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

import { useMount } from 'ahooks';
import classNames from 'classnames';
import { ShortcutActionManager, ShortcutActionName } from 'modules/shared/shortcut_key';
import { getShortcutKeyString } from 'modules/shared/shortcut_key/keybinding_config';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { LinkButton, useTheme } from '@apitable/components';
import { Api, AutoTestID, Events, IReduxState, Navigation, Player, StoreActions, Strings, t } from '@apitable/core';
import { CollapseOpenOutlined, CollapseOutlined } from '@apitable/icons';
import { TComponent } from 'pc/components/common/t_component';
import { Navigation as SiderNavigation } from 'pc/components/navigation';
import { Router } from 'pc/components/route_manager/router';
import WorkspaceRoute from 'pc/components/route_manager/workspace_route';
import { expandUpgradeSpace } from 'pc/components/space_manage/upgrade_space/expand_upgrade_space';
import Trash from 'pc/components/trash/trash';
import { ISideBarContextProps, SideBarClickType, SideBarContext, SideBarType } from 'pc/context';
import { getPageParams, useCatalogTreeRequest, useQuery, useRequest, useResponsive } from 'pc/hooks';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { StorageMethod, StorageName, getStorage, setStorage } from 'pc/utils/storage/storage';
import UpgradeSucceedDark from 'static/icon/workbench/workbench_upgrade_succeed_dark.png';
import UpgradeSucceedLight from 'static/icon/workbench/workbench_upgrade_succeed_light.png';
import { Tooltip, VikaSplitPanel } from '../common';
import { ComponentDisplay, ScreenSize } from '../common/component_display';
import { CommonSide } from '../common_side';
import { usePaymentReminder } from './hooks/usePaymentReminder';
// @ts-ignore
import { showOrderModal } from 'enterprise/subscribe_system/order_modal/pay_order_success';
import styles from './style.module.less';

// Restore the user's last opened datasheet.
const resumeUserHistory = (path: string) => {
  const state = store.getState();
  const user = state.user.info!;
  const spaceId = state.space.activeId;
  const { nodeId, datasheetId, viewId, recordId, widgetId, mirrorId } = getPageParams(path);
  if (spaceId === user.spaceId) {
    if (mirrorId) {
      Router.replace(Navigation.WORKBENCH, {
        params: {
          spaceId: spaceId || user.spaceId,
          nodeId: mirrorId,
          datasheetId: datasheetId || user.activeNodeId,
          viewId: viewId || user.activeViewId,
          recordId,
          widgetId,
        },
      });
      return;
    }
    Router.replace(Navigation.WORKBENCH, {
      params: {
        spaceId: spaceId || user.spaceId,
        nodeId: nodeId || user.activeNodeId,
        viewId: viewId || user.activeViewId,
        recordId,
        widgetId,
      },
    });
  } else {
    Router.replace(Navigation.WORKBENCH, {
      params: {
        spaceId,
        nodeId,
        viewId,
        recordId,
      },
    });
  }
};

