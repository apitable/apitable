import {
  Api, ConfigConstant, INodesMapItem, IOptNode, IReduxState, IUpdateRoleData, Navigation, ResourceIdPrefix, ResourceType, Selectors, StatusCode,
  StoreActions, Strings, SubscribeKye, t
} from '@vikadata/core';
import { triggerUsageAlert } from 'pc/common/billing';
import { Message } from 'pc/components/common';
import { useNavigation } from 'pc/components/route_manager/use_navigation';
import { resourceService } from 'pc/resource_service';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

export const useCatalogTreeRequest = () => {
  const dispatch = useDispatch();
  const navigationTo = useNavigation();
  const {
    spaceId,
    formId,
    datasheetId,
    dashboardId,
    mirrorId,
  } = useSelector((state: IReduxState) => {
    const spaceId = state.space.activeId;
    const { datasheetId, formId, dashboardId, mirrorId } = state.pageParams;
    return {
      spaceId,
      formId,
      datasheetId,
      dashboardId,
      mirrorId,
    };
  }, shallowEqual);
  const activedNodeId = useSelector(state => Selectors.getNodeId(state));
  const treeNodesMap = useSelector((state: IReduxState) => state.catalogTree.treeNodesMap);
  const expandedKeys = useSelector((state: IReduxState) => state.catalogTree.expandedKeys);
  const spaceInfo = useSelector(state => state.space.curSpaceInfo)!;

  /**
   * 新增节点
   * @param parentId 父节点ID
   * @param type 要创建节点的类型（数表/文件夹……）
   * @param nodeName 要创建节点的名称（可选）
   * @param preNodeId 要插入的位置（可选）
   */
  const addNodeReq = (parentId: string, type: number, nodeName?: string, preNodeId?: string, extra?: { [key: string]: any }) => {
    return Api.addNode({ parentId, type, nodeName, preNodeId, extra }).then(res => {
      const { data, code, success } = res.data;
      if (success) {
        const node: INodesMapItem = { ...data, children: [] };
        dispatch(StoreActions.addNode(node));
        navigationTo({ path: Navigation.WORKBENCH, params: { spaceId, nodeId: data.nodeId }});
        triggerUsageAlert(SubscribeKye.MaxSheetNums, { usage: spaceInfo!.sheetNums + 1 });
      } else {
        if (code === StatusCode.NODE_NOT_EXIST) {
          return;
        }
        dispatch(StoreActions.setErr(res.data.message));
      }
    });
  };

  /**
   * 删除节点
   * 注意：需要考虑所删除的节点如果是文件夹的话(并且在工作目录是已加载的情况下)，它的子节点可能是一个星标，
   * 所以这时候将是星标的子节点进行删除。
   * @param nodeId 要删除的节点ID
   */
  const deleteNodeReq = (optNode: IOptNode) => {
    const { nodeId } = optNode;
    return Api.delNode(nodeId).then(res => {
      if (res.data.success) {
        // 删除成功后移除engine
        if (nodeId.startsWith(ResourceIdPrefix.Datasheet)) {
          dispatch(StoreActions.resetDatasheet(nodeId));
          resourceService.instance?.reset(nodeId);
        }
        updateNextNode(nodeId);
        const tree = treeNodesMap[nodeId];
        if (!tree) {
          return;
        }
        // 判断被删除的节点是否包含当前活动节点
        const hasChildren = activedNodeId === nodeId || (activedNodeId && isFindNodeInTree(tree, activedNodeId));
        dispatch(StoreActions.deleteNode(optNode));
        if (hasChildren) {
          dispatch(StoreActions.updateUserInfo({ activeNodeId: '', activeViewId: '' }));
          Api.keepTabbar({});
          navigationTo({ path: Navigation.WORKBENCH, params: { spaceId }});
        }
        if (treeNodesMap[nodeId].type === ConfigConstant.NodeType.DATASHEET) {
          dispatch(StoreActions.datasheetErrorCode(nodeId!, StatusCode.NODE_DELETED));
          if (activedNodeId === nodeId) {
            Api.keepTabbar({}).then(res => {
              if (res.data.success) {
                navigationTo({ path: Navigation.SPACE, params: { spaceId }});
              }
            });
            return;
          }
        }
      } else {
        dispatch(StoreActions.setErr(res.data.message));
      }
    });
  };

  /**
   * 复制节点
   * @param nodeId 要复制的节点ID
   * @param copyAll 是否要复制数表中的数据
   */
  const copyNodeReq = (nodeId: string, copyAll = true) => {
    return Api.copyNode(nodeId, copyAll).then(res => {
      const { data, success, message } = res.data;
      if (success) {
        dispatch(StoreActions.addNodeToMap([data]));
        navigationTo({ path: Navigation.WORKBENCH, params: { spaceId, nodeId: data.nodeId }});
        return;
      }
      Message.error({ content: message });
    });
  };

  /**
   * 更新节点
   * @param nodeId 节点id
   * @param data 要更新的数据信息
   */
  const updateNodeReq = (
    nodeId: string,
    data: {
      nodeName?: string,
      icon?: string,
      cover?: string,
      showRecordHistory?: ConfigConstant.ShowRecordHistory
    },
  ) => {
    return Api.editNode(nodeId, data).then(res => {
      const { success, data } = res.data;
      if (success) {
        return data;
      }
      return null;
    });
  };

  const nodeRefResourceMap = {
    [ConfigConstant.NodeType.DASHBOARD]: ResourceType.Dashboard,
    [ConfigConstant.NodeType.DATASHEET]: ResourceType.Datasheet,
    [ConfigConstant.NodeType.MIRROR]: ResourceType.Mirror,
  };

  /**
   * 修改节点名称
   * @param nodeId 节点ID
   * @param nodeName 节点名称
   */
  const renameNodeReq = (nodeId: string, nodeName: string) => {
    return Api.editNode(nodeId, { nodeName }).then(res => {
      const { success, message } = res.data;
      if (success) {
        dispatch(StoreActions.setNodeName(nodeId, nodeName));
        const nodeType = treeNodesMap[nodeId].type;
        // 表单现在属于单例，并且每次点击表单都会重新请求数据，这个和其他两个节点的表现并不一致
        if (formId) {
          dispatch(StoreActions.updateForm(nodeId, { name: nodeName }));
        }
        if ([ConfigConstant.NodeType.DASHBOARD, ConfigConstant.NodeType.DATASHEET, ConfigConstant.NodeType.MIRROR].includes(nodeType)) {
          dispatch(StoreActions.updateResourceName(
            nodeName,
            nodeId,
            nodeRefResourceMap[nodeType],
          ));
        }
        dispatch(StoreActions.setEditNodeId(''));
        dispatch(StoreActions.setEditNodeId('', ConfigConstant.Modules.FAVORITE));
      } else {
        dispatch(StoreActions.setErr(message));
      }
    });
  };

  const updateNodeIconReq = (nodeId: string, type: ConfigConstant.NodeType, icon: string) => {
    return Api.editNode(nodeId, { icon }).then(res => {
      const { success, message } = res.data;
      if (success) {
        dispatch(StoreActions.updateNodeInfo(nodeId, type, { icon }));
      } else {
        Message.error({ content: message });
      }
    });
  };

  // 接收 socket 更新 redux 中对应表的历史记录状态
  const updateNodeRecordHistoryReq = (nodeId: string, type: ConfigConstant.NodeType, showRecordHistory: ConfigConstant.ShowRecordHistory) => {
    return Api.editNode(nodeId, { showRecordHistory }).then(res => {
      const { success, message } = res.data;
      if (success) {
        dispatch(StoreActions.updateNodeInfo(nodeId, type, {
          extra: {
            showRecordHistory: showRecordHistory === ConfigConstant.ShowRecordHistory.OPEN,
          },
        }));
      } else {
        Message.error({ content: message });
      }
    });
  };

  /**
   * 获取指定节点的子节点列表
   * @param nodeId 节点Id
   */
  const getChildNodeListReq = (nodeId: string) => {
    return Api.getChildNodeList(nodeId).then(res => {
      const { success, data } = res.data;
      if (success) {
        return data;
      }
      return null;
    });
  };

  /**
   * 查询部门下的子部门和成员
   * @param teamId 部门ID
   */
  const getSubUnitListReq = (teamId?: string, linkId?: string) => {
    return Api.getSubUnitList(teamId, linkId).then(res => {
      const { success, data } = res.data;
      if (success) {
        return data;
      }
      return null;
    });
  };

  /**
   * 查询节点角色列表
   * @param nodeId 要查询的节点ID
   */
  const getNodeRoleListReq = (
    nodeId: string, includeAdmin?: boolean,
    includeExtend?: boolean, includeSelf?: string,
  ) => {
    return Api.listRole(nodeId, includeAdmin, includeExtend, includeSelf).then(res => {
      const { success, code, data } = res.data;
      if (success) {
        return data;
      }
      // 当对该节点没有操作权限的时候，及时刷新页面，改获取最新的权限
      if (code === StatusCode.NODE_NOT_EXIST) {
        window.location.reload();
      }
      return null;
    });
  };

  /**
   * 搜索组织资源
   * @param keyword 关键字（标签/部门）
   */
  const searchUnitReq = (keyword: string, linkId?: string) => {
    return Api.searchUnit(keyword, linkId).then(res => {
      const { success, data } = res.data;
      if (success) {
        return data;
      }
      return null;
    });
  };

  /**
   * 更新角色
   * @param data 要更新的角色的信息
   */
  const updateRoleReq = (data: IUpdateRoleData) => {
    return Api.updateRole(data).then(res => {
      const { success } = res.data;
      if (success) {
        Message.success({ content: t(Strings.permission_change_success) });
        return true;
      }
      return null;
    });
  };

  /**
   * 获取成员所属的组织单元列表
   */
  const getUnitsByMemberReq = () => {
    return Api.getUnitsByMember().then(res => {
      const { success, data } = res.data;
      if (success) {
        return data;
      }
      return null;
    });
  };

  /**
   * 获取folder_showcase资源
   * @param nodeId
   * @param shareId
   */
  const getNodeShowcaseReq = (nodeId: string, shareId?: string) => {
    return Api.nodeShowcase(nodeId, shareId).then(res => {
      const { success, data } = res.data;
      if (success) {
        return data;
      }
      return null;
    });
  };

  /**
   * 更新节点描述
   * @param nodeId 节点Id
   * @param desc 描述
   */
  const updateNodeDescriptionReq = (nodeId: string, desc: string) => {
    return Api.changeNodeDesc(nodeId, desc).then(res => {
      const { success } = res.data;
      if (success) {
        return true;
      }
      Message.error({
        content: t(Strings.update_description_fail),
      });
      return false;
    });
  };

  /**
   * 获取目录树(模板)
   */
  const getNodeTreeReq = (depth?: number) => {
    return Api.getNodeTree(depth).then(res => {
      const { success, data } = res.data;
      if (success) {
        return data;
      }
      return data;
    });
  };

  /**
   * 获取定位节点数据
   * @param nodeId 节点id
   */
  const getPositionNodeReq = (nodeId: string) => {
    return Api.positionNode(nodeId).then(res => {
      const { success, data } = res.data;
      if (success) {
        if (data) {
          dispatch(StoreActions.addNodeToMap(Selectors.flatNodeTree([data]), false));
          dispatch(StoreActions.collectionNodeAndExpand(nodeId));
        }
        return true;
      }
      return false;
    });
  };

  /**
   * 获取节点分享状态信息
   * @param nodeId 节点Id
   */
  const getShareSettingsReq = (nodeId: string) => {
    return Api.getShareSettings(nodeId).then(res => {
      const { data, success, message } = res.data;
      if (success) {
        return data;
      }
      Message.error({
        content: message,
      });
      return null;
    });
  };

  /**
   * 发送节点移动请求
   * @param nodeId 节点ID
   * @param targetNodeId 目标节点ID
   * @param pos -1: 表示目标节点的上方；0：表示移入目标节点内部；1：表示移入目标节点下方
   */
  const nodeMoveReq = (nodeId: string, targetNodeId: string, pos: number) => {
    const parentId = pos === 0 ? targetNodeId : treeNodesMap[targetNodeId].parentId;
    let preNodeId;
    if (pos !== 0) {
      preNodeId = pos === -1 ? treeNodesMap[targetNodeId].preNodeId : targetNodeId;
    }
    const targetNode = treeNodesMap[targetNodeId];
    return Api.nodeMove(nodeId, parentId, preNodeId).then(res => {
      const { success, data, message } = res.data;
      if (success) {
        if (pos === 0 && targetNode.type === ConfigConstant.NodeType.FOLDER &&
          !expandedKeys.includes(targetNodeId) && targetNode.hasChildren && !targetNode.children.length) {
          (dispatch(StoreActions.deleteNodeAction({ parentId: treeNodesMap[nodeId].parentId, nodeId })));
          return;
        }
        dispatch(StoreActions.moveTo(nodeId, targetNodeId, pos));
        dispatch(StoreActions.addNodeToMap(data));
      } else {
        dispatch(StoreActions.setErr(message));
      }
    });
  };

  const shareSettingsReq = (nodeId: string) => {
    return Api.getShareSettings(nodeId).then(res => {
      const { success, data } = res.data;
      if (success) {
        return data;
      }
      Message.error({ content: t(Strings.message_get_node_share_setting_failed) });
      return false;
    });
  };

  /**
   * 检索一个节点是否存在树中
   * @param tree 树
   * @param nodeId 要查找的nodeId
   */
  function isFindNodeInTree(tree: INodesMapItem, nodeId: string): boolean {
    return tree.children.some(id => {
      if (id === nodeId) {
        return true;
      }
      if (treeNodesMap[id].children.length) {
        return isFindNodeInTree(treeNodesMap[id], nodeId);
      }
      return false;
    });
  }

  // 获取星标列表
  const getFavoriteNodeListReq = () => {
    return Api.getFavoriteNodeList().then(res => {
      const { data, success, message } = res.data;
      if (success) {
        dispatch(StoreActions.generateFavoriteTree(Selectors.flatNodeTree(data)));
        dispatch(StoreActions.setTreeLoading(false, ConfigConstant.Modules.FAVORITE));
        return;
      }
      dispatch(StoreActions.setTreeLoading(false, ConfigConstant.Modules.FAVORITE));
      Message.error({ content: message });
    });
  };

  // 设置星标/取消星标
  const updateNodeFavoriteStatusReq = (nodeId: string) => {
    const oldStatus = treeNodesMap[nodeId].nodeFavorite;
    return Api.updateNodeFavoriteStatus(nodeId).then(res => {
      const { success } = res.data;
      const node = treeNodesMap[nodeId];
      if (!success) {
        Message.error({ content: t(Strings.add_or_cancel_favorite_fail) });
        return;
      }
      // 如果以前星标状态为true的话，表明刚才的请求是取消星标操作
      if (oldStatus) {
        dispatch(StoreActions.removeFavorite(nodeId));
        Message.success({ content: t(Strings.cancel_favorite_success) });
        return;
      }
      // 添加星标操作
      dispatch(StoreActions.generateFavoriteTree([{ ...node, preFavoriteNodeId: '', nodeFavorite: true }]));
      datasheetId && dispatch(StoreActions.updateDatasheet(nodeId, { nodeFavorite: true }));
      formId && dispatch(StoreActions.updateForm(nodeId, { nodeFavorite: true }));
      mirrorId && dispatch(StoreActions.updateMirror(nodeId, { nodeFavorite: true }));
      dashboardId && dispatch(StoreActions.updateDashboard(nodeId, { nodeFavorite: true }));
      Message.success({ content: t(Strings.add_favorite_success) });
    });
  };

  const moveFavoriteNodeReq = (nodeId: string, preNodeId?: string) => {
    return Api.moveFavoriteNode(nodeId, preNodeId).then(res => {
      const { success } = res.data;
      if (!success) {
        Message.warning({ content: t(Strings.move_favorite_node_fail) });
        dispatch(StoreActions.setTreeLoading(false, ConfigConstant.Modules.FAVORITE));
        dispatch(StoreActions.initFavoriteTreeNodes());
        getFavoriteNodeListReq();
      }
    });
  };

  const updateNextNode = (nodeId: string) => {
    const nextNode = Object.values(treeNodesMap).find(node => node.preNodeId === nodeId);
    if (nextNode) {
      dispatch(StoreActions.updateTreeNodesMap(nextNode.nodeId, { preNodeId: treeNodesMap[nodeId].preNodeId }));
    }
  };

  const getTreeDataReq = () => {
    dispatch(StoreActions.setTreeLoading(true));
    return Api.getNodeTree().then(res => {
      const { data, success } = res.data;
      dispatch(StoreActions.setTreeLoading(false));
      if (success) {
        // 因为现在是默认加载两层数据，所以需要将第一层的文件夹节点放到已加载的集合中
        // const loadedNodeIds = data.children.filter(item => item.type === ConfigConstant.NodeType.FOLDER).map(item => item.nodeId);
        // dispatch(StoreActions.setLoadedKeys(loadedNodeIds));
        const flatTreeData = Selectors.flatNodeTree([data]);
        dispatch(StoreActions.addNodeToMap(flatTreeData));
        dispatch(StoreActions.setTreeRootId(data.nodeId));
        return data;
      }
      Message.error({ content: t(Strings.load_tree_failed) });
    });
  };

  const disableShareReq = (nodeId: string) => {
    return Api.disableShare(nodeId).then(res => {
      const { success } = res.data;
      if (success) {
        return true;
      }
      Message.error({ content: t(Strings.close_share_tip, { status: t(Strings.fail) }) });
      return false;
    });
  };

  return {
    addNodeReq, deleteNodeReq, copyNodeReq, getChildNodeListReq, getSubUnitListReq,
    getNodeRoleListReq, searchUnitReq, updateRoleReq, getUnitsByMemberReq,
    getNodeShowcaseReq, updateNodeReq, updateNodeDescriptionReq, getNodeTreeReq,
    getPositionNodeReq, getShareSettingsReq, nodeMoveReq, shareSettingsReq,
    getFavoriteNodeListReq, updateNodeFavoriteStatusReq, moveFavoriteNodeReq, updateNextNode, getTreeDataReq,
    renameNodeReq, updateNodeIconReq, updateNodeRecordHistoryReq, disableShareReq,
  };
};
