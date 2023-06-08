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

import { Dispatch } from 'redux';
import { IOptNode, INode, IReduxState, INodeChangeSocketData, INodeMeta, INodesMapItem, NodeErrorType } from '../../../../exports/store/interfaces';
import { updateDatasheet, updateDashboard, updateMirror } from '../../../../exports/store/actions';
import * as actions from '../../../shared/store/action_constants';
import { batchActions } from 'redux-batched-actions';
import { Api, IApi } from '../../../../exports/api';
import { getExpandNodeIds } from 'utils';
import { updateForm } from '../../../database/store/actions/resource/form/form';
import { ConfigConstant } from 'config';
import { Selectors } from '../../../../exports/store';

/**
 * Set Error Message
 * 
 * @param err 
 */
export function setErr(err: string) {
  return {
    type: actions.SET_ERR,
    payload: err,
  };
}

/**
 * set current edit state node ID
 * 
 * @param nodeId Node ID
 */
export function setEditNodeId(nodeId: string, module: ConfigConstant.Modules = ConfigConstant.Modules.CATALOG) {
  return {
    type: actions.SET_EDIT_NODE_ID,
    payload: {
      nodeId,
      module,
    },
  };
}

/**
 * Set the node ID to delete
 * 
 * @param nodeId Node ID
 */
export function setDelNodeId(nodeId: string, module: ConfigConstant.Modules = ConfigConstant.Modules.CATALOG) {
  return {
    type: actions.SET_DEL_NODE_ID,
    payload: { nodeId, module },
  };
}

/**
 * set the node ID to copy
 * 
 * @param nodeId Node ID
 */
export function setCopyNodeId(nodeId: string) {
  return {
    type: actions.SET_COPY_NODE_ID,
    payload: nodeId,
  };
}

/**
 * Set the root Node ID
 * 
 * @param nodeId 
 * @returns 
 */
export const setTreeRootId = (nodeId: string) => {
  return {
    type: actions.SET_TREE_ROOT_ID,
    payload: nodeId,
  };
};

/**
 * Current Node that is opening permission UI window
 * @param nodeId Node ID
 */
export function updatePermissionModalNodeId(nodeId: string) {
  return {
    type: actions.UPDATE_PERMISSION_MODAL_NODE_ID,
    payload: nodeId,
  };
}

/**
 * Current node that is opening share window.
 * @param nodeId Node ID
 */
export function updateShareModalNodeId(nodeId: string) {
  return {
    type: actions.UPDATE_SHARE_MODAL_NODE_ID,
    payload: nodeId,
  };
}

/**
 * Current node that is opening save as template window.
 * 
 * @param nodeId 
 */
export function updateSaveAsTemplateModalNodeId(nodeId: string) {
  return {
    type: actions.UPDATE_SAVE_AS_TEMPLATE_MODAL_NODE_ID,
    payload: nodeId,
  };
}

/**
 * Current node that is opening the import UI window.
 * 
 * @param nodeId Node ID
 */
export function updateImportModalNodeId(nodeId: string) {
  return {
    type: actions.UPDATE_IMPORT_MODAL_NODE_ID,
    payload: nodeId,
  };
}

/**
 * Set the array of expanded nodes
 * 
 * @param expandedKeys the keys array of expanded nodes
 */
export function setExpandedKeys(expandedKeys: string[], module: ConfigConstant.Modules = ConfigConstant.Modules.CATALOG) {
  return {
    type: actions.SET_EXPANDED_KEYS,
    payload: {
      expandedKeys,
      module,
    },
  };
}

/**
 * add single or multiple nodes to treeNodeMap (catalog tree data source)
 * 
 * @param Node Single node or collection of nodes
 */
export const addNodeToMap = (data: (Omit<INodesMapItem, 'children'> & { children?: string[] })[], isCoverChildren = true) => {
  return {
    type: actions.ADD_NODE_TO_MAP,
    payload: { data, isCoverChildren },
  };
};

