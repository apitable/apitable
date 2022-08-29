import { KONVA_DATASHEET_ID } from '@vikadata/core';
import dynamic from 'next/dynamic';
import { GanttCoordinate, IScrollState, PointPosition, useGantt } from 'pc/components/gantt_view';
import { Line, Rect } from 'pc/components/konva_components';
import { GRID_BOTTOM_STAT_HEIGHT, GRID_ROW_HEAD_WIDTH, GridCoordinate, KonvaGridContext, useGrid } from 'pc/components/konva_grid';
import { FC, memo, useContext } from 'react';
import { OperationBar } from '../components';
import { EXPORT_BRAND_DESC_HEIGHT, EXPORT_IMAGE_PADDING } from '../constant';
import { useBrandDesc, useViewWatermark } from '../hooks';

const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });
const Layer = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/layer'), { ssr: false });

export interface IGanttProps {
  ganttInstance: GanttCoordinate;
  gridInstance: GridCoordinate;
  rowStartIndex: number;
  rowStopIndex: number;
  columnStartIndex: number;
  columnStopIndex: number;
  gridColumnStartIndex: number;
  gridColumnStopIndex: number;
  gridScrollState: IScrollState;
  ganttScrollState: IScrollState;
  pointPosition: PointPosition;
  isExporting?: boolean;
}

