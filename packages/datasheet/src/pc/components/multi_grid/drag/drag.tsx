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

import { useBoolean } from 'ahooks';
import { useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import {
  ISetRecordOptions,
  ICellValue,
  IGridViewColumn,
  IGridViewProperty,
  IReduxState,
  CollaCommandName,
  ConfigConstant,
  DropDirectionType,
  FieldType,
  MIN_COLUMN_WIDTH,
  Selectors,
  StoreActions,
  ISnapshot,
  IFieldPermissionMap,
} from '@apitable/core';
import { useCacheScroll } from 'pc/context';
import { resourceService } from 'pc/resource_service';
import { useAppSelector } from 'pc/store/react-redux';
import { CELL_CLASS, FIELD_HEAD_CLASS, getElementDataset, getParentNodeByClass, OPACITY_LINE_CLASS, OPERATE_HEAD_CLASS } from 'pc/utils';
import { getMoveColumnsResult } from 'pc/utils/datasheet';
import { getClickCellId, getGroupHeadRecordId } from 'pc/utils/dom';
import { executeCommandWithMirror } from 'pc/utils/execute_command_with_mirror';
import { getCellValuesForGroupRecord } from '../../../../modules/shared/shortcut_key/shortcut_actions/append_row';
import { HoverLine } from '../hover_line/hover_line';
import { MicroComponent } from '../micro_component';
import { IDragOption, IDragProps, IGlobalRef } from './interface';

export const dependsGroup2ChangeData = (
  dragData: { recordId: string }[],
  overTargetId: string,
  options: {
    groupLevel: number;
    snapshot: ISnapshot;
    view: IGridViewProperty;
    fieldPermissionMap?: IFieldPermissionMap;
  },
) => {
  const { groupLevel, snapshot, view, fieldPermissionMap } = options;
  if (groupLevel) {
    const targetRecordData = snapshot.recordMap[overTargetId].data;
    const setRecordList: { recordId: string; fieldId: string; fieldType: FieldType; value: ICellValue }[] = [];
    for (const v of dragData) {
      for (const vs of view.groupInfo!) {
        const groupFieldId = vs.fieldId;
        const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, groupFieldId);

        if (fieldRole && fieldRole !== ConfigConstant.Role.Editor) {
          continue;
        }

        setRecordList.push({
          recordId: v.recordId,
          fieldId: vs.fieldId,
          fieldType: snapshot.meta.fieldMap[vs.fieldId].type,
          value: targetRecordData[vs.fieldId],
        });
      }
    }
    return setRecordList;
  }
  return null;
};