/**
 * add nodes to files tree(catalog)
 * 
 * @param node the node info of new 
 */
export const addNode = (node: INodesMapItem) => {
  return (dispatch: any) => {
    dispatch(batchActions([addNodeToMap([node]), setEditNodeId(node.nodeId)], 'ADD_NODE'));
  };
};

/**
 * update treeNodeMap (catalog tree data source) by socket data
 * @param data 
 * @returns 
 */
export const updateSocketData = (data: INodeChangeSocketData) => {
  return {
    type: actions.UPDATE_SOCKET_DATA,
    payload: data,
  };
};

/**
 * set the name of node
 * 
 * @param nodeId Node ID
 * @param nodeName Node Name
 */
export function setNodeName(nodeId: string, nodeName: string) {
  return {
    type: actions.SET_NODE_NAME,
    payload: {
      nodeId,
      nodeName,
    },
  };
}

export function setNodeErrorType(nodeId: string, errType: NodeErrorType | null) {
  return {
    type: actions.SET_NODE_ERROR_TYPE,
    payload: {
      nodeId,
      errType,
    },
  };
}

/**
 * get specified node's child nodes.
 * and attach them to files tree.
 * 
 * @param nodeId Node ID
 */
export function getChildNode(nodeId: string): any {
  return async(dispatch: Dispatch, getState: () => IReduxState) => {
    const state: IReduxState = getState();
    const { loadedKeys } = state.catalogTree;
    dispatch(setTreeLoading(true));
    const nodeData = await getChildNodeList(nodeId);
    if (nodeData === NodeErrorType.ChildNodes) {
      dispatch(setTreeLoading(false));
      dispatch(setNodeErrorType(nodeId, NodeErrorType.ChildNodes));
      return;
    }
    if (!nodeData || (Array.isArray(nodeData) && !nodeData.length)) {
      dispatch(setTreeLoading(false));
      dispatch(setLoadedKeys([...loadedKeys, nodeId]));
      dispatch(setNodeErrorType(nodeId, null));
      return;
    }

    // update current node has child nodes
    dispatch(addNodeToMap(Selectors.flatNodeTree(nodeData), false));
    dispatch(updateHasChildren(nodeId));
    dispatch(setNodeErrorType(nodeId, null));
    dispatch(setTreeLoading(false));
  };
}

/**
 * update node's hasChildren state
 * 
 * @param nodeId the node that want to update
 */
export function updateHasChildren(nodeId: string) {
  return {
    type: actions.UPDATE_HAS_CHILDREN,
    payload: nodeId,
  };
}

/**
 * get specified node's child nodes.
 * @param nodeId 
 * @returns 
 */
const getChildNodeList = (nodeId: string) => {
  return Api.getChildNodeList(nodeId).then(res => {
    const { success, data } = res.data;
    if (success) {
      return data;
    }
    return NodeErrorType.ChildNodes;
  }).catch(() => NodeErrorType.ChildNodes);
};

/**
 * the loading state of current files tree.
 * 
 * @param loading 
 * @param module 
 * @returns 
 */
export const setTreeLoading = (loading: boolean, module: ConfigConstant.Modules = ConfigConstant.Modules.CATALOG) => {
  return {
    type: actions.TREE_LOADING,
    payload: {
      loading,
      module,
    },
  };
};

/**
 * move node to specified position
 * 
 * @param {string} nodeId Node ID
 * @param {string} targetNodeId target node ID
 * @param {number} pos -1: above the target node | 0：move into target node | 1：below the target node
 * @returns
 */
export const moveTo = (nodeId: string, targetNodeId: string, pos: number) => {
  return {
    type: actions.NODE_MOVE_TO,
    payload: {
      nodeId,
      targetNodeId,
      pos,
    },
  };
};

/**
 * clear node attribute
 */
export const clearNode = () => {
  return {
    type: actions.CLEAR_NODE,
  };
};

