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

import { range } from 'lodash';
import { DateUnitType, Strings, t } from '@apitable/core';
import { getEndDate, getStartDate, isLastDayOfMonth, isLastMonthOfYear } from '../utils';
import { GanttCoordinate } from './gantt_coordinate';

const WEEK_DAY_TEXT_MAP = {
  0: t(Strings.gantt_config_sunday_in_bar),
  1: t(Strings.gantt_config_monday_in_bar),
  2: t(Strings.gantt_config_tuesday_in_bar),
  3: t(Strings.gantt_config_wednesday_in_bar),
  4: t(Strings.gantt_config_thursday_in_bar),
  5: t(Strings.gantt_config_friday_in_bar),
  6: t(Strings.gantt_config_saturday_in_bar),
};

export const timelineCollection = {
  [DateUnitType.Week]: {
    getTimelines: (instance: GanttCoordinate, columnStartIndex: number, columnStopIndex: number) => {
      return range(columnStartIndex, columnStopIndex + 1).map((columnIndex) => {
        const { columnWidth } = instance;
        const x = instance.getColumnOffset(columnIndex);
        const date = instance.getDateFromStartDate(columnIndex);
        const isLastDay = isLastDayOfMonth(date);
        const isWorkDay = instance.isWorkDay(date);

        return {
          textOfDay: WEEK_DAY_TEXT_MAP[date.day()],
          textOfDate: String(date.date()),
          textOffset: x,
          lineOffset: x + columnWidth,
          dividerOffset: isLastDay ? x + columnWidth : null,
          holidayOffsets: isWorkDay ? [] : [x],
        };
      });
    },
  },
  [DateUnitType.Month]: {
    getTimelines: (instance: GanttCoordinate, columnStartIndex: number, columnStopIndex: number) => {
      return range(columnStartIndex, columnStopIndex + 1).map((columnIndex) => {
        const { columnWidth } = instance;
        const x = instance.getColumnOffset(columnIndex);
        const date = instance.getDateFromStartDate(columnIndex);
        const isLastDay = isLastDayOfMonth(date);
        const isWorkDay = instance.isWorkDay(date);

        return {
          textOfDay: WEEK_DAY_TEXT_MAP[date.day()],
          textOfDate: String(date.date()),
          textOffset: x,
          lineOffset: x + columnWidth,
          dividerOffset: isLastDay ? x + columnWidth : null,
          holidayOffsets: isWorkDay ? [] : [x],
        };
      });
    },
  },
  [DateUnitType.Quarter]: {
    getTimelines: (instance: GanttCoordinate, columnStartIndex: number, columnStopIndex: number) => {
      return range(columnStartIndex, columnStopIndex + 1).map((columnIndex) => {
        const { unitType, unitWidth, columnWidth, workDays } = instance;
        const x = instance.getColumnOffset(columnIndex);
        const date = instance.getDateFromStartDate(columnIndex, unitType);
        const startDate = getStartDate(date, unitType);
        const startDateIndex = startDate.date();
        const startWeekDayIndex = startDate.day(); // 4
        const endDateIndex = getEndDate(date, unitType).date();
        const lastDateIndex = date.daysInMonth();
        const hasLastDay = startDateIndex <= lastDateIndex && (lastDateIndex <= endDateIndex || startDateIndex > endDateIndex);

        const holidayOffsets = Array.from({ length: 7 }, (_, index) => {
          const curIndex = startWeekDayIndex + index;
          return curIndex < 7 ? curIndex : curIndex - 7;
        })
          .map((weekDayIndex, index) => {
            if (workDays.has(weekDayIndex)) return;
            return x + unitWidth * index;
          })
          .filter(Boolean) as number[];

        return {
          textOfDay: null,
          textOfDate: `${startDateIndex}-${endDateIndex}`,
          textOffset: x,
          lineOffset: x + columnWidth,
          dividerOffset: hasLastDay ? x + unitWidth * (lastDateIndex - startDateIndex + 1) : null,
          holidayOffsets,
        };
      });
    },
  },
  [DateUnitType.Year]: {
    getTimelines: (instance: GanttCoordinate, columnStartIndex: number, columnStopIndex: number) => {
      return range(columnStartIndex, columnStopIndex + 1).map((columnIndex) => {
        const { unitType, columnWidth } = instance;
        const x = instance.getColumnOffset(columnIndex);
        const date = instance.getDateFromStartDate(columnIndex, unitType);
        const isLastMonth = isLastMonthOfYear(date);

        return {
          textOfDay: null,
          textOfDate: date.format('MMM'),
          textOffset: x,
          lineOffset: x + columnWidth,
          dividerOffset: isLastMonth ? x + columnWidth : null,
          holidayOffsets: [],
        };
      });
    },
  },
};
