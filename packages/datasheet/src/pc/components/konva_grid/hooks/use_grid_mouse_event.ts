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

import { useUpdateEffect } from 'ahooks';
import { KonvaEventObject } from 'konva/lib/Node';
import { isEqual } from 'lodash';
import { useContext, useEffect, useMemo, useState } from 'react';
import { batchActions } from 'redux-batched-actions';
import { Message } from '@apitable/components';
import {
  CellType,
  CollaCommandName,
  ConfigConstant,
  ExecuteResult,
  FieldType,
  ILinkField,
  KONVA_DATASHEET_ID,
  Range,
  RowHeightLevel,
  Selectors,
  StoreActions,
  Strings,
  t,
} from '@apitable/core';
import { appendRow } from 'modules/shared/shortcut_key/shortcut_actions/append_row';
import { notify } from 'pc/components/common/notify';
import { NotifyKey } from 'pc/components/common/notify/notify.interface';
import { expandRecord, expandRecordIdNavigate } from 'pc/components/expand_record';
import { AreaType, getDetailByTargetName, PointPosition } from 'pc/components/gantt_view';
import {
  cellHelper,
  GRID_BOTTOM_STAT_HEIGHT,
  GRID_DEFAULT_HORIZONTAL_SPACING,
  GRID_DEFAULT_VERTICAL_SPACING,
  GRID_GROUP_OFFSET,
  GRID_ROW_HEAD_WIDTH,
  GRID_SCROLL_BASE_SPEED,
  GridCoordinate,
  IRenderStyleProps,
  KonvaGridContext,
  KonvaGridViewContext,
  useAttachEvent,
} from 'pc/components/konva_grid';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { createdBySubscritionMessage } from 'pc/utils/created_by_subscrition_message';
import { MouseDownType } from '../../multi_grid';

const openDialog = (groupTab: any, tabCanvasX: number, tabCanvasY: number, data: any, groupField: ILinkField) => {
  const { width, height, canvasX, canvasY } = groupTab;
  if (tabCanvasX >= canvasX && tabCanvasX <= canvasX + width && tabCanvasY >= canvasY && tabCanvasY <= canvasY + height) {
    expandRecord({
      activeRecordId: groupTab.id,
      recordIds: Array.isArray(data) ? data.map((v) => v.id) : [data.id],
      datasheetId: groupField.property.foreignDatasheetId,
    });
    return true;
  }
  return false;
};

interface IUseGridMouseEventProps {
  instance: GridCoordinate;
  pointPosition: PointPosition;
  rowStartIndex: number;
  rowStopIndex: number;
  columnStartIndex?: number;
  columnStopIndex?: number;
  offsetX?: number;
  getMousePosition: (x: number, y: number, targetName?: string) => PointPosition;
  scrollTop?: number;
}