export const Drag: React.FC<React.PropsWithChildren<IDragProps>> = (props) => {
  const { gridRef, scrollWhenHitViewEdg, getFieldId, checkInGrid, checkIsOpacityLine, getClickCellId: _getClickCellId } = props;
  const {
    gridViewDragState,
    columnSortable,
    columnWidthEditable,
    visibleColumns,
    visibleRows,
    selectRecordIds,
    snapshot,
    view,
    datasheetId,
    fieldRanges,
    groupLevel,
    keepSort,
    fieldIndexMap,
    rowsIndexMap,
  } = useAppSelector((state: IReduxState) => {
    const { columnSortable, columnWidthEditable } = Selectors.getPermissions(state);

    return {
      columnSortable,
      columnWidthEditable,
      gridViewDragState: Selectors.getGridViewDragState(state),
      visibleColumns: Selectors.getVisibleColumns(state) as IGridViewColumn[],
      visibleRows: Selectors.getVisibleRows(state),
      selectRecordIds: Selectors.getSelectRecordIds(state),
      snapshot: Selectors.getSnapshot(state)!,
      view: Selectors.getCurrentView(state) as IGridViewProperty,
      datasheetId: Selectors.getActiveDatasheetId(state)!,
      fieldRanges: Selectors.getFieldRanges(state),
      groupLevel: Selectors.getGroupLevel(state),
      keepSort: Selectors.getActiveViewSortInfo(state)?.keepSort,
      fieldIndexMap: Selectors.getVisibleColumnsMap(state),
      rowsIndexMap: Selectors.getPureVisibleRowsIndexMap(state),
    };
  }, shallowEqual);

  const fieldIndexRanges = fieldRanges
    ? visibleColumns
      .map((column) => fieldIndexMap.get(column.fieldId)!)
      .slice(fieldIndexMap.get(fieldRanges[0]), fieldIndexMap.get(fieldRanges[fieldRanges.length - 1])! + 1)
    : [];

  const dispatch = useDispatch();
  const [direction, setDirection] = useState<DropDirectionType>(DropDirectionType.NONE);
  const [dragOption, setDragOption] = useState<IDragOption>({
    overTargetId: '',
    overGroupPath: '',
    dragOffsetX: -1000,
    dragOffsetY: -1000,
  });
  const [isDown, { setTrue: setDown, setFalse: setUnDown }] = useBoolean(false);
  const [isChangeColumns, { setTrue: setChange, setFalse: setUnChange }] = useBoolean(false);
  const globalRef = useRef<IGlobalRef>({
    current: null,
    pageX: 0,
    scrollLeft: 0,
    originPageX: 0,
    changeWidthFieldId: '',
  });
  const fieldPermissionMap = useAppSelector(Selectors.getFieldPermissionMap);
  const scrollValue = useCacheScroll();

  function getGlobalRef() {
    return globalRef.current;
  }

  function setGlobalRef(value: { [key: string]: any }) {
    const previous = globalRef.current;
    globalRef.current = { ...previous, ...value };
  }

  function setDragOptionFunc(option: Partial<IDragOption>) {
    setDragOption((preState) => ({ ...preState, ...option }));
  }

  const changeColumnWidth = (e: MouseEvent) => {
    let fieldHeader: HTMLElement | string | null | undefined = null;
    let fieldId: string | null | undefined = null;
    if (getFieldId) {
      fieldId = getFieldId(e);
      fieldHeader = fieldId;
    } else {
      fieldHeader = getParentNodeByClass(e.target as HTMLElement, FIELD_HEAD_CLASS);
      const columnIndex = getElementDataset(fieldHeader, 'columnIndex')!;
      if (!columnIndex || !fieldHeader) {
        return;
      }
      fieldId = getElementDataset(fieldHeader, 'fieldId');
    }
    if (!fieldId) {
      return;
    }

    setDown();
    setGlobalRef({
      current: fieldHeader,
      pageX: e.pageX,
      scrollLeft: scrollValue.scrollLeft ? scrollValue.scrollLeft : 0,
      changeWidthFieldId: fieldId,
    });
    setChange();
  };

  function dispatchDragField(e: MouseEvent) {
    if (view.lockInfo) {
      return;
    }
    const { recordId, fieldId } = _getClickCellId?.(e) || getClickCellId(e.target as HTMLElement);
    if (recordId != null || fieldId == null) {
      return;
    }
    if (!columnSortable) {
      return;
    }
    setDown();
    setGlobalRef({ originPageX: e.pageX });

    dispatch(
      StoreActions.setDragTarget(datasheetId, {
        fieldId: fieldId,
        columnIndex: visibleColumns.findIndex((col) => col.fieldId === fieldId),
      }),
    );
  }

  const mouseDown = (e: MouseEvent) => {
    const isChangeColumnWidth = Boolean(
      checkIsOpacityLine ? checkIsOpacityLine(e) : getParentNodeByClass(e.target as HTMLElement, OPACITY_LINE_CLASS),
    );
    if (isChangeColumnWidth && columnWidthEditable && !view.lockInfo) {
      // If you have the permission to modify and you click on the dom that modifies the column width, you start modifying the column width
      changeColumnWidth(e);
      return;
    }
    if (gridViewDragState.dragTarget.recordId) {
      setDown();
      return;
    }
    dispatchDragField(e);
  };

  /**
   * @description Handling automatic sorting under grouping
   * @param {MouseEvent} e
   */
  function dragWithSortInfo(e: MouseEvent) {
    const groupHeadRecordId = getGroupHeadRecordId(e);
    dispatch(StoreActions.setHoverGroupPath(datasheetId, groupHeadRecordId || null));
    const { recordId: overTargetId } = _getClickCellId?.(e) || getClickCellId(e.target as HTMLElement, true);
    setDragOptionFunc({
      overTargetId: overTargetId || '',
      overGroupPath: groupHeadRecordId || '',
      dragOffsetX: e.pageX,
      dragOffsetY: e.pageY,
    });
  }

  function setMouseStyle() {
    const { dragTarget } = gridViewDragState;
    if (isChangeColumns) {
      gridRef!.current!.style.cursor = 'col-resize';
    }

    if (!isChangeColumns && (dragTarget.fieldId || dragTarget.recordId)) {
      gridRef!.current!.style.cursor = 'move';
    }
  }

  const mouseMove = (e: MouseEvent) => {
    if (!isDown || !gridRef) {
      return;
    }
    scrollWhenHitViewEdg(e);
    const { dragTarget } = gridViewDragState;
    setMouseStyle();
    const noDragTarget = !(dragTarget.recordId || dragTarget.fieldId);

    if (noDragTarget || isChangeColumns) {
      return;
    }

    if (keepSort && dragTarget.recordId) {
      return dragWithSortInfo(e);
    }
    const { recordId, fieldId } = _getClickCellId?.(e) || getClickCellId(e.target as HTMLElement);

    if (dragTarget.recordId) {
      setDragOptionFunc({
        overTargetId: recordId || '',
        dragOffsetX: e.pageX,
        dragOffsetY: e.pageY,
      });
    } else {
      // Dragging distance more than 5 pixels, dragging bar appears
      const dragOffsetX = Math.abs(e.pageX - getGlobalRef().originPageX) > 5 ? e.pageX : 0;
      const dragOffsetY = e.pageY;
      if (!dragOffsetX) {
        return;
      }
      setDragOptionFunc({
        overTargetId: fieldId || '',
        dragOffsetX,
        dragOffsetY,
      });
    }
  };

  const clearOperateState = () => {
    setGlobalRef({ originPageX: 0 });
    dispatch(batchActions([StoreActions.setDragTarget(datasheetId, {}), StoreActions.setHoverGroupPath(datasheetId, null)]));
    setDragOptionFunc({
      overTargetId: '',
      dragOffsetX: -1000,
      dragOffsetY: -1000,
    });
    setUnChange();
  };

  const setColumnWidth = (e: MouseEvent) => {
    const ref = getGlobalRef().current;
    if (!ref) {
      return clearOperateState();
    }
    const pageXDiff = e.pageX - getGlobalRef().pageX;
    const scrollLeftDiff = scrollValue.scrollLeft! - getGlobalRef().scrollLeft;
    const changeWidthSum = pageXDiff + scrollLeftDiff;
    const changeWidthFieldId = getGlobalRef().changeWidthFieldId;
    const changeWidthColumn = visibleColumns.find((column) => column.fieldId === changeWidthFieldId);
    const originWidth = Selectors.getColumnWidth(changeWidthColumn as IGridViewColumn);
    const finalWidth = Math.max(originWidth + changeWidthSum, MIN_COLUMN_WIDTH);

    executeCommandWithMirror(
      () => {
        resourceService.instance!.commandManager.execute({
          cmd: CollaCommandName.SetColumnsProperty,
          viewId: view.id,
          fieldId: getGlobalRef().changeWidthFieldId,
          data: {
            width: finalWidth,
          },
        });
      },
      {
        columns: visibleColumns.map((column) => (column.fieldId === getGlobalRef().changeWidthFieldId ? { ...column, width: finalWidth } : column)),
      },
    );
    setGlobalRef({ current: null });
    clearOperateState();
  };

  function dragItemDownForField(e: MouseEvent) {
    const { overTargetId } = dragOption;
    if (!gridRef!.current!.contains(e.target as Element)) {
      return;
    }
    if (overTargetId === '' || fieldRanges?.includes(overTargetId)) {
      return clearOperateState();
    }
    // let direction: DropDirectionType = DropDirectionType.NONE;
    const element = checkInGrid ? checkInGrid(e) : getParentNodeByClass(e.target as HTMLElement, [CELL_CLASS, FIELD_HEAD_CLASS]);
    if (!element) {
      return;
    }

    if (fieldRanges == null || fieldRanges.includes(overTargetId)) {
      return;
    }

    const targetIndex = fieldIndexMap.get(overTargetId);

    if (
      (targetIndex === fieldIndexRanges[0] - 1 && direction === DropDirectionType.AFTER) ||
      (targetIndex === fieldIndexRanges[fieldIndexRanges.length - 1] + 1 && direction === DropDirectionType.BEFORE)
    ) {
      return;
    }

    const prepareForMoveColumns = fieldRanges.map((fieldId) => {
      return {
        fieldId,
        overTargetId,
        direction,
      };
    });

    dispatch(StoreActions.clearSelection(datasheetId));

    executeCommandWithMirror(
      () => {
        resourceService.instance!.commandManager.execute({
          cmd: CollaCommandName.MoveColumn,
          viewId: view.id,
          data: prepareForMoveColumns,
        });
      },
      {
        columns: getMoveColumnsResult({
          viewId: view.id,
          data: prepareForMoveColumns,
          datasheetId,
        }),
      },
    );
  }

  /**
   * @description There is a group and there is an auto sort,
   * drop the dragged record and then set the corresponding value according to the value of the group
   * The logic here is not the same as drag sorting,
   * appendRows places the dragged record above or below the target record, but when there is an automatic sort,
   * instead of sorting the record manually, set the value of the corresponding cell to the value of the group,
   * without changing the position of the record.
   */
  function setCellValueByKeepSort() {
    const { dragTarget } = gridViewDragState;
    let recordIds: string[] = [];
    if (selectRecordIds.length) {
      // The record you are currently working on is already checked or in the selection
      recordIds = selectRecordIds;
    } else {
      // The record currently in operation is not checked
      recordIds = [dragTarget.recordId!];
    }
    const groupCellValues = getCellValuesForGroupRecord(dragOption.overTargetId);
    const recordsData = recordIds.reduce<ISetRecordOptions[]>((recordsData, recordId) => {
      view.groupInfo!.forEach(({ fieldId }, index) => {
        recordsData.push({
          value: groupCellValues![index],
          recordId,
          fieldId,
        });
      });
      return recordsData;
    }, []);

    resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.SetRecords,
      data: recordsData,
    });
  }

  function dragItemDownForRecord(e: MouseEvent) {
    const { dragTarget } = gridViewDragState;
    const { overTargetId } = dragOption;
    if (!gridRef!.current!.contains(e.target as Element)) {
      return;
    }

    if (keepSort && dragTarget && view.groupInfo && overTargetId) {
      return setCellValueByKeepSort();
    }

    if (visibleRows.length === selectRecordIds.length || overTargetId === '') {
      return clearOperateState();
    }

    const element = checkInGrid ? checkInGrid(e) : getParentNodeByClass(e.target as HTMLElement, [CELL_CLASS, OPERATE_HEAD_CLASS]);
    if (!element) {
      return;
    }
    if (!dragTarget.recordId) {
      return;
    }

    let data: Array<{ recordId: string; overTargetId: string; direction: DropDirectionType }>;
    if (new Set(selectRecordIds).has(dragTarget.recordId)) {
      // The record you are currently working on is already checked
      data = selectRecordIds.map((recordId) => {
        return {
          recordId,
          overTargetId,
          direction,
        };
      });
    } else {
      // The record currently in operation is not checked
      data = [
        {
          recordId: dragTarget.recordId,
          overTargetId,
          direction,
        },
      ];
    }

    const targetIndex = rowsIndexMap.get(overTargetId);
    const startIndex = rowsIndexMap.get(data[0].recordId);
    const endIndex = rowsIndexMap.get(data[data.length - 1].recordId);

    if (
      (targetIndex === startIndex && direction === DropDirectionType.BEFORE) ||
      (targetIndex === endIndex && direction === DropDirectionType.AFTER)
    ) {
      return;
    }

    const isSameRecordIndex = data.findIndex((item) => item.overTargetId === item.recordId);
    if (isSameRecordIndex !== -1 && data.length > 1) {
      data = data.map((item, index) => {
        if (index < isSameRecordIndex) {
          item.direction = DropDirectionType.BEFORE;
        }
        if (index > isSameRecordIndex) {
          item.direction = DropDirectionType.AFTER;
        }
        return item;
      });
    }

    const recordData = dependsGroup2ChangeData(data, overTargetId, { groupLevel, snapshot, view, fieldPermissionMap });
    resourceService.instance!.commandManager.execute({
      cmd: CollaCommandName.MoveRow,
      data: data.filter((item) => item.overTargetId !== item.recordId),
      viewId: view.id,
      recordData,
    });
  }

  const mouseUp = (e: MouseEvent) => {
    setUnDown();
    const { dragTarget } = gridViewDragState;
    gridRef!.current!.style.cursor = 'default';

    if (isChangeColumns) {
      return setColumnWidth(e);
    }
    if (!(dragTarget.recordId || dragTarget.fieldId)) {
      return;
    }
    if (dragTarget.recordId) {
      dragItemDownForRecord(e);
    } else {
      dragItemDownForField(e);
    }
    clearOperateState();
  };

  useEffect(() => {
    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseup', mouseUp);
    return () => {
      window.removeEventListener('mousedown', mouseDown);
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseup', mouseUp);
    };
  });

  const { overTargetId } = dragOption;

  const hoverLineVisible =
    isChangeColumns ||
    (Object.keys(gridViewDragState.dragTarget).length > 0 &&
      dragOption.dragOffsetX &&
      (!keepSort || (keepSort && fieldRanges)) &&
      !fieldRanges?.includes(overTargetId));

  return (
    <>
      <MicroComponent dragOption={dragOption} />
      {hoverLineVisible && <HoverLine dragOption={dragOption} isChangeColumnsWidth={isChangeColumns} setDirection={setDirection} {...props} />}
    </>
  );
};
