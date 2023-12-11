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

import { has } from 'lodash';
import { useContext, useEffect } from 'react';
import { shallowEqual } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import {
  Api,
  collectProperty,
  ConfigConstant,
  DEFAULT_PERMISSION,
  INode,
  INodeChangeSocketData,
  INodeMeta,
  IPermissions,
  IReduxState,
  ResourceType,
  Selectors,
  StatusCode,
  StoreActions,
  Strings,
  t,
} from '@apitable/core';
import { WarnCircleFilled, WarnFilled } from '@apitable/icons';
import { Message } from 'pc/components/common/message/message';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { getModalConfig } from 'pc/components/common/modal/qr_code_modal_content';
import { WorkbenchSideContext } from 'pc/components/common_side/workbench_side/workbench_side_context';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { NotificationStore } from 'pc/notification_store';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { getNodeTypeByNodeId, getResourceTypeByNodeType } from 'pc/utils';
import { useCatalogTreeRequest } from './use_catalogtree_request';

export enum NodeChangeInfoType {
  Create = 'nodeCreate',
  Update = 'nodeUpdate',
  Move = 'nodeMove',
  Delete = 'nodeDelete',
  UpdateRole = 'nodeUpdateRole',
  Share = 'nodeShare',
  Favorite = 'nodeFavorite',
}

enum ErrorType {
  Delete = 'delete',
  NoPermission = 'noPermission',
}

