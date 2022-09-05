import { IconButton, Typography, useContextMenu, useThemeColors } from '@vikadata/components';
import {
  ConfigConstant,
  IReduxState,
  IRightClickInfo,
  Navigation,
  Selectors,
  shallowEqual,
  StoreActions,
  Strings,
  t,
  WORKBENCH_SIDE_ID,
  isIdassPrivateDeployment,
} from '@vikadata/core';
import { AddOutlined, FavoriteFilled, SearchOutlined, TitleWorkFilled } from '@vikadata/icons';
import { useRequest } from 'pc/hooks';
import { Collapse } from 'antd';
import classnames from 'classnames';
import { ShortcutActionManager, ShortcutActionName } from 'pc/common/shortcut_key';
import { GenerateTemplate } from 'pc/components/catalog/generate_template';
import { ImportFile } from 'pc/components/catalog/import_file';
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
import { useNavigation } from 'pc/components/route_manager/use_navigation';
import { sendRemind } from 'pc/events/notification_verification';
import { useCatalogTreeRequest, useResponsive, useSearchPanel, useUserRequest } from 'pc/hooks';
import { FC, useEffect, useMemo, useState } from 'react';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InviteIcon from 'static/icon/common/common_icon_invite.svg';
import ArrowIcon from 'static/icon/common/common_icon_up_line.svg';
import TrashIcon from 'static/icon/workbench/catalogue/recycle_closed.svg';
import TemplateIcon from 'static/icon/workbench/catalogue/template.svg';
import { Catalog } from '../../catalog';
import { Favorite } from './favorite';
import { SpaceInfo } from './space-info';
import styles from './style.module.less';
import { WorkbenchSideContext } from './workbench_side_context';
import { stopPropagation } from 'pc/utils';

const { Panel } = Collapse;

export interface IRightClickNodeInfo {
  nodeId: string;
  type: string;
  menuId: string;
}

export interface IDatasheetPanelInfo {
  folderId: string;
  datasheetId?: string;
}

export const WorkbenchSide: FC = () => {
  const colors = useThemeColors();
  // 管理右击节点的信息
  const [rightClickInfo, setRightClickInfo] = useState<IRightClickInfo | null>(null);
  const { contextMenu, onSetContextMenu, onCancelContextMenu } = useContextMenu();
  // 记录sidebar的展开状态
  const [activeKey, setActiveKey] = useState<string[]>([]);
  const [isSearch, setIsSearch] = useState(false);
  // 打开数表选择弹框，用以选择神奇表单单关联的数表视图
  const { panelVisible, panelInfo, onChange, setPanelInfo, setPanelVisible } = useSearchPanel();
  const navigationTo = useNavigation();
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
  const dispatch = useDispatch();

  const userInfo = useSelector(state => state.user.info);
  const spaceFeatures = useSelector(state => state.space.spaceFeatures);
  const spacePermissions = useSelector(state => state.spacePermissionManage.spaceResource?.permissions);
  const isSpaceAdmin = spacePermissions && spacePermissions.includes('MANAGE_WORKBENCH');
  const rootManageable = userInfo?.isMainAdmin || isSpaceAdmin || spaceFeatures?.rootManageable;

  /* 挂载/卸载目录树相关操作的快捷键 */
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNodeId, rootId]);

  /* 读取本地存储的sidebar展开状态 */
  useEffect(() => {
    const defaultActiveKeyString = localStorage.getItem('vika_workbench_active_key');
    const defaultActiveKey = defaultActiveKeyString ? JSON.parse(defaultActiveKeyString) : [ConfigConstant.Modules.CATALOG];
    setActiveKey(defaultActiveKey);
  }, []);

  useEffect(() => {
    if (activedNodeId && !treeNodesMap[activedNodeId] && !loading) {
      dispatch(StoreActions.getNodeInfo(activedNodeId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, activeNodeId]);

  const changeHandler = key => {
    setActiveKey(key);
    localStorage.setItem('vika_workbench_active_key', JSON.stringify(key));
  };

  const jumpTrash = () => {
    navigationTo({ path: Navigation.TRASH, params: { spaceId } });
  };

  const jumpSpaceTemplate = () => {
    navigationTo({
      path: Navigation.TEMPLATE,
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
      level: '0', // 根节点的层级为“0”
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }),
    [rightClickInfo, setRightClickInfo, onSetContextMenu, activeKey, setActiveKey],
  );

  const permissionCommitRemindStatus = useSelector(state => state.catalogTree.permissionCommitRemindStatus);

  // 权限设置弹窗关闭
  function onClosePermissionSettingModal() {
    dispatch(StoreActions.updatePermissionModalNodeId(''));

    if (permissionCommitRemindStatus) {
      // 发送消息
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
                shape="square"
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
                    <Typography className={styles.text} variant="h9" color={colors.secondLevelText}>
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
                    <Typography className={styles.text} variant="h9" color={colors.secondLevelText}>
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
      </div>
    </WorkbenchSideContext.Provider>
  );
};
