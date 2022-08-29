import { DateUnitType, KONVA_DATASHEET_ID } from '@vikadata/core';
import dynamic from 'next/dynamic';
import { GANTT_MONTH_TIMELINE_HEIGHT, GANTT_TAB_BAR_HEIGHT, GANTT_TIMELINE_HEIGHT, GanttCoordinate } from 'pc/components/gantt_view';
import { Line, Rect, Text } from 'pc/components/konva_components';
import { KonvaGridContext } from 'pc/components/konva_grid';
import { useContext, useMemo } from 'react';
import { timelineCollection } from '../model/timeline';

const Circle = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/circle'), { ssr: false });
const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });

interface IUseTimelineLayerProps {
  instance: GanttCoordinate;
  columnStartIndex: number;
  columnStopIndex: number;
}

export const useTimelineLayer = (props: IUseTimelineLayerProps) => {
  const {
    instance,
    columnStartIndex,
    columnStopIndex,
  } = props;

  const {
    unitWidth,
    todayIndex,
    columnWidth,
    rowInitSize,
    dateUnitType,
    containerWidth,
    containerHeight
  } = instance;

  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;

  /**
   * 绘制时间轴相关
   */
  const timelineMap = useMemo(() => {
    const timelineTexts: React.ReactNode[] = [];
    const timelineLines: React.ReactNode[] = [];
    const timelineHolidays: React.ReactNode[] = [];
    const timelineDividers: React.ReactNode[] = [];
    const timelines = timelineCollection[dateUnitType].getTimelines(instance, columnStartIndex, columnStopIndex);
    const isQuarter = dateUnitType === DateUnitType.Quarter;
    const isMonthly = [DateUnitType.Month, DateUnitType.Week].includes(dateUnitType);
    const timelineTextHeight = isMonthly ? GANTT_MONTH_TIMELINE_HEIGHT / 2 : GANTT_TIMELINE_HEIGHT;
    const timelineLineOffsetY = isMonthly ? GANTT_TAB_BAR_HEIGHT : rowInitSize;
    const textOffsetY = isMonthly ? 2 : 0;

    for (let index = 0; index < timelines.length; index++) {
      const { textOfDate, textOfDay, textOffset, lineOffset, dividerOffset, holidayOffsets } = timelines[index];
      const isToday = todayIndex === columnStartIndex + index;

      /**
       * 时间轴文字
       */
      timelineTexts.push(
        <>
          <Text
            key={`timeline-date-${index}`}
            x={textOffset + 0.5}
            y={GANTT_TAB_BAR_HEIGHT + textOffsetY}
            width={columnWidth}
            height={timelineTextHeight}
            text={textOfDate}
            fill={isToday ? colors.rc08 : colors.secondLevelText}
            align="center"
          />
          {
            isMonthly &&
            <Text
              key={`timeline-day-${index}`}
              x={textOffset + 0.5}
              y={GANTT_TAB_BAR_HEIGHT + timelineTextHeight - textOffsetY}
              width={columnWidth}
              height={timelineTextHeight}
              text={textOfDay}
              fontSize={12}
              fill={isToday ? colors.rc08 : colors.thirdLevelText}
              align="center"
            />
          }
        </>
      );

      /**
       * 时间轴线
       */
      timelineLines.push(
        <Line
          key={`timeline-line-${index}`}
          x={lineOffset + 0.5}
          y={timelineLineOffsetY}
          points={[0, 0, 0, containerHeight - timelineLineOffsetY]}
          stroke={colors.lineColor}
        />
      );

      /**
       * 每个时间精度下的前一个结束时间和后一个开始时间，中间需要加分割线
       * 规则（按时间精度区分）：
       * 周/月/季：分割月
       * 年：分割年
       */
      if (dividerOffset != null) {
        timelineDividers.push(
          <Line
            key={`timeline-divider-${index}`}
            x={dividerOffset + 0.5}
            points={[0, 0, 0, isQuarter ? GANTT_TAB_BAR_HEIGHT : rowInitSize]}
            stroke={colors.lineColor}
          />
        );
      }

      /**
       * 节假日
       */
      holidayOffsets.forEach((offset, i) => {
        timelineHolidays.push(
          <Rect
            key={`timeline-weekday-${index}-${i}`}
            x={offset + 0.5}
            y={rowInitSize}
            width={unitWidth}
            height={containerHeight - rowInitSize}
            fill={colors.lowestBg}
            opacity={0.6}
            listening={false}
          />
        );
      });
    }

    return {
      timelineTexts,
      timelineLines,
      timelineDividers,
      timelineHolidays,
    };
  }, [
    dateUnitType, instance, columnStartIndex, columnStopIndex, rowInitSize, todayIndex, columnWidth,
    colors.rc08, colors.secondLevelText, colors.thirdLevelText, colors.lineColor, colors.lowestBg, containerHeight, unitWidth
  ]);

  const headerBackground = useMemo(() => {
    return (
      <Group listening={false}>
        <Rect
          x={0.5}
          y={0.5}
          name={KONVA_DATASHEET_ID.GANTT_HEADER}
          width={containerWidth}
          height={rowInitSize}
          fill={colors.white}
          stroke={colors.sheetLineColor}
          strokeWidth={1}
          listening={false}
        />
        <Line
          y={GANTT_TAB_BAR_HEIGHT + 0.5}
          points={[0, 0, containerWidth, 0]}
          stroke={colors.lineColor}
        />
        <Line
          y={rowInitSize + 0.5}
          points={[0, 0, containerWidth, 0]}
          stroke={colors.lineColor}
        />
      </Group>
    );
  }, [colors.lineColor, colors.sheetLineColor, colors.white, containerWidth, rowInitSize]);

  /**
   * 绘制高亮时间线
   */
  const timelineHighlight = useMemo(() => {
    if (todayIndex < 0 || todayIndex > instance.columnThreshold * 2) return null;
    const { nowTime } = instance;
    const x = instance.getUnitStartOffset(nowTime)!;

    return (
      <Group
        x={x}
        y={rowInitSize}
      >
        <Circle
          x={unitWidth / 2 + 0.5}
          radius={2}
          fill={colors.rc08}
        />
        <Line
          x={unitWidth / 2 + 0.5}
          points={[0, 0, 0, containerHeight - rowInitSize]}
          stroke={colors.rc08}
        />
      </Group>
    );
  }, [todayIndex, instance, rowInitSize, unitWidth, colors.rc08, containerHeight]);

  return useMemo(() => ({
    ...timelineMap,
    headerBackground,
    timelineHighlight,
  }), [headerBackground, timelineHighlight, timelineMap]);
};
