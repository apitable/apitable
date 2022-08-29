import { useEffect, useContext } from 'react';
import {
  INodeChangeSocketData, StoreActions, ConfigConstant, IReduxState,
  t, Strings, Selectors, Api, collectProperty, INode, IPermissions, INodeMeta, ResourceType, DEFAULT_PERMISSION,
  StatusCode
} from '@vikadata/core';
import { store } from 'pc/store';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import { useCatalogTreeRequest } from './use_catalogtree_request';
import { Message } from 'pc/components/common';
import { NotificationStore } from 'pc/notification_store';
import { getNodeTypeByNodeId, getResourceTypeByNodeType } from 'pc/utils';
import { has } from 'lodash';
import { WorkbenchSideContext } from 'pc/components/common_side/workbench_side/workbench_side_context';
import { QRCodeModalContent } from 'pc/components/common/modal/qr_code_modal_content';
import { Modal } from 'pc/components/common';
import { WarnFilled, ErrorFilled } from '@vikadata/icons';

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
  NoPermission = 'noPermission'
}

export const useWorkbenchSideSync = () => {
  const dispatch = useDispatch();
  const { getChildNodeListReq, updateNextNode, getPositionNodeReq } = useCatalogTreeRequest();
  const activeNodeId = useSelector((state: IReduxState) => Selectors.getNodeId(state));
  const { treeNodesMap, socketData, favoriteTreeNodeIds, expandedKeys, spaceId } =
    useSelector((state: IReduxState) => ({
      treeNodesMap: state.catalogTree.treeNodesMap,
      socketData: state.catalogTree.socketData,
      favoriteTreeNodeIds: state.catalogTree.favoriteTreeNodeIds,
      expandedKeys: state.catalogTree.expandedKeys,
      spaceId: state.space.activeId,
    }), shallowEqual);
  const { setRightClickInfo, rightClickInfo } = useContext(WorkbenchSideContext);

  // 通过socket对目录树进行同步更新
  useEffect(() => {
    // 过滤掉操作方自己的信息（因为消息是全局广播的，所以操作方自己也会接收到）
    if (socketData && socketData.socketId !== NotificationStore.socket.id && socketData.spaceId === spaceId) {
      socketData && realTimeSyncTree(socketData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketData]);

  // 判断指定节点是否存在并且展开过
  // TODO: 还需要考虑到子节点本就为空的情况
  const isNodeExistAndExpanded = (nodeId: string): boolean => {
    if (!treeNodesMap[nodeId]) {
      return false;
    }
    const node = treeNodesMap[nodeId];
    // 一个节点是表明是有子节点的，并且在树中有已经挂载了子节点，就返回true
    if ((treeNodesMap[nodeId].hasChildren && node?.children.length) || expandedKeys.includes(nodeId)) {
      return true;
    }
    return false;
  };

  // 当前请求的节点数量与返回的节点数量不一致时，将对树进行差异操作
  const diffOperation = (oldIds: string[], newNodes: INode[]) => {
    const newIds = newNodes.map(node => node.nodeId);
    const datasheetMapKeys = Selectors.getDatasheetIds(store.getState());
    // 请求的节点数量大于返回的节点数量（因为请求只返回当前有权访问的节点），对树进行删除操作
    if (oldIds.length > newIds.length) {
      const diffNodeIds = oldIds.filter(nodeId => !newIds.includes(nodeId));
      if (rightClickInfo && diffNodeIds.includes(rightClickInfo.id)) {
        setRightClickInfo(null);
      }
      for (const nodeId of diffNodeIds) {
        if (!treeNodesMap[nodeId]) {
          return;
        }
        updateNextNode(nodeId);
        dispatch(StoreActions.deleteNode({ parentId: treeNodesMap[nodeId].parentId, nodeId }));
        datasheetMapKeys.includes(nodeId) && updateResourceRole([{
          type: ConfigConstant.NodeType.DATASHEET, nodeId, role: ConfigConstant.Role.Reader,
          permissions: DEFAULT_PERMISSION,
        },
        ]);
        if (nodeId === activeNodeId) {
          popErrorModal(nodeId, ErrorType.NoPermission, treeNodesMap[nodeId].type);
        }
      }
    }
  };

  const updateResourceRole = (data: INode[] |
    { type: ConfigConstant.NodeType, nodeId: string, role: ConfigConstant.Role, permissions: IPermissions }[]) => {
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

  // 更新数据源，比如目录树数表、表单的数据源
  const updateNodeInfo = (nodeId: string, nodeType: ConfigConstant.NodeType, data: Partial<Omit<INodeMeta, 'name'> &
    { nodeName?: string, showRecordHistory?: ConfigConstant.ShowRecordHistory }>) => {
    dispatch(StoreActions.updateTreeNodesMap(nodeId, data));
    const { nodeName: name, showRecordHistory, ...info } = data;
    const nodeData = name ? { ...info, name } : info;
    switch (nodeType) {
      case ConfigConstant.NodeType.DATASHEET: {
        // 协同更新表的历史记录开关状态
        if (has(data, 'showRecordHistory')) {
          dispatch(StoreActions.updateNodeInfo(nodeId, nodeType, {
            extra: {
              showRecordHistory: showRecordHistory === ConfigConstant.ShowRecordHistory.OPEN,
            },
          }));
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
    }
  };

  const popErrorModal = (
    nodeId: string, errorType: ErrorType, nodeType: ConfigConstant.NodeType = ConfigConstant.NodeType.DATASHEET
  ) => {

    const configObj = {
      delete: {
        content: t(Strings.delete_file_message_content) + `(${StatusCode.NODE_DELETED})`,
        icon: ErrorFilled({ size: 24 }),
        modalButtonType: 'error'
      },
      noPermission: {
        content: t(Strings.no_file_permission_message) + `(${StatusCode.NOT_PERMISSION})`,
        icon: WarnFilled({ size: 24 }),
        modalButtonType: 'warning'
      }
    };

    const { content, modalButtonType, icon } = configObj[errorType];
    const popErrorModalClose = () => {
      modal.destroy();
      syncErrorCode(nodeId, nodeType, StatusCode.NODE_NOT_EXIST);
      Api.keepTabbar({}).then(() => {
        window.location.reload();
      });
    };

    const modal = Modal.warning({
      title: t(Strings.file_notification),
      content: QRCodeModalContent({
        content,
        onOk: popErrorModalClose,
        modalButtonType
      }),
      footer: null,
      maskClosable: false,
      width: 416,
      icon
    });
    
  };

  // 同步非文件夹类型的节点的错误状态
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

  // 处理创建节点的同步消息
  const createNodeSync = async(data: INodeChangeSocketData) => {
    const { parentId } = data.data;
    // 如果没有展开过就没必要去同步数据,但是需要更新当前节点的hasChildren状态，表示它是有子节点的
    if (!isNodeExistAndExpanded(parentId)) {
      dispatch(StoreActions.updateTreeNodesMap(parentId, { hasChildren: true }));
      return;
    }

    const result = await getChildNodeListReq(parentId);
    if (!result) {
      return;
    }
    dispatch(batchActions([
      StoreActions.addNodeToMap(result, false),
      StoreActions.refreshTree(result)]));
    for (const node of result) {
      // TODO: 当添加的节点为文件夹时并且是当前激活的节点，就将该文件夹的的错误状态取消
      if (node.type === ConfigConstant.NodeType.FOLDER) {
        return;
      }
      syncErrorCode(node.nodeId, node.type, null);
    }
  };

  // 处理更新节点的同步消息
  const updateNodeSync = (data: INodeChangeSocketData) => {
    const { nodeId, ...rest } = data.data;
    if (!treeNodesMap[nodeId]) {
      return;
    }
    updateNodeInfo(nodeId, treeNodesMap[nodeId].type, rest);
  };

  // 处理分享节点的同步消息
  const shareNodeSync = (data: INodeChangeSocketData) => {
    const { nodeId, nodeShared } = data.data;
    if (!treeNodesMap[nodeId]) {
      return;
    }

    dispatch(StoreActions.updateTreeNodesMap(nodeId, { nodeShared }));
    dispatch(StoreActions.updateNodeInfo(nodeId, treeNodesMap[nodeId].type, { nodeShared }));
  };

  // 处理删除节点的同步消息
  const deleteNodeSync = (data: INodeChangeSocketData) => {
    const { nodeId } = data.data;
    if (!treeNodesMap[nodeId]) {
      return;
    }
    // 会受到影响的节点的id集合
    const idsArray: string[] = collectProperty(treeNodesMap, nodeId);
    // 考虑到删除一个节点有可能会影响到后面节点的prevNodeId，所以需要判断是否要更新后面一个节点的信息
    updateNextNode(nodeId);
    dispatch(StoreActions.deleteNode({ parentId: treeNodesMap[nodeId].parentId, nodeId }));
    if (rightClickInfo && idsArray.includes(rightClickInfo.id)) {
      setRightClickInfo(null);
    }
    // 显示错误信息页面
    if (activeNodeId && idsArray.includes(activeNodeId)) {
      dispatch(StoreActions.resetResource(nodeId, getResourceTypeByNodeType(treeNodesMap[activeNodeId].type)));
      popErrorModal(activeNodeId, ErrorType.Delete, treeNodesMap[activeNodeId].type);
    }
  };

  // 处理星标状态改变的消息
  const updateFavoriteSync = (data: INodeChangeSocketData) => {
    const { nodeId } = data.data;
    // 取消星标
    if (favoriteTreeNodeIds.findIndex(id => id === nodeId) !== -1) {
      dispatch(StoreActions.removeFavorite(nodeId));
      return;
    }
    // 设置星标(节点数据已存在数据源中)
    if (treeNodesMap[nodeId]) {
      dispatch(
        StoreActions.generateFavoriteTree([{ ...treeNodesMap[nodeId], preFavoriteNodeId: '', nodeFavorite: true }]),
      );
      dispatch(StoreActions.updateNodeInfo(nodeId, treeNodesMap[nodeId].type, { nodeFavorite: true }));
      return;
    }
    // 设置星标(节点数据不存在数据源中)
    Api.getNodeInfo(nodeId).then(res => {
      const { success, data } = res.data;
      if (success) {
        dispatch(StoreActions.generateFavoriteTree([{ ...data[0], preFavoriteNodeId: '', nodeFavorite: true }]));
        dispatch(StoreActions.updateNodeInfo(nodeId, treeNodesMap[nodeId].type, { nodeFavorite: true }));
      }
    });
  };

  // 处理权限变更的消息
  const updateRoleSync = (data: INodeChangeSocketData) => {
    const datasheetMapKeys = Selectors.getDatasheetIds(store.getState());
    const { nodeId, parentId } = data.data;
    // 如果父节点和更新的节点都不存在并且workbenchSidebar也不存在数表缓存中，就跳过后续的处理过程
    if (!treeNodesMap[parentId] && !treeNodesMap[nodeId] && datasheetMapKeys.includes(nodeId)) {
      return;
    }

    // 要获取新信息的节点
    const idsArray: string[] = collectProperty(treeNodesMap, nodeId);
    const ids = idsArray.join(',');

    Api.getNodeInfo(ids).then(res => {
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
        const newActiveNodeInfo = data.find(item => item.nodeId === activeNodeId);
        if (
          activeNodeId &&
          idsArray.includes(activeNodeId) &&
          newActiveNodeInfo &&
          treeNodesMap[activeNodeId].role !== newActiveNodeInfo.role
        ) {
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

  // 处理移动结点的消息
  const moveNodeSync = async(data: INodeChangeSocketData) => {
    const { nodeId, parentId, preNodeId } = data.data;
    const dragNode = treeNodesMap[nodeId];
    // 被移动的节点和被移动到的容器节点都不存在数据源，就没有处理的必要了
    if (!dragNode && !treeNodesMap[parentId]) {
      return;
    }

    // 同层级拖动
    if (dragNode && parentId === dragNode.parentId) {
      const parentNodeChildren = treeNodesMap[parentId].children;
      // 如果目标位置的前置节点存在的话，就更新父节点的children属性，否则通过parentId请求子节点后来更新children属性
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
      const children = childrenNodes.map(node => node.nodeId);
      dispatch(StoreActions.addNodeToMap(childrenNodes, false));
      dispatch(StoreActions.updateTreeNodesMap(parentId, { hasChildren: true, children }));
      return;
    }

    // 跨层级拖动
    if (dragNode) {
      dispatch(StoreActions.deleteNode({ parentId: dragNode.parentId, nodeId }));
    }
    const result = await getPositionNodeReq(nodeId);
    if (!result) {
      const nodeInfo = await Api.getNodeInfo(nodeId).then(res => res.data.data);
      if (dragNode && !nodeInfo && dragNode.type !== ConfigConstant.NodeType.FOLDER &&
        nodeId === activeNodeId && !treeNodesMap[parentId]) {
        popErrorModal(nodeId, ErrorType.NoPermission);
      }
    }
  };

  // 通过socket进行树的实时更新
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
        updateFavoriteSync(data);
        break;
      default:
        console.log('无效的socket消息: ', data);
    }
  };
};
