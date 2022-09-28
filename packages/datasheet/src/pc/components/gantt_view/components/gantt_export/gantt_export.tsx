import { CellType, DateUnitType, IGanttViewProperty, RowHeightLevel, Selectors, ViewType } from '@vikadata/core';
import { useCreation } from 'ahooks';
import { change, DEFAULT_SCROLL_STATE, GanttCoordinate, getDiffCount, getGanttHeaderHeight, KonvaGanttViewContext } from 'pc/components/gantt_view';
import GanttStage from 'pc/components/gantt_view/gantt_stage/gantt_stage';
import {
  DEFAULT_POINT_POSITION, getColumnIndicesMap, getRowIndicesMap, GRID_BOTTOM_STAT_HEIGHT, GRID_ROW_HEAD_WIDTH, GridCoordinate, KonvaGridViewContext,
} from 'pc/components/konva_grid';
import { store } from 'pc/store';
import { FC, useContext } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

const getUnitType = (dateUnitType: DateUnitType) => {
  switch (dateUnitType) {
    case DateUnitType.Week:
    case DateUnitType.Month:
      return 'day';
    case DateUnitType.Quarter:
      return 'week';
    case DateUnitType.Year:
      return 'month';
  }
};

interface IGanttExportProps {
  dateUnitType: DateUnitType;
}

export const GanttExport: FC<IGanttExportProps> = ({ dateUnitType }) => {
  const {
    view,
    rowHeight,
    rowHeightLevel,
    ganttLinearRows,
    ganttStyle,
  } = useSelector((state) => {
    const view = Selectors.getCurrentView(state)! as IGanttViewProperty;
    const rowHeightLevel = view.rowHeightLevel || RowHeightLevel.Short;
    return {
      view,
      rowHeightLevel,
      ganttLinearRows: Selectors.getGanttLinearRows(state),
      rowHeight: Selectors.getGanttRowHeightFromLevel(rowHeightLevel),
      ganttStyle: Selectors.getGanttStyle(state)!,
    };
  }, shallowEqual);
  const {
    snapshot,
    linearRows,
    visibleColumns: gridVisibleColumns
  } = useContext(KonvaGridViewContext);
  const { ganttVisibleColumns } = useContext(KonvaGanttViewContext);
  const rowCount = linearRows.length;
  const { autoHeadHeight } = view;
  const { startFieldId, endFieldId, workDays, onlyCalcWorkDay } = ganttStyle;

  const ganttInstance = useCreation<GanttCoordinate>(() => {
    const state = store.getState();
    let start = null;
    let end = null;
    ganttLinearRows.forEach(row => {
      const { recordId, type } = row;
      if (type !== CellType.Record) return;
      // 考虑到可能会有 undefined 的情况，影响后续 min/max 的计算
      let curStart = Selectors.getCellValueByGanttDateTimeFieldId(state, snapshot, recordId, startFieldId) || null;
      let curEnd = Selectors.getCellValueByGanttDateTimeFieldId(state, snapshot, recordId, endFieldId) || null;
      if (curStart == null && curEnd != null) {
        curStart = curEnd;
      }
      if (curEnd == null && curStart != null) {
        curEnd = curStart;
      }
      start = (curStart != null && start != null && Math.min(curStart as number, start)) || start || curStart || null;
      end = (curEnd != null && end != null && Math.max(curEnd as number, end)) || end || curEnd || null;
    });

    const EDGE_COLUMN_COUNT = 3;
    const unitType = getUnitType(dateUnitType);
    const totalCount = (start == null || end == null) ? undefined : getDiffCount(start, end, unitType);
    const columnThreshold = totalCount ? Math.ceil(totalCount / 2) + EDGE_COLUMN_COUNT : undefined;
    const ganttCoordinate = new GanttCoordinate({
      rowHeight,
      columnWidth: 0,
      rowCount,
      columnCount: ganttVisibleColumns.length,
      containerWidth: 0,
      containerHeight: 0,
      dateUnitType,
      rowHeightLevel,
      rowInitSize: getGanttHeaderHeight(dateUnitType),
      rowIndicesMap: getRowIndicesMap(linearRows, rowHeight),
      workDays,
      onlyCalcWorkDay,
      columnThreshold,
      initDateTime: columnThreshold != null ? change(start!, columnThreshold - EDGE_COLUMN_COUNT, unitType) : Date.now()
    });
    if (columnThreshold != null) {
      ganttCoordinate.containerWidth = ganttCoordinate.totalWidth;
    }
    ganttCoordinate.containerHeight = ganttCoordinate.totalHeight + GRID_BOTTOM_STAT_HEIGHT;
    return ganttCoordinate;
  }, []);

  const gridInstance = useCreation<GridCoordinate>(() => {
    const gridCoordinate = new GridCoordinate({
      rowHeight,
      columnWidth: 0,
      rowCount,
      columnCount: gridVisibleColumns.length,
      containerWidth: 0,
      containerHeight: 0,
      rowIndicesMap: getRowIndicesMap(linearRows, rowHeight, ViewType.Gantt),
      columnIndicesMap: getColumnIndicesMap(gridVisibleColumns),
      autoHeadHeight,
      rowInitSize: getGanttHeaderHeight(dateUnitType),
      columnInitSize: GRID_ROW_HEAD_WIDTH,
      rowHeightLevel,
      frozenColumnCount: 1,
    });
    gridCoordinate.containerWidth = gridCoordinate.totalWidth;
    gridCoordinate.containerHeight = gridCoordinate.totalHeight + GRID_BOTTOM_STAT_HEIGHT;
    return gridCoordinate;
  }, []);

  return (
    <GanttStage
      ganttInstance={ganttInstance}
      gridInstance={gridInstance}
      gridScrollState={DEFAULT_SCROLL_STATE}
      ganttScrollState={DEFAULT_SCROLL_STATE}
      pointPosition={DEFAULT_POINT_POSITION}
      setPointPosition={() => {}}
      scrollIntoView={() => {}}
      isExporting
      listening={false}
    />
  );
};
