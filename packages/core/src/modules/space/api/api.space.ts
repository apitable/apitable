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

import axios from 'axios';
import { ConfigConstant } from 'config';
import urlcat from 'urlcat';
import { NodeType, ShowRecordHistory } from '../../../config/constant';
import { IApiWrapper, INode, INodesMapItem, IParent, IUpdateRoleData } from '../../../exports/store/interfaces';
import * as Url from '../../shared/api/url';
import { IAddNodeParams } from './api.space.interface';
import { getBrowserDatabusApiEnabled } from '../../database/api/wasm';
import { WasmApi } from '../../database/api';

const CancelToken = axios.CancelToken;

/**
 *
 * Query the node tree of the workbench, limit the query to two layers
 *
 * @unitType 1: team, 3: member(private)
 * @param unitType
 * @param depth
 * @returns
 */
export function getNodeTree(unitType?: number, depth?: number) {
  return axios.get(Url.GET_NODE_TREE, {
    params: {
      unitType,
      depth,
    },
  });
}

/**
 *
 * Get and query the root node
 *
 * @returns
 */
export function getRootNode() {
  return axios.get(Url.GET_ROOT_NODE);
}

/**
 *
 * Query the child node list
 *
 * @param nodeId
 * @param nodeType
 * @param unitType
 * @returns
 */
export function getChildNodeList(nodeId: string, nodeType?: NodeType, unitType?: number) {
  return axios.get<IApiWrapper & { data: Omit<INodesMapItem, 'children'>[] }>(Url.GET_NODE_LIST, {
    params: {
      nodeId,
      nodeType,
      unitType,
    },
  });
}

/**
 * Get Node's Parent Node List
 *
 * @param nodeId
 * @returns
 */
export function getParents(nodeId: string) {
  return axios.get<IApiWrapper & { data: IParent[] }>(Url.GET_PARENTS, {
    params: {
      nodeId,
    },
  });
}

/**
 *
 * Get Node Info
 *
 * @param nodeIds
 * @returns
 */
export function getNodeInfo(nodeIds: string) {
  return axios.get(Url.GET_NODE_INFO, {
    params: {
      nodeIds,
    },
  });
}

/**
 * query the child nodes with the parent node id,
 *
 * @param parentId parent node id
 */
export function getNodeListByParentId(parentId: string) {
  return axios.get(Url.SELECTBYPARENTID + parentId);
}

/**
 *
 * Get relevant nodes(form/mirror) of the node
 *
 * @param dstId datasheet id
 * @param viewId view id. if empty, query all views' relevant nodes.
 * @param type   relevant nodes type. if empty, query all types.
 */
export function getRelateNodeByDstId(dstId: string, viewId?: string, type?: number) {
  return axios.get(Url.DATASHEET_FOREIGN_FORM, {
    params: {
      nodeId: dstId,
      viewId,
      type,
    },
  });
}

/**
 * Create Space
 *
 * @param name Space Name
 */
export function createSpace(name: string) {
  return axios.post(Url.CREATE_SPACE, {
    name,
  });
}

/**
 * Move Nodes
 *
 * @param nodeId the node id that will be moved.
 * @param parentId the parent node id that will be placed here.
 * @param preNodeId
 * @param unitId
 */
export function nodeMove(nodeId: string, parentId: string, preNodeId?: string, unitId?: string) {
  return axios.post(Url.MOVE_NODE, {
    nodeId,
    parentId,
    preNodeId,
    unitId
  });
}

/**
 * Add Node
 */
export function addNode(nodeInfo: IAddNodeParams) {
  return axios.post(Url.ADD_NODE, nodeInfo);
}

/**
 * Delete Node
 * @param nodeId Node Id
 */
export function delNode(nodeId: string) {
  if (getBrowserDatabusApiEnabled()) {
    WasmApi.getInstance()
      .delete_cache(nodeId)
      .then((result) => {
        console.log('delete indexDb cache', result);
      });
  }
  return axios.delete(Url.DELETE_NODE + nodeId);
}

