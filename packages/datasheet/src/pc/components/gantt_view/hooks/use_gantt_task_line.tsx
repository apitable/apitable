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

import { useContext } from 'react';
import { fastCloneDeep } from '@apitable/core';
import { GanttCoordinate, GANTT_TASK_GAP_SIZE, IScrollState } from 'pc/components/gantt_view';
import { TaskLine } from 'pc/components/gantt_view/components/task/task_lines';
import { KonvaGanttViewContext } from 'pc/components/gantt_view/context';
import { getTaskLineName } from 'pc/components/gantt_view/utils';
import { KonvaGridContext } from 'pc/components/konva_grid';
import { PointPosition, TaskPositionYType } from '../interface';
import { useTooltip } from './use_gantt_tooltip';

interface IAssociaLinePorps {
  instance: GanttCoordinate;
  rowStartIndex: number;
  rowStopIndex: number;
  pointPosition: PointPosition;
  scrollState: IScrollState;
}

export const useGanttAssocitionLine = (props: IAssociaLinePorps) => {
  const { instance, scrollState, rowStartIndex, rowStopIndex, pointPosition } = props;
  const { rowsCellValueMap, linkCycleEdges } = useContext(KonvaGanttViewContext);
  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;
  const { scrollTop, isScrolling } = scrollState;
  const { tooltip, setTooltipInfo } = useTooltip({ isScrolling });

  const taskLineList: React.ReactNode[] = [];
  if (!rowsCellValueMap) {
    return {
      lineTooltip: tooltip,
      taskLineList,
    };
  }

  const { rowHeight, unitWidth } = instance;
  const { taskEdges, cycleEdges } = linkCycleEdges;

  const topY = scrollTop - rowHeight * 5;
  const bottomY = scrollTop + instance.containerHeight;
  // Store the nodeId of the up or down vanishing line without repeated rendering
  const nodeTopLineMap: Map<string, string> = new Map();
  const nodeBottomLineMap: Map<string, string> = new Map();

  // Storage of grouped and put away taskstasks are stored according to the location of x
  const sourceCollapseXMap: Map<string, Map<string, string>> = new Map();
  const targetCollapseXMap: Map<string, Map<string, string>> = new Map();

  // Store the y value after each calculation
  const taskYPositionMap: Map<string, number> = new Map();

  const getTaskXPosition = (startFiledValue: string, endFiledValue: string) => {
    const { startOffset, endOffset, width } = instance.getTaskData(startFiledValue, endFiledValue);
    if (startOffset == null && endOffset == null) return null;

    const x = (startOffset ?? endOffset! - unitWidth)!;
    const taskWidth = width ?? unitWidth;
    return {
      x,
      width: taskWidth,
    };
  };

  const associationLineRender = (sourceId: string, targetId: string) => {
    if (!rowsCellValueMap[sourceId] || !rowsCellValueMap[targetId]) {
      return null;
    }

    const sourceTask = fastCloneDeep(rowsCellValueMap[sourceId]);
    const targetTask = fastCloneDeep(rowsCellValueMap[targetId]);

    if (!sourceTask || !targetTask) {
      return null;
    }

    if (!sourceTask.isCollapse) {
      if (sourceTask.rowIndex < rowStartIndex) {
        sourceTask.positionYType = TaskPositionYType.Top;
        sourceTask.y = topY;
      }

      if (sourceTask.rowIndex >= rowStartIndex && sourceTask.rowIndex <= rowStopIndex) {
        sourceTask.positionYType = TaskPositionYType.Viewable;
        if (taskYPositionMap.has(sourceId)) {
          sourceTask.y = taskYPositionMap.get(sourceId);
        } else {
          sourceTask.y = instance.getRowOffset(sourceTask.rowIndex);
          taskYPositionMap.set(sourceId, sourceTask.y);
        }
      }

      if (sourceTask.rowIndex > rowStopIndex) {
        sourceTask.positionYType = TaskPositionYType.Bottom;
        sourceTask.y = bottomY;
      }
    } else {
      if (taskYPositionMap.has(sourceId)) {
        sourceTask.y = taskYPositionMap.get(sourceId);
      } else {
        sourceTask.y = instance.getRowOffset(sourceTask.rowIndex);
        taskYPositionMap.set(sourceId, sourceTask.y);
      }
    }

    if (!targetTask.isCollapse) {
      if (targetTask.rowIndex < rowStartIndex) {
        targetTask.positionYType = TaskPositionYType.Top;
        targetTask.y = topY;
      }

      if (targetTask.rowIndex >= rowStartIndex && targetTask.rowIndex <= rowStopIndex) {
        targetTask.positionYType = TaskPositionYType.Viewable;
        if (taskYPositionMap.has(targetId)) {
          targetTask.y = taskYPositionMap.get(targetId);
        } else {
          targetTask.y = instance.getRowOffset(targetTask.rowIndex);
          taskYPositionMap.set(targetId, targetTask.y);
        }
      }

      if (targetTask.rowIndex > rowStopIndex) {
        targetTask.positionYType = TaskPositionYType.Bottom;
        targetTask.y = bottomY;
      }
    } else {
      if (taskYPositionMap.has(targetId)) {
        targetTask.y = taskYPositionMap.get(targetId);
      } else {
        targetTask.y = instance.getRowOffset(targetTask.rowIndex);
        taskYPositionMap.set(targetId, targetTask.y);
      }
    }

    const sourcePositionType = sourceTask.positionYType;
    const targetPositionType = targetTask.positionYType;

    if (!(sourcePositionType === TaskPositionYType.Viewable || targetPositionType === TaskPositionYType.Viewable)) {
      return null;
    }

    if (sourcePositionType === TaskPositionYType.Viewable && targetPositionType !== TaskPositionYType.Viewable) {
      if (targetPositionType === TaskPositionYType.Top) {
        if (nodeTopLineMap.has(sourceId)) return null;
        nodeTopLineMap.set(sourceId, sourceId);
      }
      if (targetPositionType === TaskPositionYType.Bottom) {
        if (nodeBottomLineMap.has(sourceId)) return null;
        nodeBottomLineMap.set(sourceId, sourceId);
      }
      if (targetTask.Collapse) {
        if (targetCollapseXMap.get(sourceId)?.has(targetTask.x)) {
          return null;
        }
        const targetXList = targetCollapseXMap.get(sourceId) ? (targetCollapseXMap.get(sourceId) as Map<string, string>) : new Map();
        targetXList.set(targetTask.x, targetTask.x);
        targetCollapseXMap.set(sourceId, targetXList);
      }
    }

    if (targetPositionType === TaskPositionYType.Viewable && sourcePositionType !== TaskPositionYType.Viewable) {
      if (sourcePositionType === TaskPositionYType.Top) {
        if (nodeTopLineMap.has(targetId)) return null;
        nodeTopLineMap.set(targetId, targetId);
      }
      if (sourcePositionType === TaskPositionYType.Bottom) {
        if (nodeBottomLineMap.has(targetId)) return null;
        nodeBottomLineMap.set(targetId, targetId);
      }

      if (sourceTask.isCollapse) {
        if (sourceCollapseXMap.get(sourceId)?.has(sourceTask.x)) {
          return null;
        }
        const sourceXList = sourceCollapseXMap.get(sourceId) ? (sourceCollapseXMap.get(sourceId) as Map<string, string>) : new Map();
        sourceXList.set(sourceTask.x, sourceTask.x);
        sourceCollapseXMap.set(targetId, sourceXList);
      }
    }

    const sourceXPosition = getTaskXPosition(sourceTask.startTime, sourceTask.endTime);
    if (!sourceXPosition) return null;
    sourceTask.x = sourceXPosition.x;
    sourceTask.taskWidth = sourceXPosition.width;

    const targetXPosition = getTaskXPosition(targetTask.startTime, targetTask.endTime);
    if (!targetXPosition) return null;
    targetTask.x = targetXPosition.x;

    const taskRightOffset = sourceTask.taskWidth > 32 ? 16 : sourceTask.taskWidth / 2;

    const sourcePoint = {
      x: sourceTask.x + sourceTask.taskWidth - taskRightOffset,
      y: sourceTask.y + rowHeight - 4,
    };
    const targetPoint = {
      x: targetTask.x - 2,
      y: targetTask.y + rowHeight / 2,
    };
    const taskLineName = getTaskLineName(sourceId, targetId);
    const isCycleLine = cycleEdges.includes(taskLineName);
    let fillColor = isCycleLine ? colors.fc10 : colors.black[400];
    let dashEnabled = isCycleLine ? true : false;
    let points: number[] = [];

    if (targetTask.x < sourceTask.x + sourceTask.taskWidth) {
      fillColor = colors.fc10;
      dashEnabled = true;
      points = [
        sourcePoint.x,
        sourcePoint.y,
        sourcePoint.x,
        sourcePoint.y + GANTT_TASK_GAP_SIZE / 4,
        targetPoint.x - 8,
        sourcePoint.y + GANTT_TASK_GAP_SIZE / 4,
        targetPoint.x - 8,
        targetPoint.y,
        targetPoint.x,
        targetPoint.y,
      ];
    }

    if (targetTask.x >= sourceTask.x + sourceTask.taskWidth) {
      points = [
        sourcePoint.x,
        sourcePoint.y,
        sourcePoint.x,
        sourcePoint.y + GANTT_TASK_GAP_SIZE / 4,
        sourcePoint.x,
        targetPoint.y,
        targetPoint.x - 8,
        targetPoint.y,
        targetPoint.x,
        targetPoint.y,
      ];
    }

    if (targetTask.isCollapse) {
      points = [sourcePoint.x, sourcePoint.y, sourcePoint.x, targetPoint.y - 8, targetPoint.x, targetPoint.y - 8, targetPoint.x, targetPoint.y];
    }

    if (targetPoint.x > sourcePoint.x) {
      points = [sourcePoint.x, sourcePoint.y, sourcePoint.x, targetPoint.y, targetPoint.x - 8, targetPoint.y, targetPoint.x, targetPoint.y];
    }

    return (
      <TaskLine
        points={points}
        fillColor={fillColor}
        dashEnabled={dashEnabled}
        sourceId={sourceId}
        targetId={targetId}
        pointPosition={pointPosition}
        setLineTooltipInfo={setTooltipInfo}
        isCycleLine={isCycleLine}
      />
    );
  };

  taskEdges.forEach((taskLine: [any, any]) => {
    const [sourceId, targetId] = taskLine;
    taskLineList.push(associationLineRender(sourceId, targetId));
  });

  return {
    lineTooltip: tooltip,
    taskLineList,
  };
};
