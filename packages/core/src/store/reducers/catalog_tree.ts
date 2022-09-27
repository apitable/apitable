import {
  ISetRootIdAction, ICatalogTree, ITreeNode, ISetNodeNameAction, ISetDelNodeIdAction,
  IDeleteNodeAction, IMoveNodeToFolderAction, ICoLayerMoveNodeAction, ISetOptNodeAction, IOptNode,
  ISetErrAction, ISetEditNodeIdAction, IAddNodeToMapAction, ITreeNodesMap, ISetIsCopyAllAction,
  INode, ISetExpandedKeysActions, IInitCatalogTreeAction, ISetCopyNodeIdAction, ISetAllVisibleAction,
  ISetLoadedAction, IUpdateHasChildren, IMoveToAction, IUpdateTreeNodesMapAction, IClearNodeAction,
  IUpdateIsPermissionAction, IUpdateSocketDataAction, IRefreshTreeAction, IAddNodeToFavoriteTreeAction,
  IRemoveFavoriteNodeAction, IDeleteNodeFromFavoriteTreeAction, IMoveFavoriteNodeAction, IInitFavoriteTreeNodesAction,
  ISetActiveNodeErrorAction, IUpdatePermissionModalNodeIdAction, IUpdateShareModalNodeIdAction, IUpdateSaveAsTemplateModalNodeIdAction,
  IUpdateImportModalNodeIdAction, ISetTreeRootIdAction, INodesMapItem, ISetLoadedKeysAction, ISetNodeErrorTypeAction,
  ISetPermissionModalMessageStatusAction , ISetPermissionCommitRemindParameterAction, ISetNoPermissionMembersAction,
  IUpdateMoveToNodeIdsAction,
} from '../interface';
import { findNode, getUniqName, collectProperty } from 'utils';
import * as actions from '../action_constants';
import { produce } from 'immer';
import { ConfigConstant } from 'config';

const defaultState: ICatalogTree = {
  // 目录树是否正在加载
  loading: true,
  // 新建节点的信息
  node: null,
  // 当前正在操作的节点信息
  optNode: null,
  // 删除节点的ID
  delNodeId: '',
  // 当前处理编辑状态的节点
  editNodeId: '',
  // 复制节点的ID
  copyNodeId: '',
  // 是否复制数据
  isCopyAll: false,
  // 处理失败时的错误信息
  err: '',
  // 根节点Id
  rootId: '',
  // 树的map映射  (标签栏与目录共用)
  treeNodesMap: {},
  // 展开节点的数组
  expandedKeys: [],
  // 已经加载过子节点的节点集合
  loadedKeys: [],
  // 组织资源
  unit: null,
  // 全员可见
  allVisible: false,
  // 没有当前访问的数表的权限
  isPermission: true,
  // socket推送的消息
  socketData: null,
  // 星标-树
  favoriteTreeNodeIds: [],
  // 星标的加载状态
  favoriteLoading: true,
  favoriteExpandedKeys: [],
  favoriteEditNodeId: '',
  favoriteDelNodeId: '',
  activeNodeError: false,
  /** 当前正在打开权限窗口的节点ID */
  permissionModalNodeId: '',
  /** 当前正在打开分享窗口的节点ID */
  shareModalNodeId: '',
  /** 当前正在打开保存为模板窗口的节点ID */
  saveAsTemplateModalNodeId: '',
  /** 当前正在打开导入节点窗口的节点ID */
  importModalNodeId: '',
  /** 权限设置弹窗是否来自通知调用 **/
  permissionCommitRemindStatus: false,
  /** 成员消息发送所需参数 **/
  permissionCommitRemindParameter: null,
  /** 无权限成员unitIds **/
  noPermissionMembers: []
};

