import {
  IFieldPermissionResponse, IFieldPermissionRoleListData, IGetCommentsByIdsResponse, ISubOrUnsubByRecordIdsReq,
} from 'api/datasheet_api.interface';
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';
import { Url } from 'config';
import Qs from 'qs';
import { IActivityListParams, IApiWrapper, IGetRecords, IMeta, IServerDatasheetPack } from 'store';
import { ResourceType } from 'types';
import urlcat from 'urlcat';

const baseURL = process.env.NEXT_PUBLIC_NEXT_API;

// 获取空间内的数据包
export function fetchDatasheetPack(dstId: string, recordIds?: string | string[]) {
  console.log({ baseURL });
  return axios.get<IApiWrapper & { data: IServerDatasheetPack }>(urlcat(Url.DATAPACK, { dstId }), {
    baseURL,
    params: {
      recordIds
    },
    paramsSerializer: params => {
      return Qs.stringify(params, { arrayFormat: 'repeat' });
    }
  });
}

// 获取分享表的数据包
export function fetchShareDatasheetPack(shareId: string, dstId: string) {
  return axios.get(urlcat(Url.READ_SHARE_DATAPACK, { shareId, dstId }), { baseURL });
}

// 获取模版数据包
export const fetchTemplateDatasheetPack = (dstId: string) => {
  return axios.get(urlcat(Url.READ_TEMPLATE_DATAPACK, { dstId }), { baseURL });
};

// 获取空间内，关联表的数据。支持资源：datasheet、form、mirror
export function fetchForeignDatasheetPack(resourceId: string, foreignDatasheetId: string) {
  return axios.get<IApiWrapper & { data: IServerDatasheetPack }>(urlcat(Url.READ_FOREIGN_DATASHEET_PACK,
    { resourceId, foreignDatasheetId }), { baseURL });
}

// 在分享页面，获取关联表的数据。支持资源：datasheet、form、mirror
export function fetchShareForeignDatasheetPack(shareId: string, resourceId: string, foreignDatasheetId: string) {
  return axios.get(urlcat(Url.READ_SHARE_FOREIGN_DATASHEET_PACK, { shareId, resourceId, foreignDatasheetId }), { baseURL });
}

// 获取变更集列表
export function fetchChangesets<T>(resourceId: string, resourceType: ResourceType, revisions: number[]) {
  return axios.get<T>(urlcat(Url.READ_CHANGESET, { resourceId }), {
    baseURL,
    params: {
      revisions,
      resourceType,
    },
    // 序列化参数 revisions: [1,2,3] 变成正常的GET附带数组参数 revisons=1&revisions=2&revisions=3
    paramsSerializer: params => {
      return Qs.stringify(params, { arrayFormat: 'repeat' });
    },
  });
}

// 获取指定 record 的历史记录和评论。支持资源：datasheet、mirror
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

// 根据 uuids 获取用户信息集合
export function fetchUserList<T>(nodeId: string, uuids: string[]) {
  return axios.get<T>(urlcat(Url.GET_USER_LIST, { nodeId }), {
    baseURL,
    params: {
      uuids,
    },
    // 序列化参数 revisions: [1,2,3] 变成正常的GET附带数组参数 revisons=1&revisions=2&revisions=3
    paramsSerializer: params => {
      return Qs.stringify(params, { arrayFormat: 'repeat' });
    },
  });
}

// 获取记录
export function fetchRecords(dstId: string, recordIds: string[]) {
  return axios.post<IApiWrapper & { data: IGetRecords }>(urlcat(Url.READ_RECORDS, { dstId }), recordIds, { baseURL });
}

// 获取数表的 Meta
export function fetchDatasheetMeta(dstId: string) {
  return axios.get<IApiWrapper & { data: IMeta }>(urlcat(Url.READ_DATASHEET_META, { dstId }), { baseURL });
}

// 开启/关闭列权限
export function setFieldPermissionStatus(dstId: string, fieldId: string, open: boolean, includeExtend?: boolean) {
  const params = includeExtend ? { includeExtend } : {};
  return axios.post<IApiWrapper>(urlcat(Url.FIELD_PERMISSION_STATUS, { dstId, fieldId, status: open ? 'enable' : 'disable' }), params);
}

// 新增列权限角色
export function addFieldPermissionRole(dstId: string, fieldId: string, option: { role: string; unitIds: string[] }) {
  return axios.post<IApiWrapper>(urlcat(Url.FIELD_PERMISSION_ADD_ROLE, { dstId, fieldId }), option);
}

// 修改列权限角色
export function editFieldPermissionRole(dstId: string, fieldId: string, option: { role: string; unitId: string }) {
  return axios.post<IApiWrapper & { data: IMeta }>(urlcat(Url.FIELD_PERMISSION_EDIT_ROLE, { dstId, fieldId }), option);
}

