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

import { ConfigConstant } from 'config';
import { produce } from 'immer';
import { collectProperty, findNode, getUniqName } from 'utils';
import {
  IAddNodeToFavoriteTreeAction,
  IAddNodeToMapAction,
  ICatalogTree,
  IClearNodeAction,
  ICoLayerMoveNodeAction,
  IDeleteNodeAction,
  IDeleteNodeFromFavoriteTreeAction,
  IInitCatalogTreeAction,
  IInitFavoriteTreeNodesAction,
  IMoveFavoriteNodeAction,
  IMoveNodeToFolderAction,
  IMoveToAction,
  INode,
  INodesMapItem,
  IOptNode,
  IRefreshTreeAction,
  IRemoveFavoriteNodeAction,
  ISetActiveNodeErrorAction, ISetActiveTreeType,
  ISetAllVisibleAction,
  ISetCopyNodeIdAction,
  ISetDelNodeIdAction,
  ISetEditNodeIdAction,
  ISetErrAction,
  ISetExpandedKeysActions,
  ISetIsCopyAllAction,
  ISetLoadedAction,
  ISetLoadedKeysAction,
  ISetNodeErrorTypeAction,
  ISetNodeNameAction,
  ISetNoPermissionMembersAction,
  ISetOptNodeAction,
  ISetPermissionCommitRemindParameterAction,
  ISetPermissionModalMessageStatusAction,
  ISetPrivateTreeRootIdAction,
  ISetRootIdAction,
  ISetTreeRootIdAction,
  ITreeNode,
  ITreeNodesMap,
  IUpdateHasChildren,
  IUpdateImportModalNodeIdAction,
  IUpdateIsPermissionAction,
  IUpdateMoveToNodeIdsAction,
  IUpdatePermissionModalNodeIdAction,
  IUpdateSaveAsTemplateModalNodeIdAction,
  IUpdateShareModalNodeIdAction,
  IUpdateSocketDataAction,
  IUpdateTreeNodesMapAction,
} from '../../../../exports/store/interfaces';
import * as actions from '../../../shared/store/action_constants';
import { uniq } from 'lodash';

const defaultState: ICatalogTree = {
  /**
   * whether catalog tree is loading
   */
  loading: true,
  /**
   * the information of the new node
   */
  node: null,
  /**
   * current operation node info
   */
  optNode: null,
  /**
   * node to delete ID
   */
  delNodeId: '',
  /**
   * the node ID that is being edited
   */
  editNodeId: '',
  /**
   * the node to copy ID
   */
  copyNodeId: '',
  /**
   * whether or not to copy data
   */
  isCopyAll: false,
  /**
   * error message when processing fails
   */
  err: '',
  /**
   * root node ID
   */
  rootId: '',
  /**
   * the map of the tree nodes (share by tab bar and catalog)
   */
  treeNodesMap: {},
  /**
   * the array of the expanded nodes
   */
  expandedKeys: [],
  /**
   * the array of the loaded nodes
   */
  loadedKeys: [],
  /**
   * units (members, teams)
   */
  unit: null,
  /**
   * all visible
   */
  allVisible: false,
  // whether to have current datasheet permission
  isPermission: true,
  /**
   * the push data by socket
   */
  socketData: null,
  privateRootId: '',
  privateLoading: false,
  privateEditNodeId: '',
  privateDelNodeId: '',
  privateTreeNodesMap: {},
  privateExpandedKeys: [],
  // favorite tree node ids
  favoriteTreeNodeIds: [],
  // the loading state of favorite star
  favoriteLoading: true,
  favoriteExpandedKeys: [],
  favoriteEditNodeId: '',
  favoriteDelNodeId: '',
  activeNodeError: false,

  /**
   * the node IDs that is opening permission UI window
   */
  permissionModalNodeId: '',
  /**
   * the node id that current opening share UI window
   */
  shareModalNodeId: '',
  /**
   * the node id that current opening save as template UI window
   */
  saveAsTemplateModalNodeId: '',
  /**
   * the node id that current opening import UI window
   */
  importModalNodeId: '',
  /**
   * whether or not the permission UI window comes from notification call
   */
  permissionCommitRemindStatus: false,
  /**
   * arguments that need to be sent to the member message
   */
  permissionCommitRemindParameter: null,
  /**
   * the unit(member) ids that have no permission
   */
  noPermissionMembers: [],
};

