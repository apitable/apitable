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

import { usePostHog } from 'posthog-js/react';
import * as React from 'react';
import { FC, useEffect, useMemo, useState } from 'react';
import { IconButton, LinkButton, Radio, RadioGroup, useContextMenu, useThemeColors } from '@apitable/components';
import {
  ConfigConstant,
  IReduxState,
  IRightClickInfo,
  isIdassPrivateDeployment,
  Navigation,
  Selectors,
  shallowEqual,
  StoreActions,
  Strings,
  t,
  TrackEvents,
  WORKBENCH_SIDE_ID,
} from '@apitable/core';
import { AddOutlined, DeleteOutlined, FolderAddOutlined, ImportOutlined, PlanetOutlined, SearchOutlined, UserAddOutlined } from '@apitable/icons';
import { ShortcutActionManager, ShortcutActionName } from 'modules/shared/shortcut_key';
import { getShortcutKeyString } from 'modules/shared/shortcut_key/keybinding_config';
import { GenerateTemplate } from 'pc/components/catalog/generate_template';
import { ImportFile } from 'pc/components/catalog/import_file';
import { MoveTo } from 'pc/components/catalog/move_to';
import { NodeContextMenu } from 'pc/components/catalog/node_context_menu';
import { PermissionSettingsPlus } from 'pc/components/catalog/permission_settings_plus';
import { Share } from 'pc/components/catalog/share';
import { Modal } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common/tooltip';
import { SearchPanel } from 'pc/components/datasheet_search_panel';
import { ShareModal as FormShare } from 'pc/components/form_panel/form_tab/tool_bar/share_modal';
import { expandInviteModal } from 'pc/components/invite/invite_outsider';
import { expandSearch } from 'pc/components/quick_search';
import { Router } from 'pc/components/route_manager/router';
import { sendRemind } from 'pc/events/notification_verification';
import { IPanelInfo, useCatalogTreeRequest, useRequest, useResponsive, useSearchPanel, useWorkbenchSideSync } from 'pc/hooks';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { useCatalog } from 'pc/hooks/use_catalog';
import { useAppSelector } from 'pc/store/react-redux';
import { stopPropagation } from 'pc/utils';
import { Catalog } from '../../catalog';
import { Private } from '../../private/private';
import { Favorite } from './favorite';
import { SpaceInfo } from './space-info';
import { WorkbenchSideContext } from './workbench_side_context';
import styles from './style.module.less';