export const useGridMouseEvent = (props: IUseGridMouseEventProps) => {
  const { instance, pointPosition, rowStartIndex, rowStopIndex, offsetX = 0, getMousePosition, columnStartIndex, columnStopIndex, scrollTop } = props;
  const {
    snapshot,
    fieldPermissionMap,
    fieldMap,
    datasheetId,
    linearRows,
    visibleRows,
    activeCell,
    visibleColumns,
    fillHandleStatus,
    permissions,
    groupInfo,
    sortInfo,
    recordRanges,
    selectRanges,
    view,
    dispatch,
    rowsIndexMap,
    fieldIndexMap,
    currentSearchCell,
    isSearching,
    selection,
    fieldRanges,
    visibleRecordIds,
    visibleRowsIndexMap,
    gridViewDragState,
    cacheTheme,
  } = useContext(KonvaGridViewContext);
  const { onEditorPosition, scrollToItem, setMouseStyle, isCellDown, setCellDown, scrollHandler, canAppendRow, onSetCanAppendRow } =
    useContext(KonvaGridContext);
  const { handleForHeader, handleForCell, handleForFillBar, handleForOtherArea } = useAttachEvent({
    datasheetId,
    fieldRanges,
    fieldIndexMap,
    selectRanges,
    visibleRows,
    visibleColumns,
    activeCell,
    onViewMouseDown: onEditorPosition,
  });
  const { x: pointX, y: pointY, targetName, realTargetName, realAreaType, rowIndex: pointRowIndex, columnIndex: pointColumnIndex } = pointPosition;
  const isAllowDrag = !(!groupInfo.length && sortInfo?.keepSort);
  const pointRecordId = linearRows[pointRowIndex]?.recordId;
  const pointFieldId = visibleColumns[pointColumnIndex]?.fieldId;
  const state = store.getState();
  const [isFillStart, setFillStart] = useState<boolean>(false);
  const routeRecordId = state.pageParams.recordId;
  const { rowInitSize, frozenColumnWidth, containerWidth, containerHeight } = instance;

  // Hide column jump to highlight selected columns
  useUpdateEffect(() => {
    if (!activeCell) {
      return;
    }
    const activeUICell = Selectors.getCellUIIndex(state, activeCell)!;
    activeUICell &&
      setTimeout(() => {
        scrollToItem(activeUICell);
      }, 100);
  }, [activeCell]);

  // Search
  useUpdateEffect(() => {
    const state = store.getState();
    const activeCell = Selectors.getActiveCell(state);
    // Activated cells have a higher priority than the cells highlighted in the datasheet lookup
    if (activeCell) return;
    if (currentSearchCell) {
      const [searchRecordId, searchFieldId] = currentSearchCell;
      const currentSearchUICell = Selectors.getCellUIIndex(state, { recordId: searchRecordId, fieldId: searchFieldId })!;
      currentSearchUICell && scrollToItem(currentSearchUICell);
    }
  }, [currentSearchCell?.toString()]);

  // Expand the record to scroll to the corresponding record
  useEffect(() => {
    if (!routeRecordId) return;
    if (activeCell && activeCell.recordId && activeCell.recordId === routeRecordId) return;
    if (!rowsIndexMap.has(`${CellType.Record}_${routeRecordId}`)) return;
    const fieldId = view!.columns[0].fieldId;
    dispatch(
      StoreActions.setActiveCell(datasheetId, {
        recordId: routeRecordId,
        fieldId,
      }),
    );
    const expandRecordUICell = Selectors.getCellUIIndex(state, { recordId: routeRecordId, fieldId })!;
    if (expandRecordUICell && (expandRecordUICell.rowIndex < rowStartIndex || expandRecordUICell.rowIndex > rowStopIndex)) {
      scrollToItem(expandRecordUICell);
    }
    // eslint-disable-next-line
  }, [routeRecordId, datasheetId]);

  // The current user is editing, but the "column" or "row" where the edited cell is located is hidden or deleted
  useMemo(() => {
    const editingCell = Selectors.getEditingCell(store.getState());
    if (!editingCell || !Object.keys(editingCell).length) return;

    const { fieldId, recordId } = editingCell;
    const isEditColumnExit = visibleColumns.some((item) => item.fieldId === fieldId);
    const isEditRecordExit = rowsIndexMap.has(`${CellType.Record}_${recordId}`);

    if (!isEditColumnExit || !isEditRecordExit) {
      Message.warning({ content: t(Strings.cell_not_exist_content) });
      onEditorPosition();
      dispatch(batchActions([StoreActions.clearSelection(datasheetId), StoreActions.setEditStatus(datasheetId, null)]));
    }
  }, [visibleColumns, rowsIndexMap, dispatch, datasheetId, onEditorPosition]);

  // Exit the search and scroll to the last highlighted cell
  useUpdateEffect(() => {
    if (isSearching) return;
    if (!activeCell) return;
    if (selection && selection.fieldRanges) return;
    const state = store.getState();
    const activeUICell = Selectors.getCellUIIndex(state, activeCell)!;
    activeUICell &&
      setTimeout(() => {
        scrollToItem(activeUICell);
      }, 0);
  }, [isSearching]);

  /**
   * Activating cell operations
   */
  const activeGridCell = (mouseEvent: MouseEvent, targetName: string, rowIndex: number, columnIndex: number) => {
    if (rowIndex === -1 && columnIndex === -1) return;
    mouseEvent.preventDefault();
    const { recordId: targetRecordId, fieldId: targetFieldId } = getDetailByTargetName(targetName);
    const currentActiveCell =
      targetRecordId && targetFieldId
        ? {
          recordId: targetRecordId,
          fieldId: targetFieldId,
        }
        : null;
    if (currentActiveCell) {
      setCellDown(true);
      // Prevent multiple activation of cell events
      if (isEqual(currentActiveCell, activeCell)) return;
      handleForCell(mouseEvent, currentActiveCell);
    }
  };

  /**
   * Add row operation
   */
  const addRow = async (recordId: string, areaType: AreaType) => {
    if (areaType === AreaType.None || !permissions.rowCreatable) return;
    const rowCount = visibleRows.length;
    const finalRecordId = groupInfo.length ? recordId : rowCount > 0 ? visibleRows[rowCount - 1].recordId : '';
    await appendRow({ recordId: finalRecordId });
    createdBySubscritionMessage(fieldMap);
  };

  /**
   * Select row operation
   */
  const selectRow = (mouseEvent: MouseEvent, recordId: string) => {
    if (!recordId) return;
    const defaultFn = () => dispatch(StoreActions.setRecordRange(datasheetId, [recordId]));

    if (mouseEvent.shiftKey) {
      if (!recordRanges || recordRanges.length === 0) return defaultFn();
      if (recordRanges.includes(recordId)) return;

      const rowIndexs = recordRanges.map((id) => visibleRowsIndexMap.get(id)!).sort((a, b) => a - b);
      const checkedRowIndex = visibleRowsIndexMap.get(pointRecordId)!;
      const [startIndex, endIndex] = [Math.min(checkedRowIndex, rowIndexs[0]), Math.max(checkedRowIndex, rowIndexs[rowIndexs.length - 1])];
      return dispatch(StoreActions.setRecordRange(datasheetId, visibleRecordIds.slice(startIndex, endIndex + 1)));
    }
    return defaultFn();
  };

  /**
   * Select all operation
   */
  const selectAll = () => {
    const recordIds = recordRanges?.length === visibleRows.length ? [] : visibleRows.map((r) => r.recordId);
    return dispatch(StoreActions.setRecordRange(datasheetId, recordIds));
  };

  /**
   * Drag-and-drop row operation
   */
  const dragRow = (mouseEvent: MouseEvent) => {
    if (mouseEvent.button === MouseDownType.Right) return;
    if (!permissions.rowSortable || !isAllowDrag || pointRowIndex === -1) return;
    setMouseStyle('move');
    store.dispatch(
      batchActions([
        StoreActions.clearSelectionButKeepCheckedRecord(datasheetId),
        StoreActions.setDragTarget(datasheetId, { recordId: pointRecordId }),
      ]),
    );
  };

  /**
   * Grid border scrolling operation
   */
  const scrollByPosition = () => {
    const toTopSpacing = pointY - rowInitSize;
    const toBottomSpacing = containerHeight - pointY - GRID_BOTTOM_STAT_HEIGHT;
    const toLeftSpacing = pointX - GRID_ROW_HEAD_WIDTH - frozenColumnWidth - offsetX;
    const toRightSpacing = containerWidth ? containerWidth - pointX - offsetX : Infinity;
    if (toBottomSpacing < GRID_DEFAULT_VERTICAL_SPACING) {
      scrollHandler.scrollByValue({
        rowSpeed: ((GRID_DEFAULT_VERTICAL_SPACING - toBottomSpacing) * GRID_SCROLL_BASE_SPEED) / GRID_DEFAULT_VERTICAL_SPACING,
      });
    } else if (toTopSpacing < GRID_DEFAULT_VERTICAL_SPACING) {
      scrollHandler.scrollByValue({
        rowSpeed: (-(GRID_DEFAULT_VERTICAL_SPACING - toTopSpacing) * GRID_SCROLL_BASE_SPEED) / GRID_DEFAULT_VERTICAL_SPACING,
      });
    } else if (toRightSpacing < GRID_DEFAULT_HORIZONTAL_SPACING) {
      scrollHandler.scrollByValue({
        columnSpeed: ((GRID_DEFAULT_HORIZONTAL_SPACING - toRightSpacing) * GRID_SCROLL_BASE_SPEED) / GRID_DEFAULT_HORIZONTAL_SPACING,
      });
    } else if (toLeftSpacing < GRID_DEFAULT_HORIZONTAL_SPACING && toLeftSpacing > 0) {
      scrollHandler.scrollByValue({
        columnSpeed: (-(GRID_DEFAULT_HORIZONTAL_SPACING - toLeftSpacing) * GRID_SCROLL_BASE_SPEED) / GRID_DEFAULT_HORIZONTAL_SPACING,
      });
    } else {
      scrollHandler.stopScroll();
    }
  };

  const onMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const mouseEvent = e.evt;
    const _targetName = e.target.name();
    const { targetName, fieldId: targetFieldId } = getDetailByTargetName(_targetName);
    switch (targetName) {
      case KONVA_DATASHEET_ID.GRID_FIELD_HEAD_MORE:
      case KONVA_DATASHEET_ID.GRID_FIELD_HEAD_DESC:
      case KONVA_DATASHEET_ID.GRID_FIELD_HEAD: {
        mouseEvent.preventDefault();
        if (!targetFieldId) return;
        onSetCanAppendRow(false);
        return handleForHeader(mouseEvent, targetFieldId, pointColumnIndex, false);
      }
      // Fill handler
      case KONVA_DATASHEET_ID.GRID_CELL_FILL_HANDLER: {
        if (mouseEvent.button === MouseDownType.Right) return;
        setFillStart(true);
        onSetCanAppendRow(true);
        return handleForFillBar();
      }
      // activated cell
      case KONVA_DATASHEET_ID.GRID_DATE_CELL_CREATE_ALARM:
      case KONVA_DATASHEET_ID.GRID_DATE_CELL_ALARM:
      case KONVA_DATASHEET_ID.GRID_CELL: {
        onSetCanAppendRow(false);
        return activeGridCell(mouseEvent, _targetName, pointRowIndex, pointColumnIndex);
      }
      // drag handler
      case KONVA_DATASHEET_ID.GRID_ROW_DRAG_HANDLER: {
        onSetCanAppendRow(true);
        return dragRow(mouseEvent);
      }
      case KONVA_DATASHEET_ID.GRID_ROW_HEAD:
      case KONVA_DATASHEET_ID.GRID_CELL_LINK_ICON:
      case KONVA_DATASHEET_ID.GRID_ROW_EXPAND_RECORD:
      case KONVA_DATASHEET_ID.GRID_ROW_SELECT_CHECKBOX:
      case KONVA_DATASHEET_ID.GRID_FIELD_HEAD_SELECT_CHECKBOX: {
        if (mouseEvent.button === MouseDownType.Right) return;
        onSetCanAppendRow(false);
        return onEditorPosition();
      }
      default: {
        if (targetName !== KONVA_DATASHEET_ID.GRID_ROW_ADD_BUTTON) {
          onSetCanAppendRow(true);
        }
        return handleForOtherArea(mouseEvent, false);
      }
    }
  };

  const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();
    if (activeCell) {
      const { recordId: activeRecordId, fieldId: activeFieldId } = activeCell;
      const { recordId: targetRecordId, fieldId: targetFieldId } = getDetailByTargetName(realTargetName);
      if (activeRecordId === targetRecordId && activeFieldId === targetFieldId) return;
      // Drag-and-drop selection operation
      if (isCellDown) {
        scrollByPosition();
        return dispatch(
          StoreActions.setSelection({
            start: activeCell,
            end: {
              recordId: pointRecordId,
              fieldId: pointFieldId,
            },
          }),
        );
      }
      // Drag-and-drop handle operation
      if (fillHandleStatus?.isActive && isFillStart) {
        scrollByPosition();
        return dispatch(
          StoreActions.setFillHandleStatus({
            isActive: true,
            hoverCell: {
              recordId: pointRecordId,
              fieldId: pointFieldId,
            },
          }),
        );
      }
    }
  };

  const onMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();
    // Reset Status
    setCellDown(false);
    setFillStart(false);
    scrollHandler.stopScroll();

    // Filling
    if (activeCell && fillHandleStatus && fillHandleStatus.isActive && fillHandleStatus.fillRange) {
      // TODO: Cross-sectional detection
      const { result } = resourceService.instance!.commandManager.execute({
        cmd: CollaCommandName.FillDataToCells,
        selectionRange: selectRanges,
        fillRange: fillHandleStatus.fillRange,
        direction: fillHandleStatus.direction,
      });
      if (result !== ExecuteResult.Fail) {
        const range = Range.bindModel(selectRanges[0]).combine(state, fillHandleStatus.fillRange!);
        if (range) {
          dispatch(StoreActions.setSelection(range));
        }
        dispatch(StoreActions.setFillHandleStatus({ isActive: false }));
        notify.open({
          message: t(Strings.toast_cell_fill_success),
          key: NotifyKey.FillCell,
        });
        return;
      }
    }
  };

  const onClick = (e: KonvaEventObject<MouseEvent>) => {
    const mouseEvent = e.evt;
    mouseEvent.preventDefault();
    if (mouseEvent.button !== MouseDownType.Left) return;

    if (targetName === KONVA_DATASHEET_ID.GRID_ROW_ADD_BUTTON && !canAppendRow) {
      onSetCanAppendRow(true);
      return;
    }

    switch (targetName) {
      case KONVA_DATASHEET_ID.GRID_ROW_ADD_BUTTON: {
        return addRow(pointRecordId, realAreaType);
      }
      case KONVA_DATASHEET_ID.GRID_ROW_SELECT_CHECKBOX: {
        return selectRow(mouseEvent, pointRecordId);
      }
      case KONVA_DATASHEET_ID.GRID_ROW_EXPAND_RECORD: {
        return expandRecordIdNavigate(pointRecordId!);
      }
      case KONVA_DATASHEET_ID.GRID_FIELD_HEAD_SELECT_CHECKBOX: {
        return selectAll();
      }
      // Group tab click triggers
      case KONVA_DATASHEET_ID.GRID_GROUP_TAB: {
        if (columnStartIndex !== undefined && columnStopIndex !== undefined && scrollTop !== undefined) {
          // Get the coordinates of the mouse click in the canvas
          const element = mouseEvent.target as HTMLCanvasElement;
          const { x, y } = element.getBoundingClientRect();
          const tabCanvasX = mouseEvent.clientX - x - offsetX;
          const tabCanvasY = mouseEvent.clientY - y + scrollTop;

          // Calculates the rendering coordinates of the group tab for the canvas
          const { columnCount, rowCount } = instance;
          for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
            if (columnIndex > columnCount - 1) break;
            const columnWidth = instance.getColumnWidth(columnIndex);
            for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
              if (rowIndex > rowCount - 1) break;

              const row = linearRows[rowIndex];
              const { recordId, type, depth } = row;
              const y = instance.getRowOffset(rowIndex) + 0.5;
              const height = instance.getRowHeight(rowIndex);
              if (type === CellType.GroupTab) {
                const groupFieldId = groupInfo![depth]?.fieldId;
                const groupField = fieldMap[groupFieldId];
                if (groupField?.type !== FieldType.Link) break;
                const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, groupFieldId);
                const isCryptoField = fieldRole === ConfigConstant.Role.None;
                if (groupField == null && !isCryptoField) break;
                const cellValue = isCryptoField ? null : Selectors.getCellValue(state, snapshot, recordId, groupField.id);

                const permissions = Selectors.getDatasheet(state)?.permissions || {};
                const renderProps = {
                  x: depth * GRID_GROUP_OFFSET + 0.5 + 25.5,
                  permissions,
                  y: y + 17.5,
                  columnWidth,
                  rowHeight: height - 18,
                  recordId,
                  field: groupField,
                  cellValue,
                  isActive: false,
                  rowHeightLevel: RowHeightLevel.Short,
                  style: { textAlign: 'left' } as IRenderStyleProps,
                  viewType: 1,
                  cacheTheme,
                };
                const data = cellHelper.renderCellValue(renderProps) as Array<any>;
                if (data) {
                  // Find the group tab that overlaps with the mouse position and open the pop-up if found
                  if (Array.isArray(data)) {
                    for (let index = 0; index < data.length; index++) {
                      const groupTab = data[index];
                      if (openDialog(groupTab, tabCanvasX, tabCanvasY, data, groupField)) {
                        return;
                      }
                    }
                  } else if (openDialog(data, tabCanvasX, tabCanvasY, data, groupField)) {
                    return;
                  }
                }
              }
            }
          }
        }
        break;
      }
    }
  };

  const onTap = (e: KonvaEventObject<MouseEvent>) => {
    const mouseEvent = e.evt;
    mouseEvent.preventDefault();
    const target = e.target;
    const _targetName = target.name();
    const pos = target.getStage()?.getPointerPosition();
    if (pos == null) return;
    const { x, y } = pos;
    const { realAreaType, targetName, rowIndex, columnIndex } = getMousePosition(x, y, _targetName);
    const pointRecordId = linearRows[rowIndex]?.recordId;
    switch (targetName) {
      case KONVA_DATASHEET_ID.GRID_ROW_ADD_BUTTON: {
        return addRow(pointRecordId, realAreaType);
      }
      case KONVA_DATASHEET_ID.GRID_ROW_SELECT_CHECKBOX: {
        return selectRow(mouseEvent, pointRecordId);
      }
      case KONVA_DATASHEET_ID.GRID_ROW_EXPAND_RECORD: {
        return expandRecordIdNavigate(pointRecordId!);
      }
      case KONVA_DATASHEET_ID.GRID_FIELD_HEAD_SELECT_CHECKBOX: {
        return selectAll();
      }
      case KONVA_DATASHEET_ID.GRID_CELL: {
        return activeGridCell(mouseEvent, _targetName, rowIndex, columnIndex);
      }
      default: {
        if (targetName !== KONVA_DATASHEET_ID.GRID_ROW_ADD_BUTTON) {
          onSetCanAppendRow(true);
        }
        return handleForOtherArea(mouseEvent, false);
      }
    }
  };

  const handleMouseStyle = (realTargetName: string, areaType: AreaType = AreaType.Grid) => {
    const { fieldId, recordId } = gridViewDragState.dragTarget;
    const isDragging = fieldId || recordId;
    // In drag and drop, no style setting
    if (isDragging) return;

    const { targetName, mouseStyle } = getDetailByTargetName(realTargetName);
    if (mouseStyle) return setMouseStyle(mouseStyle);
    if (areaType === AreaType.None) return setMouseStyle('default');

    switch (targetName) {
      case KONVA_DATASHEET_ID.GRID_CELL_FILL_HANDLER: {
        return setMouseStyle('crosshair');
      }
      case KONVA_DATASHEET_ID.GRID_FIELD_HEAD_OPACITY_LINE: {
        return setMouseStyle('col-resize');
      }
      case KONVA_DATASHEET_ID.GRID_DATE_CELL_ALARM:
      case KONVA_DATASHEET_ID.GRID_DATE_CELL_CREATE_ALARM:
      case KONVA_DATASHEET_ID.GRID_ROW_ADD_BUTTON:
      case KONVA_DATASHEET_ID.GRID_ROW_DRAG_HANDLER:
      case KONVA_DATASHEET_ID.GRID_FIELD_HEAD_SELECT_CHECKBOX:
      case KONVA_DATASHEET_ID.GRID_FIELD_HEAD_MORE:
      case KONVA_DATASHEET_ID.GRID_ROW_EXPAND_RECORD:
      case KONVA_DATASHEET_ID.GRID_ROW_SELECT_CHECKBOX:
      case KONVA_DATASHEET_ID.GRID_GROUP_TOGGLE_BUTTON:
      case KONVA_DATASHEET_ID.GRID_CELL_LINK_ICON:
      case KONVA_DATASHEET_ID.GRID_FIELD_ADD_BUTTON:
      case KONVA_DATASHEET_ID.GRID_FIELD_HEAD_DESC:
      case KONVA_DATASHEET_ID.GRID_BOTTOM_STAT:
      case KONVA_DATASHEET_ID.GRID_GROUP_STAT:
      case KONVA_DATASHEET_ID.GRID_FROZEN_SHADOW_LINE: {
        return setMouseStyle('pointer');
      }
      default:
        return setMouseStyle('default');
    }
  };

  return {
    onTap,
    onClick,
    onMouseUp,
    onMouseDown,
    onMouseMove,
    handleMouseStyle,
  };
};
