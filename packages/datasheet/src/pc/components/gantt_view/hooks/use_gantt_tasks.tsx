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
import { CellType, ConfigConstant, FieldType, IField, IFieldPermissionMap, KONVA_DATASHEET_ID, Selectors, Strings, t } from '@apitable/core';
import { ArrowLeftOutlined, ArrowRightOutlined, WarnCircleFilled } from '@apitable/icons';
import { getRecordName } from 'pc/components/expand_record';
import {
  AreaType,
  GANTT_COMMON_ICON_SIZE,
  GanttCoordinate,
  generateTargetName,
  getGanttGroupId,
  getStartOfDate,
  IScrollState,
  PointPosition,
  GANTT_SMALL_ICON_SIZE,
} from 'pc/components/gantt_view';
import Task from 'pc/components/gantt_view/components/task/task';
import TaskGroupHeader from 'pc/components/gantt_view/components/task_group_header/task_group_header';
import { KonvaGanttViewContext } from 'pc/components/gantt_view/context';
import { Icon, Transformer } from 'pc/components/konva_components';
import { KonvaGridContext } from 'pc/components/konva_grid';
import { KonvaGridViewContext } from 'pc/components/konva_grid/context';
import { store } from 'pc/store';
import { useTooltip } from './use_gantt_tooltip';

const GanttTask = dynamic(() => import('pc/components/gantt_view/group/gantt_task'), { ssr: false });

// Icon Path
const GanttLeftFilledPath = ArrowLeftOutlined.toString();
const GanttRightFilledPath = ArrowRightOutlined.toString();
const WarningTriangleFilledPath = WarnCircleFilled.toString();

const NotFillTargetNames = new Set([
  KONVA_DATASHEET_ID.GANTT_HEADER,
  KONVA_DATASHEET_ID.GANTT_PREV_PAGE_BUTTON,
  KONVA_DATASHEET_ID.GANTT_NEXT_PAGE_BUTTON,
  KONVA_DATASHEET_ID.GANTT_BACK_TO_NOW_BUTTON,
]);

const generateKeyName = (fieldId: string, recordId: string) => {
  return `${fieldId}-${recordId}`;
};

// Check if the current Gantt chart column can be dragged
export const checkFieldEditable = (field: IField, fieldPermissionMap: IFieldPermissionMap | undefined) => {
  if (field == null) return false;
  const { id, type } = field;
  const fieldRole = Selectors.getFieldRoleByFieldId(fieldPermissionMap, id);
  return type === FieldType.DateTime && [ConfigConstant.Role.Editor, null].includes(fieldRole);
};

interface IUseTaskProps {
  instance: GanttCoordinate;
  rowStartIndex: number;
  rowStopIndex: number;
  pointPosition: PointPosition;
  scrollState: IScrollState;
  gridWidth: number;
}

