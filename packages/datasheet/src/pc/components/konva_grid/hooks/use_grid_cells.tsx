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
import { useContext } from 'react';
import { CellType, compensator, ConfigConstant, Field, IField, KONVA_DATASHEET_ID, Range, RecordMoveType, Selectors, ViewType } from '@apitable/core';
import { AreaType, PointPosition } from 'pc/components/gantt_view';
import {
  cellHelper,
  getCellHorizontalPosition,
  GridCoordinate,
  IRenderProps,
  KonvaGridContext,
  KonvaGridViewContext,
} from 'pc/components/konva_grid';
import { store } from 'pc/store';
import { addRowLayout, blankRowLayout, groupTabLayout, recordRowLayout } from '../model';

const Shape = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/shape'), { ssr: false });

export interface IUseGridBaseProps {
  instance: GridCoordinate;
  rowStartIndex: number;
  rowStopIndex: number;
  columnStartIndex: number;
  columnStopIndex: number;
  pointPosition: PointPosition;
}

export const getCellEditable = (field: IField, editable: boolean) => {
  if (!editable) false;
  const state = store.getState();
  const { datasheetId } = state.pageParams;
  const fieldId = field.id;
  return Selectors.getPermissions(state, datasheetId, fieldId).cellEditable && Field.bindModel(field).recordEditable();
};

