/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { uniqBy } from 'lodash';
import mime from 'mime-types';
import { Api, CollaCommandManager, CollaCommandName, getNewId, IAttachmentValue, IDPrefix, Selectors, StatusCode, Strings, t } from '@apitable/core';
import { uploadAttachToS3, UploadType } from '@apitable/widget-sdk';
import { Message } from 'pc/components/common/message/message';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { IUploadResponse } from 'pc/components/upload_modal/upload_core';
import { store } from 'pc/store';
import { byte2Mb } from 'pc/utils/dom';
import { execNoTraceVerification } from 'pc/utils/no_trace_verification';
import { getEnvVariables } from './env';
// @ts-ignore
import { SubscribeUsageTipType, triggerUsageAlert } from 'enterprise/billing/trigger_usage_alert';

interface IUploadMap {
  [key: string]: IUploadMapItem;
}

interface IUploadMapItem {
  waitQueue: IQueue[];
  requestQueue: IQueue[];
  failQueue: IQueue[];
}

export enum UploadStatus {
  Pending,
  Loading,
  Fail,
}

interface IQueue {
  successHandleFn: (res: IUploadResponse) => void;
  fileId: string;
  fd: FormData;
  loaded?: number;
  total?: number;
  status: UploadStatus;
}

export const checkNetworkEnv = (code: number) => {
  const env = getEnvVariables();
  if (code === StatusCode.PHONE_VALIDATION || code === StatusCode.SECONDARY_VALIDATION || code === StatusCode.NVC_FAIL) {
    Modal.confirm({
      title: t(Strings.warning),
      content: t(Strings.status_code_phone_validation),
      onOk: () => {
        if (!env.IS_SELFHOST) {
          window['nvc'].reset();
        }
      },
      type: 'warning',
      okText: t(Strings.got_it),
      cancelButtonProps: {
        style: { display: 'none' },
      },
    });
    return true;
  }
  return false;
};

export class UploadManager {
  private uploadMap: IUploadMap = {}; // Record the upload information of different cells
  private fileStatusMap: Map<string, Map<string, Set<() => void>>> = new Map();
  private updateList: Map<string, () => void> = new Map();

  /**
   * @param {number} limit Limits the number of simultaneous requests
   * TODO: Consider doing a global limit on the number of cells, which is currently only done for the current cell
   */
  constructor(
    private readonly limit: number,
    private readonly commandManager: CollaCommandManager,
  ) {
    window.onbeforeunload = this.checkBeforePageUnMount;
  }

  checkBeforePageUnMount = () => {
    const mapArray = Object.values(this.uploadMap);
    if (
      mapArray.some((item) => {
        return Math.max(item.requestQueue.length + item.waitQueue.length, 0);
      })
    ) {
      return t(Strings.there_are_attachments_being_uploaded);
    }
    return;
  };

  /**
   * @description Adding request tasks to the waiting queue
   * @param {string} cellId
   * @param {() => AxiosPromise} requestFn
   * @param {(res: IUploadResponse) => void} successHandleFn
   * @param {() => void} failHandleFn
   * @param {(Blob | UploadFile)} file
   * @param {string} fileId
   * @returns
   * @memberof UploadManager
   */
  public register(cellId: string, successHandleFn: (res: IUploadResponse) => void, fd: FormData, fileId: string) {
    if (this.isExitCellId(cellId)) {
      this.uploadMap[cellId].waitQueue.push({
        successHandleFn,
        fileId,
        fd,
        status: this.isRequestLimit(cellId) ? UploadStatus.Loading : UploadStatus.Pending,
      });
    } else {
      this.uploadMap[cellId] = {
        requestQueue: [],
        failQueue: [],
        waitQueue: [
          {
            successHandleFn,
            fileId,
            fd,
            status: this.isRequestLimit(cellId) ? UploadStatus.Loading : UploadStatus.Pending,
          },
        ],
      };
    }
    this.notifyUploadListUpdate(cellId);
    this.checkCapacitySizeBilling().then(() => {
      if (this.isRequestLimit(cellId)) {
        return this.execute(cellId);
      }
      return null;
    });
  }

