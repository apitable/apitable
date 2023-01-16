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

import { colorVars, TextButton, useThemeColors } from '@apitable/components';
import {
  CollaCommandName,
  DATASHEET_ID,
  Events,
  ExecuteResult,
  FieldType,
  IDatasheetClientState,
  IGalleryViewProperty,
  IGridViewProperty,
  IKanbanViewProperty,
  IViewProperty,
  LayoutType,
  Player,
  ResourceType,
  RowHeightLevel,
  Selectors,
  StoreActions,
  Strings,
  t,
  UN_GROUP,
  ViewType,
} from '@apitable/core';
import { ApiOutlined, ChevronDownOutlined, RecoverOutlined, RobotOutlined, SettingFilled, WidgetOutlined } from '@apitable/icons';
import { useMount, useSize, useThrottleFn } from 'ahooks';
import classNames from 'classnames';
import { ShortcutActionManager, ShortcutActionName } from 'modules/shared/shortcut_key';
import { closeAllExpandRecord } from 'pc/components/expand_record/utils';
import { MirrorList } from 'pc/components/mirror/mirror_list';
import { getFieldTypeIcon } from 'pc/components/multi_grid/field_setting';
import { useShowViewLockModal } from 'pc/components/view_lock/use_show_view_lock_modal';
import { SideBarClickType, SideBarType, useSideBar } from 'pc/context';
import { useResponsive } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { setStorage, StorageName } from 'pc/utils/storage/storage';
import * as React from 'react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import IconAdd from 'static/icon/datasheet/addrow.svg';
import GalleryListIcon from 'static/icon/datasheet/gallery/datasheet_icon_list.svg';
import SettingIcon from 'static/icon/datasheet/gallery/datasheet_icon_setting.svg';
import GalleryIcon from 'static/icon/datasheet/gallery/datasheet_icon_tiling.svg';
import FiltrationIcon from 'static/icon/datasheet/viewtoolbar/datasheet_icon_filter_normal.svg';
import GroupIcon from 'static/icon/datasheet/viewtoolbar/datasheet_icon_group_normal.svg';
import HideIcon from 'static/icon/datasheet/viewtoolbar/datasheet_icon_hide_normal.svg';
import RankIcon from 'static/icon/datasheet/viewtoolbar/datasheet_icon_rank_normal.svg';
import ShareIcon from 'static/icon/datasheet/viewtoolbar/datasheet_icon_share_normal.svg';
import { Share } from '../catalog/share';
import { Collapse, ICollapseFunc } from '../common/collapse';
import { ScreenSize } from '../common/component_display';
import { expandRecordIdNavigate } from '../expand_record';
import { showKanbanSetting } from '../kanban_view';
import { getRowHeightIcon } from './change_row_height';
import { Display } from './display/display';
import { Find } from './find';
import { ForeignForm } from './foreign_form';
import { useDisabledOperateWithMirror } from './hooks';
import { ToolHandleType } from './interface';
import styles from './style.module.less';
import { ToolItem } from './tool_item';
import { Undo } from './undo';
import { get } from 'lodash';
import { getEnvVariables, isIframe } from 'pc/utils/env';

// Toolbar label and icon adaptation rules when in-table lookup is activated.
// width:[1180,+infinity) -> Show all.
// width:[1080,1180) -> Hide only the text of the right tool.
// width:[763,1080) -> Hide the text of the left and right side tools,
// display only the icon, and do not automatically collapse the right working directory.
// width:[540,763) -> Uncollapsed working directory: Show only the icon and collapse the working directory on the right automatically.
// Already collapsed working directory: Hide all tools on the right side.
// width:(0,540) -> Uncollapsed working directory: only the left working icon is displayed, all tools on the right are hidden.
const HIDDEN_TOOLBAR_LEFT_LABEL_WIDTH = 1080;
export const HIDDEN_TREE_WIDTH = 763;
const HIDDEN_TOOLBAR_RIGHT_WIDTH = 465;
const OFFSET_INPUT_WIDTH = 230;
const SIDERBAR_WIDTH = 333;

