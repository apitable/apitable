import { CellType, KONVA_DATASHEET_ID } from '@vikadata/core';
import dynamic from 'next/dynamic';
import { AreaType, GANTT_HEADER_HEIGHT, GanttCoordinate, IScrollState, KonvaGanttViewContext, PointPosition } from 'pc/components/gantt_view';
import { Line, Rect } from 'pc/components/konva_components';
import { KonvaGridContext, KonvaGridViewContext } from 'pc/components/konva_grid';
import * as React from 'react';
import { ReactNode, useContext, useMemo } from 'react';

const Status = dynamic(() => import('pc/components/gantt_view/group/status'), { ssr: false });

const NOT_HOVER_TARGET_NAMES = new Set([
  KONVA_DATASHEET_ID.GANTT_HEADER,
  KONVA_DATASHEET_ID.GANTT_BACK_TO_NOW_BUTTON,
  KONVA_DATASHEET_ID.GANTT_PREV_PAGE_BUTTON,
  KONVA_DATASHEET_ID.GANTT_NEXT_PAGE_BUTTON,
  KONVA_DATASHEET_ID.GRID_FIELD_HEAD,
  KONVA_DATASHEET_ID.GRID_FIELD_HEAD_SELECT_CHECKBOX,
  KONVA_DATASHEET_ID.GRID_FIELD_HEAD_MORE,
  KONVA_DATASHEET_ID.GRID_FIELD_HEAD_DESC,
]);

interface IUseStatusProps {
  instance: GanttCoordinate;
  scrollState: IScrollState;
  pointPosition: PointPosition;
  containerWidth: number;
  rowStartIndex: number;
  rowStopIndex: number;
}

export const useStatus = (props: IUseStatusProps) => {
  const {
    instance,
    scrollState,
    pointPosition,
    containerWidth,
    rowStartIndex,
    rowStopIndex,
  } = props;

  const { scrollTop } = scrollState;
  const { rowHeight, containerHeight } = instance;
  const {
    realAreaType,
    rowIndex,
    offsetTop,
    targetName
  } = pointPosition;

  // Context
  const {
    dragTaskId,
    dragSplitterInfo
  } = useContext(KonvaGanttViewContext);
  const {
    linearRows,
    recordRanges,
    rowsIndexMap,
    activeCell,
    visibleRows,
  } = useContext(KonvaGridViewContext);
  const { isMobile: _isMobile, isTouchDevice, theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  const isMobile = _isMobile || isTouchDevice;

  const dragRowHighlightLine = useMemo(() => {
    const isRecordType = linearRows[rowIndex]?.type === CellType.Record;
    if (!dragTaskId || !isRecordType) return null;
    const prevY = instance.getRowOffset(rowIndex);
    const nextY = prevY + rowHeight;
    const y = (offsetTop - prevY) * 2 > rowHeight ? nextY : prevY;
    if (y - scrollTop < GANTT_HEADER_HEIGHT) return null;

    return (
      <Line
        y={y + 0.5}
        points={[0, 0, containerWidth, 0]}
        stroke={theme.color.primaryColor}
      />
    );
  }, [containerWidth, dragTaskId, instance, linearRows, offsetTop, rowHeight, rowIndex, scrollTop, theme.color.primaryColor]);

  // 绘制 Hover 状态下的高亮行
  const hoverRow: ReactNode = useMemo(() => {
    const isNoneArea = realAreaType == AreaType.None;
    const isRecordType = linearRows[rowIndex]?.type === CellType.Record;
    if (isNoneArea || !isRecordType || NOT_HOVER_TARGET_NAMES.has(targetName)) return;
    const y = instance.getRowOffset(rowIndex);

    return (
      <Rect
        y={y + 0.5}
        width={containerWidth}
        height={rowHeight - 0.5}
        fill={colors.rowSelectedBg}
      />
    );
  }, [realAreaType, containerWidth, instance, linearRows, rowHeight, rowIndex, targetName, colors.rowSelectedBg]);

  // 绘制 Active 状态下的高亮行
  const activeRow: ReactNode = useMemo(() => {
    if (isMobile || !activeCell) return null;

    const { recordId } = activeCell;
    const rowIndex = rowsIndexMap.get(`${CellType.Record}_${recordId}`);
    if (rowIndex == null) return null;
    const y = instance.getRowOffset(rowIndex);
    return (
      <Rect
        y={y + 0.5}
        width={containerWidth}
        height={rowHeight - 1}
        fill={colors.rowSelectedBg}
      />
    );
  }, [activeCell, containerWidth, instance, isMobile, rowHeight, rowsIndexMap, colors.rowSelectedBg]);

  /**
   * 绘制选中行
   * 这里取个巧，对于全选的情况，只在 UI 上渲染可见的区域内容
   */
  const selectedRows = useMemo(() => {
    if (recordRanges == null) return null;
    const selectedRows: React.ReactNode[] = [];
    const isSelectedAll = recordRanges.length === visibleRows.length;

    // 全选
    if (isSelectedAll) {
      for (let i = rowStartIndex; i < rowStopIndex; i++) {
        const record = linearRows[i];
        if (record.type === CellType.Record) {
          const y = instance.getRowOffset(i);
          selectedRows.push(
            <Rect
              key={`selected-record-${record.recordId}`}
              y={y}
              width={containerWidth}
              height={rowHeight}
              fill={theme.color.cellSelectedColor}
            />
          );
        }
      }
    } else {
      for (let i = 0; i < recordRanges.length; i++) {
        const recordId = recordRanges[i];
        const rowIndex = rowsIndexMap.get(`${CellType.Record}_${recordId}`);
        if (rowIndex == null || rowIndex < rowStartIndex || rowIndex > rowStopIndex) continue;
        const y = instance.getRowOffset(rowIndex);

        selectedRows.push(
          <Rect
            key={`selected-record-${recordId}`}
            y={y}
            width={containerWidth}
            height={rowHeight}
            fill={theme.color.cellSelectedColor}
          />
        );
      }
    }
    return selectedRows;
  }, [
    containerWidth, instance, linearRows, recordRanges, rowHeight, rowStartIndex, rowStopIndex,
    rowsIndexMap, theme.color.cellSelectedColor, visibleRows.length
  ]);

  let dragSplitter: ReactNode = null;
  if (dragSplitterInfo.visible) {
    const { x } = dragSplitterInfo;
    dragSplitter = (
      <Status
        x={x}
        KONVA_DATASHEET_ID={KONVA_DATASHEET_ID}
        containerHeight={containerHeight}
        theme={theme}
      />
    );
  }

  return {
    hoverRow,
    activeRow,
    selectedRows,
    dragSplitter,
    dragRowHighlightLine,
  };
};
