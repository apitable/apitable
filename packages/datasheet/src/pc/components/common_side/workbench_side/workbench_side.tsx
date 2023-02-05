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

import { IconButton, Typography, useContextMenu, useThemeColors } from '@apitable/components';
import {
  ConfigConstant, IReduxState, IRightClickInfo, isIdassPrivateDeployment, Navigation, Selectors, shallowEqual, StoreActions, Strings, t,
  WORKBENCH_SIDE_ID,
} from '@apitable/core';
import { AddOutlined, FavoriteFilled, SearchOutlined, TitleWorkFilled } from '@apitable/icons';
import { Collapse } from 'antd';
import classnames from 'classnames';
import { ShortcutActionManager, ShortcutActionName } from 'modules/shared/shortcut_key';
import { GenerateTemplate } from 'pc/components/catalog/generate_template';
import { ImportFile } from 'pc/components/catalog/import_file';
import { MoveTo } from 'pc/components/catalog/move_to';
import { NodeContextMenu } from 'pc/components/catalog/node_context_menu';
import { PermissionSettingsPlus } from 'pc/components/catalog/permission_settings_plus';
import { Search } from 'pc/components/catalog/search';
import { Share } from 'pc/components/catalog/share';
import { Modal } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { Tooltip } from 'pc/components/common/tooltip';
import { SearchPanel, SubColumnType } from 'pc/components/datasheet_search_panel';
import { ShareModal as FormShare } from 'pc/components/form_panel/form_tab/tool_bar/share_modal';
import { expandInviteModal } from 'pc/components/invite/invite_outsider';
import { Router } from 'pc/components/route_manager/router';
import { sendRemind } from 'pc/events/notification_verification';
import { useCatalogTreeRequest, useRequest, useResponsive, useSearchPanel, useUserRequest } from 'pc/hooks';
import { useAppDispatch } from 'pc/hooks/use_app_dispatch';
import { stopPropagation } from 'pc/utils';
import * as React from 'react';
import { FC, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import InviteIcon from 'static/icon/common/common_icon_invite.svg';
import ArrowIcon from 'static/icon/common/common_icon_up_line.svg';
import TrashIcon from 'static/icon/workbench/catalogue/recycle_closed.svg';
import TemplateIcon from 'static/icon/workbench/catalogue/template.svg';
import { Catalog } from '../../catalog';
import { Favorite } from './favorite';
import { SpaceInfo } from './space-info';
import styles from './style.module.less';
import { WorkbenchSideContext } from './workbench_side_context';

const { Panel } = Collapse;

export interface IDatasheetPanelInfo {
  folderId: string;
  datasheetId?: string;
}

export const WorkbenchSide: FC = () => {
  const colors = useThemeColors();
  const [rightClickInfo, setRightClickInfo] = useState<IRightClickInfo | null>(null);
  const { contextMenu, onSetContextMenu, onCancelContextMenu } = useContextMenu();
  const [activeKey, setActiveKey] = useState<string[]>([]);
  const [isSearch, setIsSearch] = useState(false);
  const { panelVisible, panelInfo, onChange, setPanelInfo, setPanelVisible } = useSearchPanel();
  const {
    spaceId,
    treeNodesMap,
    rootId,
    activeNodeId,
    permissionModalNodeId,
    shareModalNodeId,
    saveAsTemplateModalNodeId,
    importModalNodeId,
    loading,
    err,
    moveToNodeIds
  } = useSelector((state: IReduxState) => {
    return {
      spaceId: state.space.activeId,
      treeNodesMap: state.catalogTree.treeNodesMap,
      rootId: state.catalogTree.rootId,
      activeNodeId: Selectors.getNodeId(state),
      permissionModalNodeId: state.catalogTree.permissionModalNodeId,
      shareModalNodeId: state.catalogTree.shareModalNodeId,
      saveAsTemplateModalNodeId: state.catalogTree.saveAsTemplateModalNodeId,
      importModalNodeId: state.catalogTree.importModalNodeId,
      loading: state.catalogTree.loading,
      err: state.catalogTree.err,
      moveToNodeIds: state.catalogTree.moveToNodeIds
    };
  }, shallowEqual);

  const isFormShare = /fom\w+/.test(shareModalNodeId);
  const activedNodeId = useSelector(state => Selectors.getNodeId(state));
  const { getTreeDataReq } = useCatalogTreeRequest();
  const { run: getTreeData } = useRequest(getTreeDataReq, { manual: true });
  const { getPositionNodeReq } = useCatalogTreeRequest();
  const { run: getPositionNode } = useRequest(getPositionNodeReq, {
    manual: true,
  });
  const { getInviteStatus } = useUserRequest();
  const { data: inviteStatus } = useRequest(getInviteStatus);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const dispatch = useAppDispatch();

  const userInfo = useSelector(state => state.user.info);
  const spaceFeatures = useSelector(state => state.space.spaceFeatures);
  const spacePermissions = useSelector(state => state.spacePermissionManage.spaceResource?.permissions);
  const isSpaceAdmin = spacePermissions && spacePermissions.includes('MANAGE_WORKBENCH');
  const rootManageable = userInfo?.isMainAdmin || isSpaceAdmin || spaceFeatures?.rootManageable;

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
      [
        ShortcutActionName.SearchNode,
        () => {
          setIsSearch(!isSearch);
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
    const activeNode = treeNodesMap[activeNodeId];
    if (activeNode && treeNodesMap[activeNode.parentId]) {
      const parentNodeId = activeNode.parentId;
      if (treeNodesMap[parentNodeId]?.children.length) {
        dispatch(StoreActions.collectionNodeAndExpand(activeNodeId));
        return;
      }
    }
    getPositionNode(activeNodeId);
    // eslint-disable-next-line
  }, [activeNodeId, rootId]);

  useEffect(() => {
    const defaultActiveKeyString = localStorage.getItem('vika_workbench_active_key');
    const defaultActiveKey = defaultActiveKeyString ? JSON.parse(defaultActiveKeyString) : [ConfigConstant.Modules.CATALOG];
    setActiveKey(defaultActiveKey);
  }, []);

  useEffect(() => {
    if (activedNodeId && !treeNodesMap[activedNodeId] && !loading) {
      dispatch(StoreActions.getNodeInfo(activedNodeId));
    }
    // eslint-disable-next-line
  }, [loading, activeNodeId]);

  const changeHandler = key => {
    setActiveKey(key);
    localStorage.setItem('vika_workbench_active_key', JSON.stringify(key));
  };

  const jumpTrash = () => {
    Router.push(Navigation.TRASH, { params: { spaceId }});
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

  const openDatasheetPanel = (visible, info) => {
    setPanelVisible(visible);
    setPanelInfo(info);
  };

  const openCatalog = () => {
    if (!activeKey.includes(ConfigConstant.Modules.CATALOG)) {
      changeHandler([...activeKey, ConfigConstant.Modules.CATALOG]);
    }
  };

  const openFavorite = () => {
    if (!activeKey.includes(ConfigConstant.Modules.FAVORITE)) {
      changeHandler([...activeKey, ConfigConstant.Modules.FAVORITE]);
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
    [rightClickInfo, setRightClickInfo, onSetContextMenu, activeKey, setActiveKey],
  );

  const permissionCommitRemindStatus = useSelector(state => state.catalogTree.permissionCommitRemindStatus);

  function onClosePermissionSettingModal() {
    dispatch(StoreActions.updatePermissionModalNodeId(''));

    if (permissionCommitRemindStatus) {
      sendRemind();
      dispatch(StoreActions.setPermissionCommitRemindStatus(false));
    }
  }

  const PermissionSettingsMain = PermissionSettingsPlus;

  return (
    <WorkbenchSideContext.Provider value={providerValue}>
      <div className={styles.workbenchSide}>
        <div className={styles.header}>
          <SpaceInfo />
          <div className={styles.search}>
            {isSearch ? (
              <Search closeSearch={() => setIsSearch(false)} />
            ) : (
              <IconButton
                shape='square'
                className={styles.searchBtn}
                icon={SearchOutlined}
                onClick={e => {
                  stopPropagation(e);
                  setIsSearch(true);
                }}
              />
            )}
          </div>
        </div>

        <div
          className={styles.groups}
          style={{
            paddingRight: isMobile ? '12px' : '0',
          }}
        >
          <div className={styles.mainContainer} id={WORKBENCH_SIDE_ID.NODE_WRAPPER}>
            <Collapse className={styles.collapse} onChange={changeHandler} activeKey={activeKey} ghost>
              <Panel
                className={styles.favorite}
                key={ConfigConstant.Modules.FAVORITE}
                header={
                  <div className={styles.groupName}>
                    <FavoriteFilled color={colors.warningColor} />
                    <Typography className={styles.text} variant='h9' color={colors.secondLevelText}>
                      {t(Strings.favorite)}
                    </Typography>
                    <ArrowIcon
                      className={classnames(styles.arrow, {
                        [styles.active]: activeKey.includes(ConfigConstant.Modules.FAVORITE),
                      })}
                    />
                  </div>
                }
                showArrow={false}
              >
                <div className={styles.scrollContainer}>
                  <Favorite />
                </div>
              </Panel>
              <Panel
                className={styles.catalog}
                key={ConfigConstant.Modules.CATALOG}
                header={
                  <div className={styles.groupName}>
                    <TitleWorkFilled color={colors.primaryColor} />
                    <Typography className={styles.text} variant='h9' color={colors.secondLevelText}>
                      {t(Strings.catalog)}
                    </Typography>
                    <ArrowIcon
                      className={classnames(styles.arrow, {
                        [styles.active]: activeKey.includes(ConfigConstant.Modules.CATALOG),
                      })}
                    />
                  </div>
                }
                extra={
                  rootManageable ? (
                    <IconButton style={{ marginRight: 10 }} onClick={openDefaultMenu} icon={AddOutlined} id={WORKBENCH_SIDE_ID.ADD_NODE_BTN} />
                  ) : null
                }
                showArrow={false}
              >
                <div className={styles.scrollContainer}>
                  <Catalog />
                </div>
              </Panel>
            </Collapse>
          </div>
        </div>
        <div className={styles.fixedGroup}>
          {!isMobile && (
            <Tooltip title={t(Strings.trash)}>
              <div className={styles.groupItem} onClick={jumpTrash} data-sensors-click id={WORKBENCH_SIDE_ID.RECYCLE_BIN}>
                <TrashIcon fill={colors.rc04} />
              </div>
            </Tooltip>
          )}
          <Tooltip title={t(Strings.workbench_side_space_template)}>
            <div className={styles.groupItem} onClick={jumpSpaceTemplate} data-sensors-click id={WORKBENCH_SIDE_ID.TO_SPACE_TEMPLATE}>
              <TemplateIcon fill={colors.rc02} />
            </div>
          </Tooltip>
          {inviteStatus && !isIdassPrivateDeployment() && (
            <Tooltip title={t(Strings.invite_friends)}>
              <div className={styles.groupItem} onClick={() => expandInviteModal()}>
                <InviteIcon fill={colors.primaryColor} />
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
        {importModalNodeId && <ImportFile parentId={importModalNodeId} onCancel={() => dispatch(StoreActions.updateImportModalNodeId(''))} />}
        {panelVisible && (
          <SearchPanel
            folderId={panelInfo!.folderId}
            subColumnType={SubColumnType.View}
            activeDatasheetId={panelInfo?.datasheetId || ''}
            setSearchPanelVisible={setPanelVisible}
            onChange={onChange}
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
        <PermissionSettingsMain
          data={{
            nodeId: permissionModalNodeId,
            type: treeNodesMap[permissionModalNodeId]?.type,
            icon: treeNodesMap[permissionModalNodeId]?.icon,
            name: treeNodesMap[permissionModalNodeId]?.nodeName,
          }}
          visible={Boolean(permissionModalNodeId)}
          onClose={onClosePermissionSettingModal}
        />
        {
          moveToNodeIds && moveToNodeIds.length > 0 && (
            <MoveTo
              nodeIds={moveToNodeIds}
              onClose={() => dispatch(StoreActions.updateMoveToNodeIds([]))}
            />
          )
        }
      </div>
    </WorkbenchSideContext.Provider>
  );
};