const ToolbarBase = () => {
  const colors = useThemeColors();
  const collapseRef = useRef<ICollapseFunc>(null);
  // Whether to show the sharing modal box.
  const [shareNodeId, setShareNodeId] = useState('');
  const [isFindOpen, setIsFindOpen] = useState(false);
  const [iconRotation, setIconRotation] = useState(false);
  const [winWidth, setWinWidth] = useState(0);
  const { shareId, templateId, datasheetId, viewId, mirrorId, embedId } = useSelector(state => {
    const { shareId, templateId, datasheetId, viewId, mirrorId, embedId } = state.pageParams;
    return {
      shareId,
      templateId,
      datasheetId,
      viewId,
      mirrorId,
      embedId
    };
  }, shallowEqual);

  const spaceId = useSelector(state => state.space.activeId);
  const treeNodesMap = useSelector(state => state.catalogTree.treeNodesMap);
  const activeView: IViewProperty = useSelector(state => Selectors.getCurrentView(state))!;
  const actualColumnCount = activeView.columns.length;
  const ganttViewStatus = useSelector(state => Selectors.getGanttViewStatus(state));
  const calendarViewStatus = useSelector(state => Selectors.getCalendarViewStatus(state));
  const orgChartViewStatus = useSelector(state => Selectors.getOrgChartViewStatus(state));
  const kanbanViewStatus = useSelector(state => Selectors.getKanbanViewStatus(state));
  const hiddenGroupMap = (activeView as IKanbanViewProperty).style?.hiddenGroupMap;
  const isGalleryView = activeView && activeView.type === ViewType.Gallery;
  const isKanbanView = activeView && activeView.type === ViewType.Kanban;
  const isGridView = activeView && activeView.type === ViewType.Grid;
  const isGanttView = activeView && activeView.type === ViewType.Gantt;
  const isCalendarView = activeView && activeView.type === ViewType.Calendar;
  const isOrgView = activeView && activeView.type === ViewType.OrgChart;
  const visibleColumnsCount = useSelector(state =>
    isCalendarView ? Selectors.getCalendarVisibleColumnCount(state) : Selectors.getVisibleColumnCount(state),
  );
  const visibleGanttColumnsCount = useSelector(state => (isGanttView ? Selectors.getGanttVisibleColumnCount(state) : 0));
  const isExitGroup = 'groupInfo' in activeView && activeView.groupInfo?.length;
  const permissions = useSelector(state => Selectors.getPermissions(state, datasheetId));
  const activeNodeId = useSelector(state => Selectors.getNodeId(state));
  const isApiPanelOpen = useSelector(state => state.space.isApiPanelOpen);
  const isWidgetPanel = useSelector(state => {
    const { mirrorId, datasheetId } = state.pageParams;
    const resourceType = mirrorId ? ResourceType.Mirror : ResourceType.Datasheet;
    const resourceId = mirrorId || datasheetId || '';
    return Selectors.getResourceWidgetPanelStatus(state, resourceId, resourceType)?.opening;
  });
  const widgetCount = useSelector(state => {
    const { datasheetId, mirrorId } = state.pageParams;
    const resourceId = mirrorId || datasheetId;
    const resourceType = mirrorId ? ResourceType.Mirror : ResourceType.Datasheet;

    if (!resourceId) {
      return 0;
    }

    const widgetPanel = Selectors.getResourceWidgetPanels(state, resourceId, resourceType);
    if (!widgetPanel) {
      return 0;
    }
    return widgetPanel.reduce((total, item) => total + item.widgets.length, 0);
  });
  const { isRobotPanelOpen, isTimeMachinePanelOpen } = useSelector(state => {
    const clientState = Selectors.getDatasheetClient(state);
    return clientState || ({} as IDatasheetClientState);
  });
  const isSideRecordOpen = useSelector(state => state.space.isSideRecordOpen);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const nodeShared = useSelector(state => {
    if (mirrorId) {
      return Boolean(Selectors.getMirror(state, mirrorId)?.nodeShared);
    }
    const datasheet = Selectors.getDatasheet(state);
    return datasheet!.nodeShared;
  });
  const visualizationEditable = permissions.visualizationEditable || permissions.editable;
  const kanbanFieldId = useSelector(state => Selectors.getKanbanFieldId(state));
  const groupIds = useSelector(Selectors.getKanbanGroupMapIds);
  const keepSort = activeView.sortInfo && activeView.sortInfo.keepSort;
  const size = useSize(toolbarRef);
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const { sideBarVisible, onSetToggleType, onSetClickType, onSetSideBarVisibleByOhter, toggleType } = useSideBar();
  const offsetWidth = isFindOpen ? 0 : OFFSET_INPUT_WIDTH;
  const hiddenRightToolbar = Boolean(
    size && size.width && (size.width < HIDDEN_TOOLBAR_RIGHT_WIDTH || (size.width < HIDDEN_TREE_WIDTH - SIDERBAR_WIDTH && !sideBarVisible)),
  );
  const showIconBarLabel = Boolean(size && size.width && size.width > HIDDEN_TOOLBAR_LEFT_LABEL_WIDTH - offsetWidth);
  const showViewLockModal = useShowViewLockModal();

  const hiddenKanbanGroupCount = useMemo(() => {
    return Object.keys(hiddenGroupMap || {})
      .filter(id => id === UN_GROUP || (groupIds || []).includes(id))
      .reduce((acc, key) => acc + (hiddenGroupMap?.[key] ? 1 : 0), 0);
  }, [groupIds, hiddenGroupMap]);

  const dispatch = useDispatch();

  const embedInfo = useSelector(state => Selectors.getEmbedInfo(state));

  // The logic of inserting rows in the toolbar is special and is handled here by itself.
  // Always in the first, no grouped data is brought in.
  const appendRecord = () => {
    const state = store.getState();
    const view = Selectors.getCurrentView(state)!;
    const collaCommandManager = resourceService.instance!.commandManager;
    const result = collaCommandManager.execute({
      cmd: CollaCommandName.AddRecords,
      count: 1,
      viewId: view.id,
      index: 0,
    });
    if (result.result === ExecuteResult.Success) {
      const newRecordId = result.data && result.data[0];
      // Requirement change: Toolbar insert line, always expand the card (don't delete the following).
      expandRecordIdNavigate(newRecordId);
      // const rowsMap = Selectors.getVisibleRowsIndexMap(store.getState());
      // const newRecordIndex = rowsMap[newRecordId];
      // console.log({ newRecordIndex });
      // const groupInfo = Selectors.getActiveViewGroupInfo(state)!;
      // const hasGroup = Boolean(groupInfo.length);
      // // Position change ｜ Under the grouping, expand directly.
      // if (newRecordIndex !== 0 || hasGroup) {
      //   expandRecordRoute(newRecordId);
      // } else {
      //   appendRowCallback(newRecordId);
      // }
    }
  };

  const disabledWithMirror = useDisabledOperateWithMirror();

  useMount(() => {
    if (activeView.autoSave) {
      return;
    }
    Player.doTrigger(Events.viewset_manual_save_tip);
  });

  const toggleGanttSetting = () => {
    if (ganttViewStatus) {
      const settingPanelVisible = !ganttViewStatus.settingPanelVisible;
      dispatch(StoreActions.toggleGanttSettingPanel(settingPanelVisible, datasheetId!));
      setStorage(StorageName.GanttStatusMap, {
        [`${spaceId}_${datasheetId}_${viewId}`]: {
          ...ganttViewStatus,
          settingPanelVisible,
        },
      });
    }
  };

  // calendarViewStatus
  const toggleCalendarSetting = () => {
    if (calendarViewStatus) {
      const { settingPanelVisible, gridVisible } = calendarViewStatus;
      dispatch(StoreActions.toggleCalendarSettingPanel(!settingPanelVisible, datasheetId!));
      if (!settingPanelVisible && gridVisible) {
        dispatch(StoreActions.toggleCalendarGrid(false, datasheetId!));
      }
      setStorage(StorageName.CalendarStatusMap, {
        [`${spaceId}_${datasheetId}_${viewId}`]: {
          ...calendarViewStatus,
          settingPanelVisible: !settingPanelVisible,
          gridVisible: settingPanelVisible,
        },
      });
    }
  };

  // OrgChartViewStatus
  const toggleOrgChartSetting = () => {
    if (orgChartViewStatus) {
      const { settingPanelVisible, rightPanelVisible: gridVisible } = orgChartViewStatus;
      dispatch(StoreActions.toggleOrgChartSettingPanel(!settingPanelVisible, datasheetId!));
      if (!settingPanelVisible && gridVisible) {
        dispatch(StoreActions.toggleOrgChartRightPanel(false, datasheetId!));
      }
      setStorage(StorageName.OrgChartStatusMap, {
        [`${spaceId}_${datasheetId}_${viewId}`]: {
          ...orgChartViewStatus,
          settingPanelVisible: !settingPanelVisible,
          rightPanelVisible: settingPanelVisible,
        },
      });
    }
  };

  const toggleKanbanGroupSettingVisible = () => {
    if (kanbanViewStatus) {
      const { groupSettingVisible } = kanbanViewStatus;
      dispatch(StoreActions.toggleKanbanGroupingSettingVisible(datasheetId!, !groupSettingVisible));
    }
  };

  const findClick = () => {
    setIsFindOpen(true);
    if (
      onSetSideBarVisibleByOhter &&
      onSetClickType &&
      onSetToggleType &&
      size?.width &&
      size.width < HIDDEN_TREE_WIDTH - offsetWidth &&
      sideBarVisible &&
      !isMobile
    ) {
      // Forced default for users to click.
      onSetToggleType(SideBarType.User);
      onSetClickType(SideBarClickType.FindInput);
      onSetSideBarVisibleByOhter(!sideBarVisible);
    }
  };

  // Click on the blank to close the search.
  const handleWrapClick = (e: React.MouseEvent) => {
    const classname = e.target && (e.target as HTMLElement).className;
    const ele = collapseRef.current;
    const focusType = ele?.getFocusElementType();
    if (typeof classname === 'string' && classname.includes('COLLAPSE') && isFindOpen && focusType !== 'INPUT') {
      setIsFindOpen(false);
      ele?.clearFocusElementType();
    }
  };

  // Listening for page changes when the toolbar width meets the requirements.
  const handleListenSize = useCallback(() => {
    const windowWidth = document.documentElement.offsetWidth;
    if (onSetSideBarVisibleByOhter && windowWidth !== winWidth && ![SideBarType.User, SideBarType.UserWithoutPanel].includes(toggleType)) {
      onSetSideBarVisibleByOhter(windowWidth > 1000);
    }
    setWinWidth(windowWidth);
  }, [toggleType, onSetSideBarVisibleByOhter, winWidth, setWinWidth]);

  const { run, cancel } = useThrottleFn(handleListenSize, { wait: 300 });

  useEffect(() => {
    setWinWidth(document.documentElement.offsetWidth);
    // Window size
    window.addEventListener('resize', run);
    return () => {
      window.removeEventListener('resize', run);
      cancel();
    };
  }, [run, cancel]);

  // With the sidebar open, you need to close the search bar.
  useEffect(() => {
    if (sideBarVisible && isFindOpen && size?.width && size.width < HIDDEN_TREE_WIDTH - offsetWidth) {
      setIsFindOpen(false);
    }
  }, [setIsFindOpen, sideBarVisible, toggleType, isFindOpen, size, offsetWidth]);

  // Mutually exclusive with the right-hand area.
  const handleToggleRightBar = (toggleKey: ShortcutActionName) => {
    // Close sidebar.
    if (isSideRecordOpen) {
      store.dispatch(StoreActions.toggleSideRecord(false));
      closeAllExpandRecord();
    }

    const panelMap = {
      [ShortcutActionName.ToggleApiPanel]: isApiPanelOpen,
      [ShortcutActionName.ToggleWidgetPanel]: isWidgetPanel,
      [ShortcutActionName.ToggleRobotPanel]: isRobotPanelOpen,
      [ShortcutActionName.ToggleTimeMachinePanel]: isTimeMachinePanelOpen,
    };
    Object.keys(panelMap).forEach((key: string) => {
      if (panelMap[key] && key !== toggleKey) {
        ShortcutActionManager.trigger(key as ShortcutActionName);
      }
    });

    onSetClickType && onSetClickType(SideBarClickType.ToolBar);
    ShortcutActionManager.trigger(toggleKey);
  };

  const embedSetting = useMemo(() => {
    const defaultValue = {
      basicTools: true,
      shareBtn: true,
      widgetBtn: true,
      apiBtn: true,
      formBtn: true,
      historyBtn: true,
      robotBtn: true
    };
    if (!embedId) {
      return defaultValue;
    }
    return {
      basicTools: get(embedInfo, 'viewControl.toolBar.basicTools', false),
      shareBtn: get(embedInfo, 'viewControl.toolBar.shareBtn', false),
      widgetBtn: get(embedInfo, 'viewControl.toolBar.widgetBtn', false),
      apiBtn: get(embedInfo, 'viewControl.toolBar.apiBtn', false),
      formBtn: get(embedInfo, 'viewControl.toolBar.formBtn', false),
      historyBtn: get(embedInfo, 'viewControl.toolBar.historyBtn', false),
      robotBtn: get(embedInfo, 'viewControl.toolBar.robotBtn', false)
    };

  }, [embedInfo, embedId]);

  // The configuration array traversal for rendering, you need to manually specify a non-repeating key for the component,
  // usually the component name can be, repeatedly rendered components are followed by a number.
  const featureToolItems = [
    {
      component: (
        <Find
          key='find'
          className={styles.toolbarItem}
          showLabel={showIconBarLabel}
          onOpen={findClick}
          isFindOpen={isFindOpen}
          setIsFindOpen={setIsFindOpen}
        />
      ),
      label: t(Strings.find),
      key: 'find',
      show: true,
    },
    {
      component: <ForeignForm key='foreignForm' className={styles.toolbarItem} showLabel={showIconBarLabel} />,
      key: 'foreignForm',
      show: isGridView && !shareId && !templateId && !mirrorId && !embedId,
    },
    {
      component: <MirrorList key='mirror' className={styles.toolbarItem} showLabel={showIconBarLabel} />,
      key: 'mirror',
      show: !shareId && !templateId && !mirrorId && !embedId,
    },
    {
      component: (
        <ToolItem
          key='api'
          icon={<ApiOutlined size={16} className={styles.toolIcon} />}
          text={'API'}
          // onClick={() => ShortcutActionManager.trigger(ShortcutActionName.ToggleApiPanel)}
          onClick={() => handleToggleRightBar(ShortcutActionName.ToggleApiPanel)}
          className={classNames({ [styles.toolbarItem]: true, [styles.apiActive]: isApiPanelOpen })}
          showLabel={showIconBarLabel}
          id={DATASHEET_ID.API_BTN}
          disabled={!permissions.editable}
        />
      ),
      key: 'api',
      show: !isGanttView && !shareId && !templateId && !mirrorId && embedSetting.apiBtn,
    },
    {
      component: (
        <ToolItem
          key='widget'
          icon={<WidgetOutlined size={16} className={styles.toolIcon} />}
          text={widgetCount > 0 ? t(Strings.widget_num, { count: widgetCount }) : t(Strings.widget_tip)}
          // onClick={() => ShortcutActionManager.trigger(ShortcutActionName.ToggleWidgetPanel)}
          onClick={() => handleToggleRightBar(ShortcutActionName.ToggleWidgetPanel)}
          className={classNames({ [styles.toolbarItem]: true, [styles.apiActive]: isWidgetPanel })}
          id={DATASHEET_ID.WIDGET_BTN}
          showLabel={showIconBarLabel}
        />
      ),
      key: 'widget',
      show: embedSetting.widgetBtn,
    },
    {
      component: (
        <ToolItem
          key='robot'
          icon={<RobotOutlined size={16} />}
          text={t(Strings.robot_feature_entry)}
          onClick={() => handleToggleRightBar(ShortcutActionName.ToggleRobotPanel)}
          className={classNames({ [styles.toolbarItem]: true, [styles.apiActive]: isRobotPanelOpen })}
          id={DATASHEET_ID.ROBOT_BTN}
          showLabel={showIconBarLabel}
          disabled={!permissions.editable}
        />
      ),
      key: 'robot',
      show: !mirrorId && !shareId && !templateId && embedSetting.robotBtn, // Open the portal only in the preview environment before going online.
    },
    {
      component: (
        <ToolItem
          key='timeMachine'
          icon={<RecoverOutlined size={16} />}
          text={t(Strings.time_machine)}
          onClick={() => handleToggleRightBar(ShortcutActionName.ToggleTimeMachinePanel)}
          className={classNames({ [styles.toolbarItem]: true, [styles.apiActive]: isTimeMachinePanelOpen })}
          id={DATASHEET_ID.TIME_MACHINE_BTN}
          showLabel={showIconBarLabel}
          disabled={!permissions.editable}
        />
      ),
      key: 'timeMachine',
      show: !mirrorId && !shareId && !templateId && embedSetting.historyBtn && getEnvVariables().TIME_MACHINE_VISIBLE
    },
  ];

  return (
    <div className={styles.toolbar} id={DATASHEET_ID.VIEW_TOOL_BAR} ref={toolbarRef}>
      {!isMobile && embedSetting.basicTools && !isIframe() && <Undo className={styles.toolbarLeft} />}

      <div className={classNames(styles.toolbarMiddle, { [styles.toolbarOnlyIcon]: !showIconBarLabel })}>
        {isGalleryView && embedSetting.basicTools &&
          !isMobile &&
          GalleryLayoutNode(activeView! as IGalleryViewProperty, showIconBarLabel, !visualizationEditable || disabledWithMirror)}
        {!isOrgView && !isCalendarView && !isGalleryView && !isKanbanView && !isMobile && embedSetting.basicTools && !isIframe() && (
          <ToolItem
            showLabel={showIconBarLabel}
            disabled={!permissions.rowCreatable}
            className={styles.toolbarItem}
            onClick={appendRecord}
            icon={<IconAdd width={16} height={16} fill={colors.secondLevelText} className={styles.toolIcon} />}
            text={isGanttView ? t(Strings.gantt_add_record) : t(Strings.insert_record)}
            id={'toolInsertRecord'}
          />
        )}
        {isKanbanView && kanbanFieldId && !isMobile && embedSetting.basicTools && (
          <ToolItem
            showLabel={showIconBarLabel}
            className={styles.toolbarItem}
            disabled={!visualizationEditable || disabledWithMirror}
            onClick={() => {
              (activeView as IKanbanViewProperty).style.kanbanFieldId && showKanbanSetting();
            }}
            icon={getKanbanIcon(kanbanFieldId, datasheetId!)}
            text={t(Strings.kanban_group_tip, {
              kanban_field_id: getKanbanFieldType(kanbanFieldId, datasheetId!),
            })}
            showViewLockModal={showViewLockModal}
          />
        )}
        {isGanttView && !isMobile && embedSetting.basicTools && (
          <ToolItem
            showLabel={showIconBarLabel}
            className={styles.toolbarItem}
            disabled={!visualizationEditable || disabledWithMirror}
            isActive={ganttViewStatus?.settingPanelVisible}
            onClick={toggleGanttSetting}
            icon={<SettingFilled size={16} className={styles.toolIcon} />}
            text={t(Strings.gantt_setting)}
            showViewLockModal={showViewLockModal}
          />
        )}
        {isCalendarView && !isMobile && embedSetting.basicTools && (
          <ToolItem
            showLabel={showIconBarLabel}
            className={styles.toolbarItem}
            disabled={!visualizationEditable || disabledWithMirror}
            isActive={calendarViewStatus?.settingPanelVisible}
            onClick={toggleCalendarSetting}
            icon={<SettingFilled size={16} className={styles.toolIcon} />}
            text={t(Strings.calendar_setting)}
            showViewLockModal={showViewLockModal}
          />
        )}
        {isOrgView && !isMobile && embedSetting.basicTools && (
          <ToolItem
            id={DATASHEET_ID.TOOL_BAR_VIEW_SETTING}
            showLabel={showIconBarLabel}
            icon={<SettingIcon width={16} height={16} fill={colors.secondLevelText} className={styles.toolIcon} />}
            text={t(Strings.org_chart_setting)}
            disabled={!visualizationEditable || disabledWithMirror}
            isActive={orgChartViewStatus?.settingPanelVisible}
            className={styles.toolbarItem}
            onClick={toggleOrgChartSetting}
            showViewLockModal={showViewLockModal}
          />
        )}
        {!((isCalendarView || isGanttView) && isMobile) && embedSetting.basicTools && (
          <Display type={ToolHandleType.HideField}>
            {/**
             * Component writing needs to be wrapped under div (rc-trigger restriction used in Display).
             * Detailed information: https://github.com/react-component/trigger/blob/55ed22f53975e2aab241aea791eee4500d10eef7/src/index.tsx#L853
             */}
            <div>
              <HideFieldNode
                id={'toolHideField'}
                viewType={activeView!.type}
                type={ToolHandleType.HideField}
                actualColumnCount={actualColumnCount}
                visibleColumnsCount={visibleColumnsCount}
                showLabel={showIconBarLabel}
                disabled={!visualizationEditable || disabledWithMirror}
                showViewLockModal={showViewLockModal}
              />
            </div>
          </Display>
        )}
        {isGanttView && embedSetting.basicTools && (
          <Display type={ToolHandleType.HideExclusiveField}>
            <div>
              <HideFieldNode
                id={'toolHideExclusiveField'}
                viewType={activeView!.type}
                type={ToolHandleType.HideExclusiveField}
                actualColumnCount={actualColumnCount}
                visibleColumnsCount={visibleGanttColumnsCount}
                showLabel={showIconBarLabel}
                disabled={!visualizationEditable || disabledWithMirror}
                showViewLockModal={showViewLockModal}
              />
            </div>
          </Display>
        )}

        {isKanbanView && (
          <Display type={ToolHandleType.HiddenKanbanGroup}>
            <div>
              <ToolItem
                id={'toolKanbanGroupSetting'}
                showLabel={showIconBarLabel}
                disabled={!visualizationEditable || disabledWithMirror}
                isActive={hiddenKanbanGroupCount > 0}
                onClick={toggleKanbanGroupSettingVisible}
                className={classNames(styles.filter, styles.toolbarItem, 'toolBarFilter')}
                icon={<HideIcon width={16} height={16} fill={colors.primaryColor} className={styles.toolIcon} />}
                text={
                  hiddenKanbanGroupCount > 0 ? t(Strings.hidden_groups_by_count, { count: hiddenKanbanGroupCount }) : t(Strings.hide_kanban_grouping)
                }
              />
            </div>
          </Display>
        )}

        {!isOrgView && embedSetting.basicTools && (
          <Display type={ToolHandleType.ViewFilter}>
            <div>
              <FilterNode
                showLabel={showIconBarLabel}
                disabled={!visualizationEditable || disabledWithMirror}
                showViewLockModal={showViewLockModal}
              />
            </div>
          </Display>
        )}

        {!isOrgView && !isCalendarView && !isKanbanView && !isMobile && embedSetting.basicTools && (
          <Display type={ToolHandleType.ViewGroup}>
            <ToolItem
              id={'toolGroup'}
              showLabel={showIconBarLabel}
              isActive={Boolean(isExitGroup)}
              disabled={!visualizationEditable || disabledWithMirror}
              className={classNames({
                [styles.toolbarItem]: true,
              })}
              icon={
                <GroupIcon width={16} height={16} className={styles.toolIcon} fill={isExitGroup ? colors.primaryColor : colors.secondLevelText} />
              }
              text={
                isExitGroup
                  ? t(Strings.group_amount, {
                    amount: (activeView as IGridViewProperty).groupInfo!.length,
                  })
                  : t(Strings.group)
              }
              showViewLockModal={showViewLockModal}
            />
          </Display>
        )}
        {!isOrgView && !isCalendarView && embedSetting.basicTools && (
          <Display type={ToolHandleType.ViewSort}>
            <ToolItem
              id={'toolSort'}
              showLabel={showIconBarLabel}
              disabled={!visualizationEditable || disabledWithMirror}
              isActive={Boolean(keepSort)}
              className={classNames({
                [styles.toolbarItem]: true,
              })}
              icon={<RankIcon width={16} height={16} fill={keepSort ? colors.primaryColor : colors.secondLevelText} className={styles.toolIcon} />}
              text={keepSort && !isMobile ? t(Strings.sort_count_tip, { count: activeView.sortInfo!.rules.length }) : t(Strings.sort)}
              showViewLockModal={showViewLockModal}
            />
          </Display>
        )}
        {!isOrgView && !isCalendarView && !isKanbanView && !isGalleryView && !isMobile && embedSetting.basicTools && (
          <Display type={ToolHandleType.ChangeRowHeight}>
            <ToolItem
              id={'toolRowHeight'}
              showLabel={showIconBarLabel}
              disabled={!visualizationEditable || disabledWithMirror}
              className={styles.toolbarItem}
              icon={getRowHeightIcon((activeView as IGridViewProperty).rowHeightLevel || RowHeightLevel.Short, {
                fill: colors.secondLevelText,
                className: styles.toolIcon,
                width: '16',
                height: '16',
              })}
              text={t(Strings.row_height)}
              showViewLockModal={showViewLockModal}
            />
          </Display>
        )}
        {!shareId && !templateId && activeNodeId && treeNodesMap[activeNodeId] && embedSetting.shareBtn && !isIframe() && (
          <Display type={ToolHandleType.Share}>
            <ToolItem
              showLabel={showIconBarLabel}
              icon={
                <ShareIcon
                  width={16}
                  height={16}
                  fill={nodeShared ? colors.primaryColor : colors.secondLevelText}
                  className={styles.toolIcon}
                />
              }
              text={t(Strings.share)}
              disabled={!permissions.sharable}
              isActive={nodeShared}
              className={styles.toolbarItem}
            />
          </Display>
        )}
      </div>
      <Share nodeId={shareNodeId} onClose={() => setShareNodeId('')} />
      {!isMobile && (
        <div
          className={styles.toolbarRight}
          style={{
            display: hiddenRightToolbar ? 'none' : 'inherit',
          }}
        >
          <Collapse
            ref={collapseRef}
            wrapClick={handleWrapClick}
            wrapClassName='COLLAPSE'
            wrapStyle={{ height: 30 }}
            id='tool_bar'
            collapseItemClassName={classNames({ [styles.toolbarOnlyIcon]: !showIconBarLabel })}
            data={featureToolItems.filter(v => v.show && v.component).map(v => ({ key: v.key, text: v.component }))}
            unSortable
            trigger={
              <TextButton
                size='x-small'
                suffixIcon={<ChevronDownOutlined className={classNames(styles.viewArrow, { [styles.viewArrowActive]: iconRotation })} />}
                id={DATASHEET_ID.VIEW_LIST_SHOW_BTN}
                data-test-id={DATASHEET_ID.VIEW_LIST_SHOW_BTN}
                style={{ fontSize: 14, padding: '0 4px', height: '100%' }}
              >
                {t(Strings.advanced_features)}
              </TextButton>
            }
            onPopupVisibleChange={setIconRotation}
            align='flex-end'
            fixedIndex={1}
            popupClassName={styles.collapsePopup}
            popupItemClassName={styles.collapsePopupItem}
          />
        </div>
      )}
    </div>
  );
};

