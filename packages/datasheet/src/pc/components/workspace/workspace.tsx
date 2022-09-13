import { Api, AutoTestID, ConfigConstant, Events, IReduxState, Navigation, Player, StoreActions, Strings, t } from '@vikadata/core';
import { CollapseOutlined, ExpandOutlined } from '@vikadata/icons';
import { useMount } from 'ahooks';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { TriggerCommands } from 'pc/common/apphook/trigger_commands';
import { destroyVikaby, showVikaby } from 'pc/common/guide/vikaby';
import { ShortcutActionManager, ShortcutActionName } from 'pc/common/shortcut_key';
import { getShortcutKeyString } from 'pc/common/shortcut_key/keybinding_config';
import { Navigation as SiderNavigation } from 'pc/components/navigation';
import { Method, navigatePath } from 'pc/components/route_manager/use_navigation';
import WorkspaceRoute from 'pc/components/route_manager/workspace_route';
import Trash from 'pc/components/trash/trash';
import { getPageParams, useCatalogTreeRequest, useQuery, useRequest, useResponsive } from 'pc/hooks';
import { store } from 'pc/store';
import { getStorage, setStorage, StorageMethod, StorageName } from 'pc/utils/storage/storage';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip, VikaSplitPanel } from '../common';
import { ComponentDisplay, ScreenSize } from '../common/component_display';
import { CommonSide } from '../common_side';
import styles from './style.module.less';
import { ISideBarContextProps, SideBarClickType, SideBarContext, SideBarType } from 'pc/context';
import { isHiddenQRCode } from 'pc/utils/env';

// 恢复用户上次打开的数表
const resumeUserHistory = (path: string) => {
  const state = store.getState();
  const user = state.user.info!;
  const spaceId = state.space.activeId;
  const { datasheetId, folderId, viewId, recordId, formId, widgetId, mirrorId, dashboardId } = getPageParams(path);
  const nodeId = datasheetId || folderId || formId || mirrorId || dashboardId;
  if (spaceId === user.spaceId) {
    if (mirrorId) {
      navigatePath({
        path: Navigation.WORKBENCH,
        params: {
          spaceId: spaceId || user.spaceId,
          nodeId: mirrorId,
          datasheetId: datasheetId || user.activeNodeId,
          viewId: viewId || user.activeViewId,
          recordId,
          widgetId,
        },
        method: Method.Replace,
      });
      return;
    }
    navigatePath({
      path: Navigation.WORKBENCH,
      params: {
        spaceId: spaceId || user.spaceId,
        nodeId: nodeId || user.activeNodeId,
        viewId: viewId || user.activeViewId,
        recordId,
        widgetId,
      },
      method: Method.Replace,
    });
  } else {
    navigatePath({
      path: Navigation.WORKBENCH,
      params: {
        spaceId,
        nodeId,
        viewId,
        recordId,
      },
      method: Method.Replace,
    });
  }
};

