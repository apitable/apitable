import { CellType, ConfigConstant, FieldType, IField, IFieldPermissionMap, KONVA_DATASHEET_ID, Selectors, Strings, t } from '@vikadata/core';
import { GanttLeftFilled, GanttRightFilled, WarningTriangleNonzeroFilled } from '@vikadata/icons';
import dynamic from 'next/dynamic';
import { getRecordName } from 'pc/components/expand_record';
import {
  AreaType, GANTT_COMMON_ICON_SIZE, GanttCoordinate, generateTargetName, getGanttGroupId, getStartOfDate, IScrollState, PointPosition
} from 'pc/components/gantt_view';
import Task from 'pc/components/gantt_view/components/task/task';
import TaskGroupHeader from 'pc/components/gantt_view/components/task_group_header/task_group_header';
import { KonvaGanttViewContext } from 'pc/components/gantt_view/context';
import { Icon, Transformer } from 'pc/components/konva_components';
import { KonvaGridContext } from 'pc/components/konva_grid';
import { KonvaGridViewContext } from 'pc/components/konva_grid/context';
import { store } from 'pc/store';
import * as React from 'react';
import { ReactNode, useContext, useMemo } from 'react';
import { useTooltip } from './use_gantt_tooltip';

const GanttTask = dynamic(() => import('pc/components/gantt_view/group/gantt_task'), { ssr: false });

// Icon Path
const GanttLeftFilledPath = GanttLeftFilled.toString();
const GanttRightFilledPath = GanttRightFilled.toString();
const WarningTriangleFilledPath = WarningTriangleNonzeroFilled.toString();

const NotFillTargetNames = new Set([
  KONVA_DATASHEET_ID.GANTT_HEADER,
  KONVA_DATASHEET_ID.GANTT_PREV_PAGE_BUTTON,
  KONVA_DATASHEET_ID.GANTT_NEXT_PAGE_BUTTON,
  KONVA_DATASHEET_ID.GANTT_BACK_TO_NOW_BUTTON,
]);

const generateKeyName = (fieldId: string, recordId: string) => {
  return `${fieldId}-${recordId}`;
};

