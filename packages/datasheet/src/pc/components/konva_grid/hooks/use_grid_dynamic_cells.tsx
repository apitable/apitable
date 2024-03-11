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

import { KonvaEventObject } from 'konva/lib/Node';
import { isEqual } from 'lodash';
import { ShortcutActionManager, ShortcutActionName } from 'modules/shared/shortcut_key';
import dynamic from 'next/dynamic';
import * as React from 'react';
import { useCallback, useContext, useMemo } from 'react';
import {
  BasicValueType,
  CellType,
  Field,
  FieldType,
  IField,
  KONVA_DATASHEET_ID,
  LOOKUP_VALUE_FUNC_SET,
  Range,
  RollUpFuncType,
  Selectors,
  Strings,
  t,
} from '@apitable/core';
import { generateTargetName, IScrollState } from 'pc/components/gantt_view';
import { Rect } from 'pc/components/konva_components';
import {
  cellHelper,
  getCellEditable,
  getCellHeight,
  GRID_FILL_HANDLER_SIZE,
  GRID_GROUP_OFFSET,
  GridCoordinate,
  IRenderStyleProps,
  KonvaGridContext,
  KonvaGridViewContext,
} from 'pc/components/konva_grid';
import { store } from 'pc/store';
import { MouseDownType } from '../../multi_grid';
import { CellValue } from '../components';

const RectComponent = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/rect'), { ssr: false });

const TOOLTIP_TEXT_MAP = {
  [FieldType.Formula]: t(Strings.formula_check_info),
  [FieldType.LookUp]: t(Strings.lookup_check_info),
  [FieldType.AutoNumber]: t(Strings.uneditable_check_info),
  [FieldType.CreatedBy]: t(Strings.uneditable_check_info),
  [FieldType.LastModifiedBy]: t(Strings.uneditable_check_info),
  [FieldType.CreatedTime]: t(Strings.uneditable_check_info),
  [FieldType.LastModifiedTime]: t(Strings.uneditable_check_info),
};

const TOOLTIP_VISIBLE_SET = new Set([
  FieldType.LookUp,
  FieldType.Formula,
  FieldType.AutoNumber,
  FieldType.CreatedBy,
  FieldType.LastModifiedBy,
  FieldType.CreatedTime,
  FieldType.LastModifiedTime,
]);

const TRANSPARENT_FIELD_TYPES = new Set([
  FieldType.Attachment,
  FieldType.Checkbox,
  FieldType.Currency,
  FieldType.Number,
  FieldType.Percent,
  FieldType.AutoNumber,
]);

const TRANSPARENT_LOOKUP_FIELD_TYPES = new Set([FieldType.Attachment, FieldType.Checkbox]);

const DBL_CLICK_DISABLED_TYPES = new Set([FieldType.Member, FieldType.SingleSelect, FieldType.MultiSelect]);

const EMPTY_ARRAY: any[] = [];

interface IUseDynamicCellsProps {
  instance: GridCoordinate;
  rowStartIndex: number;
  rowStopIndex: number;
  columnStartIndex: number;
  columnStopIndex: number;
  scrollState: IScrollState;
}

/**
 * Determine where a cell is located based on whether it is the first/last column
 */
export const getCellHorizontalPosition = (props: { depth: number; columnWidth: number; columnIndex: number; columnCount: number }) => {
  const { depth, columnWidth, columnIndex, columnCount } = props;
  if (!depth) return { width: columnWidth, offset: 0 };
  const firstIndent = columnIndex === 0 && depth;
  const lastIndent = columnIndex === columnCount - 1 && depth === 3;
  const offset = firstIndent ? (depth - 1) * GRID_GROUP_OFFSET + 0.5 : 0;
  const width = lastIndent && !firstIndent ? columnWidth - GRID_GROUP_OFFSET : columnWidth - offset;

  return {
    width,
    offset,
  };
};

