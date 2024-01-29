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

import { useLocalStorageState } from 'ahooks';
import classNames from 'classnames';
import { keyBy } from 'lodash';
import { useEffect, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { ContextMenu, Message, useThemeColors } from '@apitable/components';
import {
  CollaCommandName,
  ConfigConstant,
  IWidget,
  ResourceType,
  Selectors,
  Strings,
  t,
  WidgetPackageStatus,
  WidgetReleaseType,
} from '@apitable/core';
import {
  CodeFilled,
  DashboardOutlined,
  DeleteOutlined,
  DuplicateOutlined,
  EditOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
} from '@apitable/icons';
import { TriggerCommands } from 'modules/shared/apphook/trigger_commands';
import { EmitterEventName } from 'modules/shared/simple_emitter';
import { Modal } from 'pc/components/common';
import { ScreenSize } from 'pc/components/common/component_display';
import { simpleEmitter as panelSimpleEmitter } from 'pc/components/common/vika_split_panel';
import { expandWidgetRoute } from 'pc/components/widget/expand_widget';
import { useResponsive } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { flatContextData } from 'pc/utils';
import { WidgetContextProvider } from '../../context';
import { copyWidget, installToPanel } from '../../widget_center/install_utils';
import { expandPublishHelp } from '../../widget_center/widget_create_modal';
import { useJudgeReachInstalledCount } from '../hooks/use_judge_reach_installed_count';
import { openSendToDashboard } from '../send_to_dashboard';
import { simpleEmitter, WidgetItem } from '../widget_item';
import { installedWidgetHandle } from '../widget_panel_header';
import styles from './style.module.less';

const ResponsiveGridLayout: any = WidthProvider(Responsive);

export const WIDGET_MENU = 'WIDGET_MENU';

export const WidgetList = () => {
  const colors = useThemeColors();
  const { datasheetId, widgetId, mirrorId } = useAppSelector((state) => state.pageParams);
  const resourceId = mirrorId || datasheetId;
  const resourceType = mirrorId ? ResourceType.Mirror : ResourceType.Datasheet;
  const activeWidgetPanel = useAppSelector((state) => {
    return Selectors.getResourceActiveWidgetPanel(state, resourceId!, resourceType);
  })!;
  const widgetList = activeWidgetPanel.widgets;
  const { editable, manageable } = useAppSelector((state) => {
    return Selectors.getResourcePermission(state, datasheetId!, ResourceType.Datasheet);
  });
  const linkId = useAppSelector(Selectors.getLinkId);
  const hadWidgetExpanding = Boolean(widgetId);
  const [devWidgetId, setDevWidgetId] = useLocalStorageState<string>('devWidgetId');
  const [activeMenuWidget, setActiveMenuWidget] = useState<IWidget>();
  const widgetMap = useAppSelector((state) => state.widgetMap);
  const readonly = !editable;
  // Is scaling in.
  const [dragging, setDragging] = useState<boolean>(false);
  const reachLimitInstalledCount = useJudgeReachInstalledCount();

  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);

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

  const recordWidgetHeight = (widgetId: string, widgetHeight: number) => {
    resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.ChangeWidgetInPanelHeight,
      widgetHeight: widgetHeight,
      resourceId: resourceId!,
      resourceType,
      panelId: activeWidgetPanel.id,
      widgetId,
    });
  };

  const onResizeStop = (_layout: any, _oldItem: any, newItem: { i: string; h: number }) => {
    setDragging(false);
    recordWidgetHeight(newItem.i, newItem.h);
  };

  const deleteWidget = ({ props }: { props?: any }) => {
    const { widgetId, deleteCb } = props;
    Modal.confirm({
      title: t(Strings.delete_widget_title),
      content: t(Strings.delete_widget_content),
      onOk: () => {
        resourceService.instance!.commandManager.execute({
          cmd: CollaCommandName.DeleteWidget,
          resourceId: resourceId!,
          resourceType: resourceType,
          widgetId,
        });
        deleteCb?.();
      },
      type: 'danger',
    });
  };

  const onDragStop = (layout: any) => {
    setDragging(false);
    const layoutMap = keyBy(layout, 'i');
    const _layout = widgetList.map((item) => {
      const widgetPosition = layoutMap[item.id];
      return {
        id: widgetPosition.i,
        y: widgetPosition.y,
        height: widgetPosition.h,
      };
    });
    resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.MoveWidget,
      resourceId: resourceId!,
      resourceType,
      layout: _layout,
      panelId: activeWidgetPanel.id,
    });
  };

  const renameWidget = ({ props }: { props?: any }) => {
    const { renameCb } = props;
    renameCb && renameCb();
  };
  const isWidgetBan = () => WidgetPackageStatus.Ban === activeMenuWidget?.status;
  const isWidgetPublished = () => WidgetPackageStatus.Published === activeMenuWidget?.status;
  const isWidgetDev = () => activeMenuWidget?.id === devWidgetId;
  const isWidgetGlobal = () => Boolean(activeMenuWidget?.id && widgetMap[activeMenuWidget.id]?.widget.releaseType === WidgetReleaseType.Global);

  const _copyWidget = async (widgetId: string) => {
    const nodeId = mirrorId || datasheetId;
    let widgets;

    try {
      widgets = await copyWidget(widgetId, nodeId!);

      if (!widgets.length) {
        return;
      }

      await installToPanel(widgets[0], nodeId!, mirrorId ? ResourceType.Mirror : ResourceType.Datasheet);
    } catch (e: any) {
      Message.error({
        content: (typeof e === 'string' ? e : e?.message) || t(Strings.copy_widget_fail),
      });
      return;
    }

    installedWidgetHandle(widgets[0].id);

    Message.success({
      content: t(Strings.copy_widget_success),
    });
  };

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
      },
      {
        icon: <CodeFilled color={colors.thirdLevelText} />,
        text: t(Strings.widget_operate_exit_dev),
        hidden: readonly || isWidgetBan() || !isWidgetDev(),
        onClick: ({ props }: { props?: any }) => {
          props?.toggleWidgetDevMode(devWidgetId, setDevWidgetId);
          TriggerCommands.open_guide_wizard?.(ConfigConstant.WizardIdConstant.RELEASE_WIDGET_GUIDE);
        },
      },
      {
        icon: <EditOutlined color={colors.thirdLevelText} />,
        text: t(Strings.widget_operate_rename),
        hidden: readonly || isWidgetBan(),
        onClick: renameWidget,
      },
      {
        icon: <QuestionCircleOutlined color={colors.thirdLevelText} />,
        text: t(Strings.widget_operate_publish_help),
        hidden: readonly || !isWidgetDev(),
        onClick: () => {
          expandPublishHelp();
        },
      },
      {
        icon: <DuplicateOutlined color={colors.thirdLevelText} />,
        text: t(Strings.copy_widget),
        onClick: ({ props }: { props?: any }) => {
          const { widgetId } = props;
          _copyWidget(widgetId);
        },
        hidden: Boolean(linkId) || !isWidgetPublished() || isWidgetDev() || !manageable || reachLimitInstalledCount,
      },
      {
        icon: <DashboardOutlined color={colors.thirdLevelText} />,
        text: t(Strings.widget_operate_send_dashboard),
        onClick: ({ props }: { props?: any }) => {
          const { widgetId } = props;
          openSendToDashboard(widgetId);
        },
        hidden: Boolean(linkId) || !isWidgetPublished() || isWidgetDev(),
      },
    ],
    [
      {
        icon: <DeleteOutlined color={colors.thirdLevelText} />,
        text: t(Strings.widget_operate_delete),
        hidden: !manageable,
        onClick: deleteWidget,
      },
    ],
  ];

  return (
    <WidgetContextProvider>
      <div className={styles.widgetList}>
        <ResponsiveGridLayout
          cols={{
            lg: 1,
            md: 1,
            sm: 1,
            xs: 1,
            xxs: 1,
          }}
          layouts={{
            lg: widgetList!.map((item) => {
              return { w: 1, h: item.height, x: 0, y: item.y ?? 0, minH: 6.2, i: item.id };
            }),
          }}
          preventCollision={false}
          rowHeight={16}
          useCSSTransforms
          onDrag={() => setDragging(true)}
          onResizeStart={() => setDragging(true)}
          onResizeStop={onResizeStop}
          onDragStop={onDragStop}
          isBounded={false}
          draggableHandle={'.dragHandle'}
          draggableCancel={'.dragHandleDisabled'}
          isDroppable={manageable}
          isResizable={manageable}
          margin={[0, 24]}
        >
          {widgetList.map((item, index) => {
            const widgetMapItem = widgetMap?.[item.id]?.widget;
            const isDevMode = widgetMapItem?.status !== WidgetPackageStatus.Ban && devWidgetId === item.id;
            return (
              <div
                key={item.id}
                data-widget-id={item.id}
                data-guide-id="WIDGET_ITEM_WRAPPER"
                tabIndex={-1}
                className={classNames(styles.widgetItemWrap, widgetId === item.id && styles.isFullscreen)}
              >
                <WidgetItem
                  index={index}
                  widgetId={item.id}
                  widgetPanelId={activeWidgetPanel.id}
                  readonly={readonly}
                  config={{ isDevMode, hideMoreOperate: isMobile }}
                  setDevWidgetId={setDevWidgetId}
                  dragging={dragging}
                  setDragging={setDragging}
                  isMobile={isMobile}
                />
              </div>
            );
          })}
        </ResponsiveGridLayout>
        <ContextMenu overlay={flatContextData(menuData, true)} onShown={({ props }) => setActiveMenuWidget(props?.widget)} menuId={WIDGET_MENU} />
      </div>
    </WidgetContextProvider>
  );
};