type CatalogTreeActions =
  | ISetNodeNameAction
  | ISetRootIdAction
  | ISetDelNodeIdAction
  | IDeleteNodeAction
  | IMoveNodeToFolderAction
  | ICoLayerMoveNodeAction
  | ISetOptNodeAction
  | ISetErrAction
  | ISetEditNodeIdAction
  | IAddNodeToMapAction
  | ISetIsCopyAllAction
  | ISetExpandedKeysActions
  | IInitCatalogTreeAction
  | ISetCopyNodeIdAction
  | ISetAllVisibleAction
  | ISetLoadedAction
  | IUpdateHasChildren
  | IMoveToAction
  | IUpdateTreeNodesMapAction
  | IClearNodeAction
  | IUpdateIsPermissionAction
  | IUpdateSocketDataAction
  | IRefreshTreeAction
  | IAddNodeToFavoriteTreeAction
  | IRemoveFavoriteNodeAction
  | IDeleteNodeFromFavoriteTreeAction
  | IMoveFavoriteNodeAction
  | IInitFavoriteTreeNodesAction
  | ISetActiveNodeErrorAction
  | IUpdatePermissionModalNodeIdAction
  | IUpdateShareModalNodeIdAction
  | IUpdateSaveAsTemplateModalNodeIdAction
  | IUpdateImportModalNodeIdAction
  | ISetTreeRootIdAction
  | ISetPrivateTreeRootIdAction
  | ISetLoadedKeysAction
  | ISetNodeErrorTypeAction
  | ISetPermissionModalMessageStatusAction
  | ISetPermissionCommitRemindParameterAction
  | ISetNoPermissionMembersAction
  | ISetActiveTreeType
  | IUpdateMoveToNodeIdsAction;

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
        case ConfigConstant.Modules.PRIVATE: {
          draftCatalogTree.privateDelNodeId = nodeId;
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
        case ConfigConstant.Modules.PRIVATE: {
          draftCatalogTree.privateEditNodeId = nodeId;
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
      const { nodeId, nodeName, module } = action.payload;
      if (module === ConfigConstant.Modules.PRIVATE) {
        draftCatalogTree.privateTreeNodesMap[nodeId]!.nodeName = nodeName;
      } else {
        draftCatalogTree.treeNodesMap[nodeId]!.nodeName = nodeName;
      }
      return draftCatalogTree;
    }
    case actions.SET_NODE_ERROR_TYPE: {
      const { nodeId, errType, module } = action.payload;
      if (module === ConfigConstant.Modules.PRIVATE) {
        draftCatalogTree.privateTreeNodesMap[nodeId]!.errType = errType;
      } else {
        draftCatalogTree.treeNodesMap[nodeId]!.errType = errType;
      }
      return draftCatalogTree;
    }
    case actions.ADD_NODE_TO_MAP: {
      const { data, isCoverChildren, module } = action.payload;
      addNodeToMap(draftCatalogTree, data, isCoverChildren, module);
      return draftCatalogTree;
    }
    case actions.REFRESH_TREE: {
      const childNodeIds = action.payload.map((item) => item.nodeId);
      if (!draftCatalogTree.treeNodesMap[action.payload[0]!.parentId]) {
        return draftCatalogTree;
      }
      draftCatalogTree.treeNodesMap[action.payload[0]!.parentId]!.children = childNodeIds;
      const parentNode = draftCatalogTree.treeNodesMap[action.payload[0]!.parentId]!;
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
        case ConfigConstant.Modules.PRIVATE: {
          draftCatalogTree.privateExpandedKeys = expandedKeys;
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
    case actions.SET_ACTIVE_TREE_TYPE: {
      draftCatalogTree.activeType = action.payload;
      return draftCatalogTree;
    }
    case actions.TREE_LOADING: {
      const { loading, module } = action.payload;
      switch (module) {
        case ConfigConstant.Modules.CATALOG: {
          draftCatalogTree.loading = loading;
          break;
        }
        case ConfigConstant.Modules.PRIVATE: {
          draftCatalogTree.privateLoading = loading;
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
      const nodesMap = action.payload.module === ConfigConstant.Modules.PRIVATE ?
        draftCatalogTree.privateTreeNodesMap : draftCatalogTree.treeNodesMap;
      updateHasChildren(nodesMap, action.payload.nodeId);
      return draftCatalogTree;
    }
    case actions.NODE_MOVE_TO: {
      const { nodeId, targetNodeId, pos, module } = action.payload;
      const treeNodeKey = module === ConfigConstant.Modules.PRIVATE ? 'privateTreeNodesMap' : 'treeNodesMap';
      const prevName = draftCatalogTree[treeNodeKey][nodeId]!.nodeName;
      moveTo(draftCatalogTree[treeNodeKey], nodeId, targetNodeId, pos);
      if (prevName !== draftCatalogTree[treeNodeKey][nodeId]!.nodeName) {
        const editNodeIdKey = module === ConfigConstant.Modules.PRIVATE ? 'privateEditNodeId' : 'editNodeId';
        draftCatalogTree[editNodeIdKey] = nodeId;
      }
      return draftCatalogTree;
    }
    case actions.UPDATE_TREE_NODES_MAP: {
      const { nodeId, data, module } = action.payload;
      const treeNodeKey = module === ConfigConstant.Modules.PRIVATE ? 'privateTreeNodesMap' : 'treeNodesMap';
      if (!draftCatalogTree[treeNodeKey][nodeId]) {
        return draftCatalogTree;
      }
      draftCatalogTree[treeNodeKey][nodeId] = { ...draftCatalogTree[treeNodeKey][nodeId]!, ...data };
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
      draftCatalogTree.favoriteTreeNodeIds = uniq([...nodeIds, ...draftCatalogTree.favoriteTreeNodeIds]);
      return draftCatalogTree;
    }
    case actions.REMOVE_FAVORITE_NODE: {
      removeFavoriteNode(draftCatalogTree, action.payload);
      return draftCatalogTree;
    }
    case actions.DELETE_NODE_FROM_FAVORITE_LIST: {
      const deleteNodeId = action.payload.nodeId;
      if (draftCatalogTree.favoriteTreeNodeIds.findIndex((id) => id === deleteNodeId) !== -1) {
        draftCatalogTree.favoriteTreeNodeIds = draftCatalogTree.favoriteTreeNodeIds.filter((id) => id !== deleteNodeId);
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
    case actions.SET_PRIVATE_TREE_ROOT_ID: {
      draftCatalogTree.privateRootId = action.payload;
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
}, defaultState);

/**
 * delete node
 * attention, sub nodes may be a favorite(star).
 * it needs to update favorite trees.
 * @param catalogTree
 * @param optNode the nodes info
 */
const deleteNode = (catalogTree: ICatalogTree, optNode: IOptNode) => {
  const { nodeId, parentId, module } = optNode;
  const {
    treeNodesMap,
    privateTreeNodesMap,
    favoriteTreeNodeIds,
    delNodeId,
    editNodeId,
    privateDelNodeId,
    privateEditNodeId,
    favoriteEditNodeId,
    favoriteDelNodeId,
    permissionModalNodeId,
    shareModalNodeId,
    saveAsTemplateModalNodeId,
    importModalNodeId,
    expandedKeys,
    loadedKeys,
  } = catalogTree;
  const nodesMap = module === ConfigConstant.Modules.PRIVATE ? privateTreeNodesMap : treeNodesMap;
  // the nodeIDs collection that is operating
  const operationsIdArr = module === ConfigConstant.Modules.PRIVATE ? [
    privateDelNodeId,
    privateEditNodeId,
    favoriteEditNodeId,
    favoriteDelNodeId,
    permissionModalNodeId,
    shareModalNodeId,
    saveAsTemplateModalNodeId,
    importModalNodeId,
  ] : [
    delNodeId,
    editNodeId,
    favoriteEditNodeId,
    favoriteDelNodeId,
    permissionModalNodeId,
    shareModalNodeId,
    saveAsTemplateModalNodeId,
    importModalNodeId,
  ];

  const parentNode = nodesMap[parentId];

  const deleteIds = collectProperty(nodesMap, nodeId);
  if (parentNode) {
    const nextNodeId = parentNode.children[parentNode.children.findIndex((item) => item === nodeId) + 1]!;
    const nextNode = nodesMap[nextNodeId];
    if (nextNode && nextNode.preNodeId === nodeId) {
      nextNode.preNodeId = nodesMap[nodeId]!.preNodeId;
    }
    parentNode.children = parentNode.children.filter((id) => id !== nodeId);
  }

  for (const nodeId of deleteIds) {
    if (operationsIdArr.includes(nodeId)) {
      operationsIdArr.forEach((id) => {
        catalogTree[id] = '';
      });
    }
    if (loadedKeys.includes(nodeId)) {
      catalogTree.loadedKeys = loadedKeys.filter((item) => item !== nodeId);
    }
    if (favoriteTreeNodeIds.findIndex((id) => id === nodeId) !== -1) {
      removeFavoriteNode(catalogTree, nodeId);
    }
    // remove the deleted node from expanded collection
    if (expandedKeys.includes(nodeId)) {
      catalogTree.expandedKeys = expandedKeys.filter((item) => item !== nodeId);
    }
    delete nodesMap[nodeId];
  }
};

/**
 * add nodes to treeNodeMap (catalog tree data source)
 *
 * @param catalogTree
 * @param data tree nodes info
 * @param isCoverChildren
 * @param module
 */
const addNodeToMap = (
  catalogTree: ICatalogTree,
  data: (Omit<INodesMapItem, 'children'> & { children?: string[] })[],
  isCoverChildren: boolean,
  module: ConfigConstant.Modules
) => {
  const nodesMap = module === ConfigConstant.Modules.PRIVATE ? catalogTree.privateTreeNodesMap : catalogTree.treeNodesMap;
  data.forEach((node) => {
    const { nodeId, parentId } = node;
    const parentNode = nodesMap[parentId];

    // if nodes don't exist in data, and have no children property, it needs to add children property
    if (!nodesMap[nodeId] && !node?.children) {
      node = { ...node, children: [] };
    }
    // whether to put this node into the collection of loaded nodes
    if (node.hasChildren && node.type === ConfigConstant.NodeType.FOLDER && node.children?.length && !catalogTree.loadedKeys.includes(nodeId)) {
      catalogTree.loadedKeys = [...catalogTree.loadedKeys, nodeId];
    }
    if (isCoverChildren) {
      nodesMap[nodeId] = { ...nodesMap[nodeId]!, ...node };
    } else {
      const children = nodesMap[nodeId]?.children || node.children;
      nodesMap[nodeId] = { ...nodesMap[nodeId]!, ...node, children: children! };
    }

    if (!parentNode) {
      return;
    }

    // whether to put this node into the collection of loaded nodes
    if (!catalogTree.loadedKeys.includes(parentId) && parentNode.type === ConfigConstant.NodeType.FOLDER) {
      catalogTree.loadedKeys = [...catalogTree.loadedKeys, parentId];
    }
    // update parent node's hasChildren property
    if (!parentNode.hasChildren) {
      parentNode.hasChildren = true;
    }
    // update parent node's first child node's prevNodeId property
    if (parentNode.children.length && !parentNode.children.includes(nodeId)) {
      nodesMap[parentNode.children[0]!]!.preNodeId = '';
    }
    // whether this node has been added to children
    let isAdded = false;

    // update parent node's children property
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
 * update node's hasChildren state
 * @param nodesMap
 * @param parentId
 */
const updateHasChildren = (nodesMap: ITreeNodesMap, parentId: string) => {
  const parentNode = nodesMap[parentId];
  if (!parentNode) {
    return;
  }
  if (parentNode.children.length && !nodesMap[parentId]!.hasChildren) {
    nodesMap[parentId]!.hasChildren = true;
    return;
  }
  if (!parentNode.children.length && nodesMap[parentId]!.hasChildren) {
    nodesMap[parentId]!.hasChildren = false;
  }
};

const moveTo = (nodesMap: ITreeNodesMap, nodeId: string, targetNodeId: string, pos: number) => {
  if (pos === 0) {
    crossLevelMove(nodesMap, nodeId, targetNodeId, pos);
  }

  // the parent node id for the dragged node
  const parentNodeId = nodesMap[nodeId]!.parentId;
  const targetParentNodeId = nodesMap[targetNodeId]!.parentId;
  // if two nodes' parents are the same, it means that they are moved in the same level
  if (parentNodeId === targetParentNodeId) {
    sameLevelMove(nodesMap, nodeId, targetNodeId, pos);
  } else {
    crossLevelMove(nodesMap, nodeId, targetNodeId, pos);
  }
};

/**
 * move in the same level
 *
 * @param nodesMap the map of tree nodes
 * @param nodeId be moved nodes
 * @param targetNodeId target node
 * @param pos relative target node's position
 */
const sameLevelMove = (nodesMap: ITreeNodesMap, nodeId: string, targetNodeId: string, pos: number) => {
  const parentNodeId = nodesMap[nodeId]!.parentId;
  const parentNode = nodesMap[parentNodeId];
  const targetParentNode = nodesMap[nodesMap[targetNodeId]!.parentId]!;
  const dragNode = nodesMap[nodeId];

  if (!parentNode || !dragNode) {
    return;
  }
  const nextNodeId = parentNode.children[parentNode.children.findIndex((id) => id === nodeId) + 1];
  // whether affect the preNodeId of the next node of the moved node
  if (nextNodeId && nodesMap[nextNodeId]!.preNodeId === nodeId) {
    nodesMap[nextNodeId]!.preNodeId = dragNode.preNodeId;
  }
  // update the node which is affected by the target position
  if (pos === -1) {
    dragNode.preNodeId = nodesMap[targetNodeId]!.preNodeId;
    nodesMap[targetNodeId]!.preNodeId = nodeId;
  }
  if (pos === 1) {
    dragNode.preNodeId = targetNodeId;
    const nextNodeIdOfTargetNode = targetParentNode.children[targetParentNode.children.findIndex((id) => id === targetNodeId) + 1];
    if (nextNodeIdOfTargetNode && nodesMap[nextNodeIdOfTargetNode]!.preNodeId === targetNodeId) {
      nodesMap[nextNodeIdOfTargetNode]!.preNodeId = nodeId;
    }
  }

  parentNode.children = parentNode.children.reduce((prevNodeIds, id) => {
    // delete node from original position
    if (id === nodeId) {
      return prevNodeIds;
    }
    if (id === targetNodeId) {
      // move the dragged node to the front of the target node
      pos === -1 && prevNodeIds.push(nodeId) && prevNodeIds.push(id);
      // move the dragged node to the back of the target node
      pos === 1 && prevNodeIds.push(id) && prevNodeIds.push(nodeId);
    } else {
      prevNodeIds.push(id);
    }
    return prevNodeIds;
  }, [] as string[]);
};

/**
 * cross level move
 * @param nodesMap the collection of catalog tree's nodes info
 * @param nodeId moved node
 * @param targetNodeId target node ID
 * @param pos relative target node's position
 */
const crossLevelMove = (nodesMap: ITreeNodesMap, nodeId: string, targetNodeId: string, pos: number) => {
  const parentNodeId = nodesMap[nodeId]!.parentId;
  const targetParentNodeId = pos === 0 ? targetNodeId : nodesMap[targetNodeId]!.parentId;
  const parentNode = nodesMap[parentNodeId];
  const targetParentNode = nodesMap[targetParentNodeId];
  const dragNode = nodesMap[nodeId];

  if (!parentNode || !targetParentNode || !dragNode) {
    return;
  }

  parentNode.children = parentNode.children.filter((id) => id !== nodeId);
  if (pos === 0) {
    targetParentNode.children.unshift(nodeId);
  } else {
    targetParentNode.children = targetParentNode.children.reduce((preNodeIds, id) => {
      if (id === targetNodeId) {
        // move the dragged node to the front of the target node
        pos === -1 && preNodeIds.push(nodeId) && preNodeIds.push(id);
        // move the dragged node to the back of the target node
        pos === 1 && preNodeIds.push(id) && preNodeIds.push(nodeId);
      } else {
        preNodeIds.push(id);
      }
      return preNodeIds;
    }, [] as string[]);
  }

  // last modified the parent node of the moved node
  nodesMap[nodeId]!.parentId = targetParentNodeId;
  const names = getPropertyByTree(nodesMap, targetParentNodeId, [nodeId], 'nodeName');
  nodesMap[nodeId]!.nodeName = getUniqName(nodesMap[nodeId]!.nodeName, names);
};

/**
 * get current node's children's property
 * @param nodesMap data source tree of nodes
 * @param nodeId the node id want to find
 * @param exceptArr the node id will remove
 * @param property the node attributes to get
 */
export const getPropertyByTree = (nodesMap: ITreeNodesMap, nodeId: string, exceptArr: string[], property: string) => {
  const node = nodesMap[nodeId];
  if (!node) {
    return [];
  }
  return node.children.reduce((names, nodeId) => {
    if (!exceptArr.includes(nodeId)) {
      names.push(nodesMap[nodeId]![property]);
    }
    return names;
  }, [] as any[]);
};

export const mergeObj = (oldTree: ITreeNode[], newTree: ITreeNode[], nodesMap: ITreeNodesMap) => {
  oldTree.forEach((item) => {
    const node = findNode(newTree, item.nodeId);
    if (item.children.length === 0 && node && node.children.length) {
      item.children = node.children;
    } else {
      mergeObj(item.children, newTree, nodesMap);
    }
  });
};

/**
 * (newest)
 * attention: when you pass in multiple nodes,
 * you need to note that these multiple nodes must be the children of the same parent node
 *
 * @param tree
 * @param newNode
 */
export const addNodeToTree = (tree: ITreeNode[], newNode: INode | INode[]) => {
  // single node
  if (!Array.isArray(newNode)) {
    addSingleNodeToTree(tree, newNode);
  } else {
    addMultiNodeToTree(tree, newNode);
  }
};

/**
 * a single node to tree
 *
 * @param tree
 * @param newNode
 * @returns
 */
export const addSingleNodeToTree = (tree: ITreeNode[], newNode: INode) => {
  const { nodeId, parentId, preNodeId } = newNode;
  const parentNode = findNode(tree, parentId);
  if (!parentNode) {
    return;
  }
  // if no pre nodes, the default position is the first position of the parent node
  if (!preNodeId) {
    parentNode.children.unshift({ nodeId, children: [] });
    return;
  }
  const index = parentNode.children.findIndex((item) => item.nodeId === preNodeId);
  if (index !== -1) {
    parentNode.children.splice(index + 1, 0, { nodeId, children: [] });
  }
};

/**
 * new multi nodes
 *
 * @param tree
 * @param newNodes
 * @returns
 */
export const addMultiNodeToTree = (tree: ITreeNode[], newNodes: INode[]) => {
  const { parentId } = newNodes[0]!;
  const parentNode = findNode(tree, parentId);
  if (!parentNode) {
    return;
  }
  parentNode.children = newNodes.map((item) => ({ nodeId: item.nodeId, children: [] }));
};

export const moveFavoriteNode = (draftCatalogTree: ICatalogTree, data: { nodeId: string; preNodeId: string }) => {
  const { favoriteTreeNodeIds } = draftCatalogTree;
  const { nodeId, preNodeId } = data;

  if (!favoriteTreeNodeIds.includes(nodeId)) {
    return;
  }
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
 * cancel favorite star
 * not only remove nodes from favorite trees, but also update node's next node's info(position)
 *
 * @param catalogTree
 * @param removeNodeId the node that cancel favorite
 */
export const removeFavoriteNode = (catalogTree: ICatalogTree, removeNodeId: string) => {
  const { favoriteTreeNodeIds, treeNodesMap } = catalogTree;
  const removeIndex = favoriteTreeNodeIds.findIndex((id) => id === removeNodeId);

  if (favoriteTreeNodeIds.length > 1 && removeIndex !== favoriteTreeNodeIds.length - 1) {
    const nextNodeId = favoriteTreeNodeIds[removeIndex + 1]!;

    treeNodesMap[nextNodeId]!.preFavoriteNodeId = removeIndex === 0 ? '' : treeNodesMap[removeNodeId]!.preFavoriteNodeId;
  }

  catalogTree.favoriteTreeNodeIds = favoriteTreeNodeIds.filter((id) => id !== removeNodeId);
  delete treeNodesMap[removeNodeId]!.preFavoriteNodeId;
};