export const Toolbar = memo(ToolbarBase);

function GalleryLayoutNode(activeView: IViewProperty, showLabel: boolean, disabled: boolean) {
  if (activeView.type !== ViewType.Gallery) {
    return <></>;
  }
  return (
    <Display type={ToolHandleType.GallerySetting}>
      <ToolItem
        showLabel={showLabel}
        disabled={disabled}
        className={styles.toolbarItem}
        icon={
          activeView.style.layoutType === LayoutType.List ? (
            <GalleryListIcon width={15} height={15} className={styles.toolIcon} fill={colorVars.secondLevelText} />
          ) : (
            <GalleryIcon width={15} height={15} className={styles.toolIcon} fill={colorVars.secondLevelText} />
          )
        }
        text={t(Strings.layout)}
      />
    </Display>
  );
}

function FilterNode(props: { showLabel: boolean; disabled: boolean; showViewLockModal: boolean }) {
  const { disabled, showLabel } = props;

  const { filterInfo } = useSelector(state => {
    return {
      filterInfo: Selectors.getFilterInfo(state, state.pageParams.datasheetId!),
    };
  });
  if (!filterInfo || !filterInfo.conditions.length) {
    return (
      <ToolItem
        id={'toolFilter'}
        showLabel={showLabel}
        disabled={disabled}
        className={classNames(styles.filter, styles.toolbarItem, 'toolBarFilter')}
        icon={<FiltrationIcon width={16} height={16} fill={colorVars.secondLevelText} className={styles.toolIcon} />}
        text={t(Strings.filter)}
      />
    );
  }

  const { conditions } = filterInfo;
  const actualFilterCont = conditions.length;

  return (
    <ToolItem
      id={'toolFilter'}
      showLabel={showLabel}
      disabled={disabled}
      isActive
      className={classNames(styles.filter, styles.toolbarItem, 'toolBarFilter')}
      icon={<FiltrationIcon width={16} height={16} fill={colorVars.primaryColor} className={styles.toolIcon} />}
      text={
        isMobile
          ? t(Strings.filter)
          : t(Strings.filters_amount, {
            amount: actualFilterCont,
          })
      }
    />
  );
}