  /**
   * @description Determine if the request limit is exceeded
   * @private
   * @param {string} cellId
   * @returns
   * @memberof UploadManager
   */
  private isRequestLimit(cellId: string) {
    if (!this.uploadMap[cellId]) {
      return true;
    }
    return this.uploadMap[cellId].requestQueue.length < this.limit;
  }

  /**
   * @description Fetch the tasks in the waiting queue of the corresponding queueId to the request queue
   * @private
   * @param {string} cellId
   * @returns
   * @memberof UploadManager
   */
  private async execute(cellId: string): Promise<any> {
    if (!this.uploadMap[cellId].waitQueue.length) {
      return;
    }

    const uploadItem = this.uploadMap[cellId];
    const options = uploadItem.waitQueue[0];
    uploadItem.requestQueue.push(uploadItem.waitQueue.shift()!);

    try {
      const res = await this.httpRequest(cellId, options.fd, options.fileId);
      const { success, data, code } = res.data;

      if (!success) {
        if (checkNetworkEnv(code)) {
          return;
        }
        // Handle error messages from the server, such as insufficient space capacity
        this.uploadFailHandle(cellId, uploadItem, options);
        return;
      }
      this.deleteItem(cellId);
      options!.successHandleFn(data);
      // Eliminate completed requests from the request queue
      uploadItem.requestQueue = uploadItem.requestQueue.filter((item) => {
        return item.fileId !== options.fileId;
      });
      if (this.isRequestLimit(cellId)) {
        return this.execute(cellId);
      }
    } catch (error) {
      // This is used to handle network errors such as timeouts that
      // prevent further uploads and move the data in the request queue to the failure queue
      this.uploadFailHandle(cellId, uploadItem, options);
      Message.warning({
        content: t(Strings.attachment_upload_fail, {
          count: uploadItem.failQueue.length,
        }),
      });
    }
  }

  private checkCapacitySizeBilling() {
    return new Promise((resolve) => {
      const shareId = store.getState().pageParams.shareId;
      if (shareId) {
        return resolve(null);
      }
      Api.searchSpaceSize().then((res) => {
        const { usedCapacity } = res.data.data;
        const result = triggerUsageAlert?.(
          'maxCapacitySizeInBytes',
          { usage: usedCapacity, alwaysAlert: true, reload: true },
          SubscribeUsageTipType?.Alert,
        );
        !result && resolve(null);
      });
    });
  }

  private uploadFailHandle(cellId: string, uploadItem: IUploadMapItem, options: IQueue) {
    const failFileIndex = uploadItem.requestQueue.findIndex((item) => {
      return item.fileId === options.fileId;
    });
    uploadItem.failQueue.push(uploadItem.requestQueue.splice(failFileIndex, 1)[0]);
    uploadItem.failQueue.map((item) => {
      item.status = UploadStatus.Fail;
      return item;
    });
    if (this.fileStatusMap.has(cellId) && this.fileStatusMap.get(cellId)!.has(options.fileId)) {
      return this.fileStatusMap
        .get(cellId)!
        .get(options.fileId)!
        .forEach((item) => item());
    }
    this.notifyUploadListUpdate(cellId);
    if (this.isRequestLimit(cellId)) {
      return this.execute(cellId);
    }
  }

  public get(cellId: string) {
    if (!this.uploadMap[cellId]) {
      return [];
    }
    const requestQueue = this.uploadMap[cellId].requestQueue.filter(this.filterFile).map((item) => this.createStdValue(item));
    const waitQueue = this.uploadMap[cellId].waitQueue.filter(this.filterFile).map((item) => this.createStdValue(item));
    const failQueue = this.uploadMap[cellId].failQueue.filter(this.filterFile).map((item) => this.createStdValue(item));
    return [...failQueue, ...waitQueue, ...requestQueue];
  }

  private filterFile(item: IQueue) {
    return item;
  }

