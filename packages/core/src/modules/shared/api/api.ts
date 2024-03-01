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

import { IGetCommentsByIdsResponse } from '../../database/api/datasheet_api.interface';
import axios from 'axios';
import { ConfigConstant } from 'config';
import * as Url from './url';
import { ILocalChangeset } from 'engine';
import { IApiWrapper, IRubbishListParams } from '../../../exports/store/interfaces';
import { BindAccount } from 'modules/shared/store/constants';
import { IAxiosResponse, MemberType } from 'types';
import urlcat from 'urlcat';
import {
  IAdData,
  ICommitRemind,
  ICreateNotification,
  IGetRoleListResponse,
  IGetRoleMemberListResponse,
  IGetSpaceAuditReq,
  IGetUploadCertificateResponse,
  ILabsFeatureListResponse,
  ILoadOrSearchArg,
  INodeInfoWindowResponse,
  INoPermissionMemberResponse,
  IRecentlyBrowsedFolder,
  ISubscribeActiveEventResponse,
  ITemplateRecommendResponse,
  IUpdateSecuritySetting,
} from './api.interface';
import { WasmApi } from '../../database/api';
import { getBrowserDatabusApiEnabled } from 'modules/database/api/wasm';

export * from '../../enterprise';
export * from '../../user/api/api.auth';
export * from '../../user/api/api.user';
export * from '../../space/api/api.space';
export * from '../../org/api/api.org';

axios.defaults.baseURL = Url.BASE_URL;
const nestBaseURL = process.env.NEXT_PUBLIC_NEXT_API;

/**
 * Upload Attachment
 *
 * @param file
 */
