import { CellType } from '@apitable/core';
import { Rect } from 'pc/components/konva_components';
import {
  GRID_BOTTOM_STAT_HEIGHT, GRID_GROUP_OFFSET, GRID_GROUP_STAT_HEIGHT, GRID_ROW_HEAD_WIDTH, GridCoordinate, KonvaGridContext, KonvaGridViewContext
} from 'pc/components/konva_grid';
import * as React from 'react';
import { useCallback, useContext, useMemo } from 'react';
import { Stat } from '../components/stat';

interface IUseStatsProps {
  instance: GridCoordinate;
  rowStartIndex: number;
  rowStopIndex: number;
  columnStartIndex: number;
  columnStopIndex: number;
}

enum RenderType {
  Group = 'group',
  Bottom = 'bottom'
}

export const useStats = (props: IUseStatsProps) => {
  const {
    instance,
    rowStartIndex,
    rowStopIndex,
    columnStartIndex,
    columnStopIndex,
  } = props;

  const {
    view,
    linearRows,
    visibleColumns,
  } = useContext(KonvaGridViewContext);
  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  const {
    rowInitSize,
    columnCount,
    frozenColumnCount,
    containerWidth,
    containerHeight
  } = instance;
  const viewType = view.type;

  // 渲染统计栏
  const getStats = useCallback(({
    y,
    row,
    columnStartIndex,
    columnStopIndex,
    isFrozen = false,
    renderType = RenderType.Group
  }) => {
    const { recordId, depth } = row || {};
    const stats: React.ReactNode[] = [];
    const isGroup = renderType === RenderType.Group;

    for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
      if (columnIndex > columnCount - 1) break;
      const isFirstBottomStat = columnIndex === 0 && !isGroup;
      const x = isFirstBottomStat ? 1 : instance.getColumnOffset(columnIndex);
      const { fieldId } = visibleColumns[columnIndex];
      const columnWidth = instance.getColumnWidth(columnIndex);
      const isLastField = columnIndex === columnCount - 1;
      const lastIndent = isLastField && depth === 2;
      const additionalWidth = isFirstBottomStat ? GRID_ROW_HEAD_WIDTH - 1 : 0;

      stats.push(
        <Stat
          key={`${renderType}-stat-${recordId}-${fieldId}-${depth}`}
          x={x}
          y={y}
          width={lastIndent ? columnWidth - GRID_GROUP_OFFSET : columnWidth + additionalWidth}
          height={isGroup ? GRID_GROUP_STAT_HEIGHT : GRID_BOTTOM_STAT_HEIGHT}
          fieldId={fieldId}
          row={row}
          isFrozen={isFrozen}
          viewType={viewType}
        />
      );
    }
    return stats;
  }, [instance, visibleColumns, columnCount, viewType]);

  return useMemo(() => {
    const { rowCount } = instance;
    const frozenGroupStats: React.ReactNode[] = [];
    const groupStats: React.ReactNode[] = [];

    for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
      if (rowIndex > rowCount - 1) break;
      const row = linearRows[rowIndex];
      if (row.type !== CellType.GroupTab) continue;
      const y = instance.getRowOffset(rowIndex);

      frozenGroupStats.push(...getStats({
        y,
        row,
        columnStartIndex: 0,
        columnStopIndex: frozenColumnCount - 1,
        isFrozen: true,
      }));

      groupStats.push(...getStats({
        y,
        row,
        columnStartIndex: Math.max(columnStartIndex, frozenColumnCount),
        columnStopIndex,
      }));
    }

    const bottomFrozenStats = getStats({
      y: containerHeight - GRID_BOTTOM_STAT_HEIGHT,
      columnStartIndex: 0,
      columnStopIndex: frozenColumnCount - 1,
      renderType: RenderType.Bottom,
    });

    const bottomStats = getStats({
      y: containerHeight - GRID_BOTTOM_STAT_HEIGHT,
      columnStartIndex: Math.max(columnStartIndex, frozenColumnCount),
      columnStopIndex,
      renderType: RenderType.Bottom,
    });

    const bottomStatBackground = (
      <Rect
        x={0.5}
        y={containerHeight - GRID_BOTTOM_STAT_HEIGHT - 0.5}
        width={containerWidth}
        height={GRID_BOTTOM_STAT_HEIGHT + 1}
        fill={colors.defaultBg}
        stroke={colors.sheetLineColor}
        strokeWidth={1}
      />
    );

    return {
      groupStats,
      frozenGroupStats,
      bottomStats,
      bottomFrozenStats,
      bottomStatBackground
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    instance, getStats, containerHeight, frozenColumnCount, columnStartIndex, columnStopIndex, rowInitSize,
    containerWidth, colors.defaultBg, colors.sheetLineColor, rowStartIndex, rowStopIndex, linearRows
  ]);
};
