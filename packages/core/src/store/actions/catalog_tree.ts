import { Dispatch } from 'redux';
import { IOptNode, INode, IReduxState, INodeChangeSocketData, INodeMeta, INodesMapItem, NodeErrorType } from '../interface';
import { updateDatasheet, updateDashboard, updateMirror } from '../actions';
import * as actions from '../action_constants';
import { batchActions } from 'redux-batched-actions';
import { Api, IApi } from 'api';
import { getExpandNodeIds } from 'utils';
import { updateForm } from './resource/form/form';
import { ConfigConstant } from 'config';
import { Selectors } from 'store';

/**
 * 设置错误信息*
 * @param err 错误信息
 */
export function setErr(err: string) {
  return {
    type: actions.SET_ERR,
    payload: err,
  };
}

/**
 * 设置当前处于编辑状态的节点ID
 * @param nodeId 节点ID
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
 * 设置要删除节点的ID
 * @param nodeId 节点ID
 */
export function setDelNodeId(nodeId: string, module: ConfigConstant.Modules = ConfigConstant.Modules.CATALOG) {
  return {
    type: actions.SET_DEL_NODE_ID,
    payload: { nodeId, module },
  };
}

/**
 * 设置要复制节点的ID
 * @param nodeId 节点ID
 */
export function setCopyNodeId(nodeId: string) {
  return {
    type: actions.SET_COPY_NODE_ID,
    payload: nodeId,
  };
}

// 设置树根节点
export const setTreeRootId = (nodeId: string) => {
  return {
    type: actions.SET_TREE_ROOT_ID,
    payload: nodeId,
  };
};

/**
 * 当前打开权限弹窗的节点ID
 * @param nodeId 节点ID
 */
export function updatePermissionModalNodeId(nodeId: string) {
  return {
    type: actions.UPDATE_PERMISSION_MODAL_NODE_ID,
    payload: nodeId,
  };
}

/**
 * 当前打开分享弹窗的节点ID
 * @param nodeId 节点ID
 */
export function updateShareModalNodeId(nodeId: string) {
  return {
    type: actions.UPDATE_SHARE_MODAL_NODE_ID,
    payload: nodeId,
  };
}

/**
 * 当前打开保存为模板弹窗的节点ID
 * @param nodeId 节点ID
 */
export function updateSaveAsTemplateModalNodeId(nodeId: string) {
  return {
    type: actions.UPDATE_SAVE_AS_TEMPLATE_MODAL_NODE_ID,
    payload: nodeId,
  };
}

/**
 * 当前打开导入弹窗的节点ID
 * @param nodeId 节点ID
 */
export function updateImportModalNodeId(nodeId: string) {
  return {
    type: actions.UPDATE_IMPORT_MODAL_NODE_ID,
    payload: nodeId,
  };
}

/**
 * 设置展开结点的数组
 * @param expandedKeys 已展开结点的数组
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
 * 将单个或多个节点添加到treeNodeMap（目录树数据源）中
 * @param Node 单个节点或者节点集合
 */
export const addNodeToMap = (data: (Omit<INodesMapItem, 'children'> & { children?: string[] })[], isCoverChildren = true) => {
  return {
    type: actions.ADD_NODE_TO_MAP,
    payload: { data, isCoverChildren },
  };
};

/**
 * 在目录树中新增节点
 * @param node 新增的节点信息
 */
export const addNode = (node: INodesMapItem) => {
  return dispatch => {
    dispatch(batchActions([addNodeToMap([node]), setEditNodeId(node.nodeId)], 'ADD_NODE'));
  };
};

// 通过socket传递的数据来实时同步树
export const updateSocketData = (data: INodeChangeSocketData) => {
  return {
    type: actions.UPDATE_SOCKET_DATA,
    payload: data,
  };
};

/**
 * 设置指定节点的名称 *
 * @param nodeId 节点ID
 * @param nodeName 节点名称
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
 * 获取指定节点的子节点，并将获取到的子节点集合挂载到目录树上
 * @param nodeId 节点ID
 */
export function getChildNode(nodeId: string): any {
  return async(dispatch: Dispatch, getState) => {
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
    // 更新当前节点是否具有子节点
    dispatch(addNodeToMap(Selectors.flatNodeTree(nodeData), false));
    dispatch(updateHasChildren(nodeId));
    dispatch(setNodeErrorType(nodeId, null));
    dispatch(setTreeLoading(false));
  };
}

/**
 * 更新节点的hasChildren的状态
 * @param nodeId 要更新状态的节点ID
 */
export function updateHasChildren(nodeId: string) {
  return {
    type: actions.UPDATE_HAS_CHILDREN,
    payload: nodeId,
  };
}

// 获取指定节点的子节点
const getChildNodeList = (nodeId: string) => {
  return Api.getChildNodeList(nodeId).then(res => {
    const { success, data } = res.data;
    if (success) {
      return data;
    }
    return NodeErrorType.ChildNodes;
  }).catch(e => NodeErrorType.ChildNodes);
};

// 设置当前目录树的加载状态
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
 * 将节点移入到指定位置
 * @param {string} nodeId 节点ID
 * @param {string} targetNodeId 目标节点ID
 * @param {number} pos -1: 表示目标节点的上方；0：表示移入目标节点内部；1：表示移入目标节点下方
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
 * 清空node属性
 */