export const useTask = (props: IUseTaskProps) => {
  const { instance, rowStartIndex, rowStopIndex, pointPosition, scrollState, gridWidth } = props;

  // Context
  const { fieldMap, snapshot, groupInfo, linearRows, rowsIndexMap, permissions, visibleColumns, fieldPermissionMap } =
    useContext(KonvaGridViewContext);
  const { dragTaskId, transformerId, ganttStyle, ganttGroupMap, dragSplitterInfo, targetTaskInfo, isTaskLineDrawing } =
    useContext(KonvaGanttViewContext);
  const { isMobile: _isMobile, isTouchDevice, setTooltipInfo, clearTooltipInfo, theme } = useContext(KonvaGridContext);
  const colors = theme.color;

  const {
    realAreaType: pointAreaType,
    rowIndex: pointRowIndex,
    columnIndex: pointColumnIndex,
    targetName: pointTargetName,
    realTargetName: pointRealTargetName,
  } = pointPosition;
  const { scrollTop, scrollLeft, isScrolling } = scrollState;
  const state = store.getState();
  const { rowHeight, unitWidth, columnWidth, containerWidth } = instance;
  const { startFieldId, endFieldId } = ganttStyle;
  const startField = fieldMap[startFieldId];
  const endField = fieldMap[endFieldId];
  const { fieldId: firstFieldId } = visibleColumns[0];
  const firstField = fieldMap[firstFieldId];
  const renderEnable = startField != null && endField != null;
  const splitterVisible = dragSplitterInfo.visible;

  // Permissions related
  const isMobile = _isMobile || isTouchDevice;
  const cellEditable = !isMobile && permissions.cellEditable;
  const isSameField = startFieldId === endFieldId;
  const leftAnchorEnable = !isSameField && checkFieldEditable(startField, fieldPermissionMap);
  const rightAnchorEnable = !isSameField && checkFieldEditable(endField, fieldPermissionMap);
  const draggable = cellEditable && ((leftAnchorEnable && rightAnchorEnable) || isSameField);

  const { recordId: pointRecordId, type: pointRowType } = linearRows[pointRowIndex] || {};
  const isGanttArea = pointAreaType === AreaType.Gantt;

  const { tooltip, setTooltipInfo: setKonvaTooltipInfo } = useTooltip({ isScrolling });
  const cellValueMap = useMemo(() => {
    const result = {};
    if (!renderEnable) return result;
    for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
      const { recordId, type } = linearRows[rowIndex];
      if (type !== CellType.Record) continue;
      result[generateKeyName(startFieldId, recordId)] = Selectors.getCellValueByGanttDateTimeFieldId(state, snapshot, recordId, startFieldId);
      result[generateKeyName(endFieldId, recordId)] = Selectors.getCellValueByGanttDateTimeFieldId(state, snapshot, recordId, endFieldId);
    }
    if (dragTaskId) {
      result[generateKeyName(startFieldId, dragTaskId)] = Selectors.getCellValueByGanttDateTimeFieldId(state, snapshot, dragTaskId, startFieldId);
      result[generateKeyName(endFieldId, dragTaskId)] = Selectors.getCellValueByGanttDateTimeFieldId(state, snapshot, dragTaskId, endFieldId);
    }
    return result;
    // eslint-disable-next-line
  }, [endFieldId, linearRows, renderEnable, rowStartIndex, rowStopIndex, snapshot, startFieldId, dragTaskId]);

  // Draw the area where the task will be added in the Gantt Hover state
  const willAddTaskPoint = useMemo(() => {
    if (!renderEnable || isScrolling || splitterVisible || isTaskLineDrawing) return null;
    if (!cellEditable || !isGanttArea || dragTaskId || pointRowType !== CellType.Add) {
      return null;
    }
    const x = instance.getColumnOffset(pointColumnIndex);
    const y = instance.getRowOffset(pointRowIndex);
    const height = instance.getRowHeight(pointRowIndex) - 8;

    return (
      <GanttTask
        colors={colors}
        x={x + 0.5}
        y={y + 4}
        text={t(Strings.gantt_add_task_text)}
        width={columnWidth}
        height={height}
        fill={colors.fourthLevelText}
        opacity={0.4}
        cornerRadius={4}
      />
    );
  }, [
    renderEnable,
    isScrolling,
    splitterVisible,
    cellEditable,
    isGanttArea,
    dragTaskId,
    pointRowType,
    instance,
    pointColumnIndex,
    pointRowIndex,
    columnWidth,
    colors,
    isTaskLineDrawing,
  ]);

  // Draws the area to be filled with the task in the Gantt Hover state
  const willFillTaskPoint = (() => {
    if (!renderEnable || isScrolling || pointRowType !== CellType.Record || splitterVisible || isTaskLineDrawing) return null;
    if (!isSameField && (!leftAnchorEnable || !rightAnchorEnable || !cellEditable)) return null;
    if (NotFillTargetNames.has(pointTargetName) || !isGanttArea || dragTaskId) return null;

    const startTime = cellValueMap[generateKeyName(startFieldId, pointRecordId)];
    const endTime = cellValueMap[generateKeyName(endFieldId, pointRecordId)];
    const { startOffset, endOffset } = instance.getTaskData(startTime, endTime);

    if (startOffset != null || endOffset != null) return null;
    const x = instance.getColumnOffset(pointColumnIndex);
    const y = instance.getRowOffset(pointRowIndex);
    const title = Selectors.getCellValue(state, snapshot, pointRecordId, firstFieldId);
    const text = getRecordName(title, firstField) || t(Strings.record_unnamed);

    return (
      <GanttTask
        colors={colors}
        x={x + 0.5}
        y={y + 4}
        text={text}
        width={columnWidth}
        height={rowHeight - 8}
        fill={colors.fourthLevelText}
        opacity={0.4}
        cornerRadius={4}
      />
    );
  })();

  /**
   * Drawing group headers for Gantt chart groupings
   */
  const taskGroupHeaders = (() => {
    if (!renderEnable) return null;
    const result: React.ReactNode[] = [];
    for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
      const row = linearRows[rowIndex];
      const { recordId, type, depth } = row;
      if (type !== CellType.GroupTab) continue;
      const groupId = getGanttGroupId(recordId, depth);
      const ganttGroupInfo = ganttGroupMap[groupId];
      const y = instance.getRowOffset(rowIndex);

      result.push(
        <TaskGroupHeader
          key={`${type}-${recordId}-${depth}`}
          y={y}
          row={row}
          instance={instance}
          groupInfo={ganttGroupInfo}
          groupCount={groupInfo.length}
          pointPosition={pointPosition}
          setTooltipInfo={setKonvaTooltipInfo}
        />,
      );
    }
    return result;
  })();

  /**
   * Tips for drawing wrong date tasks
   */
  const errTaskTips = renderEnable
    ? Array.from({ length: rowStopIndex - rowStartIndex }, (_, index) => {
      return rowStartIndex + index;
    }).map((rowIndex) => {
      const { recordId, type } = linearRows[rowIndex];
      if (type !== CellType.Record) return null;
      const startTime = cellValueMap[generateKeyName(startFieldId, recordId)];
      const endTime = cellValueMap[generateKeyName(endFieldId, recordId)];
      if (!startTime || !endTime) return null;
      // No prompting if the start and end times are normal (comparison of start and end times for incorrect tasks is only accurate to "days")
      if (getStartOfDate(startTime) <= getStartOfDate(endTime)) return null;

      const offsetY = (rowHeight - GANTT_COMMON_ICON_SIZE) / 2;
      const y = instance.getRowOffset(rowIndex) + offsetY;
      return (
        <Icon
          key={`err-task-tip-${recordId}`}
          name={KONVA_DATASHEET_ID.GANTT_ERROR_TASK_TIP}
          x={10}
          y={y}
          data={WarningTriangleFilledPath}
          fill={colors.warningColor}
          onMouseEnter={() =>
            setTooltipInfo({
              visible: true,
              x: gridWidth + 10,
              y: instance.getRowOffset(pointRowIndex),
              width: GANTT_COMMON_ICON_SIZE,
              title: t(Strings.gantt_error_date_tip),
            })
          }
          onMouseOut={() => clearTooltipInfo()}
        />
      );
    })
    : null;

  /**
   * Draw a collection of "Back to Task" buttons
   */
  const backToTaskButtons = (() => {
    if (!renderEnable) return null;
    const result: React.ReactNode[] = [];
    for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
      const { recordId, type } = linearRows[rowIndex];
      if (type !== CellType.Record) continue;
      const startTime = cellValueMap[generateKeyName(startFieldId, recordId)];
      const endTime = cellValueMap[generateKeyName(endFieldId, recordId)];
      const { startOffset, endOffset, width } = instance.getTaskData(startTime, endTime);
      if (startOffset == null && endOffset == null) continue;
      const x = (startOffset ?? endOffset)!;
      const taskWidth = width ?? unitWidth;
      const isLeft = scrollLeft > x;
      const isRight = x + taskWidth > scrollLeft + containerWidth;
      const y = instance.getRowOffset(rowIndex);

      const buttonRenderer = (isLeft: boolean) => {
        const key = `back-to-task-${isLeft ? 'left' : 'right'}-${recordId}`;
        const name = generateTargetName({
          targetName: isLeft ? KONVA_DATASHEET_ID.GANTT_BACK_TO_TASK_BUTTON_LEFT : KONVA_DATASHEET_ID.GANTT_BACK_TO_TASK_BUTTON_RIGHT,
          recordId,
        });
        const background = pointRealTargetName === name ? colors.primaryColor : colors.fourthLevelText;
        const iconPath = isLeft ? GanttLeftFilledPath : GanttRightFilledPath;

        return (
          <Icon
            key={key}
            name={name}
            scaleX={0.75}
            scaleY={0.75}
            transformsEnabled={'all'}
            x={isLeft ? 10 : containerWidth - 30}
            y={y + (rowHeight - GANTT_SMALL_ICON_SIZE) / 2}
            data={iconPath}
            fill={colors.white}
            background={background}
            backgroundWidth={16}
            backgroundHeight={16}
            cornerRadius={2}
          />
        );
      };

      if (isLeft) result.push(buttonRenderer(true));
      if (isRight) result.push(buttonRenderer(false));
    }
    return result;
  })();

  // Drawing a list of tasks
  const taskList: React.ReactNode[] = [];
  const taskMap = {};

  const taskRenderer = (rowIndex: number) => {
    const { recordId } = linearRows[rowIndex];
    const y = instance.getRowOffset(rowIndex);
    const startTime = cellValueMap[generateKeyName(startFieldId, recordId)];
    const endTime = cellValueMap[generateKeyName(endFieldId, recordId)];
    const { startOffset, endOffset, width } = instance.getTaskData(startTime, endTime);
    if (startOffset == null && endOffset == null) return null;
    const taskId = `task-${recordId}`;
    const x = (startOffset ?? endOffset! - unitWidth)!;
    const taskWidth = width ?? unitWidth;
    taskMap[recordId] = {
      x,
      y,
      taskWidth,
    };
    return (
      <Task
        key={taskId}
        x={x + 0.5}
        y={y + 0.5}
        instance={instance}
        recordId={recordId}
        scrollTop={scrollTop}
        gridWidth={gridWidth}
        pointPosition={pointPosition}
        taskWidth={taskWidth}
        isTransform={transformerId === taskId}
        draggable={draggable}
        leftAnchorEnable={leftAnchorEnable}
        rightAnchorEnable={rightAnchorEnable}
        setTooltipInfo={setKonvaTooltipInfo}
        targetTaskInfo={targetTaskInfo}
      />
    );
  };

  if (renderEnable) {
    let isDragRendered = false;
    for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
      const { recordId, type } = linearRows[rowIndex];
      if (type !== CellType.Record) continue;
      if (recordId === dragTaskId) isDragRendered = true;
      taskList.push(taskRenderer(rowIndex));
    }
    taskMap['taskListLength'] = taskList.length;
    // Tasks in drag and drop
    if (dragTaskId && !isDragRendered) {
      const rowIndex = rowsIndexMap.get(`${CellType.Record}_${dragTaskId}`);
      if (rowIndex != null) {
        taskList.push(taskRenderer(rowIndex));
      }
    }
  }

  /**
   * Task Deformers
   */
  let transformer: ReactNode = null;
  if (renderEnable && cellEditable && Boolean(transformerId)) {
    transformer = (
      <Transformer
        shapeName={transformerId}
        leftAnchorEnable={leftAnchorEnable}
        rightAnchorEnable={rightAnchorEnable}
        boundBoxFunc={(oldBox, newBox) => {
          if (newBox.width < instance.unitWidth) {
            return oldBox;
          }
          return newBox;
        }}
      />
    );
  }

  return {
    tooltip,
    taskList,
    errTaskTips,
    transformer,
    taskGroupHeaders,
    willAddTaskPoint,
    willFillTaskPoint,
    backToTaskButtons,
    taskMap,
  };
};