const HideFieldNode = ({ id, type, viewType, actualColumnCount, visibleColumnsCount, showLabel, disabled, showViewLockModal }) => {
  const hidedAmount = actualColumnCount - visibleColumnsCount;
  const hasHide = !(hidedAmount === 0);
  const isGridType = viewType === ViewType.Grid;
  const isGanttType = viewType === ViewType.Gantt;
  const isCalendarType = viewType === ViewType.Calendar;
  const isOrgType = viewType === ViewType.OrgChart;
  const isExclusive = type === ToolHandleType.HideExclusiveField;
  const hideFieldString = isGanttType && isExclusive ? Strings.hide_one_graphic_field : Strings.hide_fields;
  const toolName = isMobile ? t(Strings.tool_bar_hidden) : t(hideFieldString);
  const hideFieldAmountString = isGanttType && isExclusive ? Strings.hidden_graphic_fields_amount : Strings.hidden_fields_amount;

  return (
    <ToolItem
      id={id}
      showLabel={showLabel}
      isActive={(isGridType || isGanttType || isCalendarType) && hasHide}
      disabled={disabled}
      className={classNames({
        [styles.toolbarItem]: true,
        [styles.hide]: true,
      })}
      icon={
        isGridType || isGanttType || isCalendarType || isOrgType ? (
          <HideIcon width={16} height={16} fill={hasHide ? colorVars.primaryColor : colorVars.secondLevelText} className={styles.toolIcon} />
        ) : (
          <SettingIcon width={16} height={16} fill={colorVars.secondLevelText} className={styles.toolIcon} />
        )
      }
      text={
        isGridType || isGanttType || isCalendarType
          ? hasHide && !isMobile
            ? t(hideFieldAmountString, { amount: hidedAmount })
            : toolName
          : t(Strings.custom_style)
      }
    />
  );
};

function getKanbanIcon(kanbanFieldId: string, datasheetId: string) {
  if (!kanbanFieldId) {
    return;
  }
  const field = Selectors.getField(store.getState(), kanbanFieldId);
  return getFieldTypeIcon(field.type, colorVars.secondLevelText);
}

function getKanbanFieldType(kanbanFieldId: string, datasheetId: string) {
  if (!kanbanFieldId) {
    return;
  }
  const field = Selectors.getField(store.getState(), kanbanFieldId);
  return field.type === FieldType.Member ? t(Strings.member) : t(Strings.field_title_single_select);
}
