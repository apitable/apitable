import { 
  GanttCoordinate, PointPosition, IScrollState, useTask, useStatus, useButton, useTimelineLayer,
  useGanttAssocitionLine, useGanttDrawingLine, useTaskLineSetting
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
  const {
    instance,
    scrollState,
    columnStartIndex,
    columnStopIndex,
    pointPosition,
    rowStartIndex,
    rowStopIndex,
    gridWidth
  } = props;

  const { containerWidth: ganttWidth } = instance;

  /**
   * Drawing timeline related background layers
   */
  const {
    timelineTexts,
    timelineLines,
    timelineHolidays,
    timelineDividers,
    headerBackground,
    timelineHighlight,
  } = useTimelineLayer({
    instance,
    columnStartIndex,
    columnStopIndex
  });

  /**
   * Draw mouse row and column states and drag and drop highlighting related layers
   */
  const {
    hoverRow,
    activeRow,
    selectedRows,
    dragSplitter,
    dragRowHighlightLine,
  } = useStatus({
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
  const {
    skipButtons,
    backToNowButton
  } = useButton({
    instance,
    columnStartIndex,
    columnStopIndex,
    pointPosition,
  });

  /**
   * Drawing task-related layers
   */
  const {
    tooltip,
    taskList,
    errTaskTips,
    transformer,
    taskGroupHeaders,
    willAddTaskPoint,
    willFillTaskPoint,
    backToTaskButtons,
    taskMap
  } = useTask({
    instance,
    rowStartIndex,
    rowStopIndex,
    pointPosition,
    scrollState,
    gridWidth
  });

  /**
   * Drawing task-related link lines
   */
  const { 
    lineTooltip,
    taskLineList
  } = useGanttAssocitionLine({
    instance,
    rowStartIndex,
    rowStopIndex,
    pointPosition,
    scrollState
  });

  const {
    drawingLine
  } = useGanttDrawingLine({
    instance,
    taskMap,
    gridWidth,
    pointPosition,
    scrollState
  });

  const {
    lineSettingModels
  } = useTaskLineSetting({
    scrollState
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
    lineSettingModels
  };
};
