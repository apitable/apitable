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

import { shallowEqual } from 'react-redux';
import {
  Api,
  ConfigConstant,
  IAxiosResponse,
  INodesMapItem,
  IOptNode,
  IReduxState,
  IUpdateRoleData,
  Navigation,
  ResourceIdPrefix,
  ResourceType,
  Selectors,
  StatusCode,
  StoreActions,
  Strings,
  t,
} from '@apitable/core';
import { Message } from 'pc/components/common/message/message';
import { Router } from 'pc/components/route_manager/router';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
// @ts-ignore
import { SubscribeUsageTipType, triggerUsageAlert } from 'enterprise/billing/trigger_usage_alert';

export const useCatalogTreeRequest = () => {
  const dispatch = useAppDispatch();
  const { spaceId, formId, datasheetId, dashboardId, mirrorId, embedId } = useAppSelector((state: IReduxState) => {
    const spaceId = state.space.activeId;
    const { datasheetId, formId, automationId, dashboardId, mirrorId, embedId } = state.pageParams;
    return {
      automationId,
      spaceId,
      formId,
      datasheetId,
      dashboardId,
      mirrorId,
      embedId,
    };
  }, shallowEqual);
  const activedNodeId = useAppSelector((state) => Selectors.getNodeId(state));
  const treeNodesMap = useAppSelector((state: IReduxState) => state.catalogTree.treeNodesMap);
  const favoriteTreeNodeIds = useAppSelector((state: IReduxState) => state.catalogTree.favoriteTreeNodeIds);
  const privateTreeNodesMap = useAppSelector((state: IReduxState) => state.catalogTree.privateTreeNodesMap);
  const expandedKeys = useAppSelector((state: IReduxState) => state.catalogTree.expandedKeys);
  const spaceInfo = useAppSelector((state) => state.space.curSpaceInfo)!;
  const userUnitId = useAppSelector((state) => state.user.info?.unitId);

  const checkNodeNumberLimit = (nodeType: ConfigConstant.NodeType) => {
    // First check that the total number of nodes is as required
    // Folders are not the type of node that needs to be counted
    if (nodeType !== ConfigConstant.NodeType.FOLDER) {
      const result1 = triggerUsageAlert?.(
        'maxSheetNums',
        {
          usage: spaceInfo!.sheetNums + 1,
          alwaysAlert: true,
        },
        SubscribeUsageTipType.Alert,
      );
      if (result1) {
        return true;
      }
    }
    if (nodeType === ConfigConstant.NodeType.FORM) {
      // Next, check that the number of forms or mirrors meets the requirements according to the node type
      const result1 = triggerUsageAlert?.(
        'maxFormViewsInSpace',
        { usage: spaceInfo!.formViewNums + 1, alwaysAlert: true },
        SubscribeUsageTipType.Alert,
      );
      if (result1) {
        return true;
      }
    }
    if (nodeType === ConfigConstant.NodeType.MIRROR) {
      // Next, check that the number of forms or mirrors meets the requirements according to the node type
      const result1 = triggerUsageAlert?.('maxMirrorNums', { usage: spaceInfo!.mirrorNums + 1, alwaysAlert: true }, SubscribeUsageTipType.Alert);
      if (result1) {
        return true;
      }
    }
    // if (nodeType === ConfigConstant.NodeType.AI) {
    //   // Next, check that the number of forms or mirrors meets the requirements according to the node type
    //   const result1 = triggerUsageAlert?.('maxSeats',
    //     { usage: spaceInfo!.seats + 1, alwaysAlert: true }, SubscribeUsageTipType.Alert);
    //   if (result1) {
    //     return true;
    //   }
    // }
    return false;
  };

  /**
   * Add Node
   * @param parentId
   * @param type Node Type(datasheet Folders)
   * @param nodeName Optional
   * @param preNodeId Optional
   * @param extra
   * @param unitId
   */
  const addNodeReq = (
    parentId: string,
    type: ConfigConstant.NodeType,
    nodeName?: string,
    preNodeId?: string,
    extra?: {
      [key: string]: any;
    },
    unitId?: string,
  ) => {
    const result = checkNodeNumberLimit(type);
    if (result) {
      return Promise.resolve();
    }

    return Api.addNode({
      parentId,
      type,
      nodeName,
      preNodeId,
      extra,
      unitId,
    }).then((res: IAxiosResponse) => {
      const { data, code, success } = res.data;
      if (success) {
        const node: INodesMapItem = { ...data, children: [] };
        dispatch(StoreActions.addNode(node, Boolean(unitId) ? ConfigConstant.Modules.PRIVATE : undefined));
        dispatch(StoreActions.getSpaceInfo(spaceId || '', true));
        Router.push(Navigation.WORKBENCH, { params: { spaceId, nodeId: data.nodeId } });
      } else {
        if (code === StatusCode.NODE_NOT_EXIST) {
          return;
        }
        dispatch(StoreActions.setErr(res.data.message));
      }
    });
  };

  /**
   * Delete Node
   * Note: Consider that if the node being deleted is a folder (and in the case of a working directory that is loaded),
   * its child node may be an asterisk.
   * So at this point the child nodes that are starred are deleted.
   * @param optNode
   */
  const deleteNodeReq = (optNode: IOptNode) => {
    const { nodeId, module } = optNode;
    const nodeMaps = module === ConfigConstant.Modules.PRIVATE ? privateTreeNodesMap : treeNodesMap;
    return Api.delNode(nodeId).then((res) => {
      if (res.data.success) {
        // Remove engine after successful deletion
        if (nodeId.startsWith(ResourceIdPrefix.Datasheet)) {
          dispatch(StoreActions.resetDatasheet(nodeId));
          resourceService.instance?.reset(nodeId);
        }
        dispatch(StoreActions.getSpaceInfo(spaceId || '', true));
        updateNextNode(nodeId, module);
        const tree = nodeMaps[nodeId];
        if (!tree) {
          return;
        }
        // Determine if the deleted node contains the currently active node
        const hasChildren = activedNodeId === nodeId || (activedNodeId && isFindNodeInTree(tree, activedNodeId, module));
        dispatch(StoreActions.deleteNode(optNode));
        if (hasChildren) {
          dispatch(StoreActions.updateUserInfo({ activeNodeId: '', activeViewId: '' }));
          Api.keepTabbar({});
          Router.push(Navigation.WORKBENCH, { params: { spaceId } });
        }
        if (nodeMaps[nodeId].type === ConfigConstant.NodeType.DATASHEET) {
          dispatch(StoreActions.datasheetErrorCode(nodeId!, StatusCode.NODE_DELETED));
          if (activedNodeId === nodeId) {
            Api.keepTabbar({}).then((res) => {
              if (res.data.success) {
                Router.push(Navigation.WORKBENCH, { params: { spaceId } });
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
   * Copy nodes
   * @param nodeId
   * @param copyAll
   * @param module
   */
  const copyNodeReq = (nodeId: string, copyAll = true, module?: ConfigConstant.Modules) => {
    const nodesMap = module === ConfigConstant.Modules.PRIVATE ? privateTreeNodesMap : treeNodesMap;
    const result = checkNodeNumberLimit(nodesMap[nodeId].type);
    if (result) {
      return Promise.resolve();
    }
    return Api.copyNode(nodeId, copyAll).then((res) => {
      const { data, success, message } = res.data;
      if (success) {
        dispatch(StoreActions.addNodeToMap([data], undefined, module));
        Router.push(Navigation.WORKBENCH, { params: { spaceId, nodeId: data.nodeId } });
        dispatch(StoreActions.getSpaceInfo(spaceId || '', true));
        return;
      }
      Message.error({ content: message });
    });
  };

  /**
   * Update Nodes
   * @param nodeId
   * @param data
   */
  const updateNodeReq = (
    nodeId: string,
    data: {
      nodeName?: string;
      icon?: string;
      cover?: string;
      showRecordHistory?: ConfigConstant.ShowRecordHistory;
      embedPage?: { url: string };
    },
  ) => {
    return Api.editNode(nodeId, data).then((res) => {
      const { success, data, message } = res.data;
      if (success) {
        return data;
      }
      throw new Error(message);
    });
  };

  const nodeRefResourceMap = {
    [ConfigConstant.NodeType.DASHBOARD]: ResourceType.Dashboard,
    [ConfigConstant.NodeType.DATASHEET]: ResourceType.Datasheet,
    [ConfigConstant.NodeType.MIRROR]: ResourceType.Mirror,
  };

  /**
   * Modify node name
   * @param nodeId
   * @param nodeName
   * @param module
   */
  const renameNodeReq = (nodeId: string, nodeName: string, module?: ConfigConstant.Modules) => {
    const nodesMap = module === ConfigConstant.Modules.PRIVATE ? privateTreeNodesMap : treeNodesMap;
    return Api.editNode(nodeId, { nodeName }).then((res) => {
      const { success, message } = res.data;
      if (success) {
        dispatch(StoreActions.setNodeName(nodeId, nodeName, module));
        const nodeType = nodesMap[nodeId].type;
        if (formId) {
          dispatch(StoreActions.updateForm(nodeId, { name: nodeName }));
        }
        if ([ConfigConstant.NodeType.DASHBOARD, ConfigConstant.NodeType.DATASHEET, ConfigConstant.NodeType.MIRROR].includes(nodeType)) {
          dispatch(StoreActions.updateResourceName(nodeName, nodeId, nodeRefResourceMap[nodeType]));
        }
        dispatch(StoreActions.setEditNodeId('', module));
        dispatch(StoreActions.setEditNodeId('', ConfigConstant.Modules.FAVORITE));
      } else {
        dispatch(StoreActions.setErr(message));
      }
    });
  };

  const updateNodeIconReq = (nodeId: string, type: ConfigConstant.NodeType, icon: string) => {
    return Api.editNode(nodeId, { icon }).then((res) => {
      const { success, message } = res.data;
      if (success) {
        dispatch(StoreActions.updateNodeInfo(nodeId, type, { icon }));
      } else {
        Message.error({ content: message });
      }
    });
  };

  // The receiving socket updates the history status of the corresponding table in redux
  const updateNodeRecordHistoryReq = (nodeId: string, type: ConfigConstant.NodeType, showRecordHistory: ConfigConstant.ShowRecordHistory) => {
    return Api.editNode(nodeId, { showRecordHistory }).then((res) => {
      const { success, message } = res.data;
      if (success) {
        dispatch(
          StoreActions.updateNodeInfo(nodeId, type, {
            extra: {
              showRecordHistory: showRecordHistory === ConfigConstant.ShowRecordHistory.OPEN,
            },
          }),
        );
      } else {
        Message.error({ content: message });
      }
    });
  };

  /**
   * Get the list of children of the specified node
   * @param nodeId
   */
  const getChildNodeListReq = (nodeId: string) => {
    return Api.getChildNodeList(nodeId).then((res) => {
      const { success, data } = res.data;
      if (success) {
        return data;
      }
      return null;
    });
  };

  /**
   * Search for sub-departments and members under a department
   * @param teamId
   * @param linkId
   */
  const getSubUnitListReq = (teamId?: string, linkId?: string) => {
    if (embedId) linkId = undefined;
    return Api.getSubUnitList(teamId, linkId).then((res) => {
      const { success, data } = res.data;
      if (success) {
        return data;
      }
      return null;
    });
  };

  /**
   * Get node roles list
   * @param nodeId
   * @param includeAdmin
   * @param includeExtend
   * @param includeSelf
   */
  const getNodeRoleListReq = (nodeId: string, includeAdmin?: boolean, includeExtend?: boolean, includeSelf?: string) => {
    return Api.listRole(nodeId, includeAdmin, includeExtend, includeSelf).then((res) => {
      const { success, code, data } = res.data;
      if (success) {
        return data;
      }
      // When there is no permission to operate on the node, refresh the page and get the latest permission instead
      if (code === StatusCode.NODE_NOT_EXIST) {
        window.location.reload();
      }
      return null;
    });
  };

  /**
   * Search Organizational Resources
   * @param keyword Keyword (label/sector)
   * @param linkId
   */
  const searchUnitReq = (keyword: string, linkId?: string) => {
    return Api.searchUnit(keyword, linkId).then((res) => {
      const { success, data } = res.data;
      if (success) {
        return data;
      }
      return null;
    });
  };

  /**
   * Update roles
   * @param data
   */
  const updateRoleReq = (data: IUpdateRoleData) => {
    return Api.updateRole(data).then((res) => {
      const { success } = res.data;
      if (success) {
        Message.success({ content: t(Strings.permission_change_success) });
        return true;
      }
      return null;
    });
  };

  /**
   * Get a list of organizational units to which members belong
   */
  const getUnitsByMemberReq = () => {
    return Api.getUnitsByMember().then((res) => {
      const { success, data } = res.data;
      if (success) {
        return data;
      }
      return null;
    });
  };

  /**
   * Get folder_showcase resources
   * @param nodeId
   * @param shareId
   */
  const getNodeShowcaseReq = (nodeId: string, shareId?: string) => {
    return Api.nodeShowcase(nodeId, shareId).then((res) => {
      const { success, data } = res.data;
      if (success) {
        return data;
      }
      return null;
    });
  };

  /**
   * Update node description
   * @param nodeId
   * @param desc
   */
  const updateNodeDescriptionReq = (nodeId: string, desc: string) => {
    return Api.changeNodeDesc(nodeId, desc).then((res) => {
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
   * Get a directory tree (template)
   */
  const getNodeTreeReq = (unitType: number, depth?: number) => {
    return Api.getNodeTree(unitType, depth).then((res) => {
      const { success, data } = res.data;
      if (success) {
        return data;
      }
      return data;
    });
  };

  /**
   * Get location node data
   * @param nodeId
   */
  const getPositionNodeReq = (nodeId: string) => {
    return Api.positionNode(nodeId).then((res) => {
      const { success, data } = res.data;
      if (success) {
        if (data) {
          const nodeTree = Selectors.flatNodeTree([data]);
          const nodePrivate = nodeTree.some((node) => node.nodeId === nodeId && node.nodePrivate);
          const _module = nodePrivate ? ConfigConstant.Modules.PRIVATE : undefined;
          dispatch(StoreActions.addNodeToMap(nodeTree, false, _module));
          dispatch(StoreActions.collectionNodeAndExpand(nodeId, _module));
          return { nodePrivate };
        }
        return { nodePrivate: false };
      }
      return null;
    });
  };

  /**
   * Get node sharing status information
   * @param nodeId
   */
  const getShareSettingsReq = (nodeId: string) => {
    return Api.getShareSettings(nodeId).then((res) => {
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
   * Sending node movement requests
   * @param nodeId
   * @param targetNodeId
   * @param pos -1: indicates moving above the target node; 0: indicates moving inside the target node; 1: indicates moving below the target node
   * @param module
   */
  const nodeMoveReq = (nodeId: string, targetNodeId: string, pos: number, module?: ConfigConstant.Modules) => {
    const nodeMaps = module === ConfigConstant.Modules.PRIVATE ? privateTreeNodesMap : treeNodesMap;
    const parentId = pos === 0 ? targetNodeId : nodeMaps[targetNodeId].parentId;
    let preNodeId;
    if (pos !== 0) {
      preNodeId = pos === -1 ? nodeMaps[targetNodeId].preNodeId : targetNodeId;
    }
    const targetNode = nodeMaps[targetNodeId];
    const _unitId = module === ConfigConstant.Modules.PRIVATE ? userUnitId : undefined;
    return Api.nodeMove(nodeId, parentId, preNodeId, _unitId).then((res) => {
      const { success, data, message } = res.data;
      if (success) {
        if (
          pos === 0 &&
          targetNode.type === ConfigConstant.NodeType.FOLDER &&
          !expandedKeys.includes(targetNodeId) &&
          targetNode.hasChildren &&
          !targetNode.children.length
        ) {
          dispatch(StoreActions.deleteNodeAction({
            parentId: nodeMaps[nodeId].parentId,
            nodeId,
            module,
          }));
          return;
        }
        dispatch(StoreActions.moveTo(nodeId, targetNodeId, pos, module));
        dispatch(StoreActions.addNodeToMap(data, undefined, module));
      } else {
        dispatch(StoreActions.setErr(message));
      }
    });
  };

  const shareSettingsReq = (nodeId: string) => {
    return Api.getShareSettings(nodeId).then((res) => {
      const { success, data } = res.data;
      if (success) {
        return data;
      }
      Message.error({ content: t(Strings.message_get_node_share_setting_failed) });
      return false;
    });
  };

  /**
   * Retrieves whether a node exists in the tree
   * @param tree
   * @param nodeId
   * @param module
   */
  function isFindNodeInTree(tree: INodesMapItem, nodeId: string, module?: ConfigConstant.Modules): boolean {
    const nodeMaps = module === ConfigConstant.Modules.PRIVATE ? privateTreeNodesMap : treeNodesMap;
    return tree.children.some((id) => {
      if (id === nodeId) {
        return true;
      }
      if (treeNodesMap[id].children.length) {
        return isFindNodeInTree(nodeMaps[id], nodeId, module);
      }
      return false;
    });
  }

  // Get starred list
  const getFavoriteNodeListReq = () => {
    return Api.getFavoriteNodeList().then((res) => {
      const { data, success, message } = res.data;
      if (success) {
        dispatch(StoreActions.generateFavoriteTree(Selectors.flatNodeTree(data)));
        dispatch(StoreActions.setTreeLoading(false, ConfigConstant.Modules.FAVORITE));
        return data;
      }
      dispatch(StoreActions.setTreeLoading(false, ConfigConstant.Modules.FAVORITE));
      Message.error({ content: message });
    });
  };

  // Set starred/unstarred
  const updateNodeFavoriteStatusReq = (nodeId: string, nodePrivate?: boolean) => {
    const nodesMap = nodePrivate ? privateTreeNodesMap : treeNodesMap;
    const oldStatus = nodesMap[nodeId].nodeFavorite || favoriteTreeNodeIds.includes(nodeId);
    return Api.updateNodeFavoriteStatus(nodeId).then((res) => {
      const { success } = res.data;
      const node = nodesMap[nodeId];
      if (!success) {
        Message.error({ content: t(Strings.add_or_cancel_favorite_fail) });
        return;
      }
      // If the starred status was previously true, the request was to cancel the starred operation.
      if (oldStatus) {
        dispatch(StoreActions.removeFavorite(nodeId, nodePrivate));
        Message.success({ content: t(Strings.cancel_favorite_success) });
        return;
      }
      // Add star operation
      dispatch(StoreActions.generateFavoriteTree([{ ...node, preFavoriteNodeId: '', nodeFavorite: true }]));
      datasheetId && dispatch(StoreActions.updateDatasheet(nodeId, { nodeFavorite: true }));
      formId && dispatch(StoreActions.updateForm(nodeId, { nodeFavorite: true }));
      mirrorId && dispatch(StoreActions.updateMirror(nodeId, { nodeFavorite: true }));
      dashboardId && dispatch(StoreActions.updateDashboard(nodeId, { nodeFavorite: true }));
      Message.success({ content: t(Strings.add_favorite_success) });
    });
  };

  const moveFavoriteNodeReq = (nodeId: string, preNodeId?: string) => {
    return Api.moveFavoriteNode(nodeId, preNodeId).then((res) => {
      const { success } = res.data;
      if (!success) {
        Message.warning({ content: t(Strings.move_favorite_node_fail) });
        dispatch(StoreActions.setTreeLoading(false, ConfigConstant.Modules.FAVORITE));
        dispatch(StoreActions.initFavoriteTreeNodes());
        getFavoriteNodeListReq();
      }
    });
  };

  const updateNextNode = (nodeId: string, module?: ConfigConstant.Modules) => {
    const nodeMaps = module === ConfigConstant.Modules.PRIVATE ? privateTreeNodesMap : treeNodesMap;
    const nextNode = Object.values(nodeMaps).find((node) => node.preNodeId === nodeId);
    if (nextNode) {
      dispatch(StoreActions.updateTreeNodesMap(nextNode.nodeId, { preNodeId: nodeMaps[nodeId].preNodeId }, module));
    }
  };

  const getTreeDataReq = (unitType?: number) => {
    dispatch(StoreActions.setTreeLoading(true));
    return Api.getNodeTree(unitType).then((res) => {
      const { data, success } = res.data;
      dispatch(StoreActions.setTreeLoading(false));
      if (success) {
        // Since two levels of data are now loaded by default, the folder node of the first level needs to be placed in the loaded collection
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

  const getPrivateTreeDataReq = () => {
    dispatch(StoreActions.setTreeLoading(true, ConfigConstant.Modules.PRIVATE));
    return Api.getNodeTree(3).then((res) => {
      const { data, success } = res.data;
      dispatch(StoreActions.setTreeLoading(false, ConfigConstant.Modules.PRIVATE));
      if (success) {
        if (data) {
          const flatTreeData = Selectors.flatNodeTree([data]);
          dispatch(StoreActions.addNodeToMap(flatTreeData, true, ConfigConstant.Modules.PRIVATE));
          dispatch(StoreActions.setPrivateTreeRootId(data.nodeId));
        }
        return data;
      }
      Message.error({ content: t(Strings.load_tree_failed) });
    });
  };

  const disableShareReq = (nodeId: string) => {
    return Api.disableShare(nodeId).then((res) => {
      const { success } = res.data;
      if (success) {
        return true;
      }
      Message.error({ content: t(Strings.close_share_tip, { status: t(Strings.fail) }) });
      return false;
    });
  };

  const getCollaboratorListPageReq = (pageNo: number, nodeId: string) => {
    const pageObjectParams = {
      pageSize: ConfigConstant.MEMBER_LIST_PAGE_SIZE,
    };
    return Api.getCollaboratorListPage(JSON.stringify({ ...pageObjectParams, pageNo }), nodeId).then((res) => {
      const { success, data, message } = res.data;
      if (success) {
        return data;
      }
      Message.error({ content: message });
    });
  };

  const getFieldPermissionMemberListPage = (dstId: string, fieldId: string, pageNo: number) => {
    const pageObjectParams = {
      pageSize: ConfigConstant.MEMBER_LIST_PAGE_SIZE,
    };
    return Api.getFieldPermissionPageMemberList(dstId, fieldId, JSON.stringify({ ...pageObjectParams, pageNo })).then((res) => {
      const { success, data, message } = res.data;
      if (success) {
        return data;
      }
      Message.error({ content: message });
    });
  };

  return {
    checkNodeNumberLimit,
    addNodeReq,
    deleteNodeReq,
    copyNodeReq,
    getChildNodeListReq,
    getSubUnitListReq,
    getNodeRoleListReq,
    searchUnitReq,
    updateRoleReq,
    getUnitsByMemberReq,
    getNodeShowcaseReq,
    updateNodeReq,
    updateNodeDescriptionReq,
    getNodeTreeReq,
    getPositionNodeReq,
    getShareSettingsReq,
    nodeMoveReq,
    shareSettingsReq,
    getFavoriteNodeListReq,
    updateNodeFavoriteStatusReq,
    moveFavoriteNodeReq,
    updateNextNode,
    getTreeDataReq,
    getPrivateTreeDataReq,
    renameNodeReq,
    updateNodeIconReq,
    updateNodeRecordHistoryReq,
    disableShareReq,
    getCollaboratorListPageReq,
    getFieldPermissionMemberListPage,
  };
};
