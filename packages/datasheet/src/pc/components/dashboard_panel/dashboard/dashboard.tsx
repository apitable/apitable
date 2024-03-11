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

import { useLocalStorageState, useMount, useUpdateEffect } from 'ahooks';
import { Drawer } from 'antd';
import classNames from 'classnames';
import { keyBy } from 'lodash';
import { EmitterEventName } from 'modules/shared/simple_emitter';
import React, { useEffect, useRef, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { ContextMenu, Message, useThemeColors } from '@apitable/components';
import {
  CollaCommandName,
  Events,
  IWidget,
  Navigation,
  PermissionType,
  Player,
  Selectors,
  StoreActions,
  Strings,
  t,
  WidgetApi,
  WidgetPackageStatus,
  WidgetReleaseType,
} from '@apitable/core';
import { AddOutlined, CodeFilled, DeleteOutlined, DuplicateOutlined, EditOutlined, GotoOutlined, SettingOutlined } from '@apitable/icons';
import { ScreenSize } from 'pc/components/common/component_display';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { simpleEmitter as panelSimpleEmitter } from 'pc/components/common/vika_split_panel';
import { Router } from 'pc/components/route_manager/router';
import { WidgetContextProvider } from 'pc/components/widget/context';
import { expandWidgetRoute } from 'pc/components/widget/expand_widget';
import { expandWidgetCenter, InstallPosition } from 'pc/components/widget/widget_center';
import { simpleEmitter, WidgetItem } from 'pc/components/widget/widget_panel/widget_item';
import { WIDGET_MENU } from 'pc/components/widget/widget_panel/widget_list';
import { installedWidgetHandle } from 'pc/components/widget/widget_panel/widget_panel_header';
import { useExpandWidget } from 'pc/hooks/use_expand_widget';
import { useQuery } from 'pc/hooks/use_home';
import { useResponsive } from 'pc/hooks/use_responsive';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { flatContextData } from 'pc/utils';
import 'react-grid-layout/css/styles.css';
import { getEnvVariables } from '../../../utils/env';
import { useTrackMissWidgetAndDep } from '../hooks';
import { RecommendWidgetPanel } from '../recommend_widget_panel';
import { TabBar } from '../tab_bar';
import { createWidgetByExistWidgetId } from '../utils';
import { DASHBOARD_PANEL_ID } from './id';
// @ts-ignore
import { isDingtalkSkuPage } from 'enterprise/home/social_platform/utils';
import styles from './style.module.less';
import { useAppSelector } from 'pc/store/react-redux';
export { DASHBOARD_PANEL_ID };

const ResponsiveGridLayout: any = WidthProvider(Responsive);

export const Dashboard = () => {
  const [visibleRecommend, setVisibleRecommend] = React.useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [allowChangeLayout, setAllowChangeLayout] = useState(false);
  const [activeMenuWidget, setActiveMenuWidget] = useState<IWidget>();
  const [dragging, setDragging] = useState<boolean>(false);
  const [disabledDraggle, setDisabledDraggle] = useState<boolean>(false);

  const dashboardPack = useAppSelector(Selectors.getDashboardPack);
  const dashboardLayout = useAppSelector(Selectors.getDashboardLayout);
  const { dashboardId, templateId, shareId, widgetId, embedId } = useAppSelector((state) => state.pageParams);
  const { editable, manageable } = useAppSelector(Selectors.getDashboardPermission);
  const spaceId = useAppSelector((state) => state.space.activeId);
  const widgetMap = useAppSelector((state) => state.widgetMap);
  const embedInfo = useAppSelector((state) => Selectors.getEmbedInfo(state));
  const linkId = useAppSelector(Selectors.getLinkId);
  const installedWidgetIds = useAppSelector(Selectors.getInstalledWidgetInDashboard);
  const reachInstalledLimit = installedWidgetIds && installedWidgetIds.length >= Number(getEnvVariables().DASHBOARD_WIDGET_MAX_NUM);

  const dashboardLayoutContainer = useRef<null | HTMLDivElement>(null);

  // Custom hooks start
  const colors = useThemeColors();
  const query = useQuery();
  const [devWidgetId, setDevWidgetId] = useLocalStorageState<string>('devWidgetId');
  const { screenIsAtMost } = useResponsive();
  useTrackMissWidgetAndDep();
  useExpandWidget();
  // Custom hooks end

  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const dashboard = dashboardPack?.dashboard;
  const isMobile = screenIsAtMost(ScreenSize.md);
  const hideReadonlyEmbedItem = !!(embedInfo && embedInfo.permissionType === PermissionType.READONLY);
  const readonly = isMobile || !editable || hideReadonlyEmbedItem || disabledDraggle;
  const connect = dashboardPack?.connected;
  const hasOpenRecommend = useRef(false);
  const purchaseToken = query.get('purchaseToken') || '';
  const isSkuPage = isDingtalkSkuPage?.(purchaseToken);

  const installedWidgetInDashboard = Boolean(dashboardLayout && dashboardLayout.length);

  const decisionOpenRecommend = () => {
    if (hasOpenRecommend.current) {
      return;
    }
    hasOpenRecommend.current = true;
    const dashboardIsEmpty = !(dashboardLayout && dashboardLayout.length);
    if (!dashboardIsEmpty || !manageable) {
      return;
    }
    WidgetApi.getRecentInstalledWidgets(spaceId!).then((res) => {
      const { data, success } = res.data;
      if (success) {
        store.getState();
        const isEditing = store.getState().catalogTree.editNodeId === dashboardId;
        setVisibleRecommend(Boolean(data.length));
        /**
         * TODO：Upgrading the antd version of the drawer to support a non-autofocus configuration will solve this, here is a temporary solution
         * If the current dashboard is in the process of being renamed
         * Because the current version of antd
         * The drawer will autofocus causing the renaming to be out of focus
         * So use the time delay to focus back in
         */
        setTimeout(() => {
          isEditing && dashboardId && store.dispatch(StoreActions.setEditNodeId(dashboardId));
        }, 0);
      }
    });
  };

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [embedInfo]);

  useEffect(() => {
    simpleEmitter.bind(EmitterEventName.ToggleWidgetDevMode, (widgetId) => {
      setDevWidgetId(widgetId);
    });
    return () => simpleEmitter.unbind(EmitterEventName.ToggleWidgetDevMode);
  }, [setDevWidgetId]);

  useEffect(() => {
    panelSimpleEmitter.bind(EmitterEventName.PanelDragging, (panelDragging) => {
      setDragging(panelDragging);
    });
    return () => panelSimpleEmitter.unbind(EmitterEventName.PanelDragging);
  }, [setDragging]);

  useMount(() => {
    Player.doTrigger(Events.datasheet_dashboard_panel_shown);
  });

  useUpdateEffect(() => {
    if (!connect) {
      return;
    }
    decisionOpenRecommend();
  }, [connect]);

  useEffect(() => {
    const dom = dashboardLayoutContainer.current;

    if (!dom) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;

      if (width <= 576) {
        setDisabledDraggle(true);
      } else {
        setDisabledDraggle(false);
      }
    });

    resizeObserver.observe(dom);
  }, []);

  const renameWidget = (arg: any) => {
    const {
      props: { renameCb },
    } = arg;
    renameCb && renameCb();
  };

  const jumpToDatasheet = (arg: any) => {
    const {
      props: { widgetId, pickerViewId },
    } = arg;
    const state = store.getState();
    const { shareId, templateId, categoryId } = state.pageParams;
    const spaceId = state.space.activeId;
    const widgetSnapshot = Selectors.getWidgetSnapshot(state, widgetId)!;
    const isMirrorWidget = widgetSnapshot.sourceId?.startsWith('mir');

    if (
      !Selectors.getPermissions(store.getState(), widgetSnapshot.datasheetId, undefined, isMirrorWidget ? widgetSnapshot.sourceId : undefined)
        ?.readable
    ) {
      return Message.warning({
        content: t(Strings.no_access_view),
      });
    }

    const nodeId = widgetSnapshot.sourceId || widgetSnapshot.datasheetId;
    if (shareId) {
      Router.push(Navigation.SHARE_SPACE, {
        params: { nodeId: nodeId, shareId, datasheetId: widgetSnapshot.datasheetId },
      });
    } else if (templateId) {
      Router.push(Navigation.TEMPLATE, {
        params: { nodeId: nodeId, spaceId, categoryId, templateId, datasheetId: widgetSnapshot.datasheetId },
      });
    } else {
      Router.push(Navigation.WORKBENCH, {
        params: { nodeId: nodeId, spaceId, datasheetId: widgetSnapshot.datasheetId, viewId: pickerViewId },
      });
    }
  };

  const widgetHasBindDstId = (widgetId: string) => {
    const state = store.getState();
    const widgetSnapshot = Selectors.getWidgetSnapshot(state, widgetId);
    return widgetSnapshot?.datasheetId;
  };

  const deleteWidget = (arg: any) => {
    const {
      props: { widgetId, deleteCb },
    } = arg;
    Modal.confirm({
      title: t(Strings.delete_widget_title),
      content: t(Strings.delete_widget_content),
      onOk: () => {
        resourceService.instance!.commandManager.execute({
          cmd: CollaCommandName.DeleteDashboardWidget,
          dashboardId: dashboardId!,
          widgetId,
        });
        deleteCb?.();
      },
      type: 'danger',
    });
  };

  const _copyWidget = async (widgetId: string) => {
    try {
      await createWidgetByExistWidgetId(widgetId, dashboardId!);
    } catch (e: any) {
      Message.error({
        content: typeof e === 'string' ? e : e?.message,
      });
      return;
    }

    Message.success({
      content: t(Strings.copy_widget_success),
    });
  };

  const isWidgetBan = () => WidgetPackageStatus.Ban === activeMenuWidget?.status;
  const isWidgetDev = () => activeMenuWidget?.id === devWidgetId;
  const hadWidgetExpanding = Boolean(widgetId);
  const isWidgetGlobal = () => Boolean(activeMenuWidget?.id && widgetMap[activeMenuWidget.id]?.widget.releaseType === WidgetReleaseType.Global);
  const menuData = [
    [
      {
        icon: <SettingOutlined color={colors.thirdLevelText} />,
        text: t(Strings.widget_operate_setting),
        hidden: readonly || hadWidgetExpanding,
        onClick: ({ props }: { props?: any }) => {
          const { widgetId } = props;
          props.toggleSetting();
          expandWidgetRoute(widgetId);
        },
      },
      {
        icon: <CodeFilled color={colors.thirdLevelText} />,
        text: t(Strings.widget_operate_enter_dev),
        hidden: readonly || isWidgetBan() || isWidgetDev() || isWidgetGlobal(),
        onClick: ({ props }: { props?: any }) => {
          props?.toggleWidgetDevMode(devWidgetId, setDevWidgetId);
        },
        disabled: (arg: any) => {
          const {
            props: { widgetId },
          } = arg;
          return !widgetHasBindDstId(widgetId);
        },
      },
      {
        icon: <CodeFilled color={colors.thirdLevelText} />,
        text: t(Strings.widget_operate_exit_dev),
        hidden: readonly || isWidgetBan() || !isWidgetDev(),
        onClick: ({ props }: { props?: any }) => {
          props?.toggleWidgetDevMode(devWidgetId, setDevWidgetId);
        },
      },
      {
        icon: <EditOutlined color={colors.thirdLevelText} />,
        text: t(Strings.widget_operate_rename),
        onClick: renameWidget,
        hidden: readonly,
      },
      {
        icon: <GotoOutlined color={colors.thirdLevelText} />,
        text: t(Strings.jump_link_url),
        onClick: jumpToDatasheet,
        hidden: embedId,
        disabled: (arg: any) => {
          const {
            props: { widgetId }
          } = arg;

          return !widgetHasBindDstId(widgetId);
        },
      },
      {
        icon: <DuplicateOutlined color={colors.thirdLevelText} />,
        text: t(Strings.copy_widget),
        onClick: ({ props }: { props?: any }) => {
          const { widgetId } = props;
          _copyWidget(widgetId);
        },
        hidden: Boolean(linkId) || isWidgetDev() || !manageable || reachInstalledLimit,
      },
      {
        icon: <DeleteOutlined color={colors.thirdLevelText} />,
        text: t(Strings.widget_operate_delete),
        onClick: deleteWidget,
        hidden: isMobile || !manageable,
      },
    ],
  ];

  const installWidget = () => {
    expandWidgetCenter(InstallPosition.Dashboard);
  };

  const onLayout = (_currLayout: any, allLayouts: { [x: string]: any }) => {
    if (!dashboardLayout || readonly) {
      return;
    }
    // Layout data prioritisation sm > md > lg
    const _currentLayout = allLayouts['sm'] || allLayouts['md'] || allLayouts['lg'];
    if (dashboardLayout.length !== _currentLayout.length) {
      return;
    }

    const isAllEqual = dashboardLayout.every((item, index) => {
      const _item = _currentLayout[index];
      return (
        item.column === _item.x &&
        (item.row === _item.y || item.row === Number.MAX_SAFE_INTEGER) &&
        item.id === _item.i &&
        item.heightInRoes === _item.h &&
        item.widthInColumns === _item.w
      );
    });
    if (isAllEqual) {
      return;
    }
    if (!allowChangeLayout) {
      return;
    }

    setAllowChangeLayout(false);
    console.log('layout is change', dashboardLayout, _currentLayout);

    const layoutMap = keyBy(_currentLayout, 'i');

    const _layout = dashboardLayout.map((item) => {
      const widgetPosition = layoutMap[item.id];
      return {
        id: widgetPosition.i,
        row: widgetPosition.y,
        column: widgetPosition.x,
        widthInColumns: widgetPosition.w,
        heightInRoes: widgetPosition.h,
      };
    });

    resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.ChangeDashboardLayout,
      dashboardId: dashboardId!,
      layout: _layout,
    });
  };

  if (dashboard == null) {
    return null;
  }

  return (
    <div
      style={{
        padding: isMobile || templateId || shareId || embedId ? 0 : 16,
        height: '100%',
        width: '100%',
        position: 'relative',
      }}
      id={DASHBOARD_PANEL_ID}
    >
      <div className={styles.dashboardPanel} ref={containerRef}>
        {(!embedId || embedInfo.viewControl?.tabBar) && (
          <TabBar
            dashboardId={dashboardId!}
            containerRef={containerRef}
            setVisibleRecommend={setVisibleRecommend}
            visibleRecommend={visibleRecommend}
            readonly={readonly}
            isMobile={isMobile}
            canImportWidget={manageable}
            setIsFullScreen={setIsFullScreen}
            installedWidgetHandle={installedWidgetHandle}
            reachInstalledLimit={reachInstalledLimit}
          />
        )}
        <WidgetContextProvider>
          <div
            className={styles.widgetArea}
            ref={dashboardLayoutContainer}
            style={{ pointerEvents: 'auto', height: !embedId || embedInfo.viewControl?.tabBar ? '' : '100%' }}
          >
            {installedWidgetInDashboard && (
              <ResponsiveGridLayout
                isDroppable={!readonly}
                isResizable={!readonly}
                isBounded
                isDraggable={!readonly}
                cols={{
                  lg: 12,
                  md: 12,
                  sm: 12,
                  xs: 1,
                  xxs: 1,
                  // lg: 12, md: 8, sm: 4, xs: 4, xxs: 4,
                }}
                breakpoints={{
                  lg: 992,
                  md: 768,
                  sm: 576,
                  xs: 400,
                }}
                layouts={{
                  lg: dashboardLayout!.map((item) => {
                    return {
                      w: item.widthInColumns,
                      h: item.heightInRoes,
                      x: item.column,
                      y: item.row,
                      minH: 6,
                      minW: 3,
                      i: item.id,
                    };
                  }),
                  xs: dashboardLayout!.map((item) => {
                    return { w: 1, h: item.heightInRoes, x: item.column, y: item.row, minH: 6, maxW: 1, i: item.id };
                  }),
                }}
                preventCollision={false}
                rowHeight={16}
                onLayoutChange={onLayout}
                useCSSTransforms
                draggableHandle={'.dragHandle'}
                draggableCancel={'.dragHandleDisabled'}
                margin={[24, 24]}
                containerPadding={[24, 24]}
                onDrag={() => setDragging(true)}
                onDragStart={() => {
                  setAllowChangeLayout(true);
                }}
                onResizeStart={() => {
                  setDragging(true);
                  setAllowChangeLayout(true);
                }}
                style={{ pointerEvents: isSkuPage ? 'none' : 'auto' }}
                onDragStop={() => setDragging(false)}
                onResizeStop={() => setDragging(false)}
              >
                {dashboardLayout!.map((item) => {
                  const isDevMode =
                    widgetMap?.[item.id]?.widget?.status !== WidgetPackageStatus.Ban && devWidgetId === item.id && !hideReadonlyEmbedItem;
                  return (
                    <div key={item.id} className={classNames(widgetId === item.id && styles.isFullscreen)} data-widget-id={item.id} tabIndex={-1}>
                      <WidgetItem
                        widgetId={item.id}
                        readonly={readonly}
                        isMobile={isMobile}
                        config={{
                          isDevMode,
                          hideMoreOperate: isFullScreen || hideReadonlyEmbedItem || !!(isMobile && embedId) || !!(embedId && readonly),
                          hideSetting: hideReadonlyEmbedItem,
                          hideEditName: hideReadonlyEmbedItem,
                        }}
                        setDevWidgetId={setDevWidgetId}
                        dragging={dragging}
                        setDragging={setDragging}
                      />
                    </div>
                  );
                })}
              </ResponsiveGridLayout>
            )}
            {!installedWidgetInDashboard && !readonly && (
              <div className={styles.addNewWidget} onClick={installWidget}>
                <AddOutlined size={68} color={colors.fourthLevelText} />
                {manageable ? t(Strings.add_widget) : t(Strings.no_permission_add_widget)}
              </div>
            )}
          </div>
        </WidgetContextProvider>
      </div>
      {!embedId && (
        <Drawer
          placement={'bottom'}
          closable={false}
          onClose={() => {
            setVisibleRecommend(false);
          }}
          visible={isMobile || !manageable ? false : visibleRecommend}
          key={'bottom'}
          getContainer={false}
          mask={false}
          height={312}
          style={{
            position: 'absolute',
            borderRadius: '8px 8px 0 0',
            boxShadow: '0px 2px 12px rgba(38, 38, 38, 0.1)',
            overflow: 'hidden',
          }}
          zIndex={11}
        >
          <RecommendWidgetPanel setVisibleRecommend={setVisibleRecommend} visibleRecommend={visibleRecommend} readonly={!manageable} />
        </Drawer>
      )}

      <ContextMenu overlay={flatContextData(menuData, true)} menuId={WIDGET_MENU} onShown={({ props }) => setActiveMenuWidget(props?.widget)} />
    </div>
  );
};
