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
import { Context } from 'konva/lib/Context';
import { KonvaEventObject } from 'konva/lib/Node';
import { Shape, ShapeConfig } from 'konva/lib/Shape';
import dynamic from 'next/dynamic';
import { FC, useContext, useMemo, useRef, useState } from 'react';
import { lightColors } from '@apitable/components';
import {
  CollaCommandName,
  DropDirectionType,
  FieldType,
  GanttColorType,
  GanttRowHeight,
  getTimeZoneAbbrByUtc,
  KONVA_DATASHEET_ID,
  Strings,
  t,
} from '@apitable/core';
import {
  GANTT_HORIZONTAL_DEFAULT_SPACING,
  GANTT_INNER_HANDLER_HEIGHT,
  GANTT_TASK_GAP_SIZE,
  GanttCoordinate,
  generateTargetName,
  getDiffCount,
  getDiffCountByWorkdays,
  KonvaGanttViewContext,
  PointPosition,
  useUpdate,
} from 'pc/components/gantt_view';
import TaskContent from 'pc/components/gantt_view/components/task/task_content';
import { onDragScrollSpacing, getSpeed } from 'pc/components/gantt_view/utils';
import { Rect } from 'pc/components/konva_components';
import { KonvaGridContext, KonvaGridViewContext } from 'pc/components/konva_grid';
import { setColor } from 'pc/components/multi_grid/format';
import { resourceService } from 'pc/resource_service';
import { COLOR_INDEX_THRESHOLD, rgbaToHex } from 'pc/utils';
import { AreaType, ITargetTaskInfo } from '../../interface';

const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });
const ShapeComponent = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/shape'), { ssr: false });

interface ITaskProps {
  x: number;
  y: number;
  instance: GanttCoordinate;
  recordId: string;
  scrollTop: number;
  pointPosition: PointPosition;
  gridWidth: number;
  taskWidth: number;
  draggable: boolean;
  isTransform: boolean;
  leftAnchorEnable?: boolean;
  rightAnchorEnable?: boolean;
  setTooltipInfo: (info: { visible: boolean; text?: string; x?: number; y?: number }) => void;
  targetTaskInfo: ITargetTaskInfo | null;
}

enum TipType {
  Left = 'Left',
  Right = 'Right',
  All = 'All',
}

enum TransformType {
  Left = 'Left',
  Right = 'Right',
  None = 'None',
}

/**
 * Handle colour rule (based on option's colour palette).
 * The first four rows of colour are used as the background colour and the handle colour is increased by alpha in turn.
 * The last line of colour is used as the background colour and the handle colour needs to be increased by the colour number.
 */
const getDeepColor = (color: number) => {
  const colorNumber = color < 40 ? 500 : 600;
  const realColor = color % 10;
  const realAlpha = Math.min((Math.floor(color / 10) + 2) * 0.2, 1);
  const deepColorPanel = {
    0: lightColors.deepPurple[colorNumber],
    1: lightColors.indigo[colorNumber],
    2: lightColors.blue[colorNumber],
    3: lightColors.teal[colorNumber],
    4: lightColors.green[colorNumber],
    5: lightColors.yellow[colorNumber],
    6: lightColors.orange[colorNumber],
    7: lightColors.tangerine[colorNumber],
    8: lightColors.pink[colorNumber],
    9: lightColors.red[colorNumber],
  };
  return rgbaToHex(deepColorPanel[realColor], realAlpha);
};

const moveRow = (viewId: string, dragTaskId: string, dropRecordId: string, direction: DropDirectionType) => {
  resourceService.instance!.commandManager.execute({
    cmd: CollaCommandName.MoveRow,
    viewId,
    data: [
      {
        recordId: dragTaskId,
        overTargetId: dropRecordId,
        direction,
      },
    ],
  });
};

const formatStr = 'YYYY/MM/DD';