export function getSpecifyNodeList(nodeType: NodeType) {
  return axios.get(Url.GET_SPECIFY_NODE_LIST, {
    params: {
      type: nodeType,
    },
  });
}

/**
 * Edit Node
 *
 * @param nodeId Node ID
 * @param data
 */
export function editNode(
  nodeId: string,
  data: {
    nodeName?: string;
    icon?: string;
    cover?: string;
    showRecordHistory?: ShowRecordHistory;
  }
) {
  return axios.post(Url.EDIT_NODE + nodeId, data);
}

/**
 * duplicate the node
 *
 */
export function copyNode(nodeId: string, copyAll: boolean) {
  return axios.post(Url.COPY_NODE, {
    nodeId,
    data: copyAll,
  });
}

/**
 * Get Datasheet ID by Node ID
 *
 * @param nodeId Node ID
 */
export function getDstId(nodeId: string) {
  return axios.get(Url.GET_DST_ID + nodeId);
}

/**
 * Save the active datasheet tab
 */
export function keepTabbar(data: { nodeId?: string; viewId?: string }) {
  return axios.post(Url.KEEP_TAB_BAR, data);
}

/**
 * Positioning the node, where it is.
 */
export function positionNode(nodeId: string) {
  return axios.get(Url.POSITION_NODE + nodeId);
}

/**
 * Get space list
 */
export function spaceList(onlyManageable?: boolean) {
  return axios.get(Url.SPACE_LIST, { params: { onlyManageable } });
}

/**
 * Quit the Space
 * @param spaceId
 */
export function quitSpace(spaceId: string) {
  return axios.post(`${Url.QUIT_SPACE}${spaceId}`);
}

/**
 * Find nodes
 *
 * @param keyword the keyword to search
 * @param ctx
 */
export function findNode(keyword: string, ctx: any) {
  return axios.get(Url.SEARCH_NODE, {
    params: {
      keyword,
    },
    cancelToken: new CancelToken(ctx),
  });
}

/**
 * Search nodes
 *
 * @param spaceId
 * @param keyword
 * @param unitType
 * @returns
 */
export function searchNode(spaceId: string, keyword: string, unitType?: number) {
  return axios.get<IApiWrapper & { data: INode[] }>(Url.SEARCH_NODE, {
    params: {
      spaceId,
      keyword,
      unitType
    },
  });
}

/**
 * Get the setting of "whether the space is visible to all members"
 * @param nodeId current node id
 */
export function allowVisiableSetting(nodeId: string) {
  return axios.get(Url.ALLOW_VISIBLE_SETTING, {
    params: {
      nodeId,
    },
  });
}

/**
 *
 * import datasheet by file
 *
 * @param formData
 * @param onUploadProgress
 * @param ctx
 * @returns
 */
export function importFile(formData: any, onUploadProgress: any, ctx: any) {
  return axios.post(Url.IMPORT_FILE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    cancelToken: new CancelToken(ctx),
    onUploadProgress,
  });
}

/**
 * Switch Space
 * @param spaceId
 * @returns
 */
export function switchSpace(spaceId: string) {
  return axios.post(urlcat(Url.SWITCH_SPACE, { spaceId }));
}

/**
 * Delete Space
 *
 * @param spaceId
 * @param code
 * @param type
 * @returns
 */
export function deleteSpace(spaceId: string, code?: string, type?: string) {
  return axios.delete(urlcat(Url.DELETE_SPACE, { spaceId }), {
    data: {
      code,
      type,
    },
  });
}

/**
 *
 * Delete the space immediately
 *
 * @returns
 */
export function deleteSpaceNow() {
  return axios.delete(Url.DELETE_SPACE_NOW);
}

/**
 * Update/Edit the space
 *
 * @param name
 * @param logo
 */
export function updateSpace(name?: string, logo?: string) {
  return axios.post(Url.UPDATE_SPACE, {
    name,
    logo,
  });
}

