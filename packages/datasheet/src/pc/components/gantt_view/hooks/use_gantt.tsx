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

import {
  GanttCoordinate,
  PointPosition,
  IScrollState,
  useTask,
  useStatus,
  useButton,
  useTimelineLayer,
  useGanttAssocitionLine,
  useGanttDrawingLine,
  useTaskLineSetting,
} from 'pc/components/gantt_view';

export interface IUseGanttProps {
  instance: GanttCoordinate;
  columnStartIndex: number;
  columnStopIndex: number;
  rowStartIndex: number;
  rowStopIndex: number;
  scrollState: IScrollState;
  pointPosition: PointPosition;
  gridWidth: number;
}

export const useGantt = (props: IUseGanttProps) => {
  const { instance, scrollState, columnStartIndex, columnStopIndex, pointPosition, rowStartIndex, rowStopIndex, gridWidth } = props;

  const { containerWidth: ganttWidth } = instance;

  /**
   * Drawing timeline related background layers
   */
  const { timelineTexts, timelineLines, timelineHolidays, timelineDividers, headerBackground, timelineHighlight } = useTimelineLayer({
    instance,
    columnStartIndex,
    columnStopIndex,
  });

  /**
   * Draw mouse row and column states and drag and drop highlighting related layers
   */
  const { hoverRow, activeRow, selectedRows, dragSplitter, dragRowHighlightLine } = useStatus({
    instance,
    rowStartIndex,
    rowStopIndex,
    scrollState,
    pointPosition,
    containerWidth: ganttWidth + gridWidth,
  });

  /**
   * Drawing button-related layers
   */
  const { skipButtons, backToNowButton } = useButton({
    instance,
    columnStartIndex,
    columnStopIndex,
    pointPosition,
  });

  /**
   * Drawing task-related layers
   */
  const { tooltip, taskList, errTaskTips, transformer, taskGroupHeaders, willAddTaskPoint, willFillTaskPoint, backToTaskButtons, taskMap } = useTask({
    instance,
    rowStartIndex,
    rowStopIndex,
    pointPosition,
    scrollState,
    gridWidth,
  });

  /**
   * Drawing task-related link lines
   */
  const { lineTooltip, taskLineList } = useGanttAssocitionLine({
    instance,
    rowStartIndex,
    rowStopIndex,
    pointPosition,
    scrollState,
  });

  const { drawingLine } = useGanttDrawingLine({
    instance,
    taskMap,
    gridWidth,
    pointPosition,
    scrollState,
  });

  const { lineSettingModels } = useTaskLineSetting({
    scrollState,
  });

  return {
    hoverRow,
    activeRow,
    selectedRows,
    dragRowHighlightLine,
    timelineHighlight,
    timelineTexts,
    timelineLines,
    timelineHolidays,
    timelineDividers,
    headerBackground,
    backToNowButton,
    backToTaskButtons,
    errTaskTips,
    willFillTaskPoint,
    willAddTaskPoint,
    taskList,
    taskGroupHeaders,
    skipButtons,
    transformer,
    tooltip,
    dragSplitter,
    lineTooltip,
    taskLineList,
    drawingLine,
    lineSettingModels,
  };
};
