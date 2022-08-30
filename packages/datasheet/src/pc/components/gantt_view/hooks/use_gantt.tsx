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
   * 绘制时间轴相关背景图层
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
   * 绘制鼠标行、列状态及拖拽高亮线相关图层
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
   * 绘制按钮相关图层
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
   * 绘制任务相关图层
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
   * 绘制任务关联链接线
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
  } = useTaskLineSetting();

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