/**
 * Get space info
 *
 * @param spaceId
 * @returns
 */
export function spaceInfo(spaceId: string) {
  return axios.get(Url.SPACE_INFO + spaceId);
}

/**
 * Recover space
 *
 * @param spaceId
 * @returns
 */
export function recoverSpace(spaceId: string) {
  return axios.post(Url.RECOVER_SPACE + spaceId);
}

/**
 * Search space size
 * @returns
 */
export function searchSpaceSize() {
  return axios.get(Url.SPACE_MEMORY);
}

/**
 * Get the number of nodes(folders and files) in the specified space
 */
export function getSpaceNodeNumber() {
  return axios.get(Url.NODE_NUMBER);
}

/**
 * Get the permissions resources of the specified space
 */
export function getSpaceResource() {
  return axios.get(Url.SPACE_RESOURCE);
}

/**
 * get main admin info
 */
export function getMainAdminInfo() {
  return axios.get(Url.MAIN_ADMIN_INFO);
}

/**
 * change main admin
 */
export function changeMainAdmin(memberId: string) {
  return axios.post(Url.CHANGE_MAIN_ADMIN, { memberId });
}

/**
 * query the list of admins
 *
 * @param pageObjectParams pagination params
 */
export function getlistRole(pageObjectParams: string) {
  return axios.get(Url.LIST_ROLE, {
    params: {
      pageObjectParams,
    },
  });
}

/**
 * get sub-admin's permission
 */
export function subAdminPermission(memberId: string) {
  return axios.get(Url.SUB_ADMIN_PERMISSION, {
    params: {
      memberId,
    },
  });
}

/**
 * fuzzy search members
 *
 * @param keyword the keyword to search
 * @param filter
 */
export function searchMember(keyword: string, filter: boolean) {
  return axios.get(Url.MEMBER_SEARCH, {
    params: {
      keyword,
      filter,
    },
  });
}

/**
 * add sub-admin
 *
 * @param memberIds
 * @param resourceCodes operation resources set, no orders, auto verify
 */
export function addSubMember(memberIds: string[], resourceCodes: string[]) {
  return axios.post(Url.ADD_SUB_ADMIN, {
    memberIds,
    resourceCodes,
  });
}

/**
 * edit sub-admin
 *
 * @param id
 * @param memberId member id
 * @param resourceCodes operation resources set, no orders, auto verify
 */
export function editSubMember(id: string, memberId: string, resourceCodes: string[]) {
  return axios.post(Url.EDIT_SUB_ADMIN, {
    id,
    memberId,
    resourceCodes,
  });
}

/**
 * search organization resource
 *
 * @param keyword keywords(tag/team)
 * @param linkId
 */
export function searchUnit(keyword: string, linkId?: string) {
  return axios.get(Url.SEARCH_UNIT, {
    params: {
      keyword,
      linkId,
    },
  });
}

/**
 * update the all visibility of the current space
 */
export function updateAllVisible() {
  return axios.post(Url.UPDATE_ALL_VISIBLE);
}

/**
 * get all visible status of the current space
 */
export function getAllVisibleStatus() {
  return axios.get(Url.GET_ALL_VISIBLE);
}

/**
 * get child teams and members
 * @param teamId Team ID
 * @param linkId
 */
export function getSubUnitList(teamId?: string, linkId?: string) {
  return axios.get(Url.GET_SUB_UNIT_LIST, {
    params: {
      teamId,
      linkId,
    },
  });
}

/**
 * Update(edit) role
 *
 * @param data data info
 */
export function updateRole(data: IUpdateRoleData) {
  return axios.post(Url.UPDATE_ROLE, data);
}

/**
 * delete sub-admin
 */
export function deleteSubAdmin(memberId: string) {
  return axios.delete(Url.DELETE_SUB_ADMIN + memberId);
}

/**
 * get space features
 */