type CatalogTreeActions = ISetNodeNameAction | ISetRootIdAction | ISetDelNodeIdAction | IDeleteNodeAction | IMoveNodeToFolderAction |
  ICoLayerMoveNodeAction | ISetOptNodeAction | ISetErrAction | ISetEditNodeIdAction | IAddNodeToMapAction | ISetIsCopyAllAction |
  ISetExpandedKeysActions | IInitCatalogTreeAction | ISetCopyNodeIdAction | ISetAllVisibleAction | ISetLoadedAction | IUpdateHasChildren |
  IMoveToAction | IUpdateTreeNodesMapAction | IClearNodeAction | IUpdateIsPermissionAction | IUpdateSocketDataAction | IRefreshTreeAction |
  IAddNodeToFavoriteTreeAction | IRemoveFavoriteNodeAction | IDeleteNodeFromFavoriteTreeAction | IMoveFavoriteNodeAction |
  IInitFavoriteTreeNodesAction | ISetActiveNodeErrorAction | IUpdatePermissionModalNodeIdAction | IUpdateShareModalNodeIdAction |
  IUpdateSaveAsTemplateModalNodeIdAction | IUpdateImportModalNodeIdAction | ISetTreeRootIdAction | ISetLoadedKeysAction | ISetNodeErrorTypeAction |
  ISetPermissionModalMessageStatusAction | ISetPermissionCommitRemindParameterAction | ISetNoPermissionMembersAction | IUpdateMoveToNodeIdsAction;