/**
 * init files tree(catalog)
 */
export function initCatalogTree() {
  return {
    type: actions.INIT_CATALOG_TREE,
  };
}

/**
 * remove single or multi nodes from treeNodeMap(catalog tree data source)
 * @param Node single node or collection of nodes
 */
export const removeNodeFromMap = (nodeId: string | string[]) => {
  return {
    type: actions.REMOVE_NODE_FROM_MAP,
    payload: nodeId,
  };
};

/**
 * remove single or multi nodes from tree
 * @param data single node or collection of nodes
 */
export const removeNodeFromTree = (nodeId: string | string[]) => {
  return {
    type: actions.REMOVE_NODE_FROM_TREE,
    payload: nodeId,
  };
};

/**
 * delete node
 * @param optNode 
 */
export function deleteNodeAction(optNode: IOptNode) {
  return {
    type: actions.DELETE_NODE,
    payload: optNode,
  };
}

/**
 * update the state of `isPermission`
 */
export function updateIsPermission(status: boolean) {
  return {
    type: actions.UPDATE_IS_PERMISSION,
    payload: status,
  };
}

/**
 * update specify nodes in treeNodeMap
 * 
 * @param nodeId Node ID
 * @param data new data
 */
export const updateTreeNodesMap = (nodeId: string, data: Partial<INodesMapItem>) => {
  return {
    type: actions.UPDATE_TREE_NODES_MAP,
    payload: {
      nodeId,
      data,
    },
  };
};

/**
 * refresh tree (some layer)
 * 
 * @param data
 */
export const refreshTree = (data: INode[]) => {
  return {
    type: actions.REFRESH_TREE,
    payload: data,
  };
};

/**
 * Delete node from the files tree(catalog)
 * 
 * @param optNode the node info that is under operation.
 */
export const deleteNode = (optNode: IOptNode) => {

  const actions = [
    deleteNodeAction(optNode),
    deleteNodeFromFavoriteList(optNode),
    setDelNodeId(''),
    setDelNodeId('', ConfigConstant.Modules.FAVORITE),
  ];
  return (dispatch: any) => {
    dispatch(batchActions(actions));
  };
};

/**
 * find the path of the node by parentId, and expand all the folders on them.
 * 
 * @param nodeId Node ID 
 */
export const collectionNodeAndExpand = (nodeId: string) => {
  return (dispatch: Dispatch, getState: () => IReduxState) => {
    const state = getState();
    const { rootId, expandedKeys, treeNodesMap, favoriteExpandedKeys, favoriteTreeNodeIds } = state.catalogTree;
    const newExpandKeys = [...(new Set([...expandedKeys, ...getExpandNodeIds(treeNodesMap, nodeId, rootId)]))];
    const newFavoriteExpandKeys = [...(new Set([...favoriteExpandedKeys, ...getExpandNodeIds(treeNodesMap, nodeId, rootId, favoriteTreeNodeIds)]))];
    dispatch(setExpandedKeys(newExpandKeys));
    dispatch(setExpandedKeys(newFavoriteExpandKeys, ConfigConstant.Modules.FAVORITE));
  };
};

/**
 * generate favorite (star)
 * @param node 
 * @returns 
 */
export const generateFavoriteTree = (node: INodesMapItem[]) => {
  return (dispatch: Dispatch) => {
    dispatch(addNodeToMap(node));
    const nodeIds = node.map(item => item.nodeId);
    dispatch(addNodeToFavoriteTree(nodeIds));
  };
};

/**
 * add favorite(star) into the specified node
 * @param nodeIds 
 * @param parentId 
 * @returns 
 */
export const addNodeToFavoriteTree = (nodeIds: string[], parentId = '') => {
  return {
    type: actions.ADD_NODE_TO_FAVORITE_LIST,
    payload: {
      nodeIds,
      parentId,
    },
  };
};

/**
 * remove favorite (star)
 * @param nodeId 
 * @returns 
 */