export function getSpaceFeatures() {
  return axios.get(Url.GET_SPACE_FEATURES);
}

/**
 * switch the status of the node role assignment
 */
export function switchNodeAssignableStatus() {
  return axios.post(Url.SWITCH_NODEROLE_ASSIGNALE);
}

/**
 * Get Space Reward infos
 *
 * @param isExpire
 * @param pageNo
 * @returns
 */
export function getCapacityRewardList(isExpire: boolean, pageNo: number) {
  const pageObjectParams = JSON.stringify({
    pageSize: ConfigConstant.CAPACITY_REWARD_LIST_PAGE_SIZE,
    order: 'createdAt',
    sort: ConfigConstant.SORT_DESC,
    pageNo,
  });
  return axios.get(Url.CAPACITY_REWARD_LIST, {
    params: {
      pageObjectParams,
      isExpire,
    },
  });
}

/**
 * Get Space node infos
 *
 * @param spaceId
 * @param pageNo
 * @returns
 */
export function getCapacityNodeList(spaceId: string, pageNo: number) {
  const pageObjectParams = JSON.stringify({
    pageSize: ConfigConstant.CAPACITY_REWARD_LIST_PAGE_SIZE,
    order: 'createdAt',
    sort: ConfigConstant.SORT_DESC,
    pageNo,
  });
  return axios.get(urlcat(Url.CAPACITY_NODE_LIST, { spaceId }), {
    params: {
      pageObjectParams,
    },
  });
}

/**
 * change node's description
 *
 * @param nodeId
 * @param desc
 * @returns
 */
export function changeNodeDesc(nodeId: string, desc: string) {
  return axios.post(Url.CHANGE_NODE_DESC, {
    nodeId,
    description: desc,
  });
}

export function readShareInfo(shareId: string, headers?: Record<string, string>) {
  return axios.get(Url.READ_SHARE_INFO + `/${shareId}`, {
    headers,
  });
}

/**
 * get embed Info
 */
const baseURL = process.env.NEXT_PUBLIC_NEXT_API;

export function getEmbedLinkInfo(linkId: string, headers?: Record<string, string>) {
  return axios.get(Url.EMBED_LINK_INFO + `/${linkId}`, {
    baseURL,
    headers,
  });
}

export function storeShareData(shareId: string, spaceId: string) {
  return axios.post(Url.STORE_SHARE_DATA, {
    spaceId,
    shareId,
  });
}

/**
 * disable the node's share link
 *
 * @export
 * @param {string} nodeId
 * @returns
 */
export function disableShare(nodeId: string) {
  return axios.post(Url.DISABLE_SHARE + nodeId);
}

/**
 * refresh node's share link
 *
 * @export
 * @param {string} nodeId
 * @returns
 */
export function regenerateShareLink(nodeId: string) {
  return axios.post(Url.REGENERATE_SHARE_LINK + nodeId);
}

/**
 * get node's share setting
 *
 * @export
 * @param {string} nodeId
 * @returns
 */
export function getShareSettings(nodeId: string) {
  return axios.get(Url.SHARE_SETTINGS + nodeId);
}

export function updateShare(
  nodeId: string,
  permission: {
    onlyRead?: boolean;
    canBeEdited?: boolean;
    canBeStored?: boolean;
  }
) {
  return axios.post(Url.UPDATE_SHARE + nodeId, {
    props: JSON.stringify(permission),
  });
}

/**
 * folder node preview
 *
 * @param nodeId
 * @param shareId
 */
export function nodeShowcase(nodeId: string, shareId?: string) {
  return axios.get(Url.NODE_SHOWCASE, {
    params: {
      nodeId,
      shareId,
    },
  });
}

export function checkoutOrder(spaceId: string, priceId: string, clientReferenceId: string, couponId: string, trial?: boolean) {
  return axios.post(Url.CHECKOUT_ORDER, {
    spaceId,
    priceId,
    clientReferenceId,
    couponId,
    trial,
  });
}
