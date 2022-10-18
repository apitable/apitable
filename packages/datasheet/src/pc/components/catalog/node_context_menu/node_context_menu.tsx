import { ContextMenu, IContextMenuClickState } from '@vikadata/components';
import { ConfigConstant, Events, IReduxState, Navigation, Player, StoreActions, Strings, t } from '@vikadata/core';
import { SubscribeUsageTipType, triggerUsageAlert } from 'pc/common/billing/trigger_usage_alert';
import { MobileContextMenu } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { IDatasheetPanelInfo } from 'pc/components/common_side/workbench_side';
import { WorkbenchSideContext } from 'pc/components/common_side/workbench_side/workbench_side_context';
import { Router } from 'pc/components/route_manager/router';
import { useCatalogTreeRequest, useRequest, useResponsive, useRootManageable, useSideBarVisible } from 'pc/hooks';
import { useCatalog } from 'pc/hooks/use_catalog';
import { copy2clipBoard, exportDatasheet, exportMirror, flatContextData } from 'pc/utils';
import { isMobileApp } from 'pc/utils/env';
import { FC, memo, useContext, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { expandNodeInfo } from '../node_info';
import { ContextItemKey, contextItemMap } from './context_menu_data';
import { MobileNodeContextMenuTitle } from './mobile_context_menu_title';

export interface INodeContextMenuProps {
  onHidden: () => void;
  openDatasheetPanel: (visible: boolean, info: IDatasheetPanelInfo) => void;
  openCatalog: () => void;
  contextMenu: IContextMenuClickState;
}

// - 文件菜单
//   - 复制URL
//   - 设置权限
//   - 文件信息
//   - 分享
//   - 保存为模板

export const NodeContextMenu: FC<INodeContextMenuProps> = memo(({ onHidden, openDatasheetPanel, openCatalog, contextMenu }) => {
  const { addTreeNode } = useCatalog();
  const dispatch = useDispatch();
  const { rightClickInfo, openFavorite } = useContext(WorkbenchSideContext);
  const treeNodesMap = useSelector((state: IReduxState) => state.catalogTree.treeNodesMap);
  const rootId = useSelector((state: IReduxState) => state.catalogTree.rootId);
  const spaceId = useSelector(state => state.space.activeId);
  const spaceInfo = useSelector(state => state.space.curSpaceInfo);
  const { updateNodeFavoriteStatusReq, copyNodeReq } = useCatalogTreeRequest();
  const { run: updateNodeFavoriteStatus } = useRequest(updateNodeFavoriteStatusReq, { manual: true });
  const { run: copyNode } = useRequest(copyNodeReq, { manual: true });
  const { setSideBarVisible } = useSideBarVisible();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

  const rename = (nodeId: string, level: string, module: ConfigConstant.Modules) => {
    const editNodeId = module === ConfigConstant.Modules.CATALOG ? nodeId : `${level},${nodeId}`;
    dispatch(StoreActions.setEditNodeId(editNodeId, module));
  };

  const deleteNode = (nodeId: string, level: string, module: ConfigConstant.Modules) => {
    const delNodeId = module === ConfigConstant.Modules.CATALOG ? nodeId : `${level},${nodeId}`;
    // 因为在星标树中可能出现同一个节点出现在树的多个地方，所以在删除时需要携带上层级信息
    dispatch(StoreActions.setDelNodeId(delNodeId, module));
  };

  const addForm = (folderId: string, datasheetId?: string) => {
    Player.doTrigger(Events.workbench_create_form_bth_clicked);
    const params = datasheetId ?
      { folderId, datasheetId } :
      { folderId };
    openDatasheetPanel(true, params);
  };

  const exportAsCsv = (nodeId: string) => {
    if (nodeId.startsWith('mir')) {
      return exportMirror(nodeId, ConfigConstant.EXPORT_TYPE_CSV);
    }
    exportDatasheet(nodeId, ConfigConstant.EXPORT_TYPE_CSV);
  };

  const exportExcel = (nodeId: string) => {
    if (nodeId.startsWith('mir')) {
      return exportMirror(nodeId, ConfigConstant.EXPORT_TYPE_XLSX);
    }
    exportDatasheet(nodeId, ConfigConstant.EXPORT_TYPE_XLSX);
  };

  const copyUrl = (url: string) => {
    isMobile && setSideBarVisible(false);
    copy2clipBoard(url);
  };

  const openPermissionSetting = (nodeId: string) => {
    isMobile && setSideBarVisible(false);
    dispatch(StoreActions.updatePermissionModalNodeId(nodeId));
  };

  const openShareModal = (nodeId: string) => {
    isMobile && setSideBarVisible(false);
    dispatch(StoreActions.updateShareModalNodeId(nodeId));
  };

  const openSaveAsTemplateModal = (nodeId: string) => {
    isMobile && setSideBarVisible(false);
    dispatch(StoreActions.updateSaveAsTemplateModalNodeId(nodeId));
  };

  const openImportModal = (nodeId: string) => {
    dispatch(StoreActions.updateImportModalNodeId(nodeId));
  };

  const openNodeInfo = (nodeId: string) => {
    isMobile && setSideBarVisible(false);
    expandNodeInfo({ nodeId });
  };

  const openMoveTo = (nodeId: string) => {
    dispatch(StoreActions.updateMoveToNodeIds([nodeId]));
  };

  const { rootManageable, isRootNodeId } = useRootManageable();

  const contextData = useMemo(() => {
    if (!rightClickInfo) {
      return [];
    }
    const { contextMenuType, module, id, level } = rightClickInfo;
    const { nodeId, permissions, nodeFavorite, parentId, type } = treeNodesMap[id];
    const targetId = nodeId || rootId;
    const targetManageable = rootManageable || !isRootNodeId(targetId);
    const { exportable, nodeAssignable, templateCreatable, sharable, editable } = permissions;
    const renamable = permissions.renamable && targetManageable;
    const removable = permissions.removable && targetManageable;
    const movable = permissions.movable && targetManageable;
    const parentPermissions = treeNodesMap[parentId]?.permissions;
    const copyable = parentPermissions && parentPermissions.manageable && permissions.manageable &&
      module === ConfigConstant.Modules.CATALOG && targetManageable;
    const nodeUrl = `${window.location.protocol}//${window.location.host}/workbench/${nodeId}`;
    let data: any = [];
    switch (contextMenuType) {
      /** 数表节点 */
      case ConfigConstant.ContextMenuType.DATASHEET: {
        data = [[
          contextItemMap.get(ContextItemKey.Rename)(() => rename(nodeId, level, module), !renamable),
          contextItemMap.get(ContextItemKey.Favorite)(() => {
            updateNodeFavoriteStatus(nodeId);
            if (!treeNodesMap[nodeId].nodeFavorite) {
              openFavorite();
            }
          }, nodeFavorite),
          contextItemMap.get(ContextItemKey.Copy)(() => copyNode(nodeId), !copyable),
          contextItemMap.get(ContextItemKey.CopyUrl)(() => copyUrl(nodeUrl), type),
        ], [
          contextItemMap.get(ContextItemKey.Export)(() => exportAsCsv(nodeId), () => exportExcel(nodeId), !exportable || isMobileApp()),
        ], [
          contextItemMap.get(ContextItemKey.Permission)(() => openPermissionSetting(nodeId), nodeAssignable),
          contextItemMap.get(ContextItemKey.Share)(() => openShareModal(nodeId), !sharable),
          contextItemMap.get(ContextItemKey.NodeInfo)(() => openNodeInfo(nodeId)),
          contextItemMap.get(ContextItemKey.MoveTo)(() => openMoveTo(nodeId), !movable),
          contextItemMap.get(ContextItemKey.SaveAsTemplate)(() => openSaveAsTemplateModal(nodeId), !templateCreatable),
        ], [
          contextItemMap.get(ContextItemKey.Delete)(() => deleteNode(nodeId, level, module), !removable),
        ]];
        // 往菜单注入新功能
        Player.applyFilters(Events.get_context_menu_file_more, data);
        break;
      }
      /** 文件夹节点 */
      case ConfigConstant.ContextMenuType.FOLDER: {
        data = [[
          contextItemMap.get(ContextItemKey.Rename)(() => rename(nodeId, level, module), !renamable),
        ], [
          contextItemMap.get(ContextItemKey.Favorite)(() => updateNodeFavoriteStatus(nodeId), nodeFavorite),
          contextItemMap.get(ContextItemKey.CopyUrl)(() => copyUrl(nodeUrl), type),
          contextItemMap.get(ContextItemKey.Permission)(() => openPermissionSetting(nodeId), nodeAssignable),
          contextItemMap.get(ContextItemKey.Share)(() => openShareModal(nodeId), !sharable),
          contextItemMap.get(ContextItemKey.NodeInfo)(() => openNodeInfo(nodeId)),
          contextItemMap.get(ContextItemKey.MoveTo)(() => openMoveTo(nodeId), !movable),
          contextItemMap.get(ContextItemKey.SaveAsTemplate)(() => openSaveAsTemplateModal(nodeId), !templateCreatable),
        ], [
          contextItemMap.get(ContextItemKey.Delete)(() => deleteNode(nodeId, level, module), !removable),
        ]];
        // 往菜单注入新功能
        Player.applyFilters(Events.get_context_menu_folder_more, data);
        break;
      }
      /** 神奇表单节点 */
      case ConfigConstant.ContextMenuType.FORM: {
        data = [[
          contextItemMap.get(ContextItemKey.Rename)(() => rename(nodeId, level, module), !renamable),
          contextItemMap.get(ContextItemKey.Favorite)(() => updateNodeFavoriteStatus(nodeId), nodeFavorite),
          contextItemMap.get(ContextItemKey.Copy)(() => copyNode(nodeId), !copyable),
          contextItemMap.get(ContextItemKey.CopyUrl)(() => copyUrl(nodeUrl), type),
        ], [
          contextItemMap.get(ContextItemKey.Permission)(() => openPermissionSetting(nodeId), nodeAssignable),
          contextItemMap.get(ContextItemKey.Share)(() => openShareModal(nodeId), !sharable),
          contextItemMap.get(ContextItemKey.NodeInfo)(() => openNodeInfo(nodeId)),
          contextItemMap.get(ContextItemKey.MoveTo)(() => openMoveTo(nodeId), !movable),
        ], [
          contextItemMap.get(ContextItemKey.Delete)(() => deleteNode(nodeId, level, module), !removable),
        ]];
        // 往菜单注入新功能
        Player.applyFilters(Events.get_context_menu_file_more, data);
        break;
      }
      /** 仪表盘的节点 */
      case ConfigConstant.ContextMenuType.DASHBOARD: {
        data = [[
          contextItemMap.get(ContextItemKey.Rename)(() => rename(nodeId, level, module), !renamable),
          contextItemMap.get(ContextItemKey.Favorite)(() => updateNodeFavoriteStatus(nodeId), nodeFavorite),
          contextItemMap.get(ContextItemKey.Copy)(() => copyNode(nodeId), !copyable),
          contextItemMap.get(ContextItemKey.CopyUrl)(() => copyUrl(nodeUrl), type),
        ], [
          contextItemMap.get(ContextItemKey.Permission)(() => openPermissionSetting(nodeId), nodeAssignable),
          contextItemMap.get(ContextItemKey.NodeInfo)(() => openNodeInfo(nodeId)),
          contextItemMap.get(ContextItemKey.MoveTo)(() => openMoveTo(nodeId), !movable),
        ], [
          contextItemMap.get(ContextItemKey.Delete)(() => deleteNode(nodeId, level, module), !removable),
        ]];
        // 往菜单注入新功能
        Player.applyFilters(Events.get_context_menu_file_more, data);
        break;
      }
      /** 镜像的节点 */
      case ConfigConstant.ContextMenuType.MIRROR: {
        data = [[
          contextItemMap.get(ContextItemKey.Rename)(() => rename(nodeId, level, module), !renamable),
          contextItemMap.get(ContextItemKey.Favorite)(() => updateNodeFavoriteStatus(nodeId), nodeFavorite),
          contextItemMap.get(ContextItemKey.Copy)(() => copyNode(nodeId), !copyable),
          contextItemMap.get(ContextItemKey.CopyUrl)(() => copyUrl(nodeUrl), type),
        ], [
          contextItemMap.get(ContextItemKey.Export)(() => exportAsCsv(nodeId), () => exportExcel(nodeId), !exportable || isMobileApp()),
        ], [
          contextItemMap.get(ContextItemKey.Permission)(() => openPermissionSetting(nodeId), nodeAssignable),
          contextItemMap.get(ContextItemKey.NodeInfo)(() => openNodeInfo(nodeId)),
          contextItemMap.get(ContextItemKey.Share)(() => openShareModal(nodeId), !sharable),
          contextItemMap.get(ContextItemKey.MoveTo)(() => openMoveTo(nodeId), !movable),
        ], [
          contextItemMap.get(ContextItemKey.Delete)(() => deleteNode(nodeId, level, module), !removable),
        ]];
        // 往菜单注入新功能
        Player.applyFilters(Events.get_context_menu_file_more, data);
        break;
      }
      default: {
        data = [
          [
            contextItemMap.get(ContextItemKey.AddDatasheet)(() => {
              openCatalog();
              addTreeNode(targetId);
            }),
            contextItemMap.get(ContextItemKey.AddForm)(() => {
              const result = triggerUsageAlert('maxFormViewsInSpace',
                { usage: spaceInfo!.formViewNums + 1, alwaysAlert: true }, SubscribeUsageTipType.Alert);
              if (result) {
                return;
              }
              openCatalog();
              addForm(targetId);
            }, !editable),
            contextItemMap.get(ContextItemKey.AddDashboard)(() => {
              openCatalog();
              addTreeNode(targetId, ConfigConstant.NodeType.DASHBOARD);
            }),
          ],
          [
            contextItemMap.get(ContextItemKey.AddFolder)(() => {
              openCatalog();
              addTreeNode(targetId, ConfigConstant.NodeType.FOLDER);
            }),
          ],
          [
            contextItemMap.get(ContextItemKey.Import)(() => {
              const result1 = triggerUsageAlert('maxSheetNums', { usage: spaceInfo!.sheetNums + 1, alwaysAlert: true }, SubscribeUsageTipType.Alert);
              if (result1) {
                return;
              }
              openCatalog();
              openImportModal(targetId);
            }),
          ],
          [contextItemMap.get(ContextItemKey.CreateFromTemplate)(() => Router.push(Navigation.TEMPLATE, { params: { spaceId }}))],
        ];
        // 往菜单注入新功能
        Player.applyFilters(Events.get_context_menu_root_add, data);
      }
    }
    return data;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rightClickInfo]);

  const getTitle = () => {
    if (!rightClickInfo) {
      return;
    }
    switch (rightClickInfo.contextMenuType) {
      case ConfigConstant.ContextMenuType.DEFAULT:
        return t(Strings.new_something);
      default:
        return <MobileNodeContextMenuTitle node={treeNodesMap[rightClickInfo.id]} />;
    }
  };

  const renderMobileContextMenu = () => {
    if (!rightClickInfo) {
      return <></>;
    }

    return <MobileContextMenu title={getTitle()} visible={Boolean(rightClickInfo)} data={contextData} height='auto' onClose={onHidden} />;
  };

  const contextMenuData = flatContextData(contextData);

  return (
    (
      isMobile ? renderMobileContextMenu() :
        <ContextMenu id={ConfigConstant.NODE_CONTEXT_MENU_ID} contextMenu={contextMenu} overlay={contextMenuData} />
    )
  );
});