const Gantt: FC<IGanttProps> = memo((props) => {
  const {
    ganttInstance,
    gridInstance,
    gridScrollState,
    ganttScrollState,
    rowStartIndex,
    rowStopIndex,
    columnStartIndex,
    columnStopIndex,
    gridColumnStartIndex,
    gridColumnStopIndex,
    pointPosition,
    isExporting = false,
  } = props;

  const { isMobile } = useContext(KonvaGridContext);

  const { scrollLeft: gridScrollLeft } = gridScrollState;
  const { scrollLeft: ganttScrollLeft, scrollTop } = ganttScrollState;
  const { containerWidth: gridWidth, frozenColumnWidth } = gridInstance;
  const { containerWidth: ganttWidth, containerHeight, rowInitSize } = ganttInstance;
  const gridVisible = gridWidth > 0;
  const containerWidth = gridWidth + ganttWidth;
  const frozenAreaWidth = GRID_ROW_HEAD_WIDTH + frozenColumnWidth;
  const cellGroupClipWidth = Math.min(gridWidth - frozenAreaWidth, gridInstance.totalWidth - gridScrollLeft - frozenAreaWidth);

  const {
    frozenFieldHead,
    frozenFillHandler,
    hoverRowHeadOperation,
    frozenCells,
    frozenActivedCell,
    frozenActiveCellBorder,
    otherRows,
    bottomFrozenStats,
    bottomStatBackground,
    frozenCollaboratorAvatars,
    frozenGroupStats,
    frozenCollaboratorBorders,
    frozenActiveCollaboratorBorder,
    frozenPlaceHolderCells,
    frozenDateAlarms,
    dateAddAlarm,
    frozenOpacityLines,
    cells,
    groupStats,
    fieldHeads,
    opacityLines,
    placeHolderCells,
    collaboratorBorders,
    activedCell,
    activeCellBorder,
    activeCollaboratorBorder,
    fillHandler,
    draggingOutline,
    dateAlarms,
    collaboratorAvatars,
    bottomStats,
    frozenFieldSplitter
  } = useGrid({
    instance: gridInstance,
    rowStartIndex,
    rowStopIndex,
    columnStartIndex: gridColumnStartIndex,
    columnStopIndex: gridColumnStopIndex,
    pointPosition,
    scrollState: gridScrollState,
    isExporting
  });

  const {
    headerBackground,
    timelineHighlight,
    timelineLines,
    timelineTexts,
    timelineDividers,
    timelineHolidays,
    backToNowButton,
    backToTaskButtons,
    errTaskTips,
    willFillTaskPoint,
    willAddTaskPoint,
    taskList,
    taskGroupHeaders,
    skipButtons,
    transformer,
    hoverRow,
    activeRow,
    selectedRows,
    dragRowHighlightLine,
    tooltip,
    dragSplitter
  } = useGantt({
    instance: ganttInstance,
    columnStartIndex,
    columnStopIndex,
    rowStartIndex,
    rowStopIndex,
    scrollState: ganttScrollState,
    pointPosition,
    gridWidth,
  });

  const watermarkText = useViewWatermark({
    containerWidth,
    containerHeight,
    isExporting
  });

  const brandDesc = useBrandDesc({
    containerWidth,
    containerHeight,
    isExporting
  });

  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;

  return (
    <Layer>
      {
        isExporting &&
        <Rect
          width={containerWidth + EXPORT_IMAGE_PADDING * 2}
          height={containerHeight + EXPORT_IMAGE_PADDING * 2 + EXPORT_BRAND_DESC_HEIGHT}
          fill={colors.fc6}
        />
      }
      <Group
        x={isExporting ? EXPORT_IMAGE_PADDING : undefined}
        y={isExporting ? EXPORT_IMAGE_PADDING : undefined}
      >
        <Rect
          width={containerWidth}
          height={containerHeight}
          fill={colors.white}
          cornerRadius={[12, 0, 0, 0]}
        />
        {
          !isMobile &&
          <Group
            clipX={0}
            clipY={0}
            clipWidth={containerWidth}
            clipHeight={containerHeight}
            listening={false}
          >
            <Group offsetY={scrollTop}>
              {hoverRow}
              {activeRow}
              {selectedRows}
            </Group>
          </Group>
        }

        {
          // 甘特图图形区域没有可用宽度时，不进行渲染
          ganttWidth > 0 &&
          <>
            <Group
              x={gridWidth}
              clipX={0}
              clipY={0}
              clipWidth={ganttWidth}
              clipHeight={containerHeight}
            >
              {headerBackground}

              <Group offsetX={ganttScrollLeft} listening={false}>
                <OperationBar
                  instance={ganttInstance}
                  scrollLeft={ganttScrollLeft}
                  columnStartIndex={columnStartIndex}
                  columnStopIndex={columnStopIndex}
                  ganttWidth={ganttWidth}
                />
                {timelineTexts}
                {timelineDividers}
                {timelineHolidays}
                {timelineLines}
                {timelineHighlight}
              </Group>

              {skipButtons}
              {backToNowButton}
            </Group>
            <Group
              x={gridWidth}
              clipX={0}
              clipY={rowInitSize}
              clipWidth={ganttWidth}
              clipHeight={containerHeight - rowInitSize}
            >
              <Group offsetX={ganttScrollLeft} offsetY={scrollTop}>
                {willFillTaskPoint}
                {willAddTaskPoint}
                {taskGroupHeaders}
                <Group>{taskList}</Group>
                {transformer}
              </Group>

              <Group offsetY={scrollTop}>
                {backToTaskButtons}
                {errTaskTips}
              </Group>
            </Group>
          </>
        }

        {/* 左侧任务栏区域 */}
        {
          gridVisible &&
          <>
            <Group
              clipX={0}
              clipY={0}
              clipWidth={gridWidth + 1}
              clipHeight={containerHeight}
            >
              <Group offsetY={scrollTop}>
                {frozenCells}
                {otherRows}
                {hoverRowHeadOperation}
                {frozenGroupStats}
                {frozenPlaceHolderCells}
                {frozenCollaboratorBorders}
                {frozenActivedCell}
                {frozenDateAlarms}
                {dateAddAlarm}
              </Group>
              {
                !isExporting &&
                <Rect
                  width={8}
                  height={8}
                  fill={colors.lowestBg}
                  listening={false}
                />
              }
              {frozenFieldHead}
              {frozenOpacityLines}
              <Group
                clipX={frozenAreaWidth + 1}
                clipY={0}
                clipWidth={isExporting ? undefined : cellGroupClipWidth}
                clipHeight={containerHeight}
              >
                <Group
                  offsetX={gridScrollLeft}
                  offsetY={scrollTop}
                >
                  {cells}
                  {groupStats}
                </Group>
                <Group offsetX={gridScrollLeft}>
                  {fieldHeads}
                  {opacityLines}
                </Group>
              </Group>
              {frozenFieldSplitter.top}
              {frozenFieldSplitter.middle}
            </Group>
            <Group
              clipX={frozenAreaWidth - 1}
              clipY={rowInitSize - 1}
              clipWidth={gridWidth - frozenAreaWidth + 2}
              clipHeight={containerHeight - rowInitSize}
            >
              <Group
                offsetX={gridScrollLeft}
                offsetY={scrollTop}
              >
                {placeHolderCells}
                {collaboratorBorders}
                {activedCell}
                {activeCellBorder}
                {activeCollaboratorBorder}
                {draggingOutline}
                {dateAlarms}
                {dateAddAlarm}
                {collaboratorAvatars}
              </Group>
            </Group>
            <Line
              x={gridWidth + 0.5}
              y={0}
              points={[0, 0, 0, containerHeight]}
              stroke={colors.sheetLineColor}
            />
            <Rect
              name={KONVA_DATASHEET_ID.GANTT_SPLITTER}
              x={gridWidth - 3}
              width={6}
              height={containerHeight}
              fill={'transparent'}
            />
            <Group
              clipX={frozenAreaWidth - 1}
              clipY={rowInitSize - 1}
              clipWidth={gridWidth - frozenAreaWidth + 5}
              clipHeight={containerHeight - rowInitSize}
            >
              <Group
                offsetX={gridScrollLeft}
                offsetY={scrollTop}
              >
                {fillHandler}
              </Group>
            </Group>
            <Group
              clipX={0}
              clipY={rowInitSize - 1}
              clipWidth={frozenAreaWidth + 4}
              clipHeight={containerHeight - rowInitSize}
            >
              <Group
                offsetY={scrollTop}
              >
                {frozenActiveCellBorder}
                {frozenActiveCollaboratorBorder}
                {frozenFillHandler}
                {frozenCollaboratorAvatars}
              </Group>
            </Group>
            {bottomStatBackground}
            <Group
              clipX={0}
              clipY={0}
              clipWidth={gridWidth}
              clipHeight={containerHeight}
            >
              <Group offsetX={gridScrollLeft}>
                {bottomStats}
              </Group>
              {bottomFrozenStats}
              {frozenFieldSplitter.bottom}
            </Group>
            <Line
              x={0.5}
              y={containerHeight - GRID_BOTTOM_STAT_HEIGHT}
              points={[0, 0, 0, GRID_BOTTOM_STAT_HEIGHT]}
              stroke={colors.sheetLineColor}
            />
            <Line
              x={gridWidth + 0.5}
              y={containerHeight - GRID_BOTTOM_STAT_HEIGHT}
              points={[0, 0, 0, GRID_BOTTOM_STAT_HEIGHT]}
              stroke={colors.sheetLineColor}
            />
          </>
        }

        {
          !isMobile &&
          <>
            <Group
              clipX={0}
              clipY={0}
              clipWidth={containerWidth}
              clipHeight={containerHeight}
              listening={false}
            >
              <Group offsetY={scrollTop}>
                {dragRowHighlightLine}
              </Group>
            </Group>

            <Group listening={false}>
              {tooltip}
            </Group>

            {dragSplitter}
          </>
        }

        {
          isExporting &&
          <>
            {watermarkText}
            {brandDesc}
          </>
        }
      </Group>
    </Layer>
  );
});

export default Gantt;