export const useCells = (props: IUseGridBaseProps) => {
  const { instance, rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex, pointPosition } = props;
  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  const {
    datasheetId,
    groupInfo,
    fieldMap,
    snapshot,
    activeCell,
    linearRows,
    visibleColumns,
    permissions,
    selectRanges,
    recordRanges,
    currentSearchCell,
    recordMoveType,
    fillHandleStatus,
    fieldPermissionMap,
    allowShowCommentPane,
    gridViewDragState,
    view,
    unitTitleMap,
    cacheTheme,
  } = useContext(KonvaGridViewContext);

  const { rowHeight, columnCount, rowCount, rowHeightLevel, frozenColumnCount } = instance;
  const { rowIndex: pointRowIndex, columnIndex: pointColumnIndex, realAreaType, targetName } = pointPosition;
  const { editable: _editable, rowCreatable } = permissions;
  const dragRecordId = gridViewDragState.dragTarget?.recordId;
  const selectionRange = selectRanges[0];
  let renderGroupInfo = compensator.getLastGroupInfo();
  renderGroupInfo = renderGroupInfo || groupInfo;
  const groupCount = renderGroupInfo?.length;
  const viewType = view.type;
  const state = store.getState();
  const isNoneArea = realAreaType === AreaType.None;

  const cellsDrawer = (ctx: any, columnStartIndex: number, columnStopIndex: number) => {
    cellHelper.initCtx(ctx);
    addRowLayout.initCtx(ctx);
    blankRowLayout.initCtx(ctx);
    groupTabLayout.initCtx(ctx);
    recordRowLayout.initCtx(ctx);
    for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
      if (columnIndex > columnCount - 1) break;
      const { fieldId } = visibleColumns[columnIndex];
      const field = fieldMap[fieldId];
      if (field == null) continue;
      const columnWidth = instance.getColumnWidth(columnIndex);
      const x = instance.getColumnOffset(columnIndex) + 0.5;
      const isLastColumn = columnIndex === visibleColumns.length - 1;
      const editable = getCellEditable(field, _editable);

      if (columnIndex === 1) {
        cellHelper.initStyle(field, { fontWeight: 'normal' });
      }
      for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
        if (rowIndex > rowCount - 1) break;

        const row = linearRows[rowIndex];
        const { recordId, type, depth } = row;
        const y = instance.getRowOffset(rowIndex) + 0.5;
        const height = instance.getRowHeight(rowIndex);

        switch (type) {
          // Add Row Button
          case CellType.Add: {
            const isHoverColumn = pointColumnIndex === columnIndex;
            const isHoverRow = !isNoneArea && pointRowIndex === rowIndex && targetName === KONVA_DATASHEET_ID.GRID_ROW_ADD_BUTTON;
            addRowLayout.init({
              x,
              y,
              rowIndex,
              columnIndex,
              columnWidth,
              rowHeight: height,
              columnCount,
              groupCount,
              viewType,
            });
            addRowLayout.render({
              row,
              rowCreatable,
              isHoverRow,
              isHoverColumn,
            });
            break;
          }
          // Blank row
          case CellType.Blank: {
            blankRowLayout.init({
              x,
              y,
              rowIndex,
              columnIndex,
              columnWidth,
              rowHeight: height,
              columnCount,
              groupCount,
              viewType,
            });
            blankRowLayout.render({ row, colors });
            break;
          }
          // GroupTab
          case CellType.GroupTab: {
            const groupFieldId = renderGroupInfo![depth]?.fieldId;
            const groupField = fieldMap[groupFieldId];
            const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, groupFieldId);
            const isCryptoField = fieldRole === ConfigConstant.Role.None;
            const cellValue = groupField == null || isCryptoField ? null : Selectors.getCellValue(state, snapshot, recordId, groupField.id);
            groupTabLayout.init({
              x,
              y,
              rowIndex,
              columnIndex,
              columnWidth,
              rowHeight: height,
              columnCount,
              groupCount,
              viewType,
            });
            groupTabLayout.render({
              row,
              cellValue,
              groupField,
              isCryptoField,
              unitTitleMap,
              cacheTheme,
            });
            break;
          }
          // Record
          case CellType.Record: {
            const hasFoundMark = (() => {
              const searchKeyword = Selectors.getSearchKeyword(state);
              if (!searchKeyword) return false;
              const stringifyCellValue = Selectors.getStringifyCellValue(state, snapshot, recordId, field.id, true);
              if (!stringifyCellValue) return false;
              return stringifyCellValue?.toLowerCase().includes(searchKeyword.toLowerCase());
            })();

            const isCellInSelection = (() => {
              if (!selectionRange) return false;
              const currentCell = { recordId, fieldId };
              return Range.bindModel(selectionRange).contains(state, currentCell);
            })();
            let isCurrentSearchCell = false;
            if (currentSearchCell) {
              const [searchRecordId, searchFieldId] = currentSearchCell;
              isCurrentSearchCell = searchRecordId === recordId && searchFieldId === fieldId;
            }
            const isActiveRow = Boolean(activeCell && activeCell.recordId === recordId);
            const isThisCellWillMove = recordMoveType && recordMoveType !== RecordMoveType.NotMove && isActiveRow;
            let background = colors.white;
            const isHoverRow = pointRowIndex === rowIndex && !isNoneArea;
            const isCheckedRow = Boolean(recordRanges && recordRanges.findIndex((item) => item === recordId) !== -1);
            const isCellInFillSelection =
              fillHandleStatus?.fillRange && Range.bindModel(fillHandleStatus.fillRange).contains(state, { recordId, fieldId });
            const isActive = activeCell?.recordId === recordId && activeCell?.fieldId === fieldId;
            const isDraggingRow = dragRecordId === recordId;
            const commentCount = Selectors.getRecord(state, recordId, datasheetId)?.commentCount || 0;
            const commentVisible = allowShowCommentPane && Boolean(commentCount);

            if (isCurrentSearchCell) {
              background = colors.warnLight;
            } else if (isDraggingRow) {
              background = colors.lowestBg;
            } else if (isActive) {
              background = colors.defaultBg;
            } else if (isCellInFillSelection) {
              background = colors.warnLight;
            } else if (isCheckedRow) {
              background = colors.bgBrandLightDefaultSolid;
            } else if (isThisCellWillMove) {
              background = colors.warnLight;
            } else if (isCellInSelection) {
              background = colors.bgBrandLightDefaultSolid;
            } else if (hasFoundMark) {
              background = colors.primaryLightSolid;
            } else if (isActiveRow) {
              background = colors.bgBrandLightDefaultSolid;
            } else if (isHoverRow) {
              background = colors.bgBglessHoverSolid;
            }

            recordRowLayout.init({
              x,
              y,
              rowIndex,
              columnIndex,
              columnWidth,
              rowHeight,
              columnCount,
              groupCount,
              viewType,
            });
            recordRowLayout.render({
              row,
              style: { fill: background },
              isHoverRow,
              isCheckedRow,
              isActiveRow,
              isDraggingRow,
              isThisCellWillMove,
              commentCount,
              commentVisible,
              colors,
            });
            const { width, offset } = getCellHorizontalPosition({
              depth,
              columnIndex,
              columnWidth,
              columnCount,
            });
            const realX = x + offset - 0.5;
            const realY = y - 0.5;
            const style = { fontWeight: 'normal' };
            const cellValue = Selectors.getCellValue(state, snapshot, recordId, fieldId);

            const permissions = Selectors.getDatasheet(state)?.permissions || {};
            const renderProps = {
              x: realX,
              y: realY,
              columnWidth: width,
              rowHeight,
              recordId,
              permissions,
              field,
              cellValue,
              isActive,
              editable,
              style,
              rowHeightLevel,
              viewType: ViewType.Grid,
              unitTitleMap,
              cacheTheme,
              colors,
            };

            cellHelper.initStyle(field, style);
            // The contents of the last column need to be clip to prevent overflow
            if (isLastColumn && cellValue != null) {
              ctx.save();
              ctx.rect(realX, realY, width, rowHeight);
              ctx.clip();
              cellHelper.renderCellValue(renderProps as IRenderProps, ctx);
              ctx.restore();
            } else {
              cellHelper.renderCellValue(renderProps as IRenderProps, ctx);
            }
          }
        }
      }
    }
  };

  // Freeze column cells
  const frozenCells = <Shape listening={false} perfectDrawEnabled={false} sceneFunc={(ctx: any) => cellsDrawer(ctx, 0, frozenColumnCount - 1)} />;

  // Other column cells
  const cells = (
    <Shape
      listening={false}
      perfectDrawEnabled={false}
      sceneFunc={(ctx: any) => cellsDrawer(ctx, Math.max(columnStartIndex, frozenColumnCount), columnStopIndex)}
    />
  );

  return {
    cells,
    frozenCells,
  };
};