export const clearNode = () => {
  return {
    type: actions.CLEAR_NODE,
  };
};

/**
 * 初始化目录树
 */
export function initCatalogTree() {
  return {
    type: actions.INIT_CATALOG_TREE,
  };
}

/**
 * 将单个或多个节点从treeNodeMap（目录树数据源）中移除
 * @param Node 单个节点或者节点集合
 */
export const removeNodeFromMap = (nodeId: string | string[]) => {
  return {
    type: actions.REMOVE_NODE_FROM_MAP,
    payload: nodeId,
  };
};

/**
 * 将单个或多个节点从树中移除
 * @param data 单个节点或者节点集合
 */
export const removeNodeFromTree = (nodeId: string | string[]) => {
  return {
    type: actions.REMOVE_NODE_FROM_TREE,
    payload: nodeId,
  };
};

/**
 * 删除节点*
 * @param optNode 节点信息
 */
export function deleteNodeAction(optNode: IOptNode) {
  return {
    type: actions.DELETE_NODE,
    payload: optNode,
  };
}

/**
 * 更新isPermission的状态
 */
export function updateIsPermission(status: boolean) {
  return {
    type: actions.UPDATE_IS_PERMISSION,
    payload: status,
  };
}

/**
 * 更新treeNodeMap中指定节点的信息
 * @param nodeId 节点ID
 * @param data 新数据
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
 * 刷某一层节点的信息
 * @param data
 */
export const refreshTree = (data: INode[]) => {
  return {
    type: actions.REFRESH_TREE,
    payload: data,
  };
};

/**
 * 在目录树中删除节点
 * @param optNode 正在进行操作的节点信息
 */
export const deleteNode = (optNode: IOptNode) => {

  const actions = [
    deleteNodeAction(optNode),
    deleteNodeFromFavoriteList(optNode),
    setDelNodeId(''),
    setDelNodeId('', ConfigConstant.Modules.FAVORITE),
  ];
  return dispatch => {
    dispatch(batchActions(actions));
  };
};

/**
 * 根据查找parentId来获取目录树路径，并且展开所有路径上的文件夹
 * @param nodeId 节点id
 */
export const collectionNodeAndExpand = (nodeId: string) => {
  return (dispatch: Dispatch, getState) => {
    const state: IReduxState = getState();
    const { rootId, expandedKeys, treeNodesMap, favoriteExpandedKeys, favoriteTreeNodeIds } = state.catalogTree;
    const newExpandKeys = [...(new Set([...expandedKeys, ...getExpandNodeIds(treeNodesMap, nodeId, rootId)]))];
    const newFavoriteExpandKeys = [...(new Set([...favoriteExpandedKeys, ...getExpandNodeIds(treeNodesMap, nodeId, rootId, favoriteTreeNodeIds)]))];
    dispatch(setExpandedKeys(newExpandKeys));
    dispatch(setExpandedKeys(newFavoriteExpandKeys, ConfigConstant.Modules.FAVORITE));
  };
};

// 生成星标
export const generateFavoriteTree = (node: INodesMapItem[]) => {
  return (dispatch: Dispatch) => {
    dispatch(addNodeToMap(node));
    const nodeIds = node.map(item => item.nodeId);
    dispatch(addNodeToFavoriteTree(nodeIds));
  };
};

// 将星标数据添加到星标树的指定节点下
export const addNodeToFavoriteTree = (nodeIds: string[], parentId = '') => {
  return {
    type: actions.ADD_NODE_TO_FAVORITE_LIST,
    payload: {
      nodeIds,
      parentId,
    },
  };
};

// 移除星标
export const removeFavorite = (nodeId: string) => {
  return (dispatch: Dispatch, getState) => {
    const state: IReduxState = getState();
    const type = state.catalogTree.treeNodesMap[nodeId].type;
    dispatch(updateNodeInfo(nodeId, type, { nodeFavorite: false }));
    dispatch({
      type: actions.REMOVE_FAVORITE_NODE,
      payload: nodeId,
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

// 获取单个节点信息，并将其放入数据源中
export const getNodeInfo = (nodeId: string) => {
  return (dispatch: Dispatch) => {
    Api.getNodeInfo(nodeId).then(res => {
      const { success, data } = res.data;
      if (success) {
        dispatch(addNodeToMap(data));
      }
    });
  };
};

// 更新数据源，比如目录树数表、表单的数据源
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

// 设置权限设置弹窗关闭是否需要发送通知
export function setPermissionCommitRemindStatus(status: boolean) {
  return {
    type: actions.SET_PERMISSION_COMMIT_REMIND_STATUS,
    payload: status
  };
}

// 设置评论成员更改通知参数
export function setPermissionCommitRemindParameter(Param: IApi.ICommitRemind) {
  return {
    type: actions.SET_PERMISSION_COMMIT_REMIND_PARAMETER,
    payload: Param
  };
}

// 设置无权限人员
export function setNoPermissionMembers(Param: string[]) {
  return {
    type: actions.SET_NO_PERMISSION_MEMBERS,
    payload: Param
  };
}

/**
 * 更新需要移动的节点ID
 * @param nodeIds 节点ID
 */
export function updateMoveToNodeIds(nodeIds: string[]) {
  return {
    type: actions.UPDATE_MOVE_TO_NODE_IDS,
    payload: nodeIds,
  };
}