export const Workspace: React.FC = () => {
  const dispatch = useDispatch();
  const localSize = getStorage(StorageName.SplitPos);
  const defaultSidePanelSize = localSize && localSize !== 280 ? localSize : 335;
  const editNodeId = useSelector((state: IReduxState) => state.catalogTree.editNodeId);
  const favoriteEditNodeId = useSelector((state: IReduxState) => state.catalogTree.favoriteEditNodeId);
  const shareId = useSelector((state: IReduxState) => state.pageParams.shareId);
  const userSpaceId = useSelector((state: IReduxState) => state.user.info!.spaceId);
  const { getFavoriteNodeListReq, getTreeDataReq } = useCatalogTreeRequest();
  const { run: getFavoriteNodeList } = useRequest(getFavoriteNodeListReq, { manual: true });
  const { run: getTreeData } = useRequest(getTreeDataReq, { manual: true });
  const { screenIsAtMost } = useResponsive();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [templeVisible, setTempleVisible] = useState(false);
  const isMobile = screenIsAtMost(ScreenSize.md);
  const query = useQuery();
  const router = useRouter();
 
  // 目录树切换来源态，目录树点击态，侧边栏开关
  const [toggleType, setToggleType] = useState<SideBarType>(SideBarType.None);
  const [clickType, setClickType] = useState<SideBarClickType>(SideBarClickType.None);
  const [panelVisible, setPanelVisible] = useState(false);
  const sideBarVisible = useSelector(state => state.space.sideBarVisible);

  /**
   * 目录树开关来源 - 用户
   */
  const handleSetSideBarByUser = (visible, panel) => {
    // 判断目录树切换类型，右侧面板处于展开或者右侧面板在关闭情况下用户同时关闭了目录树，则认为是用户点击操作，则展开和关闭面板不应当影响目录树状态
    const resToggleType = panel || (!panel && sideBarVisible) ? SideBarType.User : SideBarType.UserWithoutPanel;
    setToggleType(resToggleType);
    // 右侧面板未展开或者右侧面板展开并且目录树也处于展开状态时需要，设置目录树开关的点击类型认为是用户操作
    if (!panel || (panel && sideBarVisible)) {
      setClickType(SideBarClickType.User);
    }
    setStorage(StorageName.IsPanelClosed, visible, StorageMethod.Set);
    dispatch(StoreActions.setSideBarVisible(visible));
  };

  /**
   * 目录树开关来源 - 面板
   */
  const handleSetSideBarByOther = visible => {
    setStorage(StorageName.IsPanelClosed, visible, StorageMethod.Set);
    dispatch(StoreActions.setSideBarVisible(visible));
  };

  useMount(() => {
    resumeUserHistory(router.asPath);
    dispatch(StoreActions.setTreeLoading(true));
    Player.doTrigger(Events.workbench_shown);
  });

  useMount(() => {
    const notifyId = query.get('notifyId');
    if (notifyId) {
      // 来自通知，则标记通知已读
      Api.transferNoticeToRead([notifyId]);
    }
  });

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [sideBarVisible]);

  useEffect(() => {
    if (isMobile || shareId || isHiddenQRCode()) {
      destroyVikaby();
      return;
    }
   
    const isVikabyClosed = Boolean(localStorage.getItem('vikaby_closed'));
    !isVikabyClosed && showVikaby();
    return () => {
      destroyVikaby();
    };
  }, [isMobile, shareId]);

  // 绑定/解绑快捷键
  useEffect(() => {
    const eventBundle = new Map([
      [
        ShortcutActionName.ToggleCatalogPanel,
        () => {
          handleSetSideBarByUser(!sideBarVisible, panelVisible);
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
    if (userSpaceId) {
      dispatch(StoreActions.initCatalogTree());
      getTreeData();
      getFavoriteNodeList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSpaceId, dispatch]);

  const changeSplitPane = (size: number) => {
    window.dispatchEvent(new Event('resize'));
    setStorage(StorageName.SplitPos, size, StorageMethod.Set);
  };

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (favoriteEditNodeId || editNodeId || !templeVisible || (templeVisible && e.clientX < defaultSidePanelSize)) {
        return;
      }
      if (menuRef.current && menuRef.current.contains(e.target as HTMLElement)) {
        return;
      }
      setTempleVisible(false);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [templeVisible, defaultSidePanelSize, menuRef, editNodeId, favoriteEditNodeId]);

  useMount(async() => {
    const wizardId = ConfigConstant.WizardIdConstant.AGREE_TERMS_OF_SERVICE;
    await TriggerCommands.set_wizard_completed({
      wizardId,
    });
    localStorage.removeItem(`${wizardId}`);
  });

  const closeBtnClass = classNames({
    [styles.closeBtn]: true,
    [styles.isPanelClose]: !sideBarVisible,
  });

  const notVisible = !sideBarVisible && !templeVisible;

  const children = router.asPath.includes('trash') ? <Trash /> : <WorkspaceRoute />;
  const sideContextValue: ISideBarContextProps = {
    toggleType,
    clickType,
    onSetClickType: setClickType,
    onSetToggleType: setToggleType,
    onSetPanelVisible: setPanelVisible,
    onSetSideBarVisibleByUser: handleSetSideBarByUser,
    onSetSideBarVisibleByOhter: handleSetSideBarByOther,
  };

  return (
    <div
      id={AutoTestID.WORKBENCH_PAGE}
      className={classNames({
        [styles.dataspace]: true,
        [styles.hiddenCatalog]: !sideBarVisible && !isMobile,
      })}
    >
      <ComponentDisplay minWidthCompatible={ScreenSize.md}>
        <SideBarContext.Provider value={sideContextValue}>
          {/* TODO：SplitPane 上直接设置 pane1Style 加动画会导致无法拖动的问题， 下个版本解决。0.4 暂时不加动画 */}
          <VikaSplitPanel
            panelLeft={
              <div style={{ width: sideBarVisible ? '100%' : 0 }} className={styles.splitLeft} data-test-id="workspace-sidebar">
                <div
                  style={{
                    width: sideBarVisible ? '100%' : templeVisible ? defaultSidePanelSize : 0,
                    overflow: notVisible ? 'hidden' : 'inherit',
                  }}
                  className={classNames(styles.menuWrap, 'workspaceMenu', {
                    [styles.animationOpen]: templeVisible,
                    [styles.animationClose]: notVisible,
                  })}
                  ref={menuRef}
                >
                  <SiderNavigation />
                  <div className={styles.wrapper}>
                    <CommonSide />
                  </div>
                </div>
                <Tooltip
                  title={`${!sideBarVisible ? t(Strings.expand) : t(Strings.hidden)} ${getShortcutKeyString(ShortcutActionName.ToggleCatalogPanel)}`}
                  placement={!sideBarVisible ? 'right' : 'bottom'}
                  arrowPointAtCenter
                >
                  <div
                    className={closeBtnClass}
                    onClick={() => {
                      handleSetSideBarByUser(!sideBarVisible, panelVisible);
                    }}
                    onMouseEnter={() => {
                      if (!sideBarVisible && !templeVisible) {
                        setTempleVisible(true);
                      }
                    }}
                    data-test-id="sidebar-toggle-btn"
                  >
                    {!sideBarVisible ? <ExpandOutlined /> : <CollapseOutlined />}
                  </div>
                </Tooltip>
              </div>
            }
            panelRight={<div className={styles.splitRight}>{children}</div>}
            split="vertical"
            minSize={335}
            defaultSize={defaultSidePanelSize}
            maxSize={640}
            style={{ overflow: 'none' }}
            pane2Style={{ overflow: 'hidden' }}
            size={!sideBarVisible ? 0 : defaultSidePanelSize}
            onChange={changeSplitPane}
            allowResize={sideBarVisible}
          />
        </SideBarContext.Provider>
      </ComponentDisplay>

      <ComponentDisplay maxWidthCompatible={ScreenSize.md}>
        <div className={styles.splitRight} style={{ flexDirection: 'column' }}>
          {children}
        </div>
      </ComponentDisplay>
    </div>
  );
};