export const catalogTree = produce((draftCatalogTree: ICatalogTree = defaultState, action: CatalogTreeActions) => {
  switch (action.type) {
    case actions.SET_ERR: {
      draftCatalogTree.err = action.payload;
      return draftCatalogTree;
    }
    case actions.SET_DEL_NODE_ID: {
      const { nodeId, module } = action.payload;
      switch (module) {
        case ConfigConstant.Modules.CATALOG: {
          draftCatalogTree.delNodeId = nodeId;
          break;
        }
        case ConfigConstant.Modules.FAVORITE: {
          draftCatalogTree.favoriteDelNodeId = nodeId;
          break;
        }
      }
      return draftCatalogTree;
    }
    case actions.SET_OPT_NODE: {
      draftCatalogTree.optNode = action.payload;
      return draftCatalogTree;
    }
    case actions.DELETE_NODE: {
      deleteNode(draftCatalogTree, action.payload);
      return draftCatalogTree;
    }
    case actions.SET_EDIT_NODE_ID: {
      const { nodeId, module } = action.payload;
      switch (module) {
        case ConfigConstant.Modules.CATALOG: {
          draftCatalogTree.editNodeId = nodeId;
          break;
        }
        case ConfigConstant.Modules.FAVORITE: {
          draftCatalogTree.favoriteEditNodeId = nodeId;
          break;
        }
      }
      return draftCatalogTree;
    }
    case actions.SET_NODE_NAME: {
      const { nodeId, nodeName } = action.payload;
      draftCatalogTree.treeNodesMap[nodeId].nodeName = nodeName;
      return draftCatalogTree;
    }
    case actions.SET_NODE_ERROR_TYPE: {
      const { nodeId, errType } = action.payload;
      draftCatalogTree.treeNodesMap[nodeId].errType = errType;
      return draftCatalogTree;
    }
    case actions.ADD_NODE_TO_MAP: {
      const { data, isCoverChildren } = action.payload;
      addNodeToMap(draftCatalogTree, data, isCoverChildren);
      return draftCatalogTree;
    }
    case actions.REFRESH_TREE: {
      const childNodeIds = action.payload.map(item => item.nodeId);
      draftCatalogTree.treeNodesMap[action.payload[0].parentId].children = childNodeIds;
      const parentNode = draftCatalogTree.treeNodesMap[action.payload[0].parentId];
      if (!parentNode.hasChildren && action.payload.length) {
        parentNode.hasChildren = true;
      }
      return draftCatalogTree;
    }
    case actions.SET_EXPANDED_KEYS: {
      const { expandedKeys, module } = action.payload;
      switch (module) {
        case ConfigConstant.Modules.CATALOG: {
          draftCatalogTree.expandedKeys = expandedKeys;
          break;
        }
        case ConfigConstant.Modules.FAVORITE: {
          draftCatalogTree.favoriteExpandedKeys = expandedKeys;
          break;
        }
      }
      return draftCatalogTree;
    }
    case actions.SET_LOADED_KEYS: {
      draftCatalogTree.loadedKeys = action.payload;
      return draftCatalogTree;
    }
    case actions.INIT_CATALOG_TREE: {
      return defaultState;
    }
    case actions.SET_COPY_NODE_ID: {
      draftCatalogTree.copyNodeId = action.payload;
      return draftCatalogTree;
    }
    case actions.SET_ALL_VISIBLE: {
      draftCatalogTree.allVisible = action.payload;
      return draftCatalogTree;
    }
    case actions.TREE_LOADING: {
      const { loading, module } = action.payload;
      switch (module) {
        case ConfigConstant.Modules.CATALOG: {
          draftCatalogTree.loading = loading;
          break;
        }
        case ConfigConstant.Modules.FAVORITE: {
          draftCatalogTree.favoriteLoading = loading;
          break;
        }
      }
      return draftCatalogTree;
    }
    case actions.UPDATE_HAS_CHILDREN: {
      updateHasChildren(draftCatalogTree.treeNodesMap, action.payload);
      return draftCatalogTree;
    }
    case actions.NODE_MOVE_TO: {
      const { nodeId, targetNodeId, pos } = action.payload;
      const prevName = draftCatalogTree.treeNodesMap[nodeId].nodeName;
      moveTo(draftCatalogTree.treeNodesMap, nodeId, targetNodeId, pos);
      if (prevName !== draftCatalogTree.treeNodesMap[nodeId].nodeName) {
        draftCatalogTree.editNodeId = nodeId;
      }
      return draftCatalogTree;
    }
    case actions.UPDATE_TREE_NODES_MAP: {
      const { nodeId, data } = action.payload;
      if (!draftCatalogTree.treeNodesMap[nodeId]) { return draftCatalogTree; }
      draftCatalogTree.treeNodesMap[nodeId] = { ...draftCatalogTree.treeNodesMap[nodeId], ...data };
      return draftCatalogTree;
    }
    case actions.CLEAR_NODE: {
      draftCatalogTree.node = null;
      return draftCatalogTree;
    }
    case actions.UPDATE_IS_PERMISSION: {
      draftCatalogTree.isPermission = action.payload;
      return draftCatalogTree;
    }
    case actions.UPDATE_SOCKET_DATA: {
      draftCatalogTree.socketData = action.payload;
      return draftCatalogTree;
    }
    case actions.ADD_NODE_TO_FAVORITE_LIST: {
      const { nodeIds } = action.payload;
      if (!nodeIds.length || !draftCatalogTree.favoriteTreeNodeIds.length) {
        draftCatalogTree.favoriteTreeNodeIds = nodeIds;
        return draftCatalogTree;
      }
      draftCatalogTree.favoriteTreeNodeIds = [...nodeIds, ...draftCatalogTree.favoriteTreeNodeIds];
      return draftCatalogTree;
    }
    case actions.REMOVE_FAVORITE_NODE: {
      removeFavoriteNode(draftCatalogTree, action.payload);
      return draftCatalogTree;
    }
    case actions.DELETE_NODE_FROM_FAVORITE_LIST: {
      const deleteNodeId = action.payload.nodeId;
      if (draftCatalogTree.favoriteTreeNodeIds.findIndex(id => id === deleteNodeId) !== -1) {
        draftCatalogTree.favoriteTreeNodeIds = draftCatalogTree.favoriteTreeNodeIds.filter(id => id !== deleteNodeId);
      }
      return draftCatalogTree;
    }
    case actions.INIT_FAVORITE_TREE_NODES: {
      draftCatalogTree.favoriteTreeNodeIds = [];
      return draftCatalogTree;
    }
    case actions.MOVE_FAVORITE_NODE: {
      moveFavoriteNode(draftCatalogTree, action.payload);
      return draftCatalogTree;
    }
    case actions.SET_ACTIVE_NODE_ERROR: {
      draftCatalogTree.activeNodeError = action.payload;
      return draftCatalogTree;
    }
    case actions.UPDATE_PERMISSION_MODAL_NODE_ID: {
      draftCatalogTree.permissionModalNodeId = action.payload;
      return draftCatalogTree;
    }
    case actions.UPDATE_SHARE_MODAL_NODE_ID: {
      draftCatalogTree.shareModalNodeId = action.payload;
      return draftCatalogTree;
    }
    case actions.UPDATE_SAVE_AS_TEMPLATE_MODAL_NODE_ID: {
      draftCatalogTree.saveAsTemplateModalNodeId = action.payload;
      return draftCatalogTree;
    }
    case actions.UPDATE_IMPORT_MODAL_NODE_ID: {
      draftCatalogTree.importModalNodeId = action.payload;
      return draftCatalogTree;
    }
    case actions.SET_TREE_ROOT_ID: {
      draftCatalogTree.rootId = action.payload;
      return draftCatalogTree;
    }
    case actions.SET_PERMISSION_COMMIT_REMIND_STATUS: {
      draftCatalogTree.permissionCommitRemindStatus = action.payload;
      return draftCatalogTree;
    }
    case actions.SET_PERMISSION_COMMIT_REMIND_PARAMETER: {
      draftCatalogTree.permissionCommitRemindParameter = action.payload;
      return draftCatalogTree;
    }
    case actions.SET_NO_PERMISSION_MEMBERS: {
      draftCatalogTree.noPermissionMembers = action.payload;
      return draftCatalogTree;
    }
    case actions.UPDATE_MOVE_TO_NODE_IDS: {
      draftCatalogTree.moveToNodeIds = action.payload;
      return draftCatalogTree;
    }
    default:
      return draftCatalogTree;
  }
});

