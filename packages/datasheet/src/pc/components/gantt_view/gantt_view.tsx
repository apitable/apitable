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

import { useCreation, useMount, useUpdate, useUpdateEffect } from 'ahooks';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { isEqual } from 'lodash';
import { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isMobile as isTouchDevice } from 'react-device-detect';
import { shallowEqual } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import { useTheme } from '@apitable/components';
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
  IGanttViewStatus,
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
} from '@apitable/core';
import { Message, VikaSplitPanel } from 'pc/components/common';
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
import { useDispatch, useResponsive, useSetState } from 'pc/hooks';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { getStorage, setStorage, StorageName } from 'pc/utils/storage/storage';
import { ScreenSize } from '../common/component_display/enum';
import { IContainerEdit } from '../editors/interface';
import { useWxTitleMap } from '../konva_grid/hooks/use_wx_title_map';
import { useDisabledOperateWithMirror } from '../tool_bar/hooks';
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
import { getAllTaskLine, detectCyclesStack, autoTaskScheduling, getCollapsedLinearRows, getGanttViewStatusWithDefault } from './utils';
import styles from './style.module.less';

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

export const GanttView: FC<React.PropsWithChildren<IGanttViewProps>> = memo((props) => {
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
    cacheGanttViewStatus,
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
  } = useAppSelector((state) => {
    const datasheetId = Selectors.getActiveDatasheetId(state)!;
    const view = Selectors.getCurrentView(state)! as IGanttViewProperty;
    const rowHeightLevel = view.rowHeightLevel || RowHeightLevel.Short;
    return {
      datasheetId,
      gridVisibleColumns: Selectors.getVisibleColumns(state),
      ganttVisibleColumns: Selectors.getGanttVisibleColumns(state),
      fieldMap: Selectors.getFieldMap(state, datasheetId)!,
      entityFieldMap: Selectors.getFieldMapIgnorePermission(state)!,
      linearRows: Selectors.getLinearRows(state)!,
      ganttLinearRows: Selectors.getPureLinearRows(state)!,
      permissions: Selectors.getPermissions(state),
      rowHeightLevel,
      rowHeight: Selectors.getGanttRowHeightFromLevel(rowHeightLevel),
      activeCell: Selectors.getActiveCell(state),
      selection: Selectors.getSelection(state),
      ganttStyle: Selectors.getGanttStyle(state)!,
      visibleRows: Selectors.getVisibleRows(state),
      recordRanges: Selectors.getSelectionRecordRanges(state),
      rowsIndexMap: Selectors.getLinearRowsIndexMap(state) || new Map(),
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
      cacheGanttViewStatus: Selectors.getGanttViewStatus(state),
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
  const rowCount = linearRows.length;
  const { autoHeadHeight, id: viewId } = view as IGanttViewProperty;
  const dispatch = useDispatch();
  const ganttViewStatus: IGanttViewStatus = useMemo(() => {
    return {
      ...cacheGanttViewStatus,
      ...getGanttViewStatusWithDefault({
        spaceId,
        datasheetId,
        viewId,
        mirrorId,
        isViewLock,
      }),
    };
  }, [datasheetId, cacheGanttViewStatus, isViewLock, mirrorId, spaceId, viewId]);
  const {
    gridVisible: _gridVisible,
    settingPanelVisible: _settingPanelVisible,
    settingPanelWidth: _settingPanelWidth,
    dateUnitType,
  } = ganttViewStatus;
  const { visualizationEditable, editable } = permissions;
  const settingPanelVisible = (visualizationEditable || editable) && _settingPanelVisible;
  const settingPanelWidth = isMobile ? 0 : _settingPanelWidth;
  const containerWidth = _containerWidth;
  const ganttViewWidth = settingPanelVisible ? containerWidth - settingPanelWidth : containerWidth;
  const gridVisible = !isMobile && _gridVisible;

  // Total width of the left taskbar
  const gridTotalWidth = useMemo(() => {
    return gridVisibleColumns.reduce((pre, cur) => pre + Selectors.getColumnWidth(cur), GRID_ROW_HEAD_WIDTH);
  }, [gridVisibleColumns]);

  const draftGridWidth = Math.min(gridTotalWidth, Math.round(containerWidth * 0.4));
  const gridWidth = gridVisible ? draftGridWidth : 0;
  const ganttWidth = gridVisible ? ganttViewWidth - gridWidth : ganttViewWidth;

  /**
   * Here the full fieldMap is used, containing columns without permissions
   * Previous logic.
   * If no date field is detected, a pop-up will be created for the date
   * Current compatibility.
   * The compatible user does not have access to the corresponding date column,
   * but there is no need to pop up the pop-up at this point, as the date column exists
   */
  const dateTimeTypeFields = useMemo(
    () =>
      Object.values(entityFieldMap).filter((field) => {
        return [Field.bindModel(field).basicValueType, Field.bindModel(field).innerBasicValueType].includes(BasicValueType.DateTime);
      }),
    [entityFieldMap],
  );

  // Set the behavioural state of a new line
  const [canAppendRow, setCanAppendRow] = useState(true);
  const [activeUrlAction, setActiveUrlAction] = useState(false);

  // Refs
  const containerRef = useRef<any>();
  const domGridRef = useRef<IContainerEdit | null>(null); // Grid Dom
  const gridHorizontalBarRef = useRef<any>(); // Horizontal scroll bar in the task area
  const ganttHorizontalBarRef = useRef<any>(); // Horizontal scrollbar in the graphics area
  const verticalBarRef = useRef<any>(); // Vertical scroll bar
  const cellVerticalBarRef = useRef<any>(); // Cell vertical scroll bar
  const resetScrollingTimeoutID = useRef<TimeoutID | null>(null); // Scroll timer to disable event listening on stage when scrolling

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

  // Used to mark the start of a selection or the state of a fill
  const [isCellDown, setCellDown] = useState<boolean>(false);
  // tooltip in the DOM coordinate system
  const [tooltipInfo, setTooltipInfo] = useSetState<ITooltipInfo>(DEFAULT_TOOLTIP_PROPS);
  // Highlighted dividers during task column width dragging
  const [dragSplitterInfo, setDragSplitterInfo] = useSetState<ISplitterProps>({ x: -1, visible: false });
  const [activeCellBound, setActiveCellBound] = useSetState<CellBound>({
    width: 0,
    height: 0,
  });
  const [isLocking, setLocking] = useState<boolean>(false); // Locking of operations to prevent other operations from occurring frequently
  const [dragTaskId, setDragTaskId] = useState<string | null>(null);
  const [transformerId, setTransformerId] = useState<string>('');
  const [draggingOutlineInfo, setDraggingOutlineInfo] = useState<IDraggingOutlineInfoProps | null>(null);

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

    // Calculation of group header information for graphic areas under grouping only
    if (!groupCount) return dataMap;

    ganttLinearRows.forEach((row) => {
      const { recordId, type, depth } = row;
      if (type === CellType.GroupTab) {
        if (depth === 0) firstGroupId = getGanttGroupId(recordId, depth);
        if (depth === 1) secondGroupId = getGanttGroupId(recordId, depth);
      }
      if (type !== CellType.Record) {
        return;
      }
      // Considering that there may be undefined cases that affect the subsequent min/max calculation
      let start = Selectors.getCellValueByGanttDateTimeFieldId(state, snapshot, recordId, startFieldId) || null;
      const end = Selectors.getCellValueByGanttDateTimeFieldId(state, snapshot, recordId, endFieldId) || start;
      start = start ?? end;
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
    // eslint-disable-next-line
  }, [startFieldId, endFieldId, ganttLinearRows, snapshot]);

  /**
   * Example of current gantt data
   * Provides methods related to timeline and Gantt chart coordinates
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
   * Example of the left-hand taskbar data for the current gantt
   * Provide methods related to taskbar coordinates
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
  const totalHeight = Math.max(ganttInstance.totalHeight + GRID_SCROLL_REMAIN_SPACING, containerHeight - rowInitSize - GRID_BOTTOM_STAT_HEIGHT);
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

  const {
    onMouseEnter,
    clearTooltip: clearScrollbarTooltip,
    tooltip: scrollbarTooltip,
  } = useScrollbarTip({
    horizontalBarRef: ganttHorizontalBarRef,
    containerWidth,
    totalWidth: ganttTotalWidth,
  });

  const clearTooltipInfo = useCallback(() => setTooltipInfo(DEFAULT_TOOLTIP_PROPS), [setTooltipInfo]);

  const handleGridHorizontalScroll = (e: any) => {
    const { scrollLeft } = e.target;
    setGridScrollState({
      scrollLeft,
      isScrolling: true,
    });
    clearScrollbarTooltip();
    resetScrollingDebounced();
  };

  const handleGanttHorizontalScroll = (e: any) => {
    const { scrollLeft } = e.target;
    setGanttScrollState({
      scrollLeft,
      isScrolling: true,
    });
    clearScrollbarTooltip();
    resetScrollingDebounced();
  };

  const handleVerticalScroll = (e: any) => {
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

  // Set mouse style
  const setMouseStyle = useCallback((mouseStyle: string) => (containerRef.current.style.cursor = mouseStyle), []);

  useGridMessage({
    text: t(Strings.freeze_tips_when_windows_too_narrow_in_gantt),
    containerWidth: gridWidth,
    firstColumnWidth: Selectors.getColumnWidth(gridVisibleColumns[0]),
  });

  // Scroll to a cell
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

  // Return to a time
  const backTo = useCallback(
    (dateTime: any, offsetX: number = -ganttWidth / 2) => {
      ganttInstance.initTimeline(dateUnitType, dateTime);
      const columnIndex = ganttInstance.getIndexFromStartDate(dateTime, unitType);
      const currentScrollLeft = ganttInstance.getColumnOffset(columnIndex) + offsetX;
      scrollTo({ scrollLeft: currentScrollLeft }, AreaType.Gantt);
      forceRender();
    },
    [dateUnitType, forceRender, ganttWidth, ganttInstance, scrollTo, unitType],
  );

  /**
   * Set the start and end time and keep the time within the date
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
      // If automatic scheduling is enabled and the end time has been changed
      if (autoTaskLayout && endData) {
        autoSingleTask({ recordId: endData.recordId, endTime: endData.value });
      }
    }
    resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.SetRecords,
      datasheetId,
      data,
    });
  };

  // Previous / Next
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
    // Record the total distance of the X/Y axis roll
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
    const status = GanttStatusMap[`${spaceId}_${datasheetId}_${viewId}`] || {};
    dispatch(StoreActions.setGanttSettingPanelWidth(newSize, datasheetId));
    setStorage(StorageName.GanttStatusMap, {
      [`${spaceId}_${datasheetId}_${viewId}`]: {
        ...status,
        settingPanelWidth: newSize,
      },
    });
    window.dispatchEvent(new Event('resize'));
  };

  // Layout switching
  useUpdateEffect(() => {
    ganttInstance.rowHeight = rowHeight;
    ganttInstance.rowMetaDataMap = {};
    ganttInstance.lastRowIndex = -1;
    ganttInstance.rowCount = linearRows.length;
    ganttInstance.rowIndicesMap = rowIndicesMap;
    ganttInstance.rowHeightLevel = rowHeightLevel;
    forceRender();
  }, [rowIndicesMap, dateUnitType]);

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

  // Conversion time accuracy
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

  // Limit scrolling thresholds for virtual scrolling
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
    // Max. rolling distance
    const scrollMaxSize = ganttHorizontalBarRef.current.scrollWidth - ganttHorizontalBarRef.current.clientWidth;
    // Difference to maximum rolling distance
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
     * Initialising GanttStatus related data
     * Read from cache if local cache is available
     * If there is no local cache, the initial data in Redux is stored in the local cache
     */
    const defaultGanttViewStatus = getGanttViewStatusWithDefault({
      spaceId,
      datasheetId,
      viewId,
      mirrorId,
      isViewLock,
    });

    dispatch(
      batchActions([
        StoreActions.toggleGanttGrid(defaultGanttViewStatus.gridVisible, datasheetId),
        StoreActions.setGanttGridWidth(defaultGanttViewStatus.gridWidth, datasheetId),
        StoreActions.toggleGanttSettingPanel(defaultGanttViewStatus.settingPanelVisible, datasheetId),
        StoreActions.setGanttSettingPanelWidth(defaultGanttViewStatus.settingPanelWidth, datasheetId),
        StoreActions.setGanttDateUnitType(defaultGanttViewStatus.dateUnitType || DateUnitType.Month, datasheetId),
      ]),
    );

    // set gantt default timeZone to start field timeZone
    const startField = fieldMap[startFieldId];
    const timeZone = startField?.property?.timeZone;
    if (timeZone) {
      dayjs.tz.setDefault(timeZone);
    }
    // eslint-disable-next-line
  }, [view?.id]);

  useMount(() => {
    // Initialising the Gantt chart scrollbar position
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
        [`${spaceId}_${datasheetId}_${viewId}`]: {
          ...ganttViewStatus,
          settingPanelVisible: true,
        },
      });
    }
    // eslint-disable-next-line
  }, [startFieldId, endFieldId, datasheetId, view, spaceId, mirrorId, isViewLock]);

  useEffect(() => {
    if (isScrolling) {
      clearTooltipInfo();
    }
  }, [clearTooltipInfo, isScrolling]);
  const theme = useTheme();
  const activeNodePrivate = useAppSelector(Selectors.getActiveNodePrivate);

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
    visibleRows.forEach((row) => {
      const linkCellValue = Selectors.getCellValue(state, snapshot, row.recordId, linkFieldId) || [];
      if (linkCellValue.length > 0) {
        targetAdj[row.recordId] = linkCellValue;
      }
      nodeIdMap.push(row.recordId);
    });
    const { taskLineList: taskEdges, sourceAdj } = getAllTaskLine(targetAdj);
    const cycleEdges = detectCyclesStack(nodeIdMap, sourceAdj);

    return {
      taskEdges,
      cycleEdges,
      targetAdj,
      sourceAdj,
      nodeIdMap,
    };
  }, [visibleRows, linkFieldId, state, snapshot]);

  // Additional ganttLinearRows based on group hiding information
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
    visibleRows.forEach((row) => {
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

      if (startTime || endTime) {
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

  // Automatic scheduling of single-task modifications
  const autoSingleTask = (endData: { recordId: string; endTime: number }) => {
    if (!linkFieldId || !startFieldId || !endFieldId) {
      return;
    }

    const startTimeIsComputedField = Field.bindModel(fieldMap[startFieldId]).isComputed;
    const endTimeISComputedField = Field.bindModel(fieldMap[endFieldId]).isComputed;
    if (startTimeIsComputedField || endTimeISComputedField) {
      Message.warning({ content: t(Strings.gantt_cant_connect_when_computed_field) });
      return;
    }
    const commandData: ISetRecordOptions[] = autoTaskScheduling(visibleRows, ganttStyle, endData);

    resourceService.instance?.commandManager.execute({
      cmd: CollaCommandName.SetRecords,
      data: commandData,
    });
  };

  const konvaGridContext = {
    theme,
    activeNodePrivate,
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
    activeUrlAction,
    setActiveUrlAction,
  };

  const { unitTitleMap } = useWxTitleMap();
  const cacheTheme = useAppSelector(Selectors.getTheme);

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
                    {exportViewId != null && exportViewId === viewId && <GanttExport dateUnitType={dateUnitType} />}
                  </KonvaGanttViewContext.Provider>
                </KonvaGridViewContext.Provider>
              </div>

              {/* Horizontal scroll bar in the task area */}
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

              {/* Horizontal scrollbar in the graphics area */}
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

              {/* Vertical scroll bar */}
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
          panelRight={
            <div style={{ width: '100%', height: '100%' }}>
              {!isMobile && settingPanelVisible && <SettingPanel ganttViewStatus={ganttViewStatus} />}
            </div>
          }
          primary="second"
          split="vertical"
          onChange={onPanelSizeChange}
          size={settingPanelWidth}
          allowResize={false}
        />

        {/* datasheet DOM Coordinate System */}
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

        {/* Gantt Chart DOM Coordinate System */}
        <DomGantt
          containerWidth={ganttViewWidth}
          containerHeight={containerHeight}
          gridWidth={gridWidth}
          gridVisible={gridVisible}
          dateUnitType={dateUnitType}
        />

        {/* Create column modal boxes */}
        {!dateTimeTypeFields.length && <CreateFieldModal />}
      </div>
    </KonvaGridContext.Provider>
  );
});