export const useDynamicCells = (props: IUseDynamicCellsProps) => {
  const { instance, rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex, scrollState } = props;
  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  const {
    view,
    datasheetId,
    fieldMap,
    snapshot,
    activeCell,
    linearRows,
    visibleColumns,
    currentSearchCell,
    isEditing,
    selectRanges,
    permissions,
    disabledDownload,
    unitTitleMap,
    cacheTheme,
  } = useContext(KonvaGridViewContext);
  const { isScrolling } = scrollState;
  const { activeCellBound, setTooltipInfo, clearTooltipInfo, draggingOutlineInfo, activeNodePrivate } = useContext(KonvaGridContext);
  const state = store.getState();
  const { rowHeight, rowHeightLevel, columnCount, rowCount, frozenColumnCount, rowInitSize } = instance;
  const totalColumnCount = visibleColumns.length;
  const { cellEditable, editable: _editable } = permissions;
  const activeCellHeight = activeCellBound.height;

  const checkIsVisible = useCallback(
    (rowIndex: number, columnIndex: number) => {
      if (columnIndex < frozenColumnCount) return true;
      return rowIndex >= rowStartIndex && rowIndex <= rowStopIndex && columnIndex >= columnStartIndex && columnIndex <= columnStopIndex;
    },
    [columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex, frozenColumnCount],
  );

  /**
   * Active state cells, active border
   */
  const activeCellMap = useMemo(() => {
    let activedCell: React.ReactNode = null;
    let activeCellBorder: React.ReactNode = null;
    let frozenActivedCell: React.ReactNode = null;
    let frozenActiveCellBorder: React.ReactNode = null;

    if (activeCell != null) {
      const { recordId, fieldId } = activeCell;
      const cellUIIndex = Selectors.getCellUIIndex(state, activeCell);
      if (cellUIIndex != null) {
        const { rowIndex, columnIndex } = cellUIIndex;
        if (rowIndex != null && columnIndex != null && checkIsVisible(rowIndex, columnIndex)) {
          const { type, depth } = linearRows[rowIndex];

          if (type === CellType.Record) {
            const activeField = fieldMap[fieldId];
            if (activeField == null) {
              return {
                activedCell,
                activeCellBorder,
                frozenActivedCell,
                frozenActiveCellBorder,
              };
            }
            const x = instance.getColumnOffset(columnIndex);
            const y = instance.getRowOffset(rowIndex);
            const columnWidth = instance.getColumnWidth(columnIndex);
            const cellValue = Selectors.getCellValue(state, snapshot, recordId, fieldId);
            const isFrozenColumn = columnIndex < frozenColumnCount;
            const { offset, width } = getCellHorizontalPosition({
              depth,
              columnWidth,
              columnIndex,
              columnCount: totalColumnCount,
            });
            let isCurrentSearchCell = false;
            if (currentSearchCell) {
              const [searchRecordId, searchFieldId] = currentSearchCell;
              isCurrentSearchCell = searchRecordId === recordId && searchFieldId === fieldId;
            }
            const editable = getCellEditable(activeField, _editable);
            const fontWeight = 'normal';
            const permissions = Selectors.getDatasheet(state)?.permissions || {};

            const renderProps = {
              x: x + offset,
              y,
              permissions,
              columnWidth: width,
              rowHeight,
              recordId,
              field: activeField,
              cellValue,
              editable,
              isActive: true,
              rowHeightLevel,
              viewType: view.type,
              style: {
                fontWeight,
              } as IRenderStyleProps,
              unitTitleMap,
              cacheTheme,
              colors,
            };

            cellHelper.needDraw = false;
            cellHelper.initStyle(activeField, { fontWeight });
            const renderData = cellHelper.renderCellValue(renderProps);
            const realField = Selectors.findRealField(state, activeField);
            const height = getCellHeight({
              field: activeField,
              realField,
              rowHeight,
              activeHeight: activeCellHeight,
              isActive: true,
            });

            const currentCell = (
              <>
                {!(
                  (Field.bindModel(activeField).basicValueType === BasicValueType.Boolean ||
                    TRANSPARENT_FIELD_TYPES.has(activeField.type) ||
                    TRANSPARENT_LOOKUP_FIELD_TYPES.has((realField || activeField).type)) &&
                  !LOOKUP_VALUE_FUNC_SET.has(activeField.property?.rollUpType || RollUpFuncType.VALUES)
                ) && <Rect x={x + offset} y={y} width={width} height={height} fill={colors.defaultBg} listening={false} />}
                <CellValue
                  x={x + offset}
                  y={y}
                  columnWidth={width}
                  rowHeight={rowHeight}
                  recordId={recordId}
                  renderData={renderData as any}
                  cellValue={cellValue}
                  field={activeField}
                  isActive
                  editable={editable}
                  datasheetId={datasheetId}
                  disabledDownload={disabledDownload}
                  style={{
                    background: isCurrentSearchCell ? colors.fc14 : undefined,
                  }}
                />
              </>
            );
            const currentCellBorder = (
              <Rect
                x={x + offset}
                y={y}
                width={width + 1}
                height={height}
                fillEnabled={false}
                stroke={colors.primaryColor}
                strokeWidth={2}
                cornerRadius={2}
                listening={false}
              />
            );
            if (isFrozenColumn) {
              frozenActivedCell = currentCell;
              frozenActiveCellBorder = currentCellBorder;
            } else {
              activedCell = currentCell;
              activeCellBorder = currentCellBorder;
            }
          }
        }
      }
    }

    return {
      activedCell,
      activeCellBorder,
      frozenActivedCell,
      frozenActiveCellBorder,
    };
    // eslint-disable-next-line
  }, [
    activeCell,
    activeCellHeight,
    checkIsVisible,
    totalColumnCount,
    currentSearchCell,
    datasheetId,
    fieldMap,
    instance,
    linearRows,
    rowHeight,
    rowHeightLevel,
    snapshot,
    colors.defaultBg,
  ]);

  /**
   * Drag handler
   */
  let fillHandler: React.ReactNode = null;
  let frozenFillHandler: React.ReactNode = null;

  const toggleEditing: () => Promise<boolean | void> = useCallback((): Promise<boolean | void> => {
    return ShortcutActionManager.trigger(ShortcutActionName.ToggleEditing);
  }, []);

  const onDblClick = useCallback(
    async (e: KonvaEventObject<MouseEvent>, field: IField, rowIndex: number, columnIndex: number): Promise<void> => {
      if (e.evt.button === MouseDownType.Right) return;
      const fieldType = field.type;
      if (DBL_CLICK_DISABLED_TYPES.has(fieldType)) return;
      if (!TOOLTIP_VISIBLE_SET.has(fieldType)) {
        await toggleEditing();
        return;
      }
      if (cellEditable) {
        setTooltipInfo({
          title: TOOLTIP_TEXT_MAP[fieldType],
          visible: true,
          rowIndex,
          columnIndex,
          width: instance.getColumnWidth(columnIndex),
          height: rowHeight,
        });
        setTimeout(clearTooltipInfo, 2000);
        return;
      }
    },
    [cellEditable, clearTooltipInfo, instance, rowHeight, setTooltipInfo, toggleEditing],
  );

  const onMouseDown = useCallback(
    (e: any, field: any, isActive: any) => {
      if (e.evt.button === MouseDownType.Right) return;
      if (![FieldType.MultiSelect, FieldType.SingleSelect, FieldType.Member].includes(field.type)) return;
      if (getCellEditable(field, _editable) && isActive) toggleEditing();
    },
    [_editable, toggleEditing],
  );

  const getPlaceHolderCellsByColumnIndex = useCallback(
    (columnStartIndex: number, columnStopIndex: number) => {
      const tempCells: React.ReactNode[] = [];

      for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
        if (columnIndex > columnCount - 1) return EMPTY_ARRAY;
        const { fieldId } = visibleColumns[columnIndex];
        const field = fieldMap[fieldId];
        if (field == null) return EMPTY_ARRAY;
        const x = instance.getColumnOffset(columnIndex) + 0.5;
        const columnWidth = instance.getColumnWidth(columnIndex);

        for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
          if (rowIndex > rowCount - 1) break;

          const row = linearRows[rowIndex];
          const { recordId, type, depth } = row;
          if (type !== CellType.Record) continue;

          const y = instance.getRowOffset(rowIndex) + 0.5;
          const { width, offset } = getCellHorizontalPosition({
            depth,
            columnWidth,
            columnIndex,
            columnCount,
          });
          const isActive = isEqual(activeCell, { fieldId, recordId });
          let height = rowHeight;

          if (isActive) {
            const realField = Selectors.findRealField(state, field);
            height = getCellHeight({
              field,
              realField,
              rowHeight,
              activeHeight: activeCellHeight,
              isActive,
            });
          }

          tempCells.unshift(
            <RectComponent
              key={`placeholder-cell-${fieldId}-${recordId}`}
              name={generateTargetName({
                targetName: KONVA_DATASHEET_ID.GRID_CELL,
                fieldId,
                recordId,
              })}
              x={x + offset}
              y={y}
              width={width}
              height={height}
              fill={'transparent'}
              strokeEnabled={false}
              hitStrokeWidth={0}
              transformsEnabled={'position'}
              perfectDrawEnabled={false}
              shadowEnabled={false}
              onDblClick={(e: KonvaEventObject<MouseEvent>) => onDblClick(e, field, rowIndex, columnIndex)}
              onMouseDown={(e: any) => onMouseDown(e, field, isActive)}
              onTap={(e: any) => onMouseDown(e, field, isActive)}
            />,
          );
        }
      }

      return tempCells;
      // eslint-disable-next-line
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      activeCell,
      activeCellHeight,
      columnCount,
      fieldMap,
      instance,
      linearRows,
      rowInitSize,
      onDblClick,
      onMouseDown,
      rowCount,
      rowHeight,
      rowStartIndex,
      rowStopIndex,
      visibleColumns,
    ],
  );

  const placeHolderCells = useMemo(() => {
    if (isScrolling) return null;
    return getPlaceHolderCellsByColumnIndex(columnStartIndex, columnStopIndex);
  }, [columnStartIndex, columnStopIndex, getPlaceHolderCellsByColumnIndex, isScrolling]);

  const frozenPlaceHolderCells = useMemo(() => {
    if (isScrolling) return null;
    return getPlaceHolderCellsByColumnIndex(0, frozenColumnCount - 1);
  }, [getPlaceHolderCellsByColumnIndex, frozenColumnCount, isScrolling]);

  const draggingOutline = useMemo(() => {
    if (draggingOutlineInfo == null) return null;
    const { rowIndex, columnIndex } = draggingOutlineInfo;
    const x = instance.getColumnOffset(columnIndex);
    const y = instance.getRowOffset(rowIndex);
    const columnWidth = instance.getColumnWidth(columnIndex);
    return (
      <Rect
        x={x + 2}
        y={y + 2}
        width={columnWidth - 3}
        height={rowHeight - 3}
        fillEnabled={false}
        stroke={colors.primaryColor}
        strokeWidth={2}
        dash={[8, 4]}
        listening={false}
      />
    );
  }, [colors.primaryColor, draggingOutlineInfo, instance, rowHeight]);

  if (!isEditing && selectRanges.length) {
    const selectionRange = selectRanges[0];
    if (selectionRange != null) {
      const fillHandleCellIndex = Range.bindModel(selectionRange).getUIIndexRange(state);
      const { min: recordMinIndex, max: recordMaxIndex } = fillHandleCellIndex?.record || {
        min: null,
        max: null,
      };
      const { min: fieldMinIndex, max: fieldMaxIndex } = fillHandleCellIndex?.field || {
        min: null,
        max: null,
      };
      if (recordMaxIndex != null && !isNaN(recordMaxIndex) && fieldMaxIndex != null && !isNaN(fieldMaxIndex)) {
        const maxIndexColumn = visibleColumns[fieldMaxIndex];
        if (!maxIndexColumn) return;
        const { fieldId } = maxIndexColumn;
        const maxIndexField = fieldMap[fieldId];
        // Computed fields do not render drag handler
        if (getCellEditable(maxIndexField, _editable)) {
          const x = instance.getColumnOffset(fieldMaxIndex);
          const y = instance.getRowOffset(recordMaxIndex);
          const isSingleCell = recordMinIndex === recordMaxIndex && fieldMinIndex === fieldMaxIndex;
          const activeField = fieldMap[activeCell!.fieldId];
          const realField = Selectors.findRealField(state, activeField);
          const cellHeight = getCellHeight({
            field: activeField,
            realField,
            rowHeight,
            activeHeight: activeCellBound.height,
            isActive: isSingleCell,
          });
          const columnWidth = instance.getColumnWidth(fieldMaxIndex);
          const { depth } = linearRows[recordMaxIndex];
          const { width, offset } = getCellHorizontalPosition({
            depth,
            columnWidth,
            columnIndex: fieldMaxIndex,
            columnCount: totalColumnCount,
          });

          const currentHandler = (
            <Rect
              name={KONVA_DATASHEET_ID.GRID_CELL_FILL_HANDLER}
              x={x - GRID_FILL_HANDLER_SIZE / 2 - 0.5 + width + offset}
              y={y + cellHeight - GRID_FILL_HANDLER_SIZE / 2 - 0.5}
              width={GRID_FILL_HANDLER_SIZE}
              height={GRID_FILL_HANDLER_SIZE}
              stroke={colors.primaryColor}
              strokeWidth={0.5}
            />
          );
          // select section with workdoc field cannot be filled
          let selectWithWorkdocField = false;
          for (let idx = fieldMinIndex; idx <= fieldMaxIndex; idx++) {
            const { fieldId } = visibleColumns[idx];
            const field = fieldMap[fieldId];
            if (field.type === FieldType.WorkDoc) {
              selectWithWorkdocField = true;
              break;
            }
          }
          if (selectWithWorkdocField) {
            fillHandler = null;
          } else if (fieldMaxIndex < frozenColumnCount) {
            frozenFillHandler = currentHandler;
          } else {
            fillHandler = currentHandler;
          }
        }
      }
    }
  }

  return {
    ...activeCellMap,
    fillHandler,
    frozenFillHandler,
    placeHolderCells,
    frozenPlaceHolderCells,
    draggingOutline,
    toggleEditing,
  };
};