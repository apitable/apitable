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
import { useCallback, useContext, useEffect } from 'react';
import {
  CellType,
  CollaCommandName,
  DropDirectionType,
  FieldType,
  ICellValue,
  ICollaCommandExecuteResult,
  IGanttViewProperty,
  IGridViewProperty,
  ISetRecordOptions,
  KONVA_DATASHEET_ID,
  Selectors,
} from '@apitable/core';
import { appendRow, getCellValuesForGroupRecord } from 'modules/shared/shortcut_key/shortcut_actions/append_row';
import { expandRecordIdNavigate } from 'pc/components/expand_record';
import { AreaType, GanttCoordinate, KonvaGanttViewContext, PointPosition, ScrollViewType } from 'pc/components/gantt_view';
import { GridCoordinate, KonvaGridContext } from 'pc/components/konva_grid';
import { KonvaGridViewContext } from 'pc/components/konva_grid/context';
import { dependsGroup2ChangeData } from 'pc/components/multi_grid/drag';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { getParentNodeByClass } from 'pc/utils';
import { executeCommandWithMirror } from 'pc/utils/execute_command_with_mirror';
import { MouseDownType } from '../../multi_grid';
import { checkFieldEditable } from './use_gantt_tasks';

interface IGanttMouseEventProps {
  gridInstance: GridCoordinate;
  ganttInstance: GanttCoordinate;
  pointPosition: PointPosition;
  scrollIntoView: (type: ScrollViewType) => void;
  getMousePosition: (x: number, y: number, targetName?: string) => PointPosition;
}