export const useWorkbenchSideSync = () => {
  const dispatch = useAppDispatch();
  const { getChildNodeListReq, updateNextNode, getPositionNodeReq } = useCatalogTreeRequest();
  const activeNodeId = useAppSelector((state: IReduxState) => Selectors.getNodeId(state));
  const { treeNodesMap, socketData, expandedKeys, spaceId } = useAppSelector(
    (state: IReduxState) => ({
      treeNodesMap: state.catalogTree.treeNodesMap,
      socketData: state.catalogTree.socketData,
      expandedKeys: state.catalogTree.expandedKeys,
      spaceId: state.space.activeId,
    }),
    shallowEqual,
  );
  const { setRightClickInfo, rightClickInfo } = useContext(WorkbenchSideContext);

  // Synchronous update of the directory tree via socket
  useEffect(() => {
    // Filter out the operator's own messages (since the messages are broadcast globally, the operator itself will receive them)
    if (socketData && socketData.socketId !== NotificationStore.socket.id && socketData.spaceId === spaceId) {
      socketData && realTimeSyncTree(socketData);
    }
    // eslint-disable-next-line
  }, [socketData]);

  // Determines if the specified node exists and has been expanded
  // TODO: It is also necessary to take into account the case where the child node is already empty
  const isNodeExistAndExpanded = (nodeId: string): boolean => {
    if (!treeNodesMap[nodeId]) {
      return false;
    }
    const node = treeNodesMap[nodeId];
    // A node that indicates that it has children and that a child node is mounted in the tree returns true
    if ((treeNodesMap[nodeId].hasChildren && node?.children.length) || expandedKeys.includes(nodeId)) {
      return true;
    }
    return false;
  };

  // If the number of nodes currently requested does not match the number of nodes returned, a diff operation is performed on the tree
  const diffOperation = (oldIds: string[], newNodes: INode[]) => {
    const newIds = newNodes.map((node) => node.nodeId);
    const datasheetMapKeys = Selectors.getDatasheetIds(store.getState());
    /*
     * The number of nodes requested is greater than the number of nodes returned
     * (because the request only returns the nodes currently entitled to access), the tree is deleted
     **/
    if (oldIds.length > newIds.length) {
      const diffNodeIds = oldIds.filter((nodeId) => !newIds.includes(nodeId));
      if (rightClickInfo && diffNodeIds.includes(rightClickInfo.id)) {
        setRightClickInfo(null);
      }
      for (const nodeId of diffNodeIds) {
        if (!treeNodesMap[nodeId]) {
          return;
        }
        updateNextNode(nodeId);
        dispatch(StoreActions.deleteNode({ parentId: treeNodesMap[nodeId].parentId, nodeId }));
        datasheetMapKeys.includes(nodeId) &&
          updateResourceRole([
            {
              type: ConfigConstant.NodeType.DATASHEET,
              nodeId,
              role: ConfigConstant.Role.Reader,
              permissions: DEFAULT_PERMISSION,
            },
          ]);
        if (nodeId === activeNodeId) {
          popErrorModal(nodeId, ErrorType.NoPermission, treeNodesMap[nodeId].type);
        }
      }
    }
  };

  const updateResourceRole = (
    data: INode[] | { type: ConfigConstant.NodeType; nodeId: string; role: ConfigConstant.Role; permissions: IPermissions }[],
  ) => {
    for (const node of data) {
      let resourceType: ResourceType = ResourceType.Datasheet;
      if (node.type === ConfigConstant.NodeType.DASHBOARD) {
        resourceType = ResourceType.Dashboard;
      }
      if (node.type === ConfigConstant.NodeType.MIRROR) {
        resourceType = ResourceType.Mirror;
      }
      dispatch(StoreActions.updateResource({ permissions: node.permissions, role: node.role }, node.nodeId, resourceType));
    }
  };

  // Updating data sources, e.g. directory tree count tables, form data sources
  const updateNodeInfo = (
    nodeId: string,
    nodeType: ConfigConstant.NodeType,
    data: Partial<Omit<INodeMeta, 'name'> & { nodeName?: string; showRecordHistory?: ConfigConstant.ShowRecordHistory }>,
  ) => {
    dispatch(StoreActions.updateTreeNodesMap(nodeId, data));
    const { nodeName: name, showRecordHistory, ...info } = data;
    const nodeData = name ? { ...info, name } : info;
    switch (nodeType) {
      case ConfigConstant.NodeType.DATASHEET: {
        // Co-Update table history switch status
        if (has(data, 'showRecordHistory')) {
          dispatch(
            StoreActions.updateNodeInfo(nodeId, nodeType, {
              extra: {
                showRecordHistory: showRecordHistory === ConfigConstant.ShowRecordHistory.OPEN,
              },
            }),
          );
        }
        dispatch(StoreActions.updateDatasheet(nodeId, nodeData));
        break;
      }
      case ConfigConstant.NodeType.FORM: {
        dispatch(StoreActions.updateForm(nodeId, nodeData));
        break;
      }
      case ConfigConstant.NodeType.MIRROR: {
        dispatch(StoreActions.updateMirror(nodeId, nodeData));
        break;
      }
      case ConfigConstant.NodeType.DASHBOARD: {
        dispatch(StoreActions.updateDashboard(nodeId, nodeData));
        break;
      }
    }
  };

  const popErrorModal = (nodeId: string, errorType: ErrorType, nodeType: ConfigConstant.NodeType = ConfigConstant.NodeType.DATASHEET) => {
    if (errorType === ErrorType.Delete) {
      Api.keepTabbar({}).then(() => {
        // window.location.reload();
      });
      return;
    }

    const configObj = {
      delete: {
        content: t(Strings.delete_file_message_content) + `(${StatusCode.NODE_DELETED})`,
        icon: WarnCircleFilled({ size: 24 }),
        modalButtonType: 'error',
      },
      noPermission: {
        content: t(Strings.no_file_permission_message) + `(${StatusCode.NOT_PERMISSION})`,
        icon: WarnFilled({ size: 24 }),
        modalButtonType: 'warning',
      },
    };

    const { content, modalButtonType, icon } = configObj[errorType];
    const popErrorModalClose = () => {
      modal.destroy();
      syncErrorCode(nodeId, nodeType, StatusCode.NODE_NOT_EXIST);
      Api.keepTabbar({}).then(() => {
        window.location.reload();
      });
    };

    const modalConfig = getModalConfig({
      title: t(Strings.file_notification),
      content: content,
      onOk: popErrorModalClose,
      maskClosable: false,
      icon,
      modalButtonType,
    });
    const modal = Modal.warning(modalConfig);
  };

  // Synchronising the error status of non-folder type nodes
  const syncErrorCode = (nodeId: string, nodeType: ConfigConstant.NodeType, code: number | null) => {
    switch (nodeType) {
      case ConfigConstant.NodeType.DATASHEET:
        dispatch(StoreActions.resourceErrorCode(code, nodeId, ResourceType.Datasheet));
        break;
      case ConfigConstant.NodeType.FORM:
        dispatch(StoreActions.resourceErrorCode(code, nodeId, ResourceType.Form));
        break;
      case ConfigConstant.NodeType.DASHBOARD:
        dispatch(StoreActions.resourceErrorCode(code, nodeId, ResourceType.Dashboard));
        break;
    }
  };

  // Handling synchronisation messages for node creation
  const createNodeSync = async (data: INodeChangeSocketData) => {
    const { parentId } = data.data;
    /**
     * There is no need to synchronise the data if it has not been expanded,
     * but it is necessary to update the hasChildren status of the current node to indicate that it has children.
     */
    if (!isNodeExistAndExpanded(parentId)) {
      dispatch(StoreActions.updateTreeNodesMap(parentId, { hasChildren: true }));
      return;
    }

    const result = await getChildNodeListReq(parentId);
    if (!result) {
      return;
    }
    dispatch(batchActions([StoreActions.addNodeToMap(result, false), StoreActions.refreshTree(result)]));
    for (const node of result) {
      // TODO: When the added node is a folder and it is the currently active node, the error status of the folder is removed
      if (node.type === ConfigConstant.NodeType.FOLDER) {
        return;
      }
      syncErrorCode(node.nodeId, node.type, null);
    }
  };

  // Handling synchronisation messages for update nodes
  const updateNodeSync = async (data: INodeChangeSocketData) => {
    const { nodeId } = data.data;
    if (!treeNodesMap[nodeId]) {
      return;
    }
    const res = await Api.getNodeInfo(nodeId);
    const { data: nodeData } = res.data;
    const nodeInfo = nodeData[0];
    updateNodeInfo(nodeId, treeNodesMap[nodeId].type, nodeInfo);
  };

  // Handle synchronisation messages from shared nodes
  const shareNodeSync = (data: INodeChangeSocketData) => {
    const { nodeId, nodeShared } = data.data;
    if (!treeNodesMap[nodeId]) {
      return;
    }

    dispatch(StoreActions.updateTreeNodesMap(nodeId, { nodeShared }));
    dispatch(StoreActions.updateNodeInfo(nodeId, treeNodesMap[nodeId].type, { nodeShared }));
  };

  // Handling synchronisation messages for deleted nodes
  const deleteNodeSync = (data: INodeChangeSocketData) => {
    const { nodeId } = data.data;
    if (!treeNodesMap[nodeId]) {
      return;
    }
    // The set of ids of the nodes that will be affected
    const idsArray: string[] = collectProperty(treeNodesMap, nodeId);
    /**
     * Considering that deleting a node may affect the prevNodeId of the node after it,
     * you need to determine whether to update the information of a node after it
     */
    updateNextNode(nodeId);
    dispatch(StoreActions.deleteNode({ parentId: treeNodesMap[nodeId].parentId, nodeId }));
    if (rightClickInfo && idsArray.includes(rightClickInfo.id)) {
      setRightClickInfo(null);
    }
    // Show error message page
    if (activeNodeId && idsArray.includes(activeNodeId)) {
      dispatch(StoreActions.resetResource(nodeId, getResourceTypeByNodeType(treeNodesMap[activeNodeId].type)));
      popErrorModal(activeNodeId, ErrorType.Delete, treeNodesMap[activeNodeId].type);
    }
  };

  // Handling of starred status change messages
  // const updateFavoriteSync = (data: INodeChangeSocketData) => {
  //   const { nodeId } = data.data;
  //   // Cancel Starred
  //   if (favoriteTreeNodeIds.findIndex(id => id === nodeId) !== -1) {
  //     dispatch(StoreActions.removeFavorite(nodeId));
  //     return;
  //   }
  //   // Set star (node data already exists in the data source)
  //   if (treeNodesMap[nodeId]) {
  //     dispatch(
  //       StoreActions.generateFavoriteTree([{ ...treeNodesMap[nodeId], preFavoriteNodeId: '', nodeFavorite: true }]),
  //     );
  //     dispatch(StoreActions.updateNodeInfo(nodeId, treeNodesMap[nodeId].type, { nodeFavorite: true }));
  //     return;
  //   }
  //   // Set star (node data does not exist in the data source)
  //   Api.getNodeInfo(nodeId).then(res => {
  //     const { success, data } = res.data;
  //     if (success) {
  //       dispatch(StoreActions.generateFavoriteTree([{ ...data[0], preFavoriteNodeId: '', nodeFavorite: true }]));
  //       dispatch(StoreActions.updateNodeInfo(nodeId, treeNodesMap[nodeId].type, { nodeFavorite: true }));
  //     }
  //   });
  // };

  // Handling of permission change messages
  const updateRoleSync = (data: INodeChangeSocketData) => {
    const datasheetMapKeys = Selectors.getDatasheetIds(store.getState());
    const { nodeId, parentId } = data.data;
    /**
     * If neither the parent node nor the updated node exists and the workbenchSidebar does not exist in the table cache,
     * the subsequent processing is skipped
     */
    if (!treeNodesMap[parentId] && !treeNodesMap[nodeId] && datasheetMapKeys.includes(nodeId)) {
      return;
    }

    // Node to get new information
    const idsArray: string[] = collectProperty(treeNodesMap, nodeId);
    const ids = idsArray.join(',');

    Api.getNodeInfo(ids).then((res) => {
      const { success, data } = res.data;
      if (success) {
        if (idsArray.length !== data.length) {
          diffOperation(idsArray, data);
          return;
        }
        if (!treeNodesMap[nodeId]) {
          dispatch(StoreActions.addNodeToMap([data[0]]));
          dispatch(StoreActions.datasheetErrorCode(nodeId, null));
          syncErrorCode(nodeId, getNodeTypeByNodeId(nodeId), null);
          dispatch(StoreActions.setActiveNodeError(false));
          datasheetMapKeys.includes(nodeId) && updateResourceRole([data[0]]);
          return;
        }
        const newActiveNodeInfo = data.find((item: any) => item.nodeId === activeNodeId);
        if (activeNodeId && idsArray.includes(activeNodeId) && newActiveNodeInfo && treeNodesMap[activeNodeId].role !== newActiveNodeInfo.role) {
          Message.info({
            content: t(Strings.node_permission_has_been_changed, {
              nodeRoleName: ConfigConstant.permissionText[newActiveNodeInfo.role],
            }),
          });
        }
        if (newActiveNodeInfo && newActiveNodeInfo.type === ConfigConstant.NodeType.FOLDER) {
          dispatch(StoreActions.setActiveNodeError(false));
        }
        dispatch(StoreActions.addNodeToMap(data));
        updateResourceRole(data);
      } else {
        Message.error({ content: t(Strings.message_node_data_sync_failed) });
      }
    });
  };

  // Handling messages from moving nodes
  const moveNodeSync = async (data: INodeChangeSocketData) => {
    const { nodeId, parentId, preNodeId } = data.data;
    const dragNode = treeNodesMap[nodeId];
    /**
     * Neither the node being moved nor the container node being moved to has a data source and there is no need to process it
     */
    if (!dragNode && !treeNodesMap[parentId]) {
      return;
    }

    // Dragging at the same level
    if (dragNode && parentId === dragNode.parentId) {
      const parentNodeChildren = treeNodesMap[parentId].children;
      /**
       * Update the children attribute of the parent node if the predecessor node at the target location exists,
       * otherwise request the children node to update the children attribute later via parentId
       */
      if (parentNodeChildren.includes(preNodeId)) {
        const children = parentNodeChildren.reduce((prevArr, id) => {
          if (id !== nodeId) {
            prevArr.push(id);
          }
          if (id === preNodeId) {
            prevArr.push(nodeId);
          }
          return prevArr;
        }, [] as string[]);
        updateNextNode(nodeId);
        dispatch(StoreActions.updateTreeNodesMap(parentId, { children }));
        dispatch(StoreActions.updateTreeNodesMap(nodeId, { preNodeId }));
        return;
      }

      const childrenNodes = await getChildNodeListReq(parentId);
      if (!childrenNodes) {
        return;
      }
      const children = childrenNodes.map((node) => node.nodeId);
      dispatch(StoreActions.addNodeToMap(childrenNodes, false));
      dispatch(StoreActions.updateTreeNodesMap(parentId, { hasChildren: true, children }));
      return;
    }

    // Dragging across levels
    if (dragNode) {
      dispatch(StoreActions.deleteNode({ parentId: dragNode.parentId, nodeId }));
    }
    const result = await getPositionNodeReq(nodeId);
    if (!result) {
      const nodeInfo = await Api.getNodeInfo(nodeId).then((res) => res.data.data);
      if (dragNode && !nodeInfo && dragNode.type !== ConfigConstant.NodeType.FOLDER && nodeId === activeNodeId && !treeNodesMap[parentId]) {
        popErrorModal(nodeId, ErrorType.NoPermission);
      }
    }
  };

  // Real-time tree updates via sockets
  const realTimeSyncTree = (data: INodeChangeSocketData) => {
    switch (data.type) {
      case NodeChangeInfoType.Create:
        createNodeSync(data);
        break;
      case NodeChangeInfoType.Update:
        updateNodeSync(data);
        break;
      case NodeChangeInfoType.Move:
        moveNodeSync(data);
        break;
      case NodeChangeInfoType.Delete:
        deleteNodeSync(data);
        break;
      case NodeChangeInfoType.UpdateRole:
        updateRoleSync(data);
        break;
      case NodeChangeInfoType.Share:
        shareNodeSync(data);
        break;
      case NodeChangeInfoType.Favorite:
        // TODO:sync favorite will cause star action not work
        // updateFavoriteSync(data);
        break;
      default:
        console.log('Invalid socket message: ', data);
    }
  };
};