  private createStdValue(item: IQueue) {
    return {
      fileId: item.fileId,
      status: item.status,
      file: item.fd.get('file') as File,
      fileUrl: URL.createObjectURL(item.fd.get('file') as Blob),
      loaded: item.loaded,
    };
  }

  private deleteItem(cellId: string) {
    this.uploadMap[cellId].requestQueue = this.uploadMap[cellId].requestQueue.filter((item) => {
      return item.loaded !== item.total;
    });
  }

  private isExitCellId(cellId: string) {
    return Object.keys(this.uploadMap).includes(cellId);
  }

  /**
   * @description The api provided to the request to refresh the progress information of the currently opened page
   * @param {string} cellId
   * @param {string} fileId
   * @param {number} loaded
   * @param {number} total
   * @returns
   * @memberof UploadManager
   */
  public emitProgress(
    cellId: string,
    fileId: string,
    loaded: number,
    total: number | undefined,
  ) {
    if (!this.uploadMap[cellId]) {
      return;
    }
    if (this.uploadMap[cellId].requestQueue.length && this.fileStatusMap.has(cellId) && this.fileStatusMap.get(cellId)!.has(fileId)) {
      this.fileStatusMap
        .get(cellId)!
        .get(fileId)!
        .forEach((item) => item());
    }
    this.uploadMap[cellId].requestQueue.map((item) => {
      if (item.fileId === fileId) {
        item.status = UploadStatus.Loading;
        item.loaded = loaded;
        item.total = total;
      }
      return item;
    });
  }

  public bindFileStatus(cellId: string, fileId: string, fn: () => void) {
    if (!this.fileStatusMap.has(cellId)) {
      const fileMap = new Map();
      this.fileStatusMap.set(cellId, fileMap.set(fileId, new Set([fn])));
      return;
    }
    const cellMap = this.fileStatusMap.get(cellId);
    if (!cellMap!.has(fileId)) {
      cellMap!.set(fileId, new Set([fn]));
    }
    const fileMap = cellMap!.get(fileId);
    fileMap!.add(fn);
  }

  public unBindFileStatus(cellId: string, fileId: string) {
    if (!this.fileStatusMap.has(cellId)) {
      return;
    }
    if (!this.fileStatusMap.get(cellId)!.has(fileId)) {
      return;
    }
    this.fileStatusMap.get(cellId)!.delete(fileId);
  }

  public subscribeUploadList(cellId: string, fn: () => void) {
    this.updateList.set(cellId, fn);
  }

  public notifyUploadListUpdate(cellId: string) {
    if (!this.updateList.has(cellId)) {
      return;
    }
    this.updateList.get(cellId)!();
  }

  /**
   * @description resourceService.instance!.reset is used to reset all data in
   * @memberof UploadManager
   */
  public destroy() {
    this.uploadMap = {};
    this.fileStatusMap = new Map();
    this.updateList = new Map();
    // this.apiFn = null;
  }

  public httpRequest(cellId: string, formData: FormData, fileId: string): Promise<any> {
    return new Promise((resolve) => {
      const request = async (nvcVal?: string) => {
        nvcVal && formData.append('data', nvcVal);
        const res = await uploadAttachToS3({
          file: formData.get('file') as File,
          fileType: UploadType.DstAttachment,
          data: nvcVal,
          nodeId: (formData.get('nodeId') as string) || '',
          axiosConfig: {
            onUploadProgress: ({ loaded, total }) => {
              this.emitProgress(cellId, fileId, loaded, total);
            },
          },
        });
        resolve(res);
      };
      window['nvc'] ? execNoTraceVerification(request) : request();
    });
  }

  // Clear information from the error upload queue
  public clearFailQueue(cellId: string) {
    if (!this.uploadMap[cellId]) {
      return;
    }
    this.uploadMap[cellId].failQueue = [];
    this.notifyUploadListUpdate(cellId);
  }

  static getCellId(recordId: string, fieldId: string) {
    return `${recordId},${fieldId}`;
  }

