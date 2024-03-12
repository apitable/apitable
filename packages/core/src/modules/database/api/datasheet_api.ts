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

import {
  IDatasheetTablebundles,
  IRecoverDatasheetTablebundles,
  IFieldPermissionResponse,
  IFieldPermissionRoleListData,
  IGetCommentsByIdsResponse,
  IGetTreeSelectDataReq,
  IGetTreeSelectDataRes,
  IGetTreeSelectSnapshotReq,
  IGetTreeSelectSnapshotRes,
  ISubOrUnsubByRecordIdsReq,
  IUpdateTreeSelectSnapshotReq,
} from 'modules/database/api/datasheet_api.interface';
import axios, { AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios';
import * as Url from './url.data';
import Qs from 'qs';
import { IActivityListParams, IApiWrapper, IGetRecords, IMeta, IServerDatasheetPack, ISnapshot } from '../../../exports/store/interfaces';
import { ResourceType } from 'types';
import urlcat from 'urlcat';
// import { WasmApi } from 'modules/database/api';
import { getBrowserDatabusApiEnabled } from './wasm';

const baseURL = process.env.NEXT_PUBLIC_NEXT_API;

/**
 * get space datasheet pack
 * @param dstId
 * @param recordIds
 * @returns
 *
 * @deprecated This function is deprecated and should not be used. Use databus-wasm instead
 */
export function fetchDatasheetPack(
  dstId: string,
  recordIds?: string | string[],
): Promise<AxiosResponse<IApiWrapper & { data: IServerDatasheetPack }>> {
  if (getBrowserDatabusApiEnabled()) {
    if (recordIds == null || (Array.isArray(recordIds) && recordIds.length === 0)) {
      // return WasmApi.getInstance().get_datasheet_pack(dstId);
    }
  }

  return axios.get<IApiWrapper & { data: IServerDatasheetPack }>(urlcat(Url.DATAPACK, { dstId }), {
    baseURL,
    params: {
      recordIds,
    },
    paramsSerializer: (params) => {
      return Qs.stringify(params, { arrayFormat: 'repeat' });
    },
  });
}

/**
 * get share datasheet pack
 *
 * @param shareId
 * @param dstId
 * @returns
 */
export function fetchShareDatasheetPack(shareId: string, dstId: string) {
  return axios.get(urlcat(Url.READ_SHARE_DATAPACK, { shareId, dstId }), { baseURL });
}

/**
 * get template datasheet pack
 *
 * @param dstId
 * @returns
 */
export const fetchTemplateDatasheetPack = (dstId: string) => {
  return axios.get(urlcat(Url.READ_TEMPLATE_DATAPACK, { dstId }), { baseURL });
};

/**
 * get embed datasheet pack
 */
export function fetchEmbedDatasheetPack(embedId: string, dstId: string) {
  return axios.get(urlcat(Url.READ_EMBED_DATAPACK, { embedId, dstId }), { baseURL });
}

/**
 * get related datasheet pack in the same space. support resource: datasheet, form, mirror
 *
 * @param resourceId
 * @param foreignDatasheetId
 * @returns
 */
export function fetchForeignDatasheetPack(resourceId: string, foreignDatasheetId: string) {
  return axios.get<IApiWrapper & { data: IServerDatasheetPack }>(urlcat(Url.READ_FOREIGN_DATASHEET_PACK, { resourceId, foreignDatasheetId }), {
    baseURL,
  });
}

/**
 * get related datasheet pack in the share.
 * support resource: datasheet, form, mirror
 * @param shareId
 * @param resourceId
 * @param foreignDatasheetId
 * @returns
 */
export function fetchShareForeignDatasheetPack(shareId: string, resourceId: string, foreignDatasheetId: string) {
  return axios.get(urlcat(Url.READ_SHARE_FOREIGN_DATASHEET_PACK, { shareId, resourceId, foreignDatasheetId }), { baseURL });
}

export function fetchEmbedForeignDatasheetPack(embedId: string, resourceId: string, foreignDatasheetId: string) {
  return axios.get(urlcat(Url.READ_EMBED_FOREIGN_DATASHEET_PACK, { embedId, resourceId, foreignDatasheetId }), { baseURL });
}

/**
 * get changeset list
 * @param resourceId
 * @param resourceType
 * @param startRevision inclusive
 * @param endRevision   exclusive
 * @returns
 */
export function fetchChangesets<T>(
  resourceId: string,
  resourceType: ResourceType,
  startRevision: number,
  endRevision: number,
  sourceId?: string,
  shareId?: string,
) {
  const url = shareId ? urlcat(Url.READ_SHARE_CHANGESET, { shareId, resourceId }) : urlcat(Url.READ_CHANGESET, { resourceId });
  return axios.get<T>(url, {
    baseURL,
    params: {
      resourceType,
      startRevision,
      endRevision,
      sourceId,
    },
    // serialize params revisions: [1,2,3] to normal GET params revisions=1&revisions=2&revisions=3
    paramsSerializer: (params) => {
      return Qs.stringify(params, { arrayFormat: 'repeat' });
    },
  });
}

/**
 * get specified record's history and comments
 * support: datasheet, mirror
 *
 * @param resourceId
 * @param recId
 * @param params
 * @param cancelSource
 * @returns
 */
export function getActivityList(resourceId: string, recId: string, params: IActivityListParams, cancelSource?: CancelTokenSource) {
  const query: AxiosRequestConfig = {
    baseURL,
    params,
  };
  if (cancelSource) {
    query.cancelToken = cancelSource.token;
  }
  return axios.get(urlcat(Url.GET_RECORD_ACTIVITY_LIST, { resourceId, recId }), query);
}

/**
 * get user infos by uuids
 *
 * @param nodeId
 * @param uuids
 * @returns
 */
export function fetchUserList<T>(nodeId: string, uuids: string[]) {
  return axios.get<T>(urlcat(Url.GET_USER_LIST, { nodeId }), {
    baseURL,
    params: {
      uuids,
    },

    // serialize params revisions: [1,2,3] to normal GET params revisons=1&revisions=2&revisions=3
    paramsSerializer: (params) => {
      return Qs.stringify(params, { arrayFormat: 'repeat' });
    },
  });
}

/**
 * get data records
 * @param dstId
 * @param recordIds
 * @returns
 */
export function fetchRecords(dstId: string, recordIds: string[]) {
  return axios.post<IApiWrapper & { data: IGetRecords }>(urlcat(Url.READ_RECORDS, { dstId }), recordIds, { baseURL });
}

/**
 * get datasheet meta info
 *
 * @param dstId
 * @returns
 */
export function fetchDatasheetMeta(dstId: string) {
  return axios.get<IApiWrapper & { data: IMeta }>(urlcat(Url.READ_DATASHEET_META, { dstId }), { baseURL });
}

/**
 * open or close field permission
 *
 * @param dstId
 * @param fieldId
 * @param open
 * @param includeExtend
 * @returns
 */
export function setFieldPermissionStatus(dstId: string, fieldId: string, open: boolean, includeExtend?: boolean) {
  const params = includeExtend ? { includeExtend } : {};
  return axios.post<IApiWrapper>(urlcat(Url.FIELD_PERMISSION_STATUS, { dstId, fieldId, status: open ? 'enable' : 'disable' }), params);
}

/**
 * add field permission role
 *
 * @param dstId
 * @param fieldId
 * @param option
 * @returns
 */
export function addFieldPermissionRole(dstId: string, fieldId: string, option: { role: string; unitIds: string[] }) {
  return axios.post<IApiWrapper>(urlcat(Url.FIELD_PERMISSION_ADD_ROLE, { dstId, fieldId }), option);
}

/**
 * edit field permission role
 *
 * @param dstId
 * @param fieldId
 * @param option
 * @returns
 */
export function editFieldPermissionRole(dstId: string, fieldId: string, option: { role: string; unitId: string }) {
  return axios.post<IApiWrapper & { data: IMeta }>(urlcat(Url.FIELD_PERMISSION_EDIT_ROLE, { dstId, fieldId }), option);
}

/**
 * delete field permission role
 * @param dstId
 * @param fieldId
 * @param unitId
 * @returns
 */
export function deleteFieldPermissionRole(dstId: string, fieldId: string, unitId: string) {
  return axios.delete<IApiWrapper>(urlcat(Url.FIELD_PERMISSION_DELETE_ROLE, { dstId, fieldId }), {
    data: {
      unitId,
    },
  });
}

/**
 * update field permission's other config
 * @param dstId
 * @param fieldId
 * @param formSheetAccessible
 * @returns
 */
export function updateFieldPermissionSetting(dstId: string, fieldId: string, formSheetAccessible: boolean) {
  return axios.post<IApiWrapper>(urlcat(Url.FIELD_PERMISSION_UPDATE_SETTING, { dstId, fieldId }), { formSheetAccessible });
}

/**
 * get field(column) permissions' all roles list
 *
 * @param dstId
 * @param fieldId
 * @returns
 */
export function fetchFieldPermissionRoleList(dstId: string, fieldId: string) {
  return axios.get<IApiWrapper & { data: IFieldPermissionRoleListData }>(urlcat(Url.FIELD_PERMISSION_ROLE_LIST, { dstId, fieldId }));
}

/**
 * get field permissions map
 *
 * @param dstIds
 * @param shareId
 * @returns
 */
export function getFieldPermissionMap(dstIds: string[], shareId?: string) {
  return axios.get<IApiWrapper & { data: IFieldPermissionResponse[] }>(Url.GET_FIELD_PERMISSION_MAP, {
    params: {
      dstIds: dstIds.join(','),
      shareId,
    },
  });
}

/**
 *
 * batch edit field permissions role
 *
 * @param dstId
 * @param fieldId
 * @param option
 * @returns
 */
export function batchEditFieldPermissionRole(dstId: string, fieldId: string, option: { role: string; unitIds: string[] }) {
  return axios.post<IApiWrapper>(urlcat(Url.BATCH_EDIT_PERMISSION_ROLE, { dstId, fieldId }), option);
}

/**
 * get datasheet view datapack
 *
 * @param dstId
 * @param viewId
 * @returns
 */
export function getDstViewDataPack(dstId: string, viewId: string) {
  return axios.get<IApiWrapper & { data: IFieldPermissionResponse[] }>(urlcat(Url.GET_DST_VIEW_DATA_PACK, { dstId, viewId }), { baseURL });
}

/**
 * get share datasheet view data pack
 *
 * @param dstId
 * @param viewId
 * @param shareId
 * @returns
 */
export function getShareDstViewDataPack(dstId: string, viewId: string, shareId: string) {
  return axios.get<IApiWrapper & { data: IFieldPermissionResponse[] }>(urlcat(Url.GET_SHARE_DST_VIEW_DATA_PACK, { dstId, viewId, shareId }), {
    baseURL,
  });
}

export function getContentDisposition(url: string) {
  return axios.post<IApiWrapper & { data: string }>(Url.GET_CONTENT_DISPOSITION, { url }, { baseURL });
}

export function getCommentsByIds(dstId: string, recordId: string, commentIds: string) {
  return axios.get<IApiWrapper & { data: IGetCommentsByIdsResponse }>(
    urlcat(Url.GET_COMMENTS_BY_IDS, { dstId, recordId }) + `?commentIds=${commentIds}`,
    {
      baseURL,
    },
  );
}

/**
 * get datasheet/mirror's being subscription(followed) record ids
 *
 * @param dstId
 * @param mirrorId
 * @returns
 */
export const getSubscriptions = (dstId: string, mirrorId?: string) =>
  mirrorId
    ? axios.get<IApiWrapper & { data: string[] }>(urlcat(Url.GET_MIRROR_SUBSCRIPTIONS, { mirrorId }), { baseURL })
    : axios.get<IApiWrapper & { data: string[] }>(urlcat(Url.GET_DATASHEET_SUBSCRIPTIONS, { dstId }), { baseURL });

/**
 *
 * subscribe(follow) datasheet/mirror's record
 *
 * @param param0
 * @returns
 */
export const subscribeRecordByIds = ({ datasheetId, mirrorId, recordIds }: ISubOrUnsubByRecordIdsReq) =>
  mirrorId
    ? axios.post<IApiWrapper>(urlcat(Url.SUBSCRIBE_MIRROR_RECORDS, { mirrorNodeId: mirrorId }), { recordIds }, { baseURL })
    : axios.post<IApiWrapper>(urlcat(Url.SUBSCRIBE_DATASHEET_RECORDS, { dstId: datasheetId }), { recordIds }, { baseURL });

/**
 * unsubscribe(cancel follow) datasheet/mirror's record
 * @param param0
 * @returns
 */
export const unsubscribeRecordByIds = ({ datasheetId, mirrorId, recordIds }: ISubOrUnsubByRecordIdsReq) =>
  mirrorId
    ? axios.delete<IApiWrapper>(urlcat(Url.UNSUBSCRIBE_MIRROR_RECORDS, { mirrorNodeId: mirrorId }), { data: { recordIds }, baseURL })
    : axios.delete<IApiWrapper>(urlcat(Url.UNSUBSCRIBE_DATASHEET_RECORDS, { dstId: datasheetId }), { data: { recordIds }, baseURL });

/**
 * batch delete field permissions
 * @param dstId
 * @param fieldId
 * @param option
 * @returns
 */
export const batchDeletePermissionRole = (dstId: string, fieldId: string, option: { unitIds: string[] }) => {
  return axios.delete<IApiWrapper>(urlcat(Url.BATCH_DELETE_PERMISSION_ROLE, { dstId, fieldId }), { data: option });
};

// Get cascader data
export const getCascaderData = ({ spaceId, datasheetId, linkedViewId, linkedFieldIds }: IGetTreeSelectDataReq) =>
  axios.get<IApiWrapper & IGetTreeSelectDataRes>(
    urlcat(Url.CASCADER_DATA, {
      spaceId,
      datasheetId,
    }),
    {
      baseURL,
      params: {
        linkedViewId,
        linkedFieldIds,
      },
    },
  );

// get cascader snapshot data
export const getCascaderSnapshot = ({ datasheetId, fieldId, linkedFieldIds }: IGetTreeSelectSnapshotReq) =>
  axios.get<IApiWrapper & { data: IGetTreeSelectSnapshotRes }>(
    urlcat(Url.CASCADER_SNAPSHOT, {
      datasheetId,
      fieldId,
    }),
    {
      baseURL,
      params: {
        linkedFieldIds,
      },
    },
  );

// update cascader snapshot data
export const updateCascaderSnapshot = ({
  spaceId,
  datasheetId,
  fieldId, // snapshot field ID
  linkedDatasheetId,
  linkedViewId,
}: IUpdateTreeSelectSnapshotReq) =>
  axios.put<IApiWrapper & { data: boolean }>(
    urlcat(Url.UPDATE_CASCADER_SNAPSHOT, {
      spaceId,
      datasheetId,
      fieldId,
    }),
    undefined,
    {
      baseURL,
      params: {
        linkedDatasheetId,
        linkedViewId,
      },
    },
  );

// create datasheet snapshot
export const createDatasheetTablebundle = (nodeId: string) => {
  return axios.post<IApiWrapper & { data: IDatasheetTablebundles }>(urlcat(Url.DATASHEET_TABLEBUNDLE, { nodeId }), undefined, { baseURL });
};

// get datasheet snapshot
export const getDatasheetTablebundles = (nodeId: string, tablebundleId?: string) => {
  return axios.get<IApiWrapper & { data: IDatasheetTablebundles[] }>(urlcat(Url.DATASHEET_TABLEBUNDLE, { nodeId, tablebundleId }), { baseURL });
};

// rename datasheet snapshot
export const updateDatasheetTablebundle = (nodeId: string, tablebundleId: string, name: string) => {
  return axios.put<IApiWrapper>(urlcat(Url.UPDATE_DATASHEET_TABLEBUNDLE, { nodeId, tablebundleId }), { name }, { baseURL });
};

// delete datasheet snapshot
export const deleteDatasheetTablebundle = (nodeId: string, tablebundleId: string) => {
  return axios.delete<IApiWrapper>(urlcat(Url.UPDATE_DATASHEET_TABLEBUNDLE, { nodeId, tablebundleId }), { baseURL });
};

// recover datasheet snapshot
export const recoverDatasheetTablebundle = (nodeId: string, tablebundleId: string, folderId: string, recoverNameSuffix: string) => {
  return axios.post<IApiWrapper & { data: IRecoverDatasheetTablebundles }>(
    urlcat(Url.RECOVER_DATASHEET_TABLEBUNDLE, { nodeId, tablebundleId, folderId, name: recoverNameSuffix }),
    undefined,
    { baseURL },
  );
};

// preview datasheet snapshot
export const previewDatasheetTablebundle = (nodeId: string, tablebundleId: string) => {
  return axios.get<IApiWrapper & { data: { snapshot: ISnapshot } }>(urlcat(Url.PREVIEW_DATASHEET_TABLEBUNDLE, { nodeId, tablebundleId }), {
    baseURL,
  });
};

// get archived records data
export const getArchivedRecords = (dstId: string, pageParams: any) => {
  return axios.get<IApiWrapper & { data: any }>(urlcat(Url.GET_ARCHIVED_RECORDS, { dstId }), {
    baseURL,
    params: pageParams,
  });
};