export function uploadAttach(file: any) {
  return axios.post(Url.UPLOAD_ATTACH, file, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/**
 * Get attachment's preview url
 *
 * @param spaceId
 * @param token cloud file token
 * @param attname
 */
export function getAttachPreviewUrl(spaceId: string, token: string, attname: string) {
  return axios.post(urlcat(Url.OFFICE_PREVIEW, { spaceId }), {
    token,
    attname,
  });
}

/**
 * @description unbind account
 * @export
 * @param {BindAccount} type
 * @returns
 */
export function unBindAccount(type: BindAccount) {
  return axios.post(Url.UN_BIND, {
    type,
  });
}

/**
 * get notifications statistics
 */
export function getNotificationStatistics() {
  return axios.get(Url.NOTIFICATION_STATISTICS);
}

/**
 * notification list with pagination
 * @param isRead 1:read 2:unread, if empty, get all
 * @param rowNo
 */
export function getNotificationPage(isRead?: boolean, rowNo?: number) {
  return axios.get(Url.NOTIFICATION_PAGE, {
    params: {
      isRead: isRead ? 1 : 0,
      rowNo,
      pageSize: ConfigConstant.NOTICE_LIST_SIZE,
    },
  });
}

/**
 * get notification list
 *
 * @param isRead
 * @param notifyType
 * @returns
 */
export function getNotificationList(isRead?: boolean, notifyType?: string) {
  return axios.get(Url.NOTIFICATION_LIST, {
    params: {
      isRead: isRead ? 1 : 0,
      notifyType,
    },
  });
}

/**
 * create notification
 * @param data
 * @returns
 */
export function createNotification(data: ICreateNotification[]) {
  return axios.post(Url.CREATE_NOTIFICATION, data);
}

/**
 * create tip-off report
 *
 * @param nodeId
 * @param reportReason
 */
export function createReport(nodeId: string, reportReason: string) {
  return axios.post(Url.CREATE_REPORTS, {
    nodeId,
    reportReason,
  });
}

/**
 * mark notification as read
 * @param id notification id, batch edit support
 * @param isAll  total or not
 */
export function transferNoticeToRead(id: string[], isAll?: boolean) {
  return axios.post(Url.TRANSFER_NOTICE_TO_READ, {
    id,
    isAll: isAll ? 1 : 0,
  });
}

/**
 * create template
 * @param nodeId
 * @param name
 * @param data
 * @returns
 */
export function createTemplate(nodeId: string, name: string, data = true) {
  return axios.post(Url.CREATE_TEMPLATE, {
    nodeId,
    name,
    data,
  });
}

/**
 * get official template category list
 * @param categoryCodes
 * @returns
 */
export function getTemplateCategory(categoryCodes?: string) {
  return axios.get(Url.OFFICIAL_TEMPLATE_CATEGORY, {
    params: {
      categoryCodes,
    },
  });
}

/**
 * get official template list
 * @param spaceId
 * @param categoryCode
 * @param isPrivate
 * @param headers
 * @returns
 */
export function getTemplateList(spaceId: string, categoryCode?: string, isPrivate?: boolean, headers?: Record<string, string>) {
  return axios.get(urlcat(Url.SPACE_TEMPLATES, { spaceId }), {
    params: {
      categoryCode,
      isPrivate,
    },
    headers,
  });
}

/**
 * get official template category content
 * @param categoryCode
 * @param headers
 * @returns
 */
export function getTemplateCategories(categoryCode: string, headers?: Record<string, string>) {
  return axios.get(urlcat(Url.TEMPLATE_CATEGORIES, { categoryCode }), {
    headers,
  });
}

/**
 * Delete templates
 *
 * @param tempalte
 * @returns
 */
export const deleteTemplate = (tempalte: string) => {
  return axios.delete(`${Url.DELETE_TEMPLATE}${tempalte}`);
};

/**
 * Get template album content
 * @param albumId
 * @param headers
 * @returns
 */
export function getTemplateAlbum(albumId: string, headers?: Record<string, string>) {
  return axios.get(urlcat(Url.TEMPLATE_ALBUMS, { albumId }), {
    headers,
  });
}

/**
 * Get template album content
 *
 * @param albumId
 * @param maxCount
 * @param headers
 * @returns
 */
export function getTemplateAlbumsRecommend(albumId: string, maxCount: number, headers?: Record<string, string>) {
  return axios.get(Url.TEMPLATE_ALBUMS_RECOMMEND, {
    params: {
      excludeAlbumId: albumId,
      maxCount,
    },
    headers,
  });
}

/**
 * get template directory information
 * @param templateId
 * @param isPrivate
 * @param categoryCode
 * @returns
 */
export const templateDirectory = (templateId: string, isPrivate: boolean, categoryCode?: string) => {
  return axios.get(Url.TEMPLATE_DIRECTORY, {
    params: {
      templateId,
      isPrivate,
      categoryCode,
    },
  });
};

/**
 * use template
 *
 * @param templateId
 * @param parentId
 * @param data
 * @param unitId
 * @returns
 */
export const useTemplate = (templateId: string, parentId: string, data?: boolean, unitId?: string) => {
  return axios.post(Url.USE_TEMPLATE, {
    templateId,
    parentId,
    data,
    unitId
  });
};

export const triggerWizard = (wizardId: number) => {
  return axios.post(Url.TRIGGER_WIZARD, {
    wizardId,
  });
};

/**
 * validate the template's existence
 * @param name
 * @returns
 */
export const templateNameValidate = (name: string) => {
  return axios.get(Url.TEMPLATE_NAME_VALIDATE, {
    params: {
      name,
    },
  });
};

/**
 * get hot recommend content
 * @param headers
 * @returns
 */
export const templateRecommend = (headers?: Record<string, string>) => {
  return axios.get<IApiWrapper & { data: ITemplateRecommendResponse }>(Url.TEMPLATE_RECOMMEND, {
    headers,
  });
};

/**
 * load or search members.
 * display the most selected recent 10 records for Member Field choices
 * @param param0
 * @returns
 */
export function loadOrSearch({ filterIds, keyword, names, unitIds, linkId, all, searchEmail }: ILoadOrSearchArg): Promise<IAxiosResponse<any>> {
  if (unitIds && unitIds.includes('opt')) {
    return Promise.reject();
  }
  return axios.get(Url.LOAD_OR_SEARCH, {
    params: {
      filterIds,
      keyword,
      names,
      unitIds,
      linkId,
      all,
      searchEmail,
    },
  });
}

export function loadOrSearchEmbed(embedId: string, { filterIds, keyword, names, unitIds, linkId, all, searchEmail }: ILoadOrSearchArg) {
  return axios.get(urlcat(Url.LOAD_OR_SEARCH_EMBED, { embedId }), {
    baseURL: nestBaseURL,
    params: {
      filterIds,
      keyword,
      names,
      unitIds,
      linkId,
      all,
      searchEmail,
    },
  });
}

/**
 * Search unit(folder/file) info
 *
 * @param names
 * @param linkId
 * @returns
 */
export function searchUnitInfoVo(names: string, linkId?: string) {
  return axios.post(Url.SEARCH_UNIT_INFO_VO, {
    names,
    linkId,
  });
}

/**
 * when member field change, submit increment.
 * backend will aggregate them to send notice.
 * @param data
 * @returns
 */
export function commitRemind(data: ICommitRemind) {
  return axios.post(Url.COMMIT_REMIND, data);
}

/**
 * Enable node permission (inheritance parent)
 *
 * @param nodeId
 * @returns
 */
export function enableRoleExtend(nodeId: string) {
  return axios.post(Url.ENABLE_ROLE_EXTEND + `?nodeId=${nodeId}`);
}

/**
 * Disable node permission (inheritance parent)
 * @param nodeId
 * @param includeExtend
 * @returns
 */
export function disableRoleExtend(nodeId: string, includeExtend?: boolean) {
  const params = includeExtend ? { includeExtend } : {};
  if (getBrowserDatabusApiEnabled()){
    WasmApi.getInstance().delete_cache(nodeId).then((result) => {
      console.log('delete indexDb cache', result);
    });
  }
  return axios.post(Url.DISABLE_ROLE_EXTEND + `?nodeId=${nodeId}`, params);
}

/**
 * Delete node role
 * @param nodeId
 * @param unitId
 * @returns
 */
export function deleteRole(nodeId: string, unitId: string) {
  return axios.delete(Url.DELETE_ROLE, {
    data: {
      nodeId,
      unitId,
    },
  });
}

/**
 * Query the node role list
 *
 * @param nodeId
 * @param includeAdmin
 * @param includeExtend
 * @param includeSelf
 * @returns
 */
export function listRole(nodeId: string, includeAdmin?: boolean, includeExtend?: boolean, includeSelf?: string) {
  return axios.get(Url.NODE_LIST_ROLE, {
    params: {
      nodeId,
      includeAdmin,
      includeExtend,
      includeSelf,
    },
  });
}

/**
 * Edit the role of the node's organization unit
 *
 * @param nodeId
 * @param unitId
 * @param role
 * @returns
 */
export function editRole(nodeId: string, unitId: string, role: string) {
  return axios.post(Url.EDIT_ROLE, {
    nodeId,
    unitId,
    role,
  });
}

/**
 * Batch edit the role of the node's organization unit
 * @param nodeId
 * @param unitIds
 * @param role
 * @returns
 */
export function batchEditRole(nodeId: string, unitIds: string[], role: string) {
  return axios.post(Url.BATCH_EDIT_ROLE, {
    nodeId,
    unitIds,
    role,
  });
}

/**
 * Batch delete node roles
 * @param nodeId
 * @param unitIds
 * @returns
 */
export function batchDeleteRole(nodeId: string, unitIds: string[]) {
  return axios.delete(Url.BATCH_DELETE_ROLE, {
    data: { unitIds, nodeId },
  });
}

/**
 * Add role to specified organization unit
 * @param nodeId
 * @param unitIds
 * @param role
 * @returns
 */
export function addRole(nodeId: string, unitIds: string[], role: string) {
  return axios.post(Url.ADD_ROLE, {
    nodeId,
    unitIds,
    role,
  });
}

/**
 * Submit questionnaire
 *
 * TODO: remove this hard code api
 *
 * @param data
 * @returns
 */
export function submitQuestionnaire(data: any) {
  return axios({
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: 'https://workfun.aitable.ai/feedback-form',
    data: { data },
  });
}

/**
 * get space subscription info
 *
 * @param spaceId
 * @returns
 */
export function subscribeInfo(spaceId: string) {
  return axios.get(Url.SUBSCRIBE_INFO + spaceId);
}

/**
 * Query trash's node list
 * @param params
 * @returns
 */
export function getTrashList(params?: IRubbishListParams) {
  return axios.get(Url.TRASH_LIST, { params });
}

/**
 * Recover trash node
 * @param nodeId
 * @param parentId
 * @returns
 */
export function trashRecover(nodeId: string, parentId?: string) {
  return axios.post(Url.TRASH_RECOVER, {
    nodeId,
    parentId,
  });
}

/**
 * Delete trash's node
 * @param nodeId
 * @returns
 */
export function trashDelete(nodeId: string) {
  return axios.delete(`${Url.TRASH_DELETE}${nodeId}`);
}

/**
 * update node's favorite status
 *
 * @param nodeId
 * @returns
 */
export function updateNodeFavoriteStatus(nodeId: string) {
  return axios.post(`${Url.UPDATE_NODE_FAVORITE_STATUS}${nodeId}`);
}

/**
 * Move favorite node position
 *
 * @param nodeId
 * @param preNodeId
 * @returns
 */
export function moveFavoriteNode(nodeId: string, preNodeId?: string) {
  return axios.post(Url.MOVE_FAVORITE_NODE, {
    nodeId,
    preNodeId,
  });
}

/**
 * Query favorite node list
 * @returns
 */
export function getFavoriteNodeList() {
  return axios.get(Url.FAVORITE_NODE_LIST);
}

/**
 * get user's point(credit) info
 * @returns
 */
export function getUserIntegral() {
  return axios.get(Url.USER_CREDIT);
}

/**
 * get user's point(credit) transaction list
 *
 * @param pageNo
 * @returns
 */
export function getUserIntegralRecords(pageNo: number) {
  const pageObjectParams = JSON.stringify({
    pageSize: ConfigConstant.USER_INTEGRAL_RECORDS_PAGE_SIZE,
    order: 'createdAt',
    sort: ConfigConstant.SORT_DESC,
    pageNo,
  });
  return axios.get(Url.USER_INTEGRAL_RECORDS, {
    params: { pageObjectParams },
  });
}

/**
 * query audit log list with pagination
 *
 * @param param0
 * @returns
 */
export const getSpaceAudit = ({ spaceId, ...params }: IGetSpaceAuditReq) =>
  axios.get(urlcat(Url.SPACE_AUDIT, { spaceId }), {
    params: {
      ...params,
    },
  });

/**
 * Reedem the code award
 * @param code
 * @returns
 */
export function vCodeExchange(code: string) {
  return axios.post(Url.CODE_EXCHANGE + code);
}

/**
 * fuzzy search template
 *
 * @param keyword
 * @param className
 * @returns
 */
export function searchTemplate(keyword: string, className?: string) {
  return axios.get(Url.TEMPLATE_SEARCH, {
    params: {
      keyword,
      className,
    },
  });
}

/**
 * apply to join space
 *
 * @param spaceId
 * @returns
 */
export function applyJoinSpace(spaceId: string) {
  return axios.post(Url.APPLY_JOIN_SPACE, { spaceId });
}

/**
 * process the message of "someone join space"
 *
 * @param notifyId
 * @param agree
 * @returns
 */
export function processSpaceJoin(notifyId: string, agree: boolean) {
  return axios.post(Url.PROCESS_SPACE_JOIN, {
    notifyId,
    agree,
  });
}

/**
 * get 3rd apps list (marketplace)
 *
 * @param spaceId
 * @returns
 */
export function getMarketplaceApps(spaceId: string) {
  return axios.get(urlcat(Url.GET_MARKETPLACE_APPS, { spaceId }));
}

/**
 * get 3rd apps list (marketplace)
 * @returns
 */
export function getAppstoreApps() {
  return axios.get(Url.GET_APPSTORES_APPS);
}

/**
 * get app instances (enabled)
 * @param spaceId
 * @returns
 */
export function getAppInstances(spaceId: string) {
  return axios.get(urlcat(Url.APP_INSTANCE, { spaceId }));
}

/**
 *
 * create app instances (before use it, you need to create it(wecom/lark) first)
 *
 * @param spaceId
 * @param appId
 * @returns
 */
export function createAppInstance(spaceId: string, appId: string) {
  return axios.post(Url.APP_INSTANCE, { spaceId, appId });
}

/**
 *
 * delete app instance
 *
 * @param appInstanceId
 * @returns
 */
export function deleteAppInstance(appInstanceId: string) {
  return axios.delete(urlcat(Url.SINGLE_APP_INSTANCE, { appInstanceId }));
}

/**
 *
 * get app instance by id
 *
 * @param appInstanceId
 * @returns
 */
export function getAppInstanceById(appInstanceId: string) {
  return axios.get(urlcat(Url.SINGLE_APP_INSTANCE, { appInstanceId }));
}

/**
 * enable app
 * @param spaceId
 * @param appId
 * @returns
 */
export function enableApp(spaceId: string, appId: string) {
  return axios.post(urlcat(Url.APP_ENABLE, { spaceId, appId }));
}

/**
 * disable app
 * @param spaceId
 * @param appId
 * @returns
 */
export function disableApp(spaceId: string, appId: string) {
  return axios.post(urlcat(Url.APP_DISABLE, { spaceId, appId }));
}

/**
 * get audio and video metadata
 *
 * @param url
 * @returns
 */
// https://developer.qiniu.com/dora/1247/audio-and-video-metadata-information-avinfo
export function getAvInfo(url: string) {
  return axios.get(url);
}

/**
 * get space admin ad list
 * the config data stored in the space's config: https://vika.cn/workbench/dst9vf4SSYhEAme66b/viwRvDFWeP11B
 * if use cloud function to get API, every 10 minutes will sync once
 * @returns
 */
export function getSpaceAdList() {
  return axios.get<IAdData>('https://service-p4w3x0tq-1254196833.gz.apigw.tencentcs.com/release/ads');
}

export function unBindMobile(code: string) {
  return axios.post<IApiWrapper>(Url.USER_UNBIND_MOBILE, { code });
}

export function unBindEmail(code: string) {
  return axios.post<IApiWrapper>(Url.USER_UNBIND_EMAIL, { code });
}

/**
 * get labs features
 * @param spaceId
 * @returns
 */
export function getLabsFeature(spaceId: string) {
  return axios.get(urlcat(Url.GET_LABS_FEATURE, { spaceId }));
}

/**
 * get labs features list
 * @returns
 */
export function getLabsFeatureList() {
  return axios.get<IApiWrapper & ILabsFeatureListResponse>(Url.GET_LABS_FEATURE_LIST);
}

/**
 * update labs features list
 * @param key
 * @param isEnabled
 * @param spaceId
 * @returns
 */
export function updateLabsFeatureList(key: string, isEnabled: boolean, spaceId: string) {
  return axios.post<IApiWrapper>(Url.GET_LABS_FEATURE, {
    key,
    isEnabled,
    spaceId,
  });
}

export function updateSecuritySetting(config: IUpdateSecuritySetting) {
  return axios.post<IApiWrapper>(Url.UPDATE_SECURITY_SETTING, config);
}

export function applyResourceChangesets(changesets: ILocalChangeset[], roomId: string) {
  return axios.post<IApiWrapper & { data: IGetCommentsByIdsResponse }>(
    Url.APPLY_RESOURCE_CHANGESETS,
    {
      changesets,
      roomId,
    },
    {
      baseURL: nestBaseURL,
    },
  );
}

/**
 * get node info - (file info UI modal)
 * @param nodeId
 * @returns
 */
export function getNodeInfoWindow(nodeId: string) {
  return axios.get<IApiWrapper & { data: INodeInfoWindowResponse }>(urlcat(Url.GET_NODE_INFO_WINDOW, { nodeId }));
}

/**
 * get members that have no permissions
 *
 * @param nodeId
 * @param unitIds
 * @returns
 */
export function getNoPermissionMember(nodeId: string, unitIds: string[]) {
  return axios.post<IApiWrapper & INoPermissionMemberResponse>(Url.NO_PERMISSION_MEMBER, { nodeId, unitIds });
}

/**
 * batch get url info,  for URL field recognition
 *
 * @param urls
 * @returns
 */
export const getURLMetaBatch = (urls: string[]) => axios.post(Url.GET_URL_META_BATCH, { urls });

export const getUploadCertificate = (params: { count: number; data: string; nodeId?: string; type: number }) => {
  return axios.post<IApiWrapper & { data: IGetUploadCertificateResponse[] }>(Url.UPLOAD_PRESIGNED_URL, params);
};

export const getS3Callback = (params: { resourceKeys: string[]; type: number }) => {
  return axios.post<IApiWrapper & { data: IGetUploadCertificateResponse[] }>(Url.UPLOAD_CALLBACK, params);
};

export const getSubscribeActiveEvents = () => {
  return axios.get<IApiWrapper & { data: ISubscribeActiveEventResponse }>(Url.SUBSCRIBE_ACTIVE_EVENT);
};

/**
 * get role list
 * @returns
 */
export const getRoleList = () => {
  return axios.get<IApiWrapper & { data: IGetRoleListResponse }>(Url.GET_ROLE_LIST);
};

/**
 * create organization role
 * @param roleName
 * @returns
 */
export const createRole = (roleName: string) => {
  return axios.post<IApiWrapper>(Url.CREATE_NEW_ROLE, { roleName });
};

/**
 * delete organization role
 * @param roleId
 * @returns
 */
export const deleteOrgRole = (roleId: string) => {
  return axios.delete<IApiWrapper>(urlcat(Url.DELETE_ORG_ROLE, { roleId }));
};

/**
 * update organization role
 * @param roleId
 * @param roleName
 * @returns
 */
export const updateOrgRole = (roleId: string, roleName: string) => {
  return axios.patch<IApiWrapper>(urlcat(Url.UPDATE_ORG_ROLE, { roleId }), { roleName });
};

/**
 * get role's members list
 * @param roleId
 * @param page
 * @returns
 */
export const getRoleMemberList = (roleId: string, page: { pageSize: number; pageNo: number }) => {
  const pageObjectParams = JSON.stringify(page);
  return axios.get<IApiWrapper & { data: IGetRoleMemberListResponse }>(urlcat(Url.GET_MEMBER_LIST_BY_ROLE, { roleId }), {
    params: { pageObjectParams },
  });
};

/**
 * add member to role
 * @param roleId
 * @param unitList
 * @returns
 */
export const addRoleMember = (roleId: string, unitList: { id: string; type: MemberType }[]) => {
  return axios.post<IApiWrapper>(urlcat(Url.ADD_ROLE_MEMBER, { roleId }), { unitList });
};

/**
 * delete member from role
 * @param roleId
 * @param unitIds
 * @returns
 */
export const deleteRoleMember = (roleId: string, unitIds: string[]) => {
  return axios.delete<IApiWrapper>(urlcat(Url.DELETE_ROLE_MEMBER, { roleId }), { data: { unitIds } });
};

/**
 * init roles
 * @returns
 */
export const initRoles = () => {
  return axios.post<IApiWrapper>(Url.INIT_ROLE);
};

// recently browsed folder
export const getRecentlyBrowsedFolder = () => {
  return axios.get<IApiWrapper & { data: IRecentlyBrowsedFolder[] }>(Url.NODE_RECENTLY_BROWSED);
};