const Task: FC<React.PropsWithChildren<ITaskProps>> = (props) => {
  const {
    x,
    y,
    instance,
    recordId,
    scrollTop,
    taskWidth,
    draggable,
    isTransform,
    pointPosition,
    gridWidth,
    setTooltipInfo,
    leftAnchorEnable = true,
    rightAnchorEnable = true,
    targetTaskInfo,
  } = props;
  const { setLocking, ganttStyle, setRecord, isTaskLineDrawing } = useContext(KonvaGanttViewContext);
  const { view, recordMap, fieldMap, linearRows, cacheTheme } = useContext(KonvaGridViewContext);
  const { index: renderIndex, forceRender } = useUpdate();
  const { setMouseStyle, scrollHandler, theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  const containerRef = useRef<any>();
  const contentRef = useRef<any>();
  const { workDays, onlyCalcWorkDay, unitWidth, rowHeight, columnWidth, columnThreshold, containerWidth: ganttWidth } = instance;
  const taskHeight = rowHeight;
  const threshold = unitWidth / 2;
  const { rowIndex: pointRowIndex, offsetTop: pointOffsetTop, offsetLeft: pointOffsetLeft, x: pointX, y: pointY } = pointPosition;
  const dropRecordId = linearRows[pointRowIndex]?.recordId;
  const [taskPosition, _setTaskPosition] = useState({
    x,
    y,
    width: taskWidth,
    isOperating: false,
    transformType: TransformType.None,
    distanceToTaskLeft: 0,
    distanceToTaskRight: 0,
    distanceToTaskTop: 0,
    distanceToTaskBottom: 0,
    distanceToBoundaryLeft: 0,
    distanceToBoundaryRight: 0,
  });
  const { colorOption, startFieldId } = ganttStyle;
  const {
    x: _x,
    y: _y,
    width,
    isOperating,
    transformType,
    distanceToTaskLeft,
    distanceToBoundaryLeft,
    distanceToTaskTop,
    distanceToBoundaryRight,
  } = taskPosition;
  const isCustomColor = colorOption.type === GanttColorType.Custom;
  const taskCornerRadius = useMemo(() => {
    switch (rowHeight) {
      case GanttRowHeight.Short:
        return 3;
      case GanttRowHeight.Medium:
        return 4;
      case GanttRowHeight.Tall:
        return 5;
    }
    return 4;
  }, [rowHeight]);

  const colorMap = useMemo(() => {
    let bgColor = colors.defaultBg;
    let handlerColor = '#B9BCD3';
    let colorIndex = 0;
    if (isCustomColor) {
      colorIndex = colorOption.color;
      if (colorIndex !== -1) {
        bgColor = setColor(colorIndex, cacheTheme);
        handlerColor = getDeepColor(colorIndex);
      }
    } else {
      const singleSelectFieldId = colorOption.fieldId;
      const singleSelectField = fieldMap[singleSelectFieldId];
      const recordData = recordMap[recordId]?.data;
      const optionValue = recordData && recordData[singleSelectFieldId];
      if (optionValue != null && singleSelectField?.type === FieldType.SingleSelect) {
        singleSelectField.property.options.forEach((option) => {
          if (option.id === optionValue) {
            colorIndex = option.color;
            bgColor = setColor(colorIndex, cacheTheme);
            handlerColor = getDeepColor(colorIndex);
          }
        });
      }
    }
    return {
      colorIndex,
      bgColor,
      handlerColor,
    };
  }, [colors.defaultBg, isCustomColor, colorOption.color, colorOption.fieldId, cacheTheme, fieldMap, recordMap, recordId]);
  const color = colorMap.colorIndex >= COLOR_INDEX_THRESHOLD ? colors.defaultBg : colors.firstLevelText;

  const isDrawTargetTask = targetTaskInfo?.recordId === recordId;

  const setTaskPosition = (data: any) => _setTaskPosition((prev) => ({ ...prev, ...data }));

  const onTooltipShow = (taskX: number, taskWidth: number, toolTipX: number, toolTipY: number, tipType = TipType.All) => {
    if (wheelingRef.current) return;
    wheelingRef.current = window.requestAnimationFrame(() => {
      wheelingRef.current = null;
      let text = '';
      const unitStartIndex = instance.getUnitIndex(taskX);
      const unitStopIndex = instance.getUnitIndex(taskX + taskWidth) - 1;
      let startTime = instance.getDateFromStartDate(unitStartIndex);
      let endTime = instance.getDateFromStartDate(unitStopIndex);
      const startFieldTimeZone = fieldMap[startFieldId]?.property?.timeZone;
      const totalCount = onlyCalcWorkDay ? getDiffCountByWorkdays(startTime, endTime, workDays) : getDiffCount(startTime, endTime) + 1;
      let totalText = onlyCalcWorkDay
        ? t(Strings.gantt_task_total_workdays, { count: totalCount })
        : t(Strings.gantt_task_total_date, { count: totalCount });
      if (startFieldTimeZone) {
        startTime = startTime.tz(startFieldTimeZone);
        endTime = endTime.tz(startFieldTimeZone);
        totalText = ` (${getTimeZoneAbbrByUtc(startFieldTimeZone)})，${totalText}`;
      }
      switch (tipType) {
        case TipType.Left: {
          text = `${startTime.format(formatStr)}${totalText}`;
          break;
        }
        case TipType.Right: {
          text = `${endTime.format(formatStr)}${totalText}`;
          break;
        }
        case TipType.All: {
          text = `${startTime.format(formatStr)} - ${endTime.format(formatStr)}${totalText}`;
        }
      }
      setTooltipInfo({
        visible: true,
        text,
        x: toolTipX,
        y: toolTipY,
      });
    });
  };

  const wheelingRef = useRef<number | null>(null); // Store timers to ensure smooth drag and drop when tooltip appears
  const onTransformStart = (e: KonvaEventObject<Event>) => {
    const node = e.target;
    const transformer: any = node.getStage()?.findOne('.transformer');
    if (transformer == null) return;
    const activeAnchor = transformer.getActiveAnchor();
    const isLeft = activeAnchor === 'middle-left';
    setLocking(true);
    setTaskPosition({
      isOperating: true,
      transformType: isLeft ? TransformType.Left : TransformType.Right,
      distanceToTaskLeft: pointOffsetLeft - x,
      distanceToTaskRight: x + width - pointOffsetLeft,
      distanceToBoundaryLeft: pointX - gridWidth,
      distanceToBoundaryRight: gridWidth + ganttWidth - pointX,
    });
  };
  const onTransform = (e: KonvaEventObject<Event>) => {
    const pos = e.target.getStage()?.getPointerPosition();
    if (pos == null) return;
    const { x: pointX } = pos;
    const node = containerRef.current;
    const scaleX = node.scaleX();
    const curX = node.x();
    const curWidth = Math.max(unitWidth, node.width() * scaleX);
    const isLeft = transformType === TransformType.Left;

    // Need to remain undistorted during dragging
    node.scaleX(1);
    const leftSpacing = pointX - gridWidth;
    const isTouchLeft = leftSpacing < GANTT_HORIZONTAL_DEFAULT_SPACING;
    if (isTouchLeft) {
      return scrollHandler.scrollByValue(
        {
          columnSpeed: -getSpeed(leftSpacing),
          scrollCb: ({ scrollLeft, totalScrollX }: { scrollLeft: number; totalScrollX: number }) => {
            const diffFactor = isLeft ? 1 : -1;
            setTaskPosition({
              x: isLeft ? scrollLeft + pointX - gridWidth - distanceToTaskLeft : curX,
              width: Math.max(taskWidth + (totalScrollX - leftSpacing + distanceToBoundaryLeft) * diffFactor, unitWidth),
            });
          },
        },
        AreaType.Gantt,
      );
    }
    const rightSpacing = ganttWidth + gridWidth - pointX;
    const isTouchRight = rightSpacing < GANTT_HORIZONTAL_DEFAULT_SPACING;
    if (isTouchRight) {
      return scrollHandler.scrollByValue(
        {
          columnSpeed: getSpeed(rightSpacing),
          scrollCb: ({ scrollLeft, totalScrollX, maxScrollSize }: { scrollLeft: number; totalScrollX: number; maxScrollSize: number }) => {
            const curCount = totalScrollX % maxScrollSize > maxScrollSize - x ? 1 : 0;
            const prevCount = Math.floor(totalScrollX / maxScrollSize);
            const diffFactor = isLeft ? -1 : 1;
            setTaskPosition({
              x: isLeft ? scrollLeft - gridWidth + pointX : x - (curCount + prevCount) * (columnWidth * columnThreshold + columnThreshold / 2),
              width: Math.max(taskWidth + (distanceToBoundaryRight + totalScrollX - rightSpacing) * diffFactor, unitWidth),
            });
          },
        },
        AreaType.Gantt,
      );
    }
    if (!isTouchLeft && !isTouchRight) {
      const tipType = isLeft ? TipType.Left : TipType.Right;
      scrollHandler.stopScroll(false);
      setTaskPosition({ x: curX, width: curWidth });
      onTooltipShow(curX, curWidth, pointX, _y - (pointOffsetTop - pointY) + rowHeight, tipType);
    }
  };

  const onTransformEnd = () => {
    setLocking(false);
    scrollHandler.stopScroll();
    setTooltipInfo({ visible: false });
    const node = containerRef.current;
    const nodeWidth = node.width();
    const nodeX = Math.floor(node.x());
    if (Math.abs(x - nodeX) <= threshold && Math.abs(nodeWidth - taskWidth) <= threshold) {
      return setTaskPosition({ x, width: taskWidth, isOperating: false, transformType: TransformType.None });
    }
    const startUnitIndex = instance.getUnitIndex(nodeX);
    const endUnitIndex = instance.getUnitIndex(nodeX + nodeWidth);

    setRecord(recordId, startUnitIndex, endUnitIndex - 1);
  };

  const onDragStart = (e: KonvaEventObject<DragEvent>) => {
    setLocking(true);
    setTimeout(() => setMouseStyle('move'));
    const node = e.target;
    // Preventing tasks from being obscured
    node.moveToTop();
    contentRef.current.moveToTop();

    setTaskPosition({
      isOperating: true,
      distanceToTaskLeft: pointOffsetLeft - x,
      distanceToTaskTop: pointOffsetTop - y,
    });
  };

  const onDragMove = (e: KonvaEventObject<DragEvent>) => {
    const node = e.target;
    const curX = Math.round(node.x());
    const curY = Math.round(node.y());

    const scrollState = { scrollTop };
    const noScrollCb = () => {
      setTaskPosition({ x: curX, y: curY });
      onTooltipShow(curX, taskWidth, pointX, pointY + 20);
    };
    const horizontalScrollCb = ({ scrollLeft }: { scrollLeft: number }) =>
      setTaskPosition({ x: scrollLeft + pointX - gridWidth - distanceToTaskLeft, y: curY });
    const verticalScrollCb = ({ scrollTop }: { scrollTop: number }) => setTaskPosition({ x: curX, y: scrollTop + pointY - distanceToTaskTop });
    const allScrollCb = ({ scrollLeft, scrollTop }: { scrollLeft: number; scrollTop: number }) =>
      setTaskPosition({
        x: scrollLeft + pointX - gridWidth - distanceToTaskLeft,
        y: scrollTop + pointY - distanceToTaskTop,
      });

    onDragScrollSpacing(
      scrollHandler,
      gridWidth,
      instance,
      scrollState as any,
      pointPosition,
      noScrollCb,
      horizontalScrollCb,
      verticalScrollCb,
      allScrollCb,
    );
  };

  const onDragEnd = (e: KonvaEventObject<DragEvent>) => {
    setLocking(false);
    setTooltipInfo({ visible: false });
    const node = e.target;
    const nodeX = Math.floor(node.x());
    const nodeY = Math.floor(node.y());
    const isVertical = Math.abs(y - nodeY) > rowHeight;
    const isHorizontal = Math.abs(x - nodeX) > threshold;
    // Horizontal and vertical thresholds are not exceeded, return to original coordinates
    // Drag to the point where there is no record and return to the original location
    if ((!isVertical && !isHorizontal) || !dropRecordId) {
      setTaskPosition({ x, y, isOperating: false });
      return forceRender();
    }
    const viewId = view.id;
    const startUnitIndex = instance.getUnitIndex(nodeX);
    const endUnitIndex = instance.getUnitIndex(nodeX + taskWidth) - 1;
    // Horizontal dragging
    if (isHorizontal && !isVertical) {
      setRecord(recordId, startUnitIndex, endUnitIndex);
    }
    const direction = pointOffsetTop - instance.getRowOffset(pointRowIndex) > rowHeight / 2 ? DropDirectionType.AFTER : DropDirectionType.BEFORE;
    // Vertical dragging
    if (isVertical && !isHorizontal) {
      moveRow(viewId, recordId, dropRecordId, direction);
    }
    // Horizontal and vertical changes
    if (isVertical && isHorizontal) {
      moveRow(viewId, recordId, dropRecordId, direction);
      setRecord(recordId, startUnitIndex, endUnitIndex);
    }
    forceRender();
  };

  const onMouseMove = () => {
    if (isOperating || isTaskLineDrawing) {
      setTooltipInfo({ visible: false });
      return;
    }
    onTooltipShow(_x, taskWidth, pointX, _y - (pointOffsetTop - pointY) + rowHeight);
  };

  const onMouseLeave = () => {
    if (isOperating) return;
    setTooltipInfo({ visible: false });
  };

  const sceneFunc = (ctx: Context, shape: Shape<ShapeConfig>) => {
    const startY = (rowHeight - GANTT_INNER_HANDLER_HEIGHT) / 2;
    const endY = rowHeight - startY;

    // Left towing handle
    if (leftAnchorEnable) {
      roundRect(0, GANTT_TASK_GAP_SIZE / 2, 10, taskHeight - GANTT_TASK_GAP_SIZE, taskCornerRadius, 0, 0, taskCornerRadius);
      ctx.beginPath();
      ctx.moveTo(4, startY);
      ctx.lineTo(4, endY);
      ctx.moveTo(7, startY);
      ctx.lineTo(7, endY);
      ctx.fillStrokeShape(shape);
    }
    // Right drag handle
    if (rightAnchorEnable) {
      roundRect(width - 10, GANTT_TASK_GAP_SIZE / 2, 10, taskHeight - GANTT_TASK_GAP_SIZE, 0, taskCornerRadius, taskCornerRadius, 0);
      ctx.beginPath();
      ctx.moveTo(width - 3, startY);
      ctx.lineTo(width - 3, endY);
      ctx.moveTo(width - 6, startY);
      ctx.lineTo(width - 6, endY);
      ctx.fillStrokeShape(shape);
    }

    function roundRect(x: number, y: number, width: number, height: number, tlRadius = 0, trRadius = 0, brRadius = 0, blRadius = 0) {
      ctx.beginPath();
      ctx.moveTo(x + tlRadius, y);
      ctx.lineTo(x + width - trRadius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + trRadius);
      ctx.lineTo(x + width, y + height - brRadius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - brRadius, y + height);
      ctx.lineTo(x + blRadius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - blRadius);
      ctx.lineTo(x, y + tlRadius);
      ctx.quadraticCurveTo(x, y, x + tlRadius, y);
      ctx.closePath();
      ctx.fillShape(shape);
    }
  };

  useUpdateEffect(() => {
    setTaskPosition({
      x,
      y,
      width: Math.max(unitWidth, taskWidth),
      isOperating: false,
    });
  }, [taskWidth, x, y, renderIndex]);

  /**
   * This may occur with quarterly/annual time accuracy, with shorter tasks.
   * Here, the task is stretched to the width of the columnWidth when the mouse is moved in to ensure smooth interaction
   */
  useMemo(() => {
    if (isTransform && !isOperating && taskWidth < columnWidth) {
      setTaskPosition({ x, y, width: columnWidth });
    }
    if (!isTransform && !isOperating) {
      setTaskPosition({ x, y, width: taskWidth });
    }
    // eslint-disable-next-line
  }, [isTransform]);

  const getTaskStroke = () => {
    if (isTransform || isDrawTargetTask) {
      if (isTaskLineDrawing) {
        return targetTaskInfo?.dashEnabled ? colors.fc10 : colors.borderBrandDefault;
      }
      return colorMap.handlerColor;
    } else if (colorMap.bgColor === colors.defaultBg) {
      return '#B9BCD3';
    }
    return colorMap.bgColor;
  };

  return (
    <>
      <Group x={_x} y={_y} listening={false} opacity={0.5}>
        <TaskContent instance={instance} recordId={recordId} bgColor={colorMap.bgColor} color={colors.firstLevelText} />
      </Group>
      <Group
        name={`task-${recordId}`}
        _ref={containerRef}
        x={_x}
        y={_y}
        width={width}
        height={taskHeight - GANTT_TASK_GAP_SIZE}
        onTransformStart={onTransformStart}
        onTransform={onTransform}
        onTransformEnd={onTransformEnd}
        onDragStart={onDragStart}
        onDragMove={onDragMove}
        onDragEnd={onDragEnd}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        draggable={draggable}
      >
        <Rect
          name={generateTargetName({
            targetName: KONVA_DATASHEET_ID.GANTT_TASK,
            recordId,
          })}
          y={GANTT_TASK_GAP_SIZE / 2}
          width={width}
          height={taskHeight - GANTT_TASK_GAP_SIZE}
          fill={colorMap.bgColor}
          stroke={getTaskStroke()}
          strokeWidth={(isTransform && isTaskLineDrawing) || isDrawTargetTask ? 1 : 0.5}
          cornerRadius={taskCornerRadius}
        />
      </Group>
      <Group
        x={_x}
        y={_y}
        width={width}
        height={rowHeight}
        _ref={contentRef}
        listening={false}
        clipX={0}
        clipY={0}
        clipWidth={width}
        clipHeight={rowHeight}
      >
        <TaskContent instance={instance} recordId={recordId} bgColor={colorMap.bgColor} color={color} />
        {isTransform && !isTaskLineDrawing && (
          <ShapeComponent fill={colorMap.handlerColor} stroke={colors.defaultBg} strokeWidth={1} sceneFunc={sceneFunc} />
        )}
      </Group>
      {isOperating && (
        <Group x={_x} y={scrollTop + 72} listening={false}>
          <Rect width={width} height={2} fill={colors.primaryColor} />
        </Group>
      )}
    </>
  );
};

export default Task;