export const Workspace: React.FC<React.PropsWithChildren<unknown>> = () => {
  const dispatch = useDispatch();
  const localSize = getStorage(StorageName.SplitPos);
  const defaultSidePanelSize = localSize && localSize !== 280 ? localSize : 335;
  const editNodeId = useAppSelector((state: IReduxState) => state.catalogTree.editNodeId);
  const favoriteEditNodeId = useAppSelector((state: IReduxState) => state.catalogTree.favoriteEditNodeId);
  const userSpaceId = useAppSelector((state: IReduxState) => state.user.info!.spaceId);
  const { getTreeDataReq } = useCatalogTreeRequest();
  const { run: getTreeData } = useRequest(getTreeDataReq, { manual: true });
  const { screenIsAtMost } = useResponsive();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [templeVisible, setTempleVisible] = useState(false);
  const isMobile = screenIsAtMost(ScreenSize.md);
  const query = useQuery();
  const router = useRouter();
  const theme = useTheme();
  const spaceInfo = useAppSelector((state) => state.space.curSpaceInfo);
  const social = spaceInfo?.social;

  // Directory tree toggle source status, directory tree click status, sidebar switch.
  const [toggleType, setToggleType] = useState<SideBarType>(SideBarType.None);
  const [clickType, setClickType] = useState<SideBarClickType>(SideBarClickType.None);
  const [panelVisible, setPanelVisible] = useState(false);
  const [newTdbId, setNewTdbId] = useState('');
  const sideBarVisible = useAppSelector((state) => state.space.sideBarVisible);
  const showUpgradeSpaceModal = useRef(false);

  usePaymentReminder();

  useEffect(() => {
    if (showUpgradeSpaceModal.current) return;
    if (!query.get('choosePlan') || isMobile) return;
    if (!social || social?.appType === 1 || social?.appType === 2) {
      return;
    }
    showUpgradeSpaceModal.current = true;
    expandUpgradeSpace();
  });

  useMount(() => {
    if (!query.get('stripePaySuccess') || isMobile) return;
    showOrderModal({
      modalTitle: t(Strings.upgrade_success_model, { orderType: t(Strings.upgrade) }),
      modalSubTitle: () => (
        <>
          <div className={styles.desc1} style={{ marginTop: 24, fontSize: 16 }}>
            {
              <TComponent
                tkey={t(Strings.upgrade_success_1_desc)}
                params={{
                  orderType: t(Strings.upgrade),
                  position: (
                    <LinkButton
                      className={styles.linkButton}
                      style={{
                        display: 'inline-block',
                      }}
                      onClick={() => {
                        if (isMobile) {
                          return;
                        }
                        Router.redirect(Navigation.SPACE_MANAGE, { params: { pathInSpace: 'overview' }, clearQuery: true });
                      }}
                    >
                      {t(Strings.space_overview)}
                    </LinkButton>
                  ),
                }}
              />
            }
          </div>
        </>
      ),
      qrCodeUrl: '',
      illustrations: (
        <img
          width={'250px'}
          src={theme.palette.type === 'light' ? UpgradeSucceedLight.src : UpgradeSucceedDark.src}
          style={{ marginTop: 16 }}
          alt="Upgrade Succeed"
        />
      ),
      btnText: t(Strings.got_it),
    });
  });

  /**
   * Directory Tree Switch Source - Users.
   */
  const handleSetSideBarByUser = (visible: boolean, panel?: boolean) => {
    // To determine the type of directory tree switch,
    // if the right panel is expanded or the right panel is closed and
    // the user closes the directory tree at the same time,
    // it is considered as a user click operation and the expanded and
    // closed panels should not affect the directory tree state.
    const resToggleType = panel || (!panel && sideBarVisible) ? SideBarType.User : SideBarType.UserWithoutPanel;
    setToggleType(resToggleType);
    // If the right panel is not expanded or if the right panel is expanded and
    // the directory tree is also expanded,
    // set the click type of the directory tree switch to be considered a user action.
    if (!panel || (panel && sideBarVisible)) {
      setClickType(SideBarClickType.User);
    }
    setStorage(StorageName.IsPanelClosed, visible, StorageMethod.Set);
    dispatch(StoreActions.setSideBarVisible(visible));
  };

  /**
   * Directory Tree Switch Source - Panel.
   */
  const handleSetSideBarByOther = (visible: boolean) => {
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
      // From a notification, then mark the notification as read.
      Api.transferNoticeToRead([notifyId]);
    }
  });

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [sideBarVisible]);

  // Binding/unbinding shortcut keys.
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
    }
    // eslint-disable-next-line
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
    newTdbId,
    setNewTdbId,
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
          {/* TODO: `SplitPane` directly set `pane1Style` add animation will lead to the problem
           that can not be dragged, the next version to solve. 0.4 temporarily do not add animation */}
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
                    {!sideBarVisible ? <CollapseOpenOutlined /> : <CollapseOutlined />}
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