/**
 * 删除节点
 * 注意其子节点可能是星标的情况，这时需要更新星标树
 * @param tree 目录树
 * @param optNode 要删除节点的信息
 */
const deleteNode = (catalogTree: ICatalogTree, optNode: IOptNode) => {
  const { treeNodesMap, favoriteTreeNodeIds, delNodeId, editNodeId, favoriteEditNodeId, favoriteDelNodeId,
    permissionModalNodeId, shareModalNodeId, saveAsTemplateModalNodeId, importModalNodeId, expandedKeys, loadedKeys
  } = catalogTree;
  // 当前在操作中的nodeId集合
  const operationsIdArr = [delNodeId, editNodeId, favoriteEditNodeId, favoriteDelNodeId, permissionModalNodeId,
    shareModalNodeId, saveAsTemplateModalNodeId, importModalNodeId];
  const { nodeId, parentId } = optNode;
  const parentNode = treeNodesMap[parentId];

  const deleteIds = collectProperty(treeNodesMap, nodeId);
  if (parentNode) {
    const nextNodeId = parentNode.children[parentNode.children.findIndex(item => item === nodeId) + 1];
    const nextNode = treeNodesMap[nextNodeId];
    if (nextNode && nextNode.preNodeId === nodeId) {
      nextNode.preNodeId = treeNodesMap[nodeId].preNodeId;
    }
    parentNode.children = parentNode.children.filter(id => id !== nodeId);
  }

  for (const nodeId of deleteIds) {
    if (operationsIdArr.includes(nodeId)) {
      catalogTree.delNodeId = '';
      catalogTree.editNodeId = '';
      catalogTree.favoriteEditNodeId = '';
      catalogTree.favoriteDelNodeId = '';
      catalogTree.permissionModalNodeId = '';
      catalogTree.shareModalNodeId = '';
      catalogTree.saveAsTemplateModalNodeId = '';
      catalogTree.importModalNodeId = '';
    }
    if (loadedKeys.includes(nodeId)) {
      catalogTree.loadedKeys = loadedKeys.filter(item => item !== nodeId);
    }
    if (favoriteTreeNodeIds.findIndex(id => id === nodeId) !== -1) {
      removeFavoriteNode(catalogTree, nodeId);
    }
    // 将被删除的节点的从展开状态集合中清除
    if (expandedKeys.includes(nodeId)) {
      catalogTree.expandedKeys = expandedKeys.filter(item => item !== nodeId);
    }
    delete treeNodesMap[nodeId];
  }
};

/**
 * 将节点添加到treeNodeMap（目录树数据源）中
 * @param treeNodesMap 树的map
 * @param data 树节点的信息
 */
