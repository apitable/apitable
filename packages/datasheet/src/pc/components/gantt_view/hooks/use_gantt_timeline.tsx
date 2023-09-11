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
import { useContext, useMemo } from 'react';
import { DateUnitType, KONVA_DATASHEET_ID } from '@apitable/core';
import { GANTT_MONTH_TIMELINE_HEIGHT, GANTT_TAB_BAR_HEIGHT, GANTT_TIMELINE_HEIGHT, GanttCoordinate } from 'pc/components/gantt_view';
import { Line, Rect, Text } from 'pc/components/konva_components';
import { KonvaGridContext } from 'pc/components/konva_grid';
import { timelineCollection } from '../model/timeline';

const Circle = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/circle'), { ssr: false });
const Group = dynamic(() => import('pc/components/gantt_view/hooks/use_gantt_timeline/group'), { ssr: false });

interface IUseTimelineLayerProps {
  instance: GanttCoordinate;
  columnStartIndex: number;
  columnStopIndex: number;
}

export const useTimelineLayer = (props: IUseTimelineLayerProps) => {
  const { instance, columnStartIndex, columnStopIndex } = props;

  const { unitWidth, todayIndex, columnWidth, rowInitSize, dateUnitType, containerWidth, containerHeight } = instance;

  const { theme } = useContext(KonvaGridContext);
  const colors = theme.color;

  /**
   * Plotting timeline related
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
       * Timeline text
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
          {isMonthly && (
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
          )}
        </>,
      );

      /**
       * Timeline
       */
      timelineLines.push(
        <Line
          key={`timeline-line-${index}`}
          x={lineOffset + 0.5}
          y={timelineLineOffsetY}
          points={[0, 0, 0, containerHeight - timelineLineOffsetY]}
          stroke={colors.lineColor}
        />,
      );

      /**
       * The previous end time and the next start time for each time precision, with a split line in between
       * Rules (differentiated by time accuracy).
       * Week/month/quarter: split month
       * Year: split year
       */
      if (dividerOffset != null) {
        timelineDividers.push(
          <Line
            key={`timeline-divider-${index}`}
            x={dividerOffset + 0.5}
            points={[0, 0, 0, isQuarter ? GANTT_TAB_BAR_HEIGHT : rowInitSize]}
            stroke={colors.lineColor}
          />,
        );
      }

      /**
       * Holiday
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
          />,
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
    dateUnitType,
    instance,
    columnStartIndex,
    columnStopIndex,
    rowInitSize,
    todayIndex,
    columnWidth,
    colors.rc08,
    colors.secondLevelText,
    colors.thirdLevelText,
    colors.lineColor,
    colors.lowestBg,
    containerHeight,
    unitWidth,
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
        <Line y={GANTT_TAB_BAR_HEIGHT + 0.5} points={[0, 0, containerWidth, 0]} stroke={colors.lineColor} />
        <Line y={rowInitSize + 0.5} points={[0, 0, containerWidth, 0]} stroke={colors.lineColor} />
      </Group>
    );
  }, [colors.lineColor, colors.sheetLineColor, colors.white, containerWidth, rowInitSize]);

  /**
   * Drawing the highlighted timeline
   */
  const timelineHighlight = useMemo(() => {
    if (todayIndex < 0 || todayIndex > instance.columnThreshold * 2) return null;
    const { nowTime } = instance;
    const x = instance.getUnitStartOffset(nowTime)!;

    return (
      <Group x={x} y={rowInitSize}>
        <Circle x={unitWidth / 2 + 0.5} radius={2} fill={colors.rc08} />
        <Line x={unitWidth / 2 + 0.5} points={[0, 0, 0, containerHeight - rowInitSize]} stroke={colors.rc08} />
      </Group>
    );
  }, [todayIndex, instance, rowInitSize, unitWidth, colors.rc08, containerHeight]);

  return useMemo(
    () => ({
      ...timelineMap,
      headerBackground,
      timelineHighlight,
    }),
    [headerBackground, timelineHighlight, timelineMap],
  );
};
