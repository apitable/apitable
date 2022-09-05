import { colorVars, TextButton, useThemeColors } from '@vikadata/components';
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
} from '@vikadata/core';
import { ApiOutlined, ChevronDownOutlined, RecoverOutlined, RobotOutlined, SettingFilled, WidgetOutlined } from '@vikadata/icons';
import { useMount, useSize, useThrottleFn } from 'ahooks';
import classNames from 'classnames';
import { ShortcutActionManager, ShortcutActionName } from 'pc/common/shortcut_key';
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

// 当激活表内查找时，工具栏label与icon适配规则
// width:[1180,+infinity)->显示所有
// width:[1080,1180)->只隐藏右边工具的文字
// width:[763,1080)->隐藏左右边工具的文字，只显示icon，不自动折叠右边工作目录
// width:[540,763)->未折叠工作目录：只显示icon，并自动折叠右边工作目录。已经折叠了工作目录：隐藏右边所有工具
// width:(0,540)->未折叠工作目录：只显示左边工作icon，右边所有工具隐藏
const HIDDEN_TOOLBAR_LEFT_LABEL_WIDTH = 1080;
export const HIDDEN_TREE_WIDTH = 763;
const HIDDEN_TOOLBAR_RIGHT_WIDTH = 465;
const OFFSET_INPUT_WIDTH = 230;
const SIDERBAR_WIDTH = 333;

