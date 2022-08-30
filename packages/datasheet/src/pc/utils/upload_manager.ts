import {
  Api, CollaCommandManager, CollaCommandName, getNewId, IAttachmentValue, IDPrefix, Selectors, StatusCode, Strings, SubscribeKye, t
} from '@vikadata/core';
import { uploadAttachToS3, UploadType } from '@vikadata/widget-sdk';
import { uniqBy } from 'lodash';
import mime from 'mime-types';
import { triggerUsageAlert } from 'pc/common/billing';
import { subscribeUsageCheck } from 'pc/common/billing/subscribe_usage_check';
import { Message, Modal } from 'pc/components/common';
import { IUploadResponse } from 'pc/components/upload_modal/upload_core';
import { store } from 'pc/store';
import { byte2Mb, execNoTraceVerification } from 'pc/utils';

interface IUploadMap {
  [key: string]: IUploadMapItem;
}

interface IUploadMapItem {
  waitQueue: IQueue[];
  requestQueue: IQueue[];
  failQueue: IQueue[];
}

export interface IUploadParams {
  nodeId: string | undefined;
  fieldId: string;
  recordId: string;
  cellValue: IAttachmentValue[];
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
  if (code === StatusCode.PHONE_VALIDATION || code === StatusCode.SECONDARY_VALIDATION || code === StatusCode.NVC_FAIL) {
    Modal.confirm({
      title: t(Strings.warning),
      content: t(Strings.status_code_phone_validation),
      onOk: () => {
        window['nvc'].reset();
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
  private uploadMap: IUploadMap = {}; // 记录不同的cell的上传信息
  private fileStatusMap: Map<string, Map<string, Set<() => void>>> = new Map();
  private updateList: Map<string, () => void> = new Map();

  /**
   * @param {number} limit 限制同时请求的数量
   * TODO: 考虑下做 全局的数量限制，目前只是对当前的cell做了数量限制
   * @memberof UploadManager
   */
  constructor(
    public limit: number,
    public commandManager: CollaCommandManager,
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
   * @description 将请求任务添加到等待队列中
   * @param {string} cellId
   * @param {() => AxiosPromise} requestFn
   * @param {(res: IUploadResponse) => void} successHandleFn
   * @param {() => void} failHandleFn
   * @param {(Blob | UploadFile)} file
   * @param {string} fileId
   * @returns
   * @memberof UploadManager
   */
  public register(
    cellId: string,
    successHandleFn: (res: IUploadResponse) => void,
    fd: FormData,
    fileId: string,
  ) {
    if (this.isExitCellId(cellId)) {
      this.uploadMap[cellId].waitQueue.push({
        successHandleFn,
        fileId,
        fd,
        status: this.isRequestLimit(cellId)
          ? UploadStatus.Loading
          : UploadStatus.Pending,
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
            status: this.isRequestLimit(cellId)
              ? UploadStatus.Loading
              : UploadStatus.Pending,
          },
        ],
      };
    }
    this.notifyUploadListUpdate(cellId);
    this.checkCapacitySizeBilling();
    if (this.isRequestLimit(cellId)) {
      return this.execute(cellId);
    }
  }

  /**
   * @description 判断是否超过请求上限
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
   * @description 取出相应queueId中等待队列的任务到请求队列
   * @private
   * @param {string} cellId
   * @returns
   * @memberof UploadManager
   */
  private async execute(cellId: string) {
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
        // 处理服务器的报错信息，比如说空间容量不足
        this.uploadFailHandle(cellId, uploadItem, options);
        return;
      }
      this.deleteItem(cellId);
      options!.successHandleFn(data);
      // 剔除掉请求队列中完成的请求
      uploadItem.requestQueue = uploadItem.requestQueue.filter((item) => {
        return item.fileId !== options.fileId;
      });
      if (this.isRequestLimit(cellId)) {
        return this.execute(cellId);
      }
    } catch (error) {
      // 此处用来处理超时等网络错误导致无法继续上传，将请求队列中的数据移动到失败队列
      this.uploadFailHandle(cellId, uploadItem, options);
      Message.warning({
        content: t(Strings.attachment_upload_fail, {
          count: uploadItem.failQueue.length,
        }),
      });
    }
  }

  private checkCapacitySizeBilling() {
    // 如果已经发送过提示，当天就没有必要再检查用量
    if (!subscribeUsageCheck.shouldAlertToUser(SubscribeKye.MaxCapacitySizeInBytes, undefined, true)) {
      return;
    }
    Api.searchSpaceSize().then(res => {
      const { usedCapacity, subscriptionCapacity } = res.data.data;
      if (usedCapacity > subscriptionCapacity) {
        triggerUsageAlert(SubscribeKye.MaxCapacitySizeInBytes, { usage: usedCapacity });
      }
    });
  }

  private uploadFailHandle(
    cellId: string,
    uploadItem: IUploadMapItem,
    options: IQueue,
  ) {
    const failFileIndex = uploadItem.requestQueue.findIndex((item) => {
      return item.fileId === options.fileId;
    });
    uploadItem.failQueue.push(
      uploadItem.requestQueue.splice(failFileIndex, 1)[0],
    );
    uploadItem.failQueue.map((item) => {
      item.status = UploadStatus.Fail;
      return item;
    });
    if (
      this.fileStatusMap.has(cellId) &&
      this.fileStatusMap.get(cellId)!.has(options.fileId)
    ) {
      this.fileStatusMap
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
    const requestQueue = this.uploadMap[cellId].requestQueue
      .filter(this.filterFile)
      .map((item) => this.createStdValue(item));
    const waitQueue = this.uploadMap[cellId].waitQueue
      .filter(this.filterFile)
      .map((item) => this.createStdValue(item));
    const failQueue = this.uploadMap[cellId].failQueue
      .filter(this.filterFile)
      .map((item) => this.createStdValue(item));
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
    this.uploadMap[cellId].requestQueue = this.uploadMap[
      cellId
    ].requestQueue.filter((item) => {
      return item.loaded !== item.total;
    });
  }

  private isExitCellId(cellId: string) {
    return Object.keys(this.uploadMap).includes(cellId);
  }

  /**
   * @description 提供给请求的api，用来刷新当前打开页面的进度信息
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
    total: number
  ) {
    if (!this.uploadMap[cellId]) {
      return;
    }
    if (
      this.uploadMap[cellId].requestQueue.length &&
      this.fileStatusMap.has(cellId) &&
      this.fileStatusMap.get(cellId)!.has(fileId)
    ) {
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
   * @description resourceService.instance!.reset 中用来重置所有数据
   * @memberof UploadManager
   */
  public destroy() {
    this.uploadMap = {};
    this.fileStatusMap = new Map();
    this.updateList = new Map();
    // this.apiFn = null;
  }

  public httpRequest(cellId: string, formData: FormData, fileId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = async(nvcVal?: string) => {
        nvcVal && formData.append('data', nvcVal);
        const res = await uploadAttachToS3({
          file: formData.get('file'),
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

  // 清除错误上传队列的信息
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
      file.name
    );
    fd.append('nodeId', datasheetId!);
    fd.append('type', type);
    return fd;
  }

  static generateNewFile(
    res: IUploadResponse,
    fileInfo: { name: string; id: string }
  ) {
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

  public buildStdUploadList(
    fileList: File[],
    recordId: string,
    fieldId: string,
    cellValue: IAttachmentValue[]
  ) {
    const uploadList = this.get(UploadManager.getCellId(recordId, fieldId));
    const uploadListId = uploadList.map((item) => item.fileId);
    const exitIds = cellValue ? cellValue.map((item) => item.id) : [];
    if (fileList.some((item) => UploadManager.checkFileSize(item))) {
      Message.warning({
        content: t(Strings.message_file_size_out_of_upperbound),
      });
      return [];
    }
    const list = fileList.map((item) => {
      const newId = getNewId(IDPrefix.File, [...exitIds, ...uploadListId]);
      exitIds.push(newId);
      return {
        file: item,
        fileUrl: this.createFileUrl(item),
        fileId: newId,
      };
    });
    return list;
  }

  static checkFileSize(file: File) {
    return byte2Mb(file.size)! >= 1024;
  }

  private defaultSuccessFn(
    datasheetId: string | undefined,
    fieldId: string,
    recordId: string,
    cellValue: IAttachmentValue[]
  ) {
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

  private defaultCellValue(
    datasheetId: string | undefined,
    recordId: string,
    fieldId: string
  ) {
    const state = store.getState();
    const snapshot = Selectors.getSnapshot(state, datasheetId)!;
    return Selectors.getCellValue(
      state,
      snapshot,
      recordId,
      fieldId
    ) as IAttachmentValue[];
  }

  public generateSuccessFn(
    recordId: string,
    fieldId: string,
    fileInfo: { name: string; id: string },
    datasheetId?: string,
    getCellValueFn?: (
      datasheetId: string | undefined,
      recordId: string,
      fieldId: string
    ) => IAttachmentValue[],
    successFn?: (cellValue: IAttachmentValue[]) => void
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
        return this.defaultSuccessFn(
          datasheetId,
          fieldId,
          recordId,
          _cellValue
        );
      }
      return successFn(_cellValue);
    };
  }
}