  static generateFormData(file: File, datasheetId: string, type = '2') {
    const fd = new FormData();
    fd.append(
      'file',
      new Blob([file], {
        type: file.type || mime.lookup(file.name) || 'application/octet-stream',
      }),
      file.name,
    );
    fd.append('nodeId', datasheetId!);
    fd.append('type', type);
    return fd;
  }

  static generateNewFile(res: IUploadResponse, fileInfo: { name: string; id: string }) {
    const result: IAttachmentValue = {
      id: fileInfo.id,
      mimeType: res.mimeType,
      name: fileInfo.name,
      size: res.size,
      token: res.token,
      bucket: res!.bucket,
      width: res.width ? res.width : 0,
      height: res.height ? res.height : 0,
    };
    if (res.preview) {
      result.preview = res.preview;
    }
    return result;
  }

  public retryUpload(cellId: string, fileId: string) {
    const failList = this.uploadMap[cellId]!['failQueue'];
    const failFile = failList.find((item) => item.fileId === fileId);
    if (!failFile) {
      return;
    }
    this.deleteFailItem(cellId, fileId);
    this.register(cellId, failFile.successHandleFn, failFile.fd, fileId);
  }

  public deleteFailItem(cellId: string, fileId: string, notify?: boolean) {
    const failList = this.uploadMap[cellId]!['failQueue'];
    const _failList = failList.filter((item) => item.fileId !== fileId);
    this.uploadMap[cellId]!['failQueue'] = _failList;
    if (notify) {
      this.notifyUploadListUpdate(cellId);
    }
  }

  public createFileUrl(file: File) {
    return URL.createObjectURL(file);
  }

  public buildStdUploadList(fileList: File[], recordId: string, fieldId: string, cellValue: IAttachmentValue[]) {
    const uploadList = this.get(UploadManager.getCellId(recordId, fieldId));
    const uploadListId = uploadList.map((item) => item.fileId);
    const exitIds = cellValue ? cellValue.map((item) => item.id) : [];
    if (fileList.some((item) => UploadManager.checkFileSize(item))) {
      Message.warning({
        content: t(Strings.message_file_size_out_of_upperbound),
      });
      return [];
    }
    return fileList.map((item) => {
      const newId = getNewId(IDPrefix.File, [...exitIds, ...uploadListId]);
      exitIds.push(newId);
      return {
        file: item,
        fileUrl: this.createFileUrl(item),
        fileId: newId,
      };
    });
  }

  static checkFileSize(file: File) {
    return byte2Mb(file.size)! >= 1024;
  }

  private defaultSuccessFn(datasheetId: string | undefined, fieldId: string, recordId: string, cellValue: IAttachmentValue[]) {
    return this.commandManager.execute({
      cmd: CollaCommandName.SetRecords,
      datasheetId,
      data: [
        {
          recordId,
          fieldId,
          value: uniqBy(cellValue, 'id'),
        },
      ],
    });
  }

  private defaultCellValue(datasheetId: string | undefined, recordId: string, fieldId: string) {
    const state = store.getState();
    const snapshot = Selectors.getSnapshot(state, datasheetId)!;
    return Selectors.getCellValue(state, snapshot, recordId, fieldId) as IAttachmentValue[];
  }

  public generateSuccessFn(
    recordId: string,
    fieldId: string,
    fileInfo: { name: string; id: string },
    datasheetId?: string,
    getCellValueFn?: (datasheetId: string | undefined, recordId: string, fieldId: string) => IAttachmentValue[],
    successFn?: (cellValue: IAttachmentValue[]) => void,
  ) {
    return (res: IUploadResponse) => {
      const newFile = UploadManager.generateNewFile(res, fileInfo);
      let cellValue;
      if (getCellValueFn) {
        cellValue = getCellValueFn(datasheetId!, recordId, fieldId);
      } else {
        cellValue = this.defaultCellValue(datasheetId!, recordId, fieldId);
      }
      const _cellValue = cellValue ? [...cellValue, newFile] : [newFile];
      if (!successFn) {
        return this.defaultSuccessFn(datasheetId, fieldId, recordId, _cellValue);
      }
      return successFn(_cellValue);
    };
  }
}