const addNodeToMap = (catalogTree: ICatalogTree, data: (Omit<INodesMapItem, 'children'> & { children?: string[] })[], isCoverChildren: boolean) => {
  const { treeNodesMap } = catalogTree;
  data.forEach(node => {
    const { nodeId, parentId } = node;
    const parentNode = treeNodesMap[parentId];
    // 如果节点不存在数据中，并且自身没有children属性，这时需要给它补上children属性
    if (!treeNodesMap[nodeId] && !node?.children) {
      node = { ...node, children: [] };
    }
    // 判断是否将这个节点放入已加载节点的集合中
    if (node.hasChildren && node.type === ConfigConstant.NodeType.FOLDER && node.children?.length && !catalogTree.loadedKeys.includes(nodeId)) {
      catalogTree.loadedKeys = [...catalogTree.loadedKeys, nodeId];
    }
    if (isCoverChildren) {
      treeNodesMap[nodeId] = { ...treeNodesMap[nodeId], ...node };
    } else {
      const children = treeNodesMap[nodeId]?.children || node.children;
      treeNodesMap[nodeId] = { ...treeNodesMap[nodeId], ...node, children };
    }

    if (!parentNode) {
      return;
    }

    // 判断是否将这个节点放入已加载节点的集合中
    if (!catalogTree.loadedKeys.includes(parentId) && parentNode.type === ConfigConstant.NodeType.FOLDER) {
      catalogTree.loadedKeys = [...catalogTree.loadedKeys, parentId];
    }
    // 更新父节点的hasChildren属性
    if (!parentNode.hasChildren) {
      parentNode.hasChildren = true;
    }
    // 更新父节点下原先的第一个节点prevNodeId属性
    if (parentNode.children.length && !parentNode.children.includes(nodeId)) {
      treeNodesMap[parentNode.children[0]].preNodeId = '';
    }
    // 表示这个添加是否已经添加到children中了
    let isAdded = false;
    // 更新父节点的children属性
    if (!parentNode.children.includes(nodeId)) {
      if (node.preNodeId) {
        parentNode.children = parentNode.children.reduce((prev, item, index) => {
          prev.push(item);
          if (item === node.preNodeId || (!prev.includes(nodeId) && index === parentNode.children.length - 1)) {
            isAdded = true;
            prev.push(nodeId);
          }
          return prev;
        }, [] as string[]);
      } else {
        isAdded = true;
        parentNode.children = [nodeId, ...parentNode.children];
      }

      if (!isAdded) {
        parentNode.children = [...parentNode.children, nodeId];
      }
    }
  });
};

/**
 * 更新节点是否有子节点的状态
 * @param treeNodesMap
 * @param tree
 * @param parentId
 */
const updateHasChildren = (treeNodesMap: ITreeNodesMap, parentId: string) => {
  const parentNode = treeNodesMap[parentId];
  if (!parentNode) { return; }
  if (parentNode.children.length && !treeNodesMap[parentId].hasChildren) {
    treeNodesMap[parentId].hasChildren = true;
    return;
  }
  if (!parentNode.children.length && treeNodesMap[parentId].hasChildren) {
    treeNodesMap[parentId].hasChildren = false;
  }
};

const moveTo = (treeNodesMap: ITreeNodesMap, nodeId: string, targetNodeId: string, pos: number) => {
  if (pos === 0) {
    crossLevelMove(treeNodesMap, nodeId, targetNodeId, pos);
  }
  // 被拖拽节点的你节点
  const parentNodeId = treeNodesMap[nodeId].parentId;
  const targetParentNodeId = treeNodesMap[targetNodeId].parentId;
  // 如果两个节点的父节点相同，说明是同级目录下移动
  if (parentNodeId === targetParentNodeId) {
    sameLevelMove(treeNodesMap, nodeId, targetNodeId, pos);
  } else {
    crossLevelMove(treeNodesMap, nodeId, targetNodeId, pos);
  }
};

/**
 * 同层级移动
 * @param treeNodes 目录树
 * @param treeNodesMap 目录树节点信息的集合
 * @param nodeId 被移动的节点
 * @param targetNodeId 目标节点
 * @param pos 相对目标节点的位置
 */