export const removeFavorite = (nodeId: string) => {
  return (dispatch: Dispatch, getState: () => IReduxState) => {
    const state = getState();
    const type = state.catalogTree.treeNodesMap[nodeId]!.type;
    dispatch(updateNodeInfo(nodeId, type, { nodeFavorite: false }));
    dispatch({
      type: actions.DELETE_NODE_FROM_FAVORITE_LIST,
      payload: { nodeId },
    });
  };
};

export function deleteNodeFromFavoriteList(optNode: IOptNode) {
  return {
    type: actions.DELETE_NODE_FROM_FAVORITE_LIST,
    payload: optNode,
  };
}

export function moveFavoriteNode(nodeId: string, preNodeId?: string) {
  return {
    type: actions.MOVE_FAVORITE_NODE,
    payload: {
      nodeId,
      preNodeId,
    },
  };
}

export function initFavoriteTreeNodes() {
  return {
    type: actions.INIT_FAVORITE_TREE_NODES,
  };
}

export function setActiveNodeError(status: boolean) {
  return {
    type: actions.SET_ACTIVE_NODE_ERROR,
    payload: status,
  };
}

export function setLoadedKeys(keys: string[]) {
  return {
    type: actions.SET_LOADED_KEYS,
    payload: keys,
  };
}

/**
 * get single node info, put it in data source
 * @param nodeId 
 * @returns 
 */
export const getNodeInfo = (nodeId: string) => {
  return (dispatch: Dispatch) => {
    Api.getNodeInfo(nodeId).then(res => {
      const { success, data } = res.data;
      if (success) {
        dispatch(addNodeToMap(data));
      }
    }, err => {
      console.error('API.getNodeInfo error', err)
    });
  };
};

/**
 * update data source
 * for example, the data source of datasheet / form...
 * @param nodeId 
 * @param nodeType 
 * @param data 
 * @returns 
 */
export const updateNodeInfo = (nodeId: string, nodeType: ConfigConstant.NodeType, data: Partial<INodeMeta>): any => {
  return (dispatch: Dispatch) => {
    switch (nodeType) {
      case ConfigConstant.NodeType.DATASHEET: {
        dispatch(updateDatasheet(nodeId, data));
        break;
      }
      case ConfigConstant.NodeType.FORM: {
        dispatch(updateForm(nodeId, data));
        break;
      }
      case ConfigConstant.NodeType.DASHBOARD: {
        dispatch(updateDashboard(nodeId, data));
        break;
      }
      case ConfigConstant.NodeType.MIRROR: {
        dispatch(updateMirror(nodeId, data));
        break;
      }
    }
    const { name, ...info } = data;
    const nodeData = name ? { ...info, nodeName: name } : info;
    dispatch(updateTreeNodesMap(nodeId, nodeData));
  };
};

/**
 * set permissions, whether or not to send a notification when popup window closed.
 * 
 * @param status 
 * @returns 
 */
export function setPermissionCommitRemindStatus(status: boolean) {
  return {
    type: actions.SET_PERMISSION_COMMIT_REMIND_STATUS,
    payload: status
  };
}

/**
 * set commenter change remind params by yiliu
 * @param Param 
 * @returns 
 */
export function setPermissionCommitRemindParameter(Param: IApi.ICommitRemind) {
  return {
    type: actions.SET_PERMISSION_COMMIT_REMIND_PARAMETER,
    payload: Param
  };
}

/**
 * set members that no permission
 * @param Param 
 * @returns 
 */
export function setNoPermissionMembers(Param: string[]) {
  return {
    type: actions.SET_NO_PERMISSION_MEMBERS,
    payload: Param
  };
}

/**
 * update the node that will move.
 * 
 * @param nodeIds 
 */
export function updateMoveToNodeIds(nodeIds: string[]) {
  return {
    type: actions.UPDATE_MOVE_TO_NODE_IDS,
    payload: nodeIds,
  };
}