export const WorkbenchSide: FC<React.PropsWithChildren<unknown>> = () => {
  const colors = useThemeColors();
  const [rightClickInfo, setRightClickInfo] = useState<IRightClickInfo | null>(null);
  const { contextMenu, onSetContextMenu, onCancelContextMenu } = useContextMenu();
  const { panelVisible, panelInfo, onChange, setPanelInfo, setPanelVisible } = useSearchPanel();
  const { addTreeNode } = useCatalog();
  const {
    spaceId,
    activeKey,
    treeNodesMap,
    privateTreeNodesMap,
    rootId,
    activeNodeId,
    permissionModalNodeId,
    shareModalNodeId,
    saveAsTemplateModalNodeId,
    importModalNodeId,
    loading,
    err,
    moveToNodeIds,
  } = useAppSelector((state: IReduxState) => {
    return {
      spaceId: state.space.activeId,
      activeKey: state.catalogTree.activeType || ConfigConstant.Modules.CATALOG,
      treeNodesMap: state.catalogTree.treeNodesMap,
      privateTreeNodesMap: state.catalogTree.privateTreeNodesMap,
      rootId: state.catalogTree.rootId,
      activeNodeId: Selectors.getNodeId(state),
      permissionModalNodeId: state.catalogTree.permissionModalNodeId,
      shareModalNodeId: state.catalogTree.shareModalNodeId,
      saveAsTemplateModalNodeId: state.catalogTree.saveAsTemplateModalNodeId,
      importModalNodeId: state.catalogTree.importModalNodeId,
      loading: state.catalogTree.loading,
      err: state.catalogTree.err,
      moveToNodeIds: state.catalogTree.moveToNodeIds,
    };
  }, shallowEqual);

  const isFormShare = /fom\w+/.test(shareModalNodeId);
  const activedNodeId = useAppSelector((state) => Selectors.getNodeId(state));
  const activedNodePrivate = useAppSelector((state) => Selectors.getActiveNodePrivate(state));
  const { getTreeDataReq, getPrivateTreeDataReq } = useCatalogTreeRequest();
  const { run: getTreeData } = useRequest(getTreeDataReq, { manual: true });
  const { run: getPrivateTreeData } = useRequest(getPrivateTreeDataReq, { manual: true });
  const { getPositionNodeReq } = useCatalogTreeRequest();
  const { run: getPositionNode } = useRequest(getPositionNodeReq, {
    manual: true,
  });
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const dispatch = useAppDispatch();
  const posthog = usePostHog();

  const userInfo = useAppSelector((state) => state.user.info);
  const spaceFeatures = useAppSelector((state) => state.space.spaceFeatures);
  const spacePermissions = useAppSelector((state) => state.spacePermissionManage.spaceResource?.permissions);
  const isSpaceAdmin = spacePermissions && spacePermissions.includes('MANAGE_WORKBENCH');
  const rootManageable = userInfo?.isMainAdmin || isSpaceAdmin || spaceFeatures?.rootManageable;
  const inviteStatus = spaceFeatures?.invitable;

  const [showPrivate, setShowPrivate] = useState(false);

  useWorkbenchSideSync();

  useEffect(() => {
    const eventBundle = new Map([
      [
        ShortcutActionName.Permission,
        () => {
          activeNodeId && treeNodesMap[activeNodeId] && dispatch(StoreActions.updatePermissionModalNodeId(activeNodeId));
        },
      ],
      [
        ShortcutActionName.Share,
        () => {
          activeNodeId && treeNodesMap[activeNodeId] && dispatch(StoreActions.updateShareModalNodeId(activeNodeId));
        },
      ],
      [
        ShortcutActionName.SaveAsTemplate,
        () => {
          dispatch(StoreActions.updateSaveAsTemplateModalNodeId(activeNodeId || ''));
        },
      ],
    ]);

    eventBundle.forEach((cb, key) => {
      ShortcutActionManager.bind(key, cb);
    });

    return () => {
      eventBundle.forEach((_cb, key) => {
        ShortcutActionManager.unbind(key);
      });
    };
  });

  useEffect(() => {
    const handleClose = () => {
      dispatch(StoreActions.setErr(''));
      dispatch(StoreActions.initCatalogTree());
      getTreeData();
    };
    if (err) {
      Modal.error({
        title: t(Strings.kindly_reminder),
        content: err,
        okText: t(Strings.refresh_manually),
        onCancel: handleClose,
        onOk: handleClose,
      });
    }
    // eslint-disable-next-line
  }, [err, dispatch]);

  useEffect(() => {
    if (!activeNodeId || !rootId) {
      return;
    }
    let isPrivate = false;
    let nodeMaps = treeNodesMap;
    let activeNode = treeNodesMap[activeNodeId];
    if (!activeNode) {
      activeNode = privateTreeNodesMap[activeNodeId];
      if (activeNode) {
        nodeMaps = privateTreeNodesMap;
        isPrivate = true;
        activeKey !== ConfigConstant.Modules.FAVORITE && changeHandler(ConfigConstant.Modules.PRIVATE);
      }
    }
    const _module = isPrivate ? ConfigConstant.Modules.PRIVATE : undefined;
    if (activeNode && nodeMaps[activeNode.parentId]) {
      const parentNodeId = activeNode.parentId;
      if (nodeMaps[parentNodeId]?.children.length) {
        dispatch(StoreActions.collectionNodeAndExpand(activeNodeId, _module));
        return;
      }
    }
    getPositionNode(activeNodeId).then((rlt) => {
      if (rlt && rlt.nodePrivate) {
        activeKey !== ConfigConstant.Modules.FAVORITE && changeHandler(ConfigConstant.Modules.PRIVATE);
      }
    });
    // eslint-disable-next-line
  }, [activeNodeId, rootId]);

  useEffect(() => {
    if (activedNodeId && !treeNodesMap[activedNodeId] && !loading) {
      dispatch(StoreActions.getNodeInfo(activedNodeId));
    }
    // eslint-disable-next-line
  }, [loading, activeNodeId]);

  const changeHandler = (key: ConfigConstant.Modules) => {
    dispatch(StoreActions.setActiveTreeType(key));
    updateActiveKey(key);
  };

  useEffect(() => {
    if (spaceId) {
      getPrivateTreeData().then(rlt => {
        if (rlt === null) {
          changeHandler(ConfigConstant.Modules.CATALOG);
          setShowPrivate(false);
        } else {
          setShowPrivate(true);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spaceId]);

  const updateActiveKey = React.useCallback(
    (key: string = 'get') => {
      const defaultActiveKeyString = localStorage.getItem('vika_workbench_active_key');
      let defaultActiveKey = defaultActiveKeyString ? JSON.parse(defaultActiveKeyString) : ConfigConstant.Modules.CATALOG;
      if ('get' === key) {
        // Compatible with older versions, which is arrayed
        if (typeof defaultActiveKey[0] === 'string') defaultActiveKey = ConfigConstant.Modules.CATALOG;
        if (Array.isArray(defaultActiveKey)) {
          defaultActiveKey = defaultActiveKey.find((i: { spaceId: string }) => i.spaceId === spaceId);
          defaultActiveKey = defaultActiveKey ? defaultActiveKey.activeKey : ConfigConstant.Modules.CATALOG;
        }
        return defaultActiveKey;
      }
      if (typeof defaultActiveKey[0] === 'string') defaultActiveKey = [{ spaceId, activeKey: key }];
      if (Array.isArray(defaultActiveKey)) {
        let noSpaceId = true;
        for (const item of defaultActiveKey) {
          if (item.spaceId === spaceId) {
            noSpaceId = false;
            item.activeKey = key;
            break;
          }
        }
        if (noSpaceId) defaultActiveKey.push({ spaceId, activeKey: key });
        localStorage.setItem('vika_workbench_active_key', JSON.stringify(defaultActiveKey));
      }
    },
    [spaceId],
  );

  useEffect(() => {
    dispatch(StoreActions.setActiveTreeType(updateActiveKey()));
  }, [dispatch, updateActiveKey]);

  const jumpTrash = () => {
    Router.push(Navigation.TRASH, { params: { spaceId } });
  };

  const jumpSpaceTemplate = () => {
    Router.push(Navigation.TEMPLATE, {
      params: {
        spaceId,
        categoryId: 'tpcprivate',
      },
    });
  };

  const openDefaultMenu = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    setRightClickInfo({
      id: rootId,
      module: ConfigConstant.Modules.CATALOG,
      contextMenuType: ConfigConstant.ContextMenuType.DEFAULT,
      level: '0',
    });
    onSetContextMenu(e);
  };

  const openDatasheetPanel = (info: IPanelInfo) => {
    setPanelVisible(true);
    setPanelInfo(info);
  };

  const openCatalog = () => {
    // TODO
    // if (!activeKey.includes(ConfigConstant.Modules.CATALOG)) {
    //   changeHandler(ConfigConstant.Modules.CATALOG);
    // }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const openFavorite = () => {
    if (!activeKey.includes(ConfigConstant.Modules.FAVORITE)) {
      changeHandler(ConfigConstant.Modules.FAVORITE);
    }
  };

  const providerValue = useMemo(
    () => ({
      rightClickInfo,
      setRightClickInfo,
      openFavorite,
      onSetContextMenu,
      // eslint-disable-next-line
    }),
    [rightClickInfo, openFavorite, onSetContextMenu],
  );

  const permissionCommitRemindStatus = useAppSelector((state) => state.catalogTree.permissionCommitRemindStatus);
  const activeNodePrivate = useAppSelector((state) => Selectors.getActiveNodePrivate(state));

  function onClosePermissionSettingModal() {
    dispatch(StoreActions.updatePermissionModalNodeId(''));

    if (permissionCommitRemindStatus && !activeNodePrivate) {
      sendRemind();
      dispatch(StoreActions.setPermissionCommitRemindStatus(false));
    }
  }

  return (
    <WorkbenchSideContext.Provider value={providerValue}>
      <div className={styles.workbenchSide}>
        <div className={styles.header}>
          <div className={styles.left}>
            <SpaceInfo />
          </div>
          <div className={styles.search}>
            <Tooltip title={t(Strings.search_node_tip, {
              shortcutKey: getShortcutKeyString(ShortcutActionName.SearchNode)
            })} placement="right">
              <IconButton
                shape="square"
                className={styles.searchBtn}
                icon={SearchOutlined}
                onClick={(e) => {
                  stopPropagation(e);
                  expandSearch();
                }}
              />
            </Tooltip>
          </div>
        </div>

        <div
          className={styles.groups}
          style={{
            paddingRight: isMobile ? '12px' : '0',
          }}
        >
          <div className={styles.mainContainer} id={WORKBENCH_SIDE_ID.NODE_WRAPPER}>
            <div className={styles.btnGroup}>
              <RadioGroup name="workbench-btn-group" isBtn block value={activeKey} onChange={(_e, value) => changeHandler(value)}>
                <Radio value={ConfigConstant.Modules.CATALOG}>{t(Strings.catalog_team)}</Radio>
                {showPrivate && <Radio value={ConfigConstant.Modules.PRIVATE}>{t(Strings.catalog_private)}</Radio>}
                <Radio value={ConfigConstant.Modules.FAVORITE}>{t(Strings.favorite)}</Radio>
              </RadioGroup>
            </div>
            {activeKey === ConfigConstant.Modules.FAVORITE ? (
              <div className={styles.scrollContainer}>
                <Favorite />
              </div>
            ) : (
              <>
                <div className={styles.catalogActions}>
                  {rootManageable && (
                    <>
                      <LinkButton
                        underline={false}
                        component="div"
                        prefixIcon={<AddOutlined color={colors.textCommonSecondary} size={12} />}
                        color={colors.textCommonSecondary}
                        onClick={openDefaultMenu}
                        id={WORKBENCH_SIDE_ID.ADD_NODE_BTN}
                      >
                        <Tooltip title={t(Strings.new_node_tooltip)}>{t(Strings.new_node_btn_title)}</Tooltip>
                      </LinkButton>
                      <LinkButton
                        underline={false}
                        component="div"
                        prefixIcon={<ImportOutlined color={colors.textCommonSecondary} size={12} />}
                        color={colors.textCommonSecondary}
                        onClick={() => {
                          dispatch(StoreActions.updateImportModalNodeId(rootId));
                        }}
                      >
                        <Tooltip title={t(Strings.import_from_excel_tooltip)}>{t(Strings.import_file_btn_title)}</Tooltip>
                      </LinkButton>
                      <LinkButton
                        underline={false}
                        component="div"
                        prefixIcon={<FolderAddOutlined color={colors.textCommonSecondary} size={12} />}
                        color={colors.textCommonSecondary}
                        onClick={() => {
                          addTreeNode(rootId, ConfigConstant.NodeType.FOLDER);
                        }}
                      >
                        <Tooltip title={t(Strings.new_folder_tooltip)}>{t(Strings.folder)}</Tooltip>
                      </LinkButton>
                    </>
                  )}
                </div>
                <div className={styles.scrollContainer}>
                  {activeKey === ConfigConstant.Modules.CATALOG && <Catalog />}
                  {showPrivate && activeKey === ConfigConstant.Modules.PRIVATE && <Private />}
                </div>
              </>
            )}
          </div>
        </div>
        <div className={styles.fixedGroup}>
          {!isMobile && (
            <Tooltip title={t(Strings.trash)}>
              <div className={styles.groupItem} onClick={jumpTrash} id={WORKBENCH_SIDE_ID.RECYCLE_BIN}>
                <DeleteOutlined color={colors.rc04} />
              </div>
            </Tooltip>
          )}
          <Tooltip title={t(Strings.workbench_side_space_template)}>
            <div className={styles.groupItem} onClick={jumpSpaceTemplate} id={WORKBENCH_SIDE_ID.TO_SPACE_TEMPLATE}>
              <PlanetOutlined color={colors.rc02} />
            </div>
          </Tooltip>
          {inviteStatus && !isIdassPrivateDeployment() && (
            <Tooltip title={t(Strings.invite_friends)}>
              <div
                className={styles.groupItem}
                onClick={() => {
                  posthog?.capture(TrackEvents.InviteByWorkbench);
                  expandInviteModal();
                }}
              >
                <UserAddOutlined color={colors.primaryColor} />
              </div>
            </Tooltip>
          )}
        </div>
        <NodeContextMenu
          openDatasheetPanel={openDatasheetPanel}
          onHidden={() => {
            setRightClickInfo(null);
            onCancelContextMenu();
          }}
          contextMenu={contextMenu}
          openCatalog={openCatalog}
        />
        {saveAsTemplateModalNodeId && (
          <GenerateTemplate nodeId={saveAsTemplateModalNodeId} onCancel={() => dispatch(StoreActions.updateSaveAsTemplateModalNodeId(''))} />
        )}
        {importModalNodeId && <ImportFile
          isPrivate={activeKey === ConfigConstant.Modules.PRIVATE}
          parentId={importModalNodeId} 
          onCancel={() => dispatch(StoreActions.updateImportModalNodeId(''))} 
        />}
        {panelVisible && (
          <SearchPanel
            folderId={panelInfo!.folderId}
            secondConfirmType={panelInfo?.secondConfirmType}
            activeDatasheetId={panelInfo?.datasheetId || ''}
            setSearchPanelVisible={setPanelVisible}
            onChange={onChange}
            isPrivate={activeKey === ConfigConstant.Modules.PRIVATE}
          />
        )}
        {isFormShare && (
          <FormShare
            formId={shareModalNodeId}
            visible={Boolean(shareModalNodeId)}
            onClose={() => dispatch(StoreActions.updateShareModalNodeId(''))}
          />
        )}
        {!isFormShare && <Share nodeId={shareModalNodeId} onClose={() => dispatch(StoreActions.updateShareModalNodeId(''))} />}
        {!activedNodePrivate && (
          <PermissionSettingsPlus
            data={{
              nodeId: permissionModalNodeId,
              type: treeNodesMap[permissionModalNodeId]?.type,
              icon: treeNodesMap[permissionModalNodeId]?.icon,
              name: treeNodesMap[permissionModalNodeId]?.nodeName,
            }}
            visible={Boolean(permissionModalNodeId)}
            onClose={onClosePermissionSettingModal}
          />
        )}
        {moveToNodeIds && moveToNodeIds.length > 0 && (
          <MoveTo
            nodeIds={moveToNodeIds}
            onClose={() => dispatch(StoreActions.updateMoveToNodeIds([]))}
            isPrivate={activeKey === ConfigConstant.Modules.PRIVATE}
          />
        )}
      </div>
    </WorkbenchSideContext.Provider>
  );
};
