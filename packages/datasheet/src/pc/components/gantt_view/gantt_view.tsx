import { useTheme } from '@vikadata/components';
import {
  BasicValueType,
  CellType,
  CollaCommandName,
  DateUnitType,
  DEFAULT_WORK_DAYS,
  Events,
  Field,
  ICell,
  IGanttViewProperty,
  ILinearRowRecord,
  ISetRecordOptions,
  KONVA_DATASHEET_ID,
  Player,
  RowHeightLevel,
  Selectors,
  StoreActions,
  Strings,
  t,
  ViewType,
} from '@vikadata/core';
import { useCreation, useMount, useUpdate, useUpdateEffect } from 'ahooks';
import classNames from 'classnames';
import { isEqual } from 'lodash';
import {
  cancelTimeout,
  GanttCoordinate,
  getDetailByTargetName,
  getGanttGroupId,
  getLinearRowHeight,
  getTimeStampOfDate,
  ICellScrollState,
  ISplitterProps,
  KonvaGanttViewContext,
  requestTimeout,
} from 'pc/components/gantt_view';
import GanttStage from 'pc/components/gantt_view/gantt_stage/gantt_stage';
import {
  DEFAULT_POINT_POSITION,
  DEFAULT_TOOLTIP_PROPS,
  DomGrid,
  GRID_BOTTOM_STAT_HEIGHT,
  GRID_ROW_HEAD_WIDTH,
  GRID_SCROLL_REMAIN_SPACING,
  GridCoordinate,
  IDraggingOutlineInfoProps,
  IndicesMap,
  ITooltipInfo,
  KonvaGridContext,
  KonvaGridViewContext,
  useGridMessage,
  useScrollbarTip,
} from 'pc/components/konva_grid';
import { useDisabledOperateWithMirror } from 'pc/components/tool_bar';
import { useDispatch, useResponsive, useSetState } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { getStorage, setStorage, StorageName } from 'pc/utils/storage/storage';
import { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isMobile as isTouchDevice } from 'react-device-detect';
import { shallowEqual, useSelector } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import { VikaSplitPanel } from '../common';
import { ScreenSize } from '../common/component_display/component_display';
import { IContainerEdit } from '../editors';
import { useWxTitleMap } from '../konva_grid/hooks/use_wx_title_map';
import { GanttExport, SettingPanel } from './components';
import { CreateFieldModal } from './components/create_field_modal';
import { GANTT_HEADER_HEIGHT, GANTT_MONTH_HEADER_HEIGHT } from './constant';
import { DomGantt } from './dom_gantt';
import { useGanttScroller } from './hooks/use_gantt_scroller';
import {
  AreaType,
  CellBound,
  IGanttGroupMap,
  IScrollHandler,
  IScrollOptions,
  IScrollState,
  PointPosition,
  ScrollViewType,
  TimeoutID,
  ITaskLineSetting,
  ITargetTaskInfo,
} from './interface';
import styles from './style.module.less';
import { getAllTaskLine, getAllCycleDAG, autoTaskScheduling, getCollapsedLinearRows } from './utils';
import { Message } from 'pc/components/common';
interface IGanttViewProps {
  height: number;
  width: number;
}

export const getGanttHeaderHeight = (dateUnitType: DateUnitType): number => {
  return [DateUnitType.Month, DateUnitType.Week].includes(dateUnitType) ? GANTT_MONTH_HEADER_HEIGHT : GANTT_HEADER_HEIGHT;
};

export const DEFAULT_SCROLL_STATE = {
  scrollTop: 0,
  scrollLeft: 0,
  isScrolling: false,
};