const sameLevelMove = (treeNodesMap: ITreeNodesMap, nodeId: string, targetNodeId: string, pos: number) => {
  const parentNodeId = treeNodesMap[nodeId].parentId;
  const parentNode = treeNodesMap[parentNodeId];
  const targetParentNode = treeNodesMap[treeNodesMap[targetNodeId].parentId];
  const dragNode = treeNodesMap[nodeId];

  if (!parentNode || !dragNode) { return; }
  const nextNodeId = parentNode.children[parentNode.children.findIndex(id => id === nodeId) + 1];
  // 是否会影响被移动节点的下一个节点的preNodeId
  if (nextNodeId && treeNodesMap[nextNodeId].preNodeId === nodeId) {
    treeNodesMap[nextNodeId].preNodeId = dragNode.preNodeId;
  }
  // 更新目标位置受到影响的节点
  if (pos === -1) {
    dragNode.preNodeId = treeNodesMap[targetNodeId].preNodeId;
    treeNodesMap[targetNodeId].preNodeId = nodeId;
  }
  if (pos === 1) {
    dragNode.preNodeId = targetNodeId;
    const nextNodeIdOfTargetNode = targetParentNode.children[targetParentNode.children.findIndex(id => id === targetNodeId) + 1];
    if (nextNodeIdOfTargetNode && treeNodesMap[nextNodeIdOfTargetNode].preNodeId === targetNodeId) {
      treeNodesMap[nextNodeIdOfTargetNode].preNodeId = nodeId;
    }
  }

  parentNode.children = parentNode.children.reduce((prevNodeIds, id) => {
    // 将节点从原先位置删除
    if (id === nodeId) { return prevNodeIds; }
    if (id === targetNodeId) {
      // 将拖拽节点移动到目标节点的前面
      pos === -1 && prevNodeIds.push(nodeId) && prevNodeIds.push(id);
      // 将拖拽节点移动到目标节点的后面
      pos === 1 && prevNodeIds.push(id) && prevNodeIds.push(nodeId);
    } else {
      prevNodeIds.push(id);
    }
    return prevNodeIds;
  }, [] as string[]);
};

/**
 * 跨层级移动
 * @param treeNodesMap 目录树节点信息的集合
 * @param nodeId 被移动的节点
 * @param targetNodeId 目标节点
 * @param pos 相对目标节点的位置
 */
const crossLevelMove = (treeNodesMap: ITreeNodesMap, nodeId: string, targetNodeId: string, pos: number) => {
  const parentNodeId = treeNodesMap[nodeId].parentId;
  const targetParentNodeId = pos === 0 ? targetNodeId : treeNodesMap[targetNodeId].parentId;
  const parentNode = treeNodesMap[parentNodeId];
  const targetParentNode = treeNodesMap[targetParentNodeId];
  const dragNode = treeNodesMap[nodeId];

  if (!parentNode || !targetParentNode || !dragNode) { return; }

  parentNode.children = parentNode.children.filter(id => id !== nodeId);
  if (pos === 0) {
    targetParentNode.children.unshift(nodeId);
  } else {
    targetParentNode.children = targetParentNode.children.reduce((preNodeIds, id) => {
      if (id === targetNodeId) {
        // 将拖拽节点移动到目标节点的前面
        pos === -1 && preNodeIds.push(nodeId) && preNodeIds.push(id);
        // 将拖拽节点移动到目标节点的后面
        pos === 1 && preNodeIds.push(id) && preNodeIds.push(nodeId);
      } else {
        preNodeIds.push(id);
      }
      return preNodeIds;
    }, [] as string[]);
  }
  // 最后修改被移动节点的父节点
  treeNodesMap[nodeId].parentId = targetParentNodeId;
  const names = getPropertyByTree(treeNodesMap, targetParentNodeId, [nodeId], 'nodeName');
  treeNodesMap[nodeId].nodeName = getUniqName(treeNodesMap[nodeId].nodeName, names);
};

/**
 *  获取当前节点下所有子节点的指定的属性
 * @param treeNodesMap 树的数据源
 * @param treeNodes 树
 * @param nodeId 要查找的节点ID
 * @param exceptArr 要去除的节点
 * @param property 要获取的节点属性
 */