// 检查当前甘特图列是否能够被拖动
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
  const {
    instance,
    rowStartIndex,
    rowStopIndex,
    pointPosition,
    scrollState,
    gridWidth
  } = props;

  // Context
  const {
    fieldMap,
    snapshot,
    groupInfo,
    linearRows,
    rowsIndexMap,
    permissions,
    visibleColumns,
    fieldPermissionMap
  } = useContext(KonvaGridViewContext);
  const {
    dragTaskId,
    transformerId,
    ganttStyle,
    ganttGroupMap,
    dragSplitterInfo
  } = useContext(KonvaGanttViewContext);
  const {
    isMobile: _isMobile,
    isTouchDevice,
    setTooltipInfo,
    clearTooltipInfo,
    theme,
  } = useContext(KonvaGridContext);
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

  // 权限相关
  const isMobile = _isMobile || isTouchDevice;
  const cellEditable = !isMobile && permissions.cellEditable;
  const isSameField = startFieldId === endFieldId;
  const leftAnchorEnable = !isSameField && checkFieldEditable(startField, fieldPermissionMap);
  const rightAnchorEnable = !isSameField && checkFieldEditable(endField, fieldPermissionMap);
  const draggable = cellEditable && ((leftAnchorEnable && rightAnchorEnable) || isSameField);

  const {
    recordId: pointRecordId,
    type: pointRowType,
  } = linearRows[pointRowIndex] || {};
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endFieldId, linearRows, renderEnable, rowStartIndex, rowStopIndex, snapshot, startFieldId, dragTaskId]);

  // 绘制 Gantt Hover 状态下，将要添加任务的区域
  const willAddTaskPoint = useMemo(() => {
    if (!renderEnable || isScrolling || splitterVisible) return null;
    if (!cellEditable || !isGanttArea || dragTaskId || pointRowType !== CellType.Add) {
      return null;
    }
    const x = instance.getColumnOffset(pointColumnIndex);
    const y = instance.getRowOffset(pointRowIndex);
    const height = instance.getRowHeight(pointRowIndex) - 8;

    return <GanttTask
      colors={colors}
      x={x + 0.5}
      y={y + 4}
      text={t(Strings.gantt_add_task_text)}
      width={columnWidth}
      height={height}
      fill={colors.fourthLevelText}
      opacity={0.4}
      cornerRadius={4}
    />;
  }, [
    renderEnable, isScrolling, splitterVisible, cellEditable, isGanttArea,
    dragTaskId, pointRowType, instance, pointColumnIndex, pointRowIndex, columnWidth,
    colors
  ]);

  // 绘制 Gantt Hover 状态下，将要填充任务的区域
  const willFillTaskPoint = (() => {
    if (!renderEnable || isScrolling || pointRowType !== CellType.Record || splitterVisible) return null;
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

    return <GanttTask
      colors={colors}
      x={x + 0.5}
      y={y + 4}
      text={text}
      width={columnWidth}
      height={rowHeight - 8}
      fill={colors.fourthLevelText}
      opacity={0.4}
      cornerRadius={4}
    />;
  })();

  /**
   * 绘制甘特图分组的组头
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
        />
      );
    }
    return result;
  })();

  /**
   * 绘制错误日期任务的提示
   */
  const errTaskTips = renderEnable ? Array.from({ length: rowStopIndex - rowStartIndex }, (_, index) => {
    return rowStartIndex + index;
  }).map(rowIndex => {
    const { recordId, type } = linearRows[rowIndex];
    if (type !== CellType.Record) return null;
    const startTime = cellValueMap[generateKeyName(startFieldId, recordId)];
    const endTime = cellValueMap[generateKeyName(endFieldId, recordId)];
    if (!startTime || !endTime) return null;
    // 如果起止时间是正常的，就不进行提示（错误任务的起止时间比较只精确到 “天”）
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
        onMouseEnter={() => setTooltipInfo({
          visible: true,
          x: gridWidth + 10,
          y: instance.getRowOffset(pointRowIndex),
          width: GANTT_COMMON_ICON_SIZE,
          title: t(Strings.gantt_error_date_tip),
        })}
        onMouseOut={() => clearTooltipInfo()}
      />
    );
  }) : null;

  /**
   * 绘制 ”回到任务“ 按钮集合
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
          recordId
        });
        const background = pointRealTargetName === name ? colors.primaryColor : colors.fourthLevelText;
        const iconPath = isLeft ? GanttLeftFilledPath : GanttRightFilledPath;

        return (
          <Icon
            key={key}
            name={name}
            x={isLeft ? 10 : containerWidth - 30}
            y={y + (rowHeight - GANTT_COMMON_ICON_SIZE) / 2}
            data={iconPath}
            fill={colors.white}
            background={background}
            cornerRadius={2}
          />
        );
      };

      if (isLeft) result.push(buttonRenderer(true));
      if (isRight) result.push(buttonRenderer(false));
    }
    return result;
  })();

  // 绘制任务列表
  const taskList: React.ReactNode[] = [];

  const taskRenderer = (rowIndex: number) => {
    const { recordId } = linearRows[rowIndex];
    const y = instance.getRowOffset(rowIndex);
    const startTime = cellValueMap[generateKeyName(startFieldId, recordId)];
    const endTime = cellValueMap[generateKeyName(endFieldId, recordId)];
    const { startOffset, endOffset, width } = instance.getTaskData(startTime, endTime);
    if (startOffset == null && endOffset == null) return null;
    const taskId = `task-${recordId}`;
    const x = (startOffset ?? endOffset)!;
    const taskWidth = width ?? unitWidth;
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

    // 拖拽中的任务
    if (dragTaskId && !isDragRendered) {
      const rowIndex = rowsIndexMap.get(`${CellType.Record}_${dragTaskId}`);
      if (rowIndex != null) {
        taskList.push(taskRenderer(rowIndex));
      }
    }
  }

  /**
   * Task 变形器
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
  };
};