export const GanttView: FC<IGanttViewProps> = memo(props => {
  const { width: _containerWidth, height: containerHeight } = props;
  const {
    datasheetId,
    gridVisibleColumns,
    ganttVisibleColumns,
    fieldMap,
    entityFieldMap,
    linearRows,
    ganttLinearRows,
    permissions,
    rowHeightLevel,
    rowHeight,
    activeCell,
    selection,
    ganttStyle,
    recordMap,
    visibleRows,
    recordRanges,
    rowsIndexMap,
    visibleRowsIndexMap,
    selectRanges,
    fillHandleStatus,
    gridViewDragState,
    groupInfo,
    sortInfo,
    view,
    spaceId,
    isSearching,
    groupCollapseIds,
    snapshot,
    ganttViewStatus,
    currentSearchCell,
    fieldPermissionMap,
    selectRecordIds,
    recordMoveType,
    isEditing,
    allowShowCommentPane,
    fieldRanges,
    fieldIndexMap,
    filterInfo,
    collaboratorCursorMap,
    groupBreakpoint,
    visibleRecordIds,
    mirrorId,
    isViewLock,
    exportViewId,
  } = useSelector(state => {
    const datasheetId = Selectors.getActiveDatasheetId(state)!;
    const view = Selectors.getCurrentView(state)! as IGanttViewProperty;
    const rowHeightLevel = view.rowHeightLevel || RowHeightLevel.Short;
    return {
      datasheetId,
      gridVisibleColumns: Selectors.getVisibleColumns(state),
      ganttVisibleColumns: Selectors.getGanttVisibleColumns(state),
      fieldMap: Selectors.getFieldMap(state, datasheetId)!,
      entityFieldMap: Selectors.getFieldMapIgnorePermission(state)!,
      linearRows: Selectors.getLinearRows(state),
      ganttLinearRows: Selectors.getGanttLinearRows(state),
      permissions: Selectors.getPermissions(state),
      rowHeightLevel,
      rowHeight: Selectors.getGanttRowHeightFromLevel(rowHeightLevel),
      activeCell: Selectors.getActiveCell(state),
      selection: Selectors.getSelection(state),
      ganttStyle: Selectors.getGanttStyle(state)!,
      visibleRows: Selectors.getVisibleRows(state),
      recordRanges: Selectors.getSelectionRecordRanges(state),
      rowsIndexMap: Selectors.getLinearRowsIndexMap(state),
      visibleRowsIndexMap: Selectors.getPureVisibleRowsIndexMap(state),
      selectRanges: Selectors.getSelectRanges(state),
      fillHandleStatus: Selectors.getFillHandleStatus(state),
      gridViewDragState: Selectors.getGridViewDragState(state),
      groupInfo: Selectors.getActiveViewGroupInfo(state),
      recordMap: Selectors.getSnapshot(state)!.recordMap,
      sortInfo: Selectors.getActiveViewSortInfo(state),
      view: Selectors.getCurrentView(state)!,
      spaceId: state.space.activeId!,
      mirrorId: state.pageParams.mirrorId!,
      isSearching: Boolean(Selectors.getSearchKeyword(state)),
      groupCollapseIds: Selectors.getGroupingCollapseIds(state),
      snapshot: Selectors.getSnapshot(state)!,
      ganttViewStatus: Selectors.getGanttViewStatus(state)!,
      fieldIndexMap: Selectors.getVisibleColumnsMap(state),
      currentSearchCell: Selectors.getCurrentSearchItem(state),
      fieldPermissionMap: Selectors.getFieldPermissionMap(state),
      selectRecordIds: Selectors.getSelectRecordIds(state),
      recordMoveType: Selectors.getRecordMoveType(state),
      isEditing: Boolean(Selectors.getEditingCell(state)),
      allowShowCommentPane: Selectors.allowShowCommentPane(state),
      fieldRanges: Selectors.getFieldRanges(state),
      filterInfo: Selectors.getFilterInfo(state),
      collaboratorCursorMap: Selectors.collaboratorCursorSelector(state),
      groupBreakpoint: Selectors.getGroupBreakpoint(state),
      visibleRecordIds: Selectors.getVisibleRowIds(state),
      isViewLock: Boolean(view.lockInfo),
      exportViewId: Selectors.getDatasheetClient(state)?.exportViewId,
    };
  }, shallowEqual);
  const disabledSettingPanelWithMirror = useDisabledOperateWithMirror();
  const state = store.getState();
  const { screenIsAtMost } = useResponsive();
  const isMobile = screenIsAtMost(ScreenSize.md);
  const { startFieldId, endFieldId, workDays = DEFAULT_WORK_DAYS, onlyCalcWorkDay, autoTaskLayout, linkFieldId } = ganttStyle;
  const rowCount = linearRows.length; // 总行数
  const dispatch = useDispatch();
  const {
    gridVisible: _gridVisible,
    settingPanelVisible: _settingPanelVisible,
    settingPanelWidth: _settingPanelWidth,
    dateUnitType,
  } = ganttViewStatus;
  const { visualizationEditable, editable } = permissions;
  const settingPanelVisible = (visualizationEditable || editable) && _settingPanelVisible;
  const settingPanelWidth = isMobile ? 0 : _settingPanelWidth;
  const containerWidth = _containerWidth; // 考虑 2px border
  const ganttViewWidth = settingPanelVisible ? containerWidth - settingPanelWidth : containerWidth;
  const gridVisible = !isMobile && _gridVisible; // 移动端不展示左侧任务栏
  const { autoHeadHeight } = view as IGanttViewProperty;

  // 左侧任务栏总宽度
  const gridTotalWidth = useMemo(() => {
    return gridVisibleColumns.reduce((pre, cur) => pre + Selectors.getColumnWidth(cur), GRID_ROW_HEAD_WIDTH);
  }, [gridVisibleColumns]);

  const draftGridWidth = Math.min(gridTotalWidth, Math.round(containerWidth * 0.4));
  const gridWidth = gridVisible ? draftGridWidth : 0;
  const ganttWidth = gridVisible ? ganttViewWidth - gridWidth : ganttViewWidth;

  /**
   * 这里使用完整的 fieldMap，包含没有权限的列
   * 之前逻辑：
   * 若检测到无日期字段，就会弹出创建日期的弹窗
   * 当前兼容的情况：
   * 兼容用户没有对应日期列的权限，但此时不需要弹出弹窗，因为有日期列存在
   */
  const dateTimeTypeFields = useMemo(
    () =>
      Object.values(entityFieldMap).filter(field => {
        return [Field.bindModel(field).basicValueType, Field.bindModel(field).innerBasicValueType].includes(BasicValueType.DateTime);
      }),
    [entityFieldMap],
  );

  // 设置新增一行的行为状态
  const [canAppendRow, setCanAppendRow] = useState(true);

  // Refs
  const containerRef = useRef<any>();
  const domGridRef = useRef<IContainerEdit | null>(null); // Grid Dom
  const gridHorizontalBarRef = useRef<any>(); // 任务区域横向滚动条
  const ganttHorizontalBarRef = useRef<any>(); // 图形区域横向滚动条
  const verticalBarRef = useRef<any>(); // 纵向滚动条
  const cellVerticalBarRef = useRef<any>(); // 单元格纵向滚动条
  const resetScrollingTimeoutID = useRef<TimeoutID | null>(null); // 滚动定时器，当滚动时，禁止 stage 的事件监听

  // Hooks
  const forceRender = useUpdate();
  const [ganttScrollState, setGanttScrollState] = useSetState<IScrollState>(DEFAULT_SCROLL_STATE);
  const [gridScrollState, setGridScrollState] = useSetState<IScrollState>(DEFAULT_SCROLL_STATE);
  const [cellScrollState, setCellScrollState] = useSetState<ICellScrollState>({
    scrollTop: 0,
    totalHeight: 0,
    isOverflow: false,
  });
  const { scrollLeft, scrollTop, isScrolling } = ganttScrollState;
  // 落点
  const [pointPosition, setPointPosition] = useState<PointPosition>({
    areaType: AreaType.None,
    realAreaType: AreaType.None,
    targetName: KONVA_DATASHEET_ID.GANTT_BLANK,
    realTargetName: KONVA_DATASHEET_ID.GANTT_BLANK,
    rowIndex: -1,
    columnIndex: -1,
    x: 0,
    y: 0,
    offsetTop: 0,
    offsetLeft: 0,
  });

  // 用于标识开始选区或填充的状态
  const [isCellDown, setCellDown] = useState<boolean>(false);
  // DOM 坐标系中的 tooltip
  const [tooltipInfo, setTooltipInfo] = useSetState<ITooltipInfo>(DEFAULT_TOOLTIP_PROPS);
  // 任务列宽度拖拽过程中的高亮分割线
  const [dragSplitterInfo, setDragSplitterInfo] = useSetState<ISplitterProps>({ x: -1, visible: false });
  const [activeCellBound, setActiveCellBound] = useSetState<CellBound>({
    width: 0,
    height: 0,
  });
  const [isLocking, setLocking] = useState<boolean>(false); // 对操作进行锁定，防止其它操作频发
  const [dragTaskId, setDragTaskId] = useState<string | null>(null);
  const [transformerId, setTransformerId] = useState<string>('');
  const [draggingOutlineInfo, setDraggingOutlineInfo] = useState<IDraggingOutlineInfoProps | null>(null);

  // 任务关联相关
  const [isTaskLineDrawing, setIsTaskLineDrawing] = useState<boolean>(false);
  const [targetTaskInfo, setTargetTaskInfo] = useState<ITargetTaskInfo | null>(null);
  const [taskLineSetting, setTaskLineSetting] = useState<ITaskLineSetting | null>(null);

  const rowIndicesMap = useMemo(() => {
    const rowIndicesMap: IndicesMap = {};
    linearRows.forEach((row, index) => {
      const rowType = row.type;
      if (rowType !== CellType.Record) {
        rowIndicesMap[index] = getLinearRowHeight(rowType, rowHeight, ViewType.Gantt);
      }
    });
    return rowIndicesMap;
  }, [linearRows, rowHeight]);

  const columnIndicesMap = useMemo(() => {
    const columnIndicesMap: IndicesMap = {};
    gridVisibleColumns.forEach((column, index) => {
      columnIndicesMap[index] = Selectors.getColumnWidth(column);
    });
    return columnIndicesMap;
  }, [gridVisibleColumns]);

  const ganttGroupMap: IGanttGroupMap = useMemo(() => {
    const dataMap: IGanttGroupMap = {};
    const groupCount = groupInfo.length;
    let firstGroupId = '';
    let secondGroupId = '';

    const setGroupDataMap = (dataMap: IGanttGroupMap, groupId: string, start: number | null, end: number) => {
      if (dataMap[groupId] == null) {
        dataMap[groupId] = { start, end, count: 1 };
      } else {
        const { start: prevStart, end: prevEnd, count: prevCount } = dataMap[groupId];
        dataMap[groupId] = {
          start: (prevStart != null && start != null && Math.min(prevStart as number, start)) || start || prevStart || null,
          end: Math.max(prevEnd as number, end) || null,
          count: prevCount + 1,
        };
      }
    };

    // 只在分组下计算图形区域的组头信息
    if (!groupCount) return dataMap;

    ganttLinearRows.forEach(row => {
      const { recordId, type, depth } = row;
      if (type === CellType.GroupTab) {
        if (depth === 0) firstGroupId = getGanttGroupId(recordId, depth);
        if (depth === 1) secondGroupId = getGanttGroupId(recordId, depth);
      }
      if (type !== CellType.Record) {
        return;
      }
      // 考虑到可能会有 undefined 的情况，影响后续 min/max 的计算
      const start = Selectors.getCellValueByGanttDateTimeFieldId(state, snapshot, recordId, startFieldId) || null;
      const end = Selectors.getCellValueByGanttDateTimeFieldId(state, snapshot, recordId, endFieldId) || null;
      const groupId = getGanttGroupId((row as ILinearRowRecord).groupHeadRecordId, depth - 1);

      if (groupCount === 1) setGroupDataMap(dataMap, groupId, start, end);
      if (groupCount === 2) {
        setGroupDataMap(dataMap, groupId, start, end);
        setGroupDataMap(dataMap, firstGroupId, start, end);
      }
      if (groupCount === 3) {
        setGroupDataMap(dataMap, groupId, start, end);
        setGroupDataMap(dataMap, firstGroupId, start, end);
        setGroupDataMap(dataMap, secondGroupId, start, end);
      }
    });
    return dataMap;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startFieldId, endFieldId, ganttLinearRows, snapshot]);

  /**
   * 当前 gantt 的数据实例
   * 提供与时间轴和甘特图坐标相关的方法
   */
  const ganttInstance = useCreation<GanttCoordinate>(
    () =>
      new GanttCoordinate({
        rowHeight,
        columnWidth: 0,
        rowCount,
        columnCount: ganttVisibleColumns.length,
        containerWidth: ganttWidth,
        containerHeight,
        dateUnitType,
        rowHeightLevel,
        rowInitSize: getGanttHeaderHeight(dateUnitType),
        rowIndicesMap,
        workDays,
        onlyCalcWorkDay,
      }),
    [],
  );

  /**
   * 当前 gantt 的左侧任务栏数据实例
   * 提供与任务栏坐标相关的方法
   */
  const gridInstance = useCreation<GridCoordinate>(
    () =>
      new GridCoordinate({
        rowHeight,
        columnWidth: 0,
        rowCount,
        columnCount: gridVisibleColumns.length,
        containerWidth: gridWidth,
        containerHeight,
        rowIndicesMap,
        columnIndicesMap,
        autoHeadHeight,
        rowInitSize: getGanttHeaderHeight(dateUnitType),
        columnInitSize: GRID_ROW_HEAD_WIDTH,
        rowHeightLevel,
        frozenColumnCount: 1,
      }),
    [rowCount, rowHeight, rowIndicesMap, JSON.stringify(columnIndicesMap), rowHeightLevel, dateUnitType, autoHeadHeight],
  );

  const { totalWidth: ganttTotalWidth, todayIndex, columnThreshold, unitType, rowInitSize } = ganttInstance;
  const totalHeight = Math.max(ganttInstance.totalHeight + GRID_SCROLL_REMAIN_SPACING, containerHeight - rowInitSize - GRID_BOTTOM_STAT_HEIGHT); // 甘特图总高
  const { realTargetName, areaType } = pointPosition;
  const { isOverflow } = cellScrollState;

  const isCellScrolling = useMemo(() => {
    if (activeCell == null) {
      return false;
    }
    const { recordId, fieldId } = getDetailByTargetName(realTargetName);
    return isOverflow && isEqual(activeCell, { recordId, fieldId });
  }, [activeCell, isOverflow, realTargetName]);

  const { scrollTo } = useGanttScroller({
    containerRef,
    gridHorizontalBarRef,
    ganttHorizontalBarRef,
    verticalBarRef,
    gridWidth,
    ganttWidth,
    containerHeight,
    gridTotalWidth,
    ganttTotalWidth,
    totalHeight,
    isCellScrolling,
    cellVerticalBarRef,
    pointAreaType: isMobile ? AreaType.Gantt : areaType,
  });

  const { onMouseEnter, clearTooltip: clearScrollbarTooltip, tooltip: scrollbarTooltip } = useScrollbarTip({
    horizontalBarRef: ganttHorizontalBarRef,
    containerWidth,
    totalWidth: ganttTotalWidth,
  });

  const clearTooltipInfo = useCallback(() => setTooltipInfo(DEFAULT_TOOLTIP_PROPS), [setTooltipInfo]);

  const handleGridHorizontalScroll = e => {
    const { scrollLeft } = e.target;
    setGridScrollState({
      scrollLeft,
      isScrolling: true,
    });
    clearScrollbarTooltip();
    resetScrollingDebounced();
  };

  const handleGanttHorizontalScroll = e => {
    const { scrollLeft } = e.target;
    setGanttScrollState({
      scrollLeft,
      isScrolling: true,
    });
    clearScrollbarTooltip();
    resetScrollingDebounced();
  };

  const handleVerticalScroll = e => {
    const { scrollTop } = e.target;
    setGanttScrollState({
      scrollTop,
      isScrolling: true,
    });
    setGridScrollState({
      scrollTop,
      isScrolling: true,
    });
    resetScrollingDebounced();
  };

  const resetScrolling = useCallback(() => {
    resetScrollingTimeoutID.current = null;
    setGanttScrollState({ isScrolling: false });
    setGridScrollState({ isScrolling: false });
  }, [setGanttScrollState, setGridScrollState]);

  const resetScrollingDebounced = useCallback(() => {
    if (resetScrollingTimeoutID.current !== null) {
      cancelTimeout(resetScrollingTimeoutID.current);
    }
    resetScrollingTimeoutID.current = requestTimeout(resetScrolling, 150);
  }, [resetScrolling]);

  // 设置鼠标样式
  const setMouseStyle = useCallback((mouseStyle: string) => (containerRef.current.style.cursor = mouseStyle), []);

  useGridMessage({
    text: t(Strings.freeze_tips_when_windows_too_narrow_in_gantt),
    containerWidth: gridWidth,
    firstColumnWidth: Selectors.getColumnWidth(gridVisibleColumns[0]),
  });

  // 滚动到某个单元格
  const scrollToItem = useCallback(
    ({ rowIndex, columnIndex }: { rowIndex?: number; columnIndex?: number }) => {
      let _scrollTop;
      let _scrollLeft;
      if (rowIndex != null) {
        const offset = gridInstance.getRowOffset(rowIndex);
        const { rowInitSize } = gridInstance;
        if (offset - rowInitSize < scrollTop) {
          _scrollTop = offset - rowInitSize;
        }
        if (offset + rowHeight > scrollTop + containerHeight - GRID_BOTTOM_STAT_HEIGHT) {
          _scrollTop = offset - containerHeight + rowHeight + GRID_BOTTOM_STAT_HEIGHT;
        }
      }
      if (columnIndex != null && columnIndex !== 0) {
        const offset = gridInstance.getColumnOffset(columnIndex);
        if (offset - GRID_ROW_HEAD_WIDTH < scrollLeft) {
          _scrollLeft = offset - GRID_ROW_HEAD_WIDTH - columnIndicesMap[0];
        }
        const columnWidth = columnIndicesMap[columnIndex];
        if (offset + columnWidth > scrollLeft + containerWidth) {
          _scrollLeft = offset - containerWidth + columnWidth;
        }
      }
      scrollTo({
        scrollTop: _scrollTop,
        scrollLeft: _scrollLeft,
      });
    },
    [columnIndicesMap, containerHeight, containerWidth, gridInstance, rowHeight, scrollLeft, scrollTo, scrollTop],
  );

  // 返回某个时间
  const backTo = useCallback(
    (dateTime, offsetX: number = -ganttWidth / 2) => {
      ganttInstance.initTimeline(dateUnitType, dateTime);
      const columnIndex = ganttInstance.getIndexFromStartDate(dateTime, unitType);
      const currentScrollLeft = ganttInstance.getColumnOffset(columnIndex) + offsetX;
      scrollTo({ scrollLeft: currentScrollLeft }, AreaType.Gantt);
      forceRender();
    },
    [dateUnitType, forceRender, ganttWidth, ganttInstance, scrollTo, unitType],
  );

  /**
   * 设置起止字段时间，并保留日期内的时间
   */
  const setRecord = (recordId: string, startUnitIndex: number | null, endUnitIndex: number | null) => {
    const data: ISetRecordOptions[] = [];
    const startField = fieldMap[startFieldId];
    const endField = fieldMap[endFieldId];
    const isSameField = startFieldId === endFieldId;
    const getData = (fieldId: string, unitIndex: number) => {
      const curTime = Selectors.getCellValueByGanttDateTimeFieldId(state, snapshot, recordId, fieldId);
      let timeStamp = ganttInstance.getDateFromStartDate(unitIndex).valueOf();
      if (curTime) timeStamp += getTimeStampOfDate(curTime);
      return {
        recordId,
        fieldId,
        value: timeStamp,
      };
    };
    if (startUnitIndex != null && startField != null) {
      data.push(getData(startFieldId, startUnitIndex));
    }
    if (endUnitIndex != null && endField != null) {
      const endData = getData(endFieldId, endUnitIndex);
      if (!isSameField) {
        data.push(endData);
      }
      // 如果开启了自动编排而且结束时间遭到了修改
      if (autoTaskLayout && endData) {
        autoSingleTask(endData);
      }
    }
    resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.SetRecords,
      datasheetId,
      data,
    });
  };

  // 上一页/下一页
  const scrollIntoView = useCallback(
    (type: ScrollViewType) => {
      const scrollLeft = ganttHorizontalBarRef.current.scrollLeft;
      const currentScrollLeft = type === ScrollViewType.Next ? scrollLeft + ganttWidth : scrollLeft - ganttWidth;
      scrollTo({ scrollLeft: currentScrollLeft }, AreaType.Gantt);
      forceRender();
    },
    [forceRender, ganttWidth, scrollTo],
  );

  const scrollHandler: IScrollHandler = useCreation(() => {
    let isStop = false;
    let _scrollOptions: IScrollOptions = {};
    let _areaType: AreaType = AreaType.Grid;
    // 记录 X/Y 轴滚动的总距离
    let totalScrollX = 0;
    let totalScrollY = 0;

    const scrollByValue = () => {
      if (isStop) {
        return;
      }
      const { rowSpeed, columnSpeed, scrollCb } = _scrollOptions;
      const options: { scrollLeft?: number; scrollTop?: number } = {};
      if (rowSpeed != null) {
        const currentScrollTop = Math.max(verticalBarRef.current.scrollTop + rowSpeed, 0);
        options.scrollTop = currentScrollTop;
        totalScrollY += Math.abs(rowSpeed);
      }
      if (columnSpeed != null) {
        const currentScrollLeft = Math.max(ganttHorizontalBarRef.current.scrollLeft + columnSpeed, 0);
        options.scrollLeft = currentScrollLeft;
        totalScrollX += Math.abs(columnSpeed);
      }
      const maxScrollSize = ganttHorizontalBarRef.current.scrollWidth;
      scrollTo(options, _areaType);
      scrollCb?.({ ...options, totalScrollX, totalScrollY, maxScrollSize });
      window.requestAnimationFrame(scrollByValue);
    };

    const stopScroll = (isClearAll = true) => {
      if (isClearAll) {
        totalScrollX = 0;
        totalScrollY = 0;
      }
      isStop = true;
    };

    return {
      scrollByValue: (scrollOptions: IScrollOptions, areaType: AreaType = AreaType.Grid) => {
        isStop = false;
        _scrollOptions = scrollOptions;
        _areaType = areaType;
        scrollByValue();
      },
      stopScroll,
    };
  }, []);

  const onEditorPosition = useCallback((activeCell?: ICell) => domGridRef.current?.onViewMouseDown(activeCell), []);

  const resetCellScroll = useCallback(() => {
    if (cellVerticalBarRef.current) {
      cellVerticalBarRef.current.scrollTop = 0;
    }
  }, []);

  const onPanelSizeChange = (newSize: number) => {
    const GanttStatusMap = getStorage(StorageName.GanttStatusMap)!;
    const status = GanttStatusMap[`${spaceId}_${datasheetId}_${view.id}`] || {};
    dispatch(StoreActions.setGanttSettingPanelWidth(newSize, datasheetId));
    setStorage(StorageName.GanttStatusMap, {
      [`${spaceId}_${datasheetId}_${view.id}`]: {
        ...status,
        settingPanelWidth: newSize,
      },
    });
    window.dispatchEvent(new Event('resize'));
  };

  // 布局切换
  useUpdateEffect(() => {
    ganttInstance.rowHeight = rowHeight;
    ganttInstance.rowMetaDataMap = {};
    ganttInstance.lastRowIndex = -1;
    ganttInstance.rowCount = linearRows.length;
    ganttInstance.rowIndicesMap = rowIndicesMap;
    ganttInstance.rowHeightLevel = rowHeightLevel;
    forceRender();
  }, [rowIndicesMap]);

  // resize
  useUpdateEffect(() => {
    ganttInstance.containerWidth = ganttWidth;
    gridInstance.containerWidth = gridWidth;
    forceRender();
  }, [ganttWidth, gridWidth]);

  // resize
  useUpdateEffect(() => {
    ganttInstance.containerHeight = containerHeight;
    gridInstance.containerHeight = containerHeight;
    forceRender();
  }, [containerHeight]);

  // workday change
  useUpdateEffect(() => {
    ganttInstance.workDays = workDays;
    ganttInstance.onlyCalcWorkDay = onlyCalcWorkDay;
    forceRender();
  }, [workDays, onlyCalcWorkDay]);

  // 转换时间精度
  useUpdateEffect(() => {
    const selfWidth = ganttWidth / 2;
    const prevColumnIndex = ganttInstance.getColumnStartIndex(scrollLeft + selfWidth);
    const initDate = ganttInstance.getDateFromStartDate(prevColumnIndex, unitType);
    ganttInstance.initTimeline(dateUnitType, initDate);
    ganttInstance.rowInitSize = getGanttHeaderHeight(dateUnitType);
    const currentColumnIndex = ganttInstance.getIndexFromStartDate(initDate, ganttInstance.unitType);
    const currentScrollLeft = ganttInstance.getColumnOffset(currentColumnIndex) - selfWidth;
    scrollTo({ scrollLeft: currentScrollLeft }, AreaType.Gantt);
    forceRender();
  }, [dateUnitType]);

  // 限制滚动阈值，实现虚拟滚动
  useUpdateEffect(() => {
    if (scrollLeft <= 0) {
      if (isTaskLineDrawing) {
        scrollHandler.stopScroll();
        return;
      }
      ganttInstance.prevTimelineStep();
      const currentScrollLeft = ganttInstance.getColumnOffset(ganttInstance.columnThreshold) + scrollLeft;
      scrollTo({ scrollLeft: currentScrollLeft }, AreaType.Gantt);
      return forceRender();
    }
    // 最大滚动距离
    const scrollMaxSize = ganttHorizontalBarRef.current.scrollWidth - ganttHorizontalBarRef.current.clientWidth;
    // 与最大滚动距离的差值
    const scrollMaxDiff = scrollLeft - scrollMaxSize;
    if (scrollMaxDiff >= 0) {
      if (isTaskLineDrawing) {
        scrollHandler.stopScroll();
        return;
      }
      ganttInstance.nextTimelineStep();
      const currentScrollLeft =
        ganttInstance.getColumnOffset(ganttInstance.columnThreshold) - ganttHorizontalBarRef.current.clientWidth + scrollMaxDiff;
      scrollTo({ scrollLeft: currentScrollLeft }, AreaType.Gantt);
      forceRender();
    }
  }, [scrollLeft]);

  useEffect(() => {
    /**
     * 初始化 GanttStatus 相关数据
     * 若有本地缓存，则从缓存中读取
     * 若无本地缓存，则将 Redux 中的初始数据存入本地缓存
     */
    const ganttStatusMap = getStorage(StorageName.GanttStatusMap);
    const ganttStatus = ganttStatusMap?.[`${spaceId}_${datasheetId}_${view.id}`] || {};
    const defaultGanttViewStatus = {
      gridWidth: 256,
      gridVisible: true,
      settingPanelWidth: 320,
      settingPanelVisible: !(mirrorId || isViewLock),
      dateUnitType: DateUnitType.Month,
      ...ganttStatus,
    };

    dispatch(
      batchActions([
        StoreActions.toggleGanttGrid(defaultGanttViewStatus.gridVisible, datasheetId),
        StoreActions.setGanttGridWidth(defaultGanttViewStatus.gridWidth, datasheetId),
        StoreActions.toggleGanttSettingPanel(defaultGanttViewStatus.settingPanelVisible, datasheetId),
        StoreActions.setGanttSettingPanelWidth(defaultGanttViewStatus.settingPanelWidth, datasheetId),
        StoreActions.setGanttDateUnitType(defaultGanttViewStatus.dateUnitType || DateUnitType.Month, datasheetId),
      ]),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view?.id]);

  useMount(() => {
    // 初始化甘特图滚动条位置
    if (0 <= todayIndex && todayIndex <= columnThreshold * 2) {
      const todayOffset = ganttInstance.getColumnOffset(todayIndex);
      const currentScrollLeft = todayOffset - ganttWidth / 2;
      scrollTo({ scrollLeft: currentScrollLeft }, AreaType.Gantt);
    }
    setTimeout(() => Player.doTrigger(Events.datasheet_gantt_view_shown), 500);
  });

  useUpdateEffect(() => {
    if (disabledSettingPanelWithMirror || isViewLock) {
      settingPanelVisible && dispatch(StoreActions.toggleGanttSettingPanel(false, datasheetId));
    }
  }, [isViewLock, disabledSettingPanelWithMirror]);

  useUpdateEffect(() => {
    if (disabledSettingPanelWithMirror || isViewLock) {
      return;
    }
    if (startFieldId == null || endFieldId == null) {
      dispatch(StoreActions.toggleGanttSettingPanel(true, datasheetId));
      setStorage(StorageName.GanttStatusMap, {
        [`${spaceId}_${datasheetId}_${view.id}`]: {
          ...ganttViewStatus,
          settingPanelVisible: true,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startFieldId, endFieldId, datasheetId, view, spaceId, mirrorId, isViewLock]);

  useEffect(() => {
    if (isScrolling) {
      clearTooltipInfo();
    }
  }, [clearTooltipInfo, isScrolling]);
  const theme = useTheme();

  // 任务关联相关
  const linkCycleEdges = useMemo(() => {
    if (!linkFieldId) {
      return {
        taskEdges: [],
        cycleEdges: [],
        targetAdj: null,
      };
    }
    // target adjacency list
    const targetAdj = {};
    const nodeIdMap: string[] = [];
    visibleRows.forEach(row => {
      const linkCellValue = Selectors.getCellValue(state, snapshot, row.recordId, linkFieldId) || [];
      if (linkCellValue.length > 0) {
        targetAdj[row.recordId] = linkCellValue;
      }
      nodeIdMap.push(row.recordId);
    });
    const { taskLineList: taskEdges, sourceAdj } = getAllTaskLine(targetAdj);
    const cycleEdges = getAllCycleDAG(nodeIdMap, sourceAdj);

    return {
      taskEdges,
      cycleEdges,
      targetAdj,
      sourceAdj,
      nodeIdMap,
    };
  }, [visibleRows, linkFieldId, state, snapshot]);

  // 根据分组隐藏信息补充ganttLinearRows
  const ganttLinearRowsAfterCollapseMap = useMemo(() => {
    return getCollapsedLinearRows(ganttLinearRows, groupCollapseIds);
  }, [ganttLinearRows, groupCollapseIds]);

  const rowsCellValueMap = useMemo(() => {
    if (!linkFieldId || !startFieldId || !endFieldId) {
      return {
        cellValueMap: null,
      };
    }
    const groupingCollapseSet = new Set<string>(groupCollapseIds);

    const cellValueMap = {};
    visibleRows.forEach(row => {
      const startTime = Selectors.getCellValue(state, snapshot, row.recordId, startFieldId);
      const endTime = Selectors.getCellValue(state, snapshot, row.recordId, endFieldId);

      const { groupHeadRecordId, groupDepth } = ganttLinearRowsAfterCollapseMap.get(row.recordId);
      const isCollapse = groupingCollapseSet.has(groupHeadRecordId + '_' + groupDepth);

      let rowIndex;
      if (isCollapse) {
        rowIndex = rowsIndexMap.get(`${CellType.GroupTab}_${groupHeadRecordId}`);
      } else {
        rowIndex = rowsIndexMap.get(`${CellType.Record}_${row.recordId}`);
      }

      if (startTime && endTime) {
        cellValueMap[row.recordId] = {
          startTime,
          endTime,
          isCollapse,
          rowIndex,
          groupHeadRecordId,
        };
      }
    });
    return cellValueMap;
  }, [visibleRows, linkFieldId, groupCollapseIds, rowsIndexMap, startFieldId, endFieldId, state, snapshot, ganttLinearRowsAfterCollapseMap]);

  // 单任务修改自动编排
  const autoSingleTask = endData => {
    if (!linkFieldId || !startFieldId || !endFieldId) {
      return;
    }

    const startTimeIsComputedField = Field.bindModel(fieldMap[startFieldId]).isComputed;
    const endTimeISComputedField = Field.bindModel(fieldMap[endFieldId]).isComputed;
    if (startTimeIsComputedField || endTimeISComputedField) {
      Message.warning({ content: t(Strings.gantt_cant_connect_when_computed_field) });
      return;
    }
    const commandData: ISetRecordOptions[] = autoTaskScheduling(visibleRows, state, snapshot, ganttStyle, endData);

    resourceService.instance?.commandManager.execute({
      cmd: CollaCommandName.SetRecords,
      data: commandData,
    });
  };

  const konvaGridContext = {
    theme,
    tooltipInfo,
    setTooltipInfo,
    clearTooltipInfo,
    activeCellBound,
    setActiveCellBound,
    scrollTo,
    scrollToItem,
    onEditorPosition,
    setMouseStyle,
    isCellDown,
    setCellDown,
    draggingOutlineInfo,
    setDraggingOutlineInfo,
    cellScrollState,
    setCellScrollState,
    resetCellScroll,
    scrollHandler,
    isMobile,
    isTouchDevice,
    canAppendRow,
    onSetCanAppendRow: setCanAppendRow,
  };

  const { unitTitleMap } = useWxTitleMap();
  const cacheTheme = useSelector(Selectors.getTheme);

  const gridViewContext = {
    snapshot,
    fieldMap,
    unitTitleMap,
    cacheTheme,
    visibleColumns: gridVisibleColumns,
    view,
    recordMap,
    linearRows,
    datasheetId,
    isSearching,
    groupCollapseIds,
    dispatch,
    mirrorId,
    visibleRows,
    groupInfo,
    permissions,
    fieldPermissionMap,
    selectRecordIds,
    visibleRowsIndexMap,
    recordRanges,
    selectRanges,
    rowsIndexMap,
    activeCell,
    visibleRecordIds,
    groupBreakpoint,
    collaboratorCursorMap,
    currentSearchCell,
    recordMoveType,
    fillHandleStatus,
    gridViewDragState,
    isEditing,
    fieldIndexMap,
    sortInfo,
    selection,
    fieldRanges,
    filterInfo,
    allowShowCommentPane,
  };

  const ganttViewContext = {
    backTo,
    setRecord,
    isLocking,
    setLocking,
    dragTaskId,
    setDragTaskId,
    transformerId,
    setTransformerId,
    ganttVisibleColumns,
    ganttStyle,
    ganttGroupMap,
    ganttViewStatus,
    dragSplitterInfo,
    setDragSplitterInfo,
    isTaskLineDrawing,
    setIsTaskLineDrawing,
    rowsCellValueMap,
    linkCycleEdges,
    targetTaskInfo,
    setTargetTaskInfo,
    taskLineSetting,
    setTaskLineSetting,
  };

  return (
    <KonvaGridContext.Provider value={konvaGridContext}>
      <div
        className={classNames(styles.ganttView, isMobile && styles.ganttViewMobile)}
        onMouseLeave={() => {
          setPointPosition(DEFAULT_POINT_POSITION);
          clearTooltipInfo();
        }}
      >
        <VikaSplitPanel
          panelLeft={
            <div className={styles.gantt}>
              <div
                ref={containerRef}
                className={'vikaGanttView vikaGridView'}
                style={{
                  width: '100%',
                  height: containerHeight,
                  borderRadius: 8,
                  borderLeft: gridVisible ? 'none' : `1px solid ${theme.color.sheetLineColor}`,
                }}
              >
                <KonvaGridViewContext.Provider value={gridViewContext}>
                  <KonvaGanttViewContext.Provider value={ganttViewContext}>
                    <GanttStage
                      ganttInstance={ganttInstance}
                      gridInstance={gridInstance}
                      gridScrollState={gridScrollState}
                      ganttScrollState={ganttScrollState}
                      pointPosition={pointPosition}
                      setPointPosition={setPointPosition}
                      scrollIntoView={scrollIntoView}
                    />
                    {exportViewId != null && exportViewId === view.id && <GanttExport />}
                  </KonvaGanttViewContext.Provider>
                </KonvaGridViewContext.Provider>
              </div>

              {/* 任务区横向滚动条 */}
              <div
                ref={gridHorizontalBarRef}
                className={styles.horizontalScrollBarWrapper}
                style={{
                  width: gridWidth,
                  left: 0,
                }}
                onScroll={handleGridHorizontalScroll}
              >
                <div
                  className={styles.horizontalScrollBarInner}
                  style={{
                    width: gridTotalWidth,
                    height: 1,
                  }}
                />
                {scrollbarTooltip}
              </div>

              {/* 图形区横向滚动条 */}
              <div
                ref={ganttHorizontalBarRef}
                className={styles.horizontalScrollBarWrapper}
                style={{
                  width: ganttWidth,
                  left: gridWidth,
                }}
                onScroll={handleGanttHorizontalScroll}
                onMouseEnter={onMouseEnter}
                onMouseLeave={clearScrollbarTooltip}
              >
                <div
                  className={styles.horizontalScrollBarInner}
                  style={{
                    width: ganttTotalWidth,
                    height: 1,
                  }}
                />
                {scrollbarTooltip}
              </div>

              {/* 纵向滚动条 */}
              <div
                ref={verticalBarRef}
                className={styles.verticalScrollBarWrapper}
                style={{
                  height: containerHeight - rowInitSize,
                  top: rowInitSize,
                }}
                onScroll={handleVerticalScroll}
              >
                <div
                  className={styles.verticalScrollBarInner}
                  style={{
                    width: 1,
                    height: totalHeight,
                  }}
                />
              </div>
            </div>
          }
          panelRight={<div style={{ width: '100%', height: '100%' }}>{!isMobile && settingPanelVisible && <SettingPanel />}</div>}
          primary="second"
          split="vertical"
          onChange={onPanelSizeChange}
          size={settingPanelWidth}
          allowResize={false}
        />

        {/* 数表 DOM 坐标系 */}
        <DomGrid
          ref={domGridRef}
          instance={gridInstance}
          datasheetId={datasheetId}
          containerWidth={ganttViewWidth}
          containerHeight={containerHeight}
          scrollState={gridScrollState}
          pointPosition={pointPosition}
          wrapperRef={containerRef}
          cellVerticalBarRef={cellVerticalBarRef}
        />

        {/* 甘特图 DOM 坐标系 */}
        <DomGantt containerWidth={ganttViewWidth} containerHeight={containerHeight} gridWidth={gridWidth} gridVisible={gridVisible} />

        {/* 创建列模态框 */}
        {!dateTimeTypeFields.length && <CreateFieldModal />}
      </div>
    </KonvaGridContext.Provider>
  );
});