export const getPropertyByTree = (treeNodesMap: ITreeNodesMap, nodeId: string, exceptArr: string[], property: string) => {
  const node = treeNodesMap[nodeId];
  if (!node) {
    return [];
  }
  return node.children.reduce((names, nodeId) => {
    if (!exceptArr.includes(nodeId)) {
      names.push(treeNodesMap[nodeId][property]);
    }
    return names;
  }, [] as any[]);
};

export const mergeObj = (oldTree: ITreeNode[], newTree: ITreeNode[], treeNodesMap: ITreeNodesMap) => {
  oldTree.forEach(item => {
    const node = findNode(newTree, item.nodeId);
    if (item.children.length === 0 && node && node.children.length) {
      item.children = node.children;
    } else {
      mergeObj(item.children, newTree, treeNodesMap);
    }
  });
};

// 最最新
// 传入多节点时需要注意，这多个节点必须是同一个父节点下的子节点
export const addNodeToTree = (tree: ITreeNode[], newNode: INode | INode[]) => {
  // 单个节点
  if (!Array.isArray(newNode)) {
    addSingleNodeToTree(tree, newNode);
  } else {
    addMultiNodeToTree(tree, newNode);
  }
};

// 新增单个节点
export const addSingleNodeToTree = (tree: ITreeNode[], newNode: INode) => {
  const { nodeId, parentId, preNodeId } = newNode;
  const parentNode = findNode(tree, parentId);
  if (!parentNode) {
    return;
  }
  // 没有前置节点，默认为父节点下的第一个位置
  if (!preNodeId) {
    parentNode.children.unshift({ nodeId, children: [] });
    return;
  }
  const index = parentNode.children.findIndex(item => item.nodeId === preNodeId);
  if (index !== -1) {
    parentNode.children.splice(index + 1, 0, { nodeId, children: [] });
  }
};

// 新增多个节点
export const addMultiNodeToTree = (tree: ITreeNode[], newNodes: INode[]) => {
  const { parentId } = newNodes[0];
  const parentNode = findNode(tree, parentId);
  if (!parentNode) { return; }
  const formatNodes = newNodes.map(item => ({ nodeId: item.nodeId, children: [] }));
  parentNode.children = formatNodes;
};

export const moveFavoriteNode = (draftCatalogTree: ICatalogTree, data: { nodeId: string, preNodeId: string }) => {
  const { favoriteTreeNodeIds } = draftCatalogTree;
  const { nodeId, preNodeId } = data;

  if (!favoriteTreeNodeIds.includes(nodeId)) { return; }
  draftCatalogTree.favoriteTreeNodeIds = favoriteTreeNodeIds.reduce((prev, id, index) => {
    if (index === 0 && !preNodeId) {
      prev.push(nodeId);
    }
    if (id !== nodeId) {
      prev.push(id);
    }
    if (id === preNodeId) {
      prev.push(nodeId);
    }
    return prev;
  }, [] as string[]);
};

/**
 * 取消星标
 * 不仅要将节点从星标树中移除，同时还需要更新该节点的后一个节点的信息（位置）
 * @param catalogTree
 * @param removeNodeId 要取消星标的节点
 */
export const removeFavoriteNode = (catalogTree: ICatalogTree, removeNodeId: string) => {
  const { favoriteTreeNodeIds, treeNodesMap } = catalogTree;
  const removeIndex = favoriteTreeNodeIds.findIndex(id => id === removeNodeId);

  if (favoriteTreeNodeIds.length > 1 && removeIndex !== favoriteTreeNodeIds.length - 1) {
    const nextNodeId = favoriteTreeNodeIds[removeIndex + 1];

    treeNodesMap[nextNodeId].preFavoriteNodeId = removeIndex === 0 ? '' : treeNodesMap[removeNodeId].preFavoriteNodeId;
  }

  catalogTree.favoriteTreeNodeIds = favoriteTreeNodeIds.filter(id => id !== removeNodeId);
  delete treeNodesMap[removeNodeId].preFavoriteNodeId;
};
