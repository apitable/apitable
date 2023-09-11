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

import dynamic from 'next/dynamic';
import * as React from 'react';
import { ReactNode, useContext, useMemo } from 'react';
import { CellType, KONVA_DATASHEET_ID } from '@apitable/core';
import { AreaType, GANTT_HEADER_HEIGHT, GanttCoordinate, IScrollState, KonvaGanttViewContext, PointPosition } from 'pc/components/gantt_view';
import { Line, Rect } from 'pc/components/konva_components';
import { KonvaGridContext, KonvaGridViewContext } from 'pc/components/konva_grid';

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
  const { instance, scrollState, pointPosition, containerWidth, rowStartIndex, rowStopIndex } = props;

  const { scrollTop } = scrollState;
  const { rowHeight, containerHeight } = instance;
  const { realAreaType, rowIndex, offsetTop, targetName } = pointPosition;

  // Context
  const { dragTaskId, dragSplitterInfo } = useContext(KonvaGanttViewContext);
  const { linearRows, recordRanges, rowsIndexMap, activeCell, visibleRows } = useContext(KonvaGridViewContext);
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

    return <Line y={y + 0.5} points={[0, 0, containerWidth, 0]} stroke={theme.color.primaryColor} />;
  }, [containerWidth, dragTaskId, instance, linearRows, offsetTop, rowHeight, rowIndex, scrollTop, theme.color.primaryColor]);

  // Drawing the highlighted line in Hover state
  const hoverRow: ReactNode = useMemo(() => {
    const isNoneArea = realAreaType == AreaType.None;
    const isRecordType = linearRows[rowIndex]?.type === CellType.Record;
    if (isNoneArea || !isRecordType || NOT_HOVER_TARGET_NAMES.has(targetName)) return;
    const y = instance.getRowOffset(rowIndex);

    return <Rect y={y + 0.5} width={containerWidth} height={rowHeight - 0.5} fill={colors.rowSelectedBg} />;
  }, [realAreaType, containerWidth, instance, linearRows, rowHeight, rowIndex, targetName, colors.rowSelectedBg]);

  // Highlighting rows in Active state
  const activeRow: ReactNode = useMemo(() => {
    if (isMobile || !activeCell) return null;

    const { recordId } = activeCell;
    const rowIndex = rowsIndexMap.get(`${CellType.Record}_${recordId}`);
    if (rowIndex == null) return null;
    const y = instance.getRowOffset(rowIndex);
    return <Rect y={y + 0.5} width={containerWidth} height={rowHeight - 1} fill={colors.rowSelectedBg} />;
  }, [activeCell, containerWidth, instance, isMobile, rowHeight, rowsIndexMap, colors.rowSelectedBg]);

  /**
   * Draw selected rows
   * Here's a trick, for the full selection case, only the content of the visible area is rendered on the UI
   */
  const selectedRows = useMemo(() => {
    if (recordRanges == null) return null;
    const selectedRows: React.ReactNode[] = [];
    const isSelectedAll = recordRanges.length === visibleRows.length;

    // Select All
    if (isSelectedAll) {
      for (let i = rowStartIndex; i < rowStopIndex; i++) {
        const record = linearRows[i];
        if (record.type === CellType.Record) {
          const y = instance.getRowOffset(i);
          selectedRows.push(
            <Rect key={`selected-record-${record.recordId}`} y={y} width={containerWidth} height={rowHeight} fill={theme.color.cellSelectedColor} />,
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
          <Rect key={`selected-record-${recordId}`} y={y} width={containerWidth} height={rowHeight} fill={theme.color.cellSelectedColor} />,
        );
      }
    }
    return selectedRows;
  }, [
    containerWidth,
    instance,
    linearRows,
    recordRanges,
    rowHeight,
    rowStartIndex,
    rowStopIndex,
    rowsIndexMap,
    theme.color.cellSelectedColor,
    visibleRows.length,
  ]);

  let dragSplitter: ReactNode = null;
  if (dragSplitterInfo.visible) {
    const { x } = dragSplitterInfo;
    dragSplitter = <Status x={x} KONVA_DATASHEET_ID={KONVA_DATASHEET_ID} containerHeight={containerHeight} theme={theme} />;
  }

  return {
    hoverRow,
    activeRow,
    selectedRows,
    dragSplitter,
    dragRowHighlightLine,
  };
};