const ToolbarBase = () => {
  const colors = useThemeColors();
  const collapseRef = useRef<ICollapseFunc>(null);
  // 是否显示分享模态框
  const [shareNodeId, setShareNodeId] = useState('');
  const [isFindOpen, setIsFindOpen] = useState(false);
  const [iconRotation, setIconRotation] = useState(false);
  const [winWidth, setWinWidth] = useState(0);
  const { shareId, templateId, datasheetId, viewId, mirrorId } = useSelector(state => {
    const { shareId, templateId, datasheetId, viewId, mirrorId } = state.pageParams;
    return {
      shareId,
      templateId,
      datasheetId,
      viewId,
      mirrorId,
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
  // 工具栏插入行的逻辑比较特殊，这里自己处理。始终在第一个、不带入分组数据。
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
      // 需求变更：工具栏插入行，始终展开卡片（下面的别删
      expandRecordIdNavigate(newRecordId);
      // const rowsMap = Selectors.getVisibleRowsIndexMap(store.getState());
      // const newRecordIndex = rowsMap[newRecordId];
      // console.log({ newRecordIndex });
      // const groupInfo = Selectors.getActiveViewGroupInfo(state)!;
      // const hasGroup = Boolean(groupInfo.length);
      // // 位置变化 ｜ 分组下，直接展开。
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
      // 强制默认为用户点击
      onSetToggleType(SideBarType.User);
      onSetClickType(SideBarClickType.FindInput);
      onSetSideBarVisibleByOhter(!sideBarVisible);
    }
  };

  // 点击空白处关闭搜索
  const handleWrapClick = (e: React.MouseEvent) => {
    const classname = e.target && (e.target as HTMLElement).className;
    const ele = collapseRef.current;
    const focusType = ele?.getFocusElementType();
    if (typeof classname === 'string' && classname.includes('COLLAPSE') && isFindOpen && focusType !== 'INPUT') {
      setIsFindOpen(false);
      ele?.clearFocusElementType();
    }
  };

  // 监听页面变化时工具栏宽度是否满足要求
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
    // 窗口大小
    window.addEventListener('resize', run);
    return () => {
      window.removeEventListener('resize', run);
      cancel();
    };
  }, [run, cancel]);

  // 侧边栏打开情况下，需要关闭搜索栏
  useEffect(() => {
    if (sideBarVisible && isFindOpen && size?.width && size.width < HIDDEN_TREE_WIDTH - offsetWidth) {
      setIsFindOpen(false);
    }
  }, [setIsFindOpen, sideBarVisible, toggleType, isFindOpen, size, offsetWidth]);

  // 右侧互斥
  const handleToggleRightBar = (toggleKey: ShortcutActionName) => {
    // 关闭侧边栏
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

  // 该配置数组遍历进行渲染，需要给 component 手动指定不重复的 key，一般为组件名称即可，重复渲染的组件在后面加上数字
  const featureToolItems = [
    {
      component: (
        <Find
          key="find"
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
      component: <ForeignForm key="foreignForm" className={styles.toolbarItem} showLabel={showIconBarLabel} />,
      key: 'foreignForm',
      show: isGridView && !shareId && !templateId && !mirrorId,
    },
    {
      component: <MirrorList key="mirror" className={styles.toolbarItem} showLabel={showIconBarLabel} />,
      key: 'mirror',
      show: !shareId && !templateId && !mirrorId,
    },
    {
      component: (
        <ToolItem
          key="api"
          icon={<ApiOutlined size={16} className={styles.toolIcon} />}
          text={'API'}
          // onClick={() => ShortcutActionManager.trigger(ShortcutActionName.ToggleApiPanel)}
          onClick={() => handleToggleRightBar(ShortcutActionName.ToggleApiPanel)}
          className={classNames({ [styles.toolbarItem]: true, [styles.apiActive]: isApiPanelOpen })}
          showLabel={showIconBarLabel}
          id={DATASHEET_ID.API_BTN}
        />
      ),
      key: 'api',
      show: !isGanttView && !shareId && !templateId && !mirrorId,
    },
    {
      component: (
        <ToolItem
          key="widget"
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
      show: true,
    },
    {
      component: (
        <ToolItem
          key="robot"
          icon={<RobotOutlined size={16} />}
          text={t(Strings.robot_feature_entry)}
          onClick={() => handleToggleRightBar(ShortcutActionName.ToggleRobotPanel)}
          className={classNames({ [styles.toolbarItem]: true, [styles.apiActive]: isRobotPanelOpen })}
          id={DATASHEET_ID.ROBOT_BTN}
          showLabel={showIconBarLabel}
        />
      ),
      key: 'robot',
      show: !mirrorId && !shareId && !templateId, // 上线前只在预览环境开启入口
    },
    {
      component: (
        <ToolItem
          key="timeMachine"
          icon={<RecoverOutlined size={16} />}
          text={t(Strings.time_machine)}
          onClick={() => handleToggleRightBar(ShortcutActionName.ToggleTimeMachinePanel)}
          className={classNames({ [styles.toolbarItem]: true, [styles.apiActive]: isTimeMachinePanelOpen })}
          id={DATASHEET_ID.TIME_MACHINE_BTN}
          showLabel={showIconBarLabel}
        />
      ),
      key: 'timeMachine',
      show: !mirrorId && !shareId && !templateId && permissions.editable,
    },
  ];

  return (
    <div className={styles.toolbar} id={DATASHEET_ID.VIEW_TOOL_BAR} ref={toolbarRef}>
      {!isMobile && <Undo className={styles.toolbarLeft} />}

      <div className={classNames(styles.toolbarMiddle, { [styles.toolbarOnlyIcon]: !showIconBarLabel })}>
        {isGalleryView &&
          !isMobile &&
          GalleryLayoutNode(activeView! as IGalleryViewProperty, showIconBarLabel, !visualizationEditable || disabledWithMirror)}
        {!isOrgView && !isCalendarView && !isGalleryView && !isKanbanView && !isMobile && (
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
        {isKanbanView && kanbanFieldId && !isMobile && (
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
        {isGanttView && !isMobile && (
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
        {isCalendarView && !isMobile && (
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
        {isOrgView && !isMobile && (
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
        {!((isCalendarView || isGanttView) && isMobile) && (
          <Display type={ToolHandleType.HideField}>
            {/**
             * 组件写法需要用 div 包裹下（Display 中使用的 rc-trigger 限制）
             * 详细信息：https://github.com/react-component/trigger/blob/55ed22f53975e2aab241aea791eee4500d10eef7/src/index.tsx#L853
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
        {isGanttView && (
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

        {!isOrgView && (
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

        {!isOrgView && !isCalendarView && !isKanbanView && !isMobile && (
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
        {!isOrgView && !isCalendarView && (
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
        {!isOrgView && !isCalendarView && !isKanbanView && !isGalleryView && !isMobile && (
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
        {!shareId && !templateId && activeNodeId && treeNodesMap[activeNodeId] && (
          <ToolItem
            showLabel={showIconBarLabel}
            icon={<ShareIcon width={16} height={16} fill={nodeShared ? colors.primaryColor : colors.secondLevelText} className={styles.toolIcon} />}
            text={t(Strings.share)}
            disabled={!permissions.sharable}
            isActive={nodeShared}
            className={styles.toolbarItem}
            onClick={() => permissions.sharable && setShareNodeId(activeNodeId)}
          />
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
            wrapClassName="COLLAPSE"
            wrapStyle={{ height: 30 }}
            id="tool_bar"
            collapseItemClassName={classNames({ [styles.toolbarOnlyIcon]: !showIconBarLabel })}
            data={featureToolItems.filter(v => v.show && v.component).map(v => ({ key: v.key, text: v.component }))}
            unSortable
            trigger={
              <TextButton
                size="x-small"
                suffixIcon={<ChevronDownOutlined className={classNames(styles.viewArrow, { [styles.viewArrowActive]: iconRotation })} />}
                id={DATASHEET_ID.VIEW_LIST_SHOW_BTN}
                data-test-id={DATASHEET_ID.VIEW_LIST_SHOW_BTN}
                style={{ fontSize: 14, padding: '0 4px', height: '100%' }}
              >
                {t(Strings.advanced_features)}
              </TextButton>
            }
            onPopupVisibleChange={setIconRotation}
            align="flex-end"
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