export const useGanttMouseEvent = ({ gridInstance, ganttInstance, pointPosition, scrollIntoView, getMousePosition }: IGanttMouseEventProps) => {
  const { x: pointX, rowIndex: pointRowIndex, columnIndex: pointColumnIndex, offsetTop: pointOffsetTop, targetName: pointTargetName } = pointPosition;
  const state = store.getState();
  const {
    view,
    mirrorId,
    fieldMap,
    snapshot,
    linearRows,
    visibleRows,
    visibleColumns,
    sortInfo,
    groupInfo,
    permissions,
    fieldPermissionMap,
    selectRecordIds,
    visibleRowsIndexMap,
  } = useContext(KonvaGridViewContext);
  const {
    ganttStyle,
    backTo,
    setRecord,
    dragTaskId,
    setDragTaskId,
    transformerId,
    setTransformerId,
    dragSplitterInfo,
    setDragSplitterInfo,
    isTaskLineDrawing,
    setIsTaskLineDrawing,
    taskLineSetting,
    setTaskLineSetting,
  } = useContext(KonvaGanttViewContext);
  const { isMobile, setMouseStyle, scrollHandler } = useContext(KonvaGridContext);

  const { startFieldId, endFieldId } = ganttStyle;
  const startField = fieldMap[startFieldId];
  const endField = fieldMap[endFieldId];
  const isSameField = startFieldId === endFieldId;
  const leftAnchorEnable = !isSameField && checkFieldEditable(startField, fieldPermissionMap);
  const rightAnchorEnable = !isSameField && checkFieldEditable(endField, fieldPermissionMap);
  const isValidSameField = startFieldId === endFieldId && startField?.type === FieldType.DateTime;
  const { editable: _editable, rowCreatable } = permissions;
  const editable = _editable && !isValidSameField;
  const { containerWidth: gridWidth } = gridInstance;
  const { rowHeight, columnWidth, containerWidth: ganttWidth } = ganttInstance;
  const getTaskData = (rowIndex: number) => {
    if (rowIndex !== -1) {
      const { recordId, type } = linearRows[rowIndex];
      if (type === CellType.Record) {
        const task = ganttInstance.getTaskData(
          Selectors.getCellValueByGanttDateTimeFieldId(state, snapshot, recordId, startFieldId),
          Selectors.getCellValueByGanttDateTimeFieldId(state, snapshot, recordId, endFieldId),
        );
        return { ...task, recordId, type };
      }
      return { offset: null, startOffset: null, endOffset: null, recordId, type };
    }
    return null;
  };

  const onTransformerAttach = () => {
    if (![KONVA_DATASHEET_ID.GANTT_TASK, KONVA_DATASHEET_ID.GANTT_LINE_POINT].includes(pointTargetName)) return setTransformerId('');
    const task = getTaskData(pointRowIndex);
    if (task == null) return setTransformerId('');
    const taskId = `task-${task.recordId}`;
    if (transformerId !== taskId) return setTransformerId(taskId);
  };

  const clickBlankHandler = (): Promise<ICollaCommandExecuteResult<string[]>> | void => {
    const task = getTaskData(pointRowIndex);
    if (task == null) return;
    const { type, startOffset, endOffset, recordId: taskRecordId } = task;
    const isValidGanttFields = isValidSameField || (editable && leftAnchorEnable && rightAnchorEnable);
    switch (type) {
      case CellType.Record: {
        if (startOffset != null || endOffset != null) return;
        if (!isValidGanttFields) return;
        const finalStartOffset = ganttInstance.getColumnOffset(pointColumnIndex);
        const finalEndOffset = ganttInstance.getColumnOffset(pointColumnIndex + 1);
        const startUnitIndex = ganttInstance.getUnitIndex(finalStartOffset);
        const endUnitIndex = ganttInstance.getUnitIndex(finalEndOffset);
        return setRecord(taskRecordId, startUnitIndex, endUnitIndex - 1);
      }
      /**
       * Creation line rule.
       * 1. For two different date fields: assign values to both date fields at the same time as creating the row
       * 2. For two identical date fields: same 1, but with (quarter/year) precision, assigned to the first day of each cell
       * 3. For date fields and calculated date (creation date or magical reference date) fields: only rows are created, no assignment is made
       * 4. For two calculated date fields: same as 3
       */
      case CellType.Add: {
        if (!rowCreatable) return;
        const rowCount = visibleRows.length;
        const pointRecordId = linearRows[pointRowIndex]?.recordId;
        const recordId = groupInfo.length ? pointRecordId : rowCount > 0 ? visibleRows[rowCount - 1].recordId : '';
        let recordData: { [fieldId: string]: ICellValue } | null = null;
        if (isValidGanttFields) {
          const { startUnitIndex, endUnitIndex } = ganttInstance.getRangeIndexByColumnIndex(pointColumnIndex);
          const startDate = ganttInstance.getDateFromStartDate(startUnitIndex);
          const endDate = ganttInstance.getDateFromStartDate(endUnitIndex);
          recordData = {
            [endFieldId]: endDate.valueOf(),
            [startFieldId]: startDate.valueOf(),
          };
        }
        return appendRow({ recordId, recordData });
      }
    }
  };

  const onClick = (e: KonvaEventObject<MouseEvent>) => {
    const target = e.target;
    const _targetName = target.name();
    const pos = target.getStage()?.getPointerPosition();
    if (pos == null) return;
    const { x, y } = pos;
    const { realAreaType, targetName, rowIndex, offsetLeft, offsetTop } = getMousePosition(x, y, _targetName);
    if (realAreaType !== AreaType.Gantt) return;
    const pointRecordId = linearRows[rowIndex]?.recordId;
    // Only jumps to a distance of 1 frame from the border on mobile, 3 frames on PC
    const columnDistanceCount = isMobile ? 1 : 3;
    console.log('targetName--->', targetName);
    if (targetName !== KONVA_DATASHEET_ID.GANTT_LINE_SETTING) {
      setTaskLineSetting(null);
    }

    switch (targetName) {
      // Back to current time
      case KONVA_DATASHEET_ID.GANTT_BACK_TO_NOW_BUTTON: {
        return backTo(Date.now());
      }
      // Back to task button on the left - visible area showing the start time of the task
      case KONVA_DATASHEET_ID.GANTT_BACK_TO_TASK_BUTTON_LEFT: {
        let startDistanceCount = columnDistanceCount;
        let startTime = Selectors.getCellValueByGanttDateTimeFieldId(state, snapshot, pointRecordId, startFieldId);
        if (!startTime) {
          startTime = Selectors.getCellValueByGanttDateTimeFieldId(state, snapshot, pointRecordId, endFieldId);
          startDistanceCount--;
        }
        return backTo(startTime, -columnWidth * startDistanceCount);
      }
      // Back to task button on the right - visible area showing the end of the task
      case KONVA_DATASHEET_ID.GANTT_BACK_TO_TASK_BUTTON_RIGHT: {
        const endDistanceCount = columnDistanceCount + 1;
        let endTime = Selectors.getCellValueByGanttDateTimeFieldId(state, snapshot, pointRecordId, endFieldId);
        if (!endTime) {
          endTime = Selectors.getCellValueByGanttDateTimeFieldId(state, snapshot, pointRecordId, startFieldId);
          endDistanceCount;
        }
        return backTo(endTime, -(ganttWidth - columnWidth * endDistanceCount));
      }
      // Click on the task to expand the card
      case KONVA_DATASHEET_ID.GANTT_TASK:
      case KONVA_DATASHEET_ID.GANTT_ERROR_TASK_TIP: {
        if (e.evt.button === MouseDownType.Right) return;
        return expandRecordIdNavigate(pointRecordId!);
      }
      // Click on the blank space to create a new task
      case KONVA_DATASHEET_ID.GANTT_BLANK: {
        if (taskLineSetting) return;
        return clickBlankHandler();
      }
      // Previous page
      case KONVA_DATASHEET_ID.GANTT_PREV_PAGE_BUTTON: {
        return scrollIntoView(ScrollViewType.Prev);
      }
      // Next page
      case KONVA_DATASHEET_ID.GANTT_NEXT_PAGE_BUTTON: {
        return scrollIntoView(ScrollViewType.Next);
      }
      case KONVA_DATASHEET_ID.GANTT_LINE_TASK: {
        const { sourceId, targetId, dashEnabled, fillColor } = e.target.attrs;
        setTaskLineSetting({
          x: offsetLeft,
          y: offsetTop,
          sourceId,
          targetId,
          dashEnabled,
          fillColor,
        });
      }
    }
  };

  const onMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const target = e.target;
    const _targetName = target.name();
    const pos = target.getStage()?.getPointerPosition();
    if (pos == null) return;
    const { x, y } = pos;
    const { targetName } = getMousePosition(x, y, _targetName);

    if (targetName === KONVA_DATASHEET_ID.GANTT_LINE_POINT) {
      setIsTaskLineDrawing(true);
    }

    if (mirrorId || view.lockInfo) return;

    if (_targetName === KONVA_DATASHEET_ID.GANTT_SPLITTER) {
      setDragSplitterInfo({
        x: pointX,
        visible: true,
      });
    }
  };

  const onHighlightSplitterMove = (e: KonvaEventObject<MouseEvent>) => {
    const pos = e.target.getStage()?.getPointerPosition();
    if (pos == null) return;
    const { x } = pos;
    // Set the position of the hover divider
    if (dragSplitterInfo.visible) {
      setDragSplitterInfo({ x });
    }
  };

  const onMouseUp = () => {
    const { x, visible } = dragSplitterInfo;

    setIsTaskLineDrawing(false);
    if (visible) {
      const MAX_WIDTH = Math.round((gridWidth + ganttWidth) * 0.4);
      const curWidth = Math.max(Math.min(x, MAX_WIDTH), 280);
      const diffWidth = curWidth - gridInstance.containerWidth;
      setDragSplitterInfo({ x: curWidth, visible: false });
      const lastColumnIndex = visibleColumns.length - 1;
      const lastFieldId = visibleColumns[lastColumnIndex].fieldId;
      const lastColumnWidth = gridInstance.getColumnWidth(lastColumnIndex);
      const finalColumnWidth = Math.max(lastColumnWidth + diffWidth, 80);
      if (finalColumnWidth === lastColumnWidth) return;
      executeCommandWithMirror(
        () => {
          resourceService.instance!.commandManager.execute({
            cmd: CollaCommandName.SetColumnsProperty,
            viewId: view.id,
            fieldId: lastFieldId,
            data: {
              width: finalColumnWidth,
            },
          });
        },
        {
          columns: (view as IGanttViewProperty).columns.map((column) => {
            return column.fieldId === lastFieldId
              ? {
                ...column,
                width: finalColumnWidth,
              }
              : column;
          }),
        },
      );
    }
  };

  const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    onTransformerAttach();
    onHighlightSplitterMove(e);
  };

  const onDragStart = () => {
    if (pointTargetName === KONVA_DATASHEET_ID.GANTT_TASK) {
      const pointRecordId = linearRows[pointRowIndex]?.recordId;
      setDragTaskId(pointRecordId);
    }
  };

  const onDragMove = () => {
    //
  };

  function setCellValueByKeepSort() {
    let recordIds: string[] = [];
    if (selectRecordIds.length) {
      // The record you are currently working on is already ticked or in the selection
      recordIds = selectRecordIds;
    } else {
      // The record currently in operation is not ticked
      recordIds = [dragTaskId!];
    }
    const pointRecordId = linearRows[pointRowIndex]?.recordId;
    const groupCellValues = getCellValuesForGroupRecord(pointRecordId);
    const recordsData = recordIds.reduce<ISetRecordOptions[]>((recordsData, recordId) => {
      groupInfo?.forEach(({ fieldId }, index) => {
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

  const onDragEnd = () => {
    if (dragTaskId) {
      if (sortInfo?.keepSort && groupInfo) {
        setCellValueByKeepSort();
      } else {
        const overTargetId = linearRows[pointRowIndex]?.recordId;
        const pointY = ganttInstance.getRowOffset(pointRowIndex);
        const direction = pointOffsetTop - pointY > rowHeight / 2 ? DropDirectionType.AFTER : DropDirectionType.BEFORE;
        let data: Array<{ recordId: string; overTargetId: string; direction: DropDirectionType }>;
        if (new Set(selectRecordIds).has(dragTaskId)) {
          // The record currently in operation is already ticked
          data = selectRecordIds.map((recordId) => {
            return {
              recordId,
              overTargetId,
              direction,
            };
          });
        } else {
          // The record currently in operation is not ticked
          data = [
            {
              recordId: dragTaskId,
              overTargetId,
              direction,
            },
          ];
        }

        const targetIndex = visibleRowsIndexMap.get(overTargetId);
        const startIndex = visibleRowsIndexMap.get(data[0].recordId);
        const endIndex = visibleRowsIndexMap.get(data[data.length - 1].recordId);
        if (
          (targetIndex === startIndex && direction === DropDirectionType.BEFORE) ||
          (targetIndex === endIndex && direction === DropDirectionType.AFTER)
        ) {
          return setDragTaskId(null);
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
        const recordData = dependsGroup2ChangeData(data, overTargetId, {
          groupLevel: groupInfo.length,
          snapshot,
          view: view as IGridViewProperty,
          fieldPermissionMap,
        });
        if (recordData == null) return setDragTaskId(null);
        resourceService.instance!.commandManager.execute({
          cmd: CollaCommandName.MoveRow,
          data: data.filter((item) => item.overTargetId !== item.recordId),
          viewId: view.id,
          recordData,
        });
      }
    }
    // Reset the recordId of the drag and drop
    setDragTaskId(null);
  };

  const handleMouseStyle = (targetName: string) => {
    if (isTaskLineDrawing) {
      setMouseStyle('grabbing');
      return;
    }
    switch (targetName) {
      case KONVA_DATASHEET_ID.GANTT_TASK:
      case KONVA_DATASHEET_ID.GANTT_BACK_TO_NOW_BUTTON:
      case KONVA_DATASHEET_ID.GANTT_PREV_PAGE_BUTTON:
      case KONVA_DATASHEET_ID.GANTT_NEXT_PAGE_BUTTON:
      case KONVA_DATASHEET_ID.GANTT_ERROR_TASK_TIP:
      case KONVA_DATASHEET_ID.GANTT_GROUP_TOGGLE_BUTTON:
      case KONVA_DATASHEET_ID.GANTT_BACK_TO_TASK_BUTTON_LEFT:
      case KONVA_DATASHEET_ID.GANTT_BACK_TO_TASK_BUTTON_RIGHT:
      case KONVA_DATASHEET_ID.GANTT_LINE_POINT:
      case KONVA_DATASHEET_ID.GANTT_LINE_TASK:
      case KONVA_DATASHEET_ID.GANTT_LINE_SETTING: {
        return setMouseStyle('pointer');
      }
      default:
        setMouseStyle('default');
    }
  };

  const mouseUp = useCallback(
    (e: any) => {
      if (getParentNodeByClass(e.target as HTMLElement, 'vikaGanttView')) return;
      scrollHandler.stopScroll();
      setDragTaskId(null);
      setTaskLineSetting(null);
    },
    [scrollHandler, setDragTaskId, setTaskLineSetting],
  );

  useEffect(() => {
    document.addEventListener('mouseup', mouseUp);
    return () => document.removeEventListener('mouseup', mouseUp);
  }, [mouseUp]);

  return {
    onClick,
    onMouseUp,
    onMouseDown,
    onMouseMove,
    onDragStart,
    onDragMove,
    onDragEnd,
    handleMouseStyle,
  };
};