// 删除列权限角色
export function deleteFieldPermissionRole(dstId: string, fieldId: string, unitId: string) {
  return axios.delete<IApiWrapper>(urlcat(Url.FIELD_PERMISSION_DELETE_ROLE, { dstId, fieldId }), {
    data: {
      unitId,
    },
  });
}

// 设置列权限里的其他配置
export function updateFieldPermissionSetting(dstId: string, fieldId: string, formSheetAccessible: boolean) {
  return axios.post<IApiWrapper>(urlcat(Url.FIELD_PERMISSION_UPDATE_SETTING, { dstId, fieldId }), { formSheetAccessible });
}

// 获取列权限中所有的角色信息
export function fetchFieldPermissionRoleList(dstId: string, fieldId: string) {
  return axios.get<IApiWrapper & { data: IFieldPermissionRoleListData }>(urlcat(Url.FIELD_PERMISSION_ROLE_LIST, { dstId, fieldId }));
}

export function getFieldPermissionMap(dstIds: string[], shareId?: string) {
  return axios.get<IApiWrapper & { data: IFieldPermissionResponse[] }>(Url.GET_FIELD_PERMISSION_MAP, {
    params: {
      dstIds: dstIds.join(','),
      shareId,
    },
  });
}

export function batchEditFieldPermissionRole(dstId: string, fieldId: string, option: { role: string; unitIds: string[] }) {
  return axios.post<IApiWrapper>(urlcat(Url.BATCH_EDIT_PERMISSION_ROLE, { dstId, fieldId }), option);
}

export function getDstViewDataPack(dstId, viewId) {
  return axios.get<IApiWrapper & { data: IFieldPermissionResponse[] }>(
    urlcat(Url.GET_DST_VIEW_DATA_PACK, { dstId, viewId }), { baseURL },
  );
}

export function getShareDstViewDataPack(dstId, viewId, shareId) {
  return axios.get<IApiWrapper & { data: IFieldPermissionResponse[] }>(
    urlcat(Url.GET_SHARE_DST_VIEW_DATA_PACK, { dstId, viewId, shareId }), { baseURL },
  );
}

export function getContentDisposition(url: string) {
  return axios.post<IApiWrapper & { data: string }>(
    Url.GET_CONTENT_DISPOSITION,
    { url },
    { baseURL },
  );
}

export function getCommentsByIds(dstId: string, recordId: string, commentIds: string) {
  return axios.get<IApiWrapper & { data: IGetCommentsByIdsResponse }>(
    urlcat(Url.GET_COMMENTS_BY_IDS, { dstId, recordId }) + `?commentIds=${commentIds}`, {
      baseURL,
    },
  );
}

// 获取数表/mirror被关注的record IDs
export const getSubscriptions = (dstId: string, mirrorId?: string) => mirrorId
  ? axios.get<IApiWrapper & { data: string[] }>(urlcat(Url.GET_MIRROR_SUBSCRIPTIONS, { mirrorId }), { baseURL })
  : axios.get<IApiWrapper & { data: string[] }>(urlcat(Url.GET_DATASHEET_SUBSCRIPTIONS, { dstId }), { baseURL });

// 关注数表/mirror中的数据
export const subscribeRecordByIds = ({ datasheetId, mirrorId, recordIds }: ISubOrUnsubByRecordIdsReq) => mirrorId
  ? axios.post<IApiWrapper>(urlcat(Url.SUBSCRIBE_MIRROR_RECORDS, { mirrorNodeId: mirrorId }), { recordIds }, { baseURL })
  : axios.post<IApiWrapper>(urlcat(Url.SUBSCRIBE_DATASHEET_RECORDS, { dstId: datasheetId }), { recordIds }, { baseURL });

// 取消关注数表/mirror中的数据
export const unsubscribeRecordByIds = ({ datasheetId, mirrorId, recordIds }: ISubOrUnsubByRecordIdsReq) => mirrorId
  ? axios.delete<IApiWrapper>(urlcat(Url.UNSUBSCRIBE_MIRROR_RECORDS, { mirrorNodeId: mirrorId }), { data: { recordIds }, baseURL })
  : axios.delete<IApiWrapper>(urlcat(Url.UNSUBSCRIBE_DATASHEET_RECORDS, { dstId: datasheetId }), { data: { recordIds }, baseURL });

// 批量删除权限
export const batchDeletePermissionRole = (dstId: string, fieldId: string, option: { unitIds: string[] }) => {
  return axios.delete<IApiWrapper>(urlcat(Url.BATCH_DELETE_PERMISSION_ROLE, { dstId, fieldId }), { data: option, baseURL });
};