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

import dayjs, { OpUnitType, Dayjs, isDayjs, ManipulateType } from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
dayjs.extend(dayOfYear);

export type DateTimeType = Dayjs | string | number;

export const getDayjs = (dateTime: DateTimeType): Dayjs => {
  return isDayjs(dateTime) ? dateTime : dayjs.tz(dateTime);
};

/**
 * Get the timestamp of the start of the day
 */
export const getStartOfDate = (dateTime: DateTimeType) => {
  return getDayjs(dateTime).hour(0).minute(0).second(0).millisecond(0);
};

/**
 * Get the time difference between the acquisition start and end times according to the unit
 */
export const getDiffCount = (startTime: DateTimeType, endTime: DateTimeType, unit: OpUnitType = 'day') => {
  const end = getStartOfDate(endTime);
  const start = getStartOfDate(startTime);
  return Math.abs(end.diff(start, unit));
};

export const getDiffOriginalCount = (startTime: DateTimeType, endTime: DateTimeType, unit: OpUnitType = 'day') => {
  const end = getDayjs(endTime);
  const start = getDayjs(startTime);
  return end.diff(start, unit);
};

/**
 * Excluding rest days, based on the time difference between the start and end of the unit's acquisition acquisition time
 */
export const getDiffCountByWorkdays = (startTime: DateTimeType, endTime: DateTimeType, workDays: Set<number>) => {
  const workDayCount = workDays.size;
  const TOTAL_DAY_COUNT = 7;
  // The whole week is a working day and no special calculations are required
  if (workDayCount === TOTAL_DAY_COUNT) {
    return getDiffCount(startTime, endTime) + 1;
  }
  const start = getDayjs(startTime);
  const end = getDayjs(endTime);
  const first = getStartOfDate(start.endOf('week'));
  const last = getStartOfDate(end.startOf('week'));
  const middleDays = Math.floor((last.diff(first, 'day') * workDayCount) / TOTAL_DAY_COUNT);
  // Get the number of working days in the first week
  const startDayIndex = start.day();
  const startDiffCount = getDiffCount(start, first, 'day');
  const startDays = Array.from({ length: startDiffCount + 1 }, (_, index) => {
    const curIndex = startDayIndex + index;
    return curIndex > 6 ? curIndex - 7 : curIndex;
  }).filter((dayIndex) => workDays.has(dayIndex)).length;
  // Get the number of working days in the last week
  const lastDayIndex = last.day();
  const endDiffCount = getDiffCount(end, last, 'day');
  const endDays = Array.from({ length: endDiffCount + 1 }, (_, index) => {
    const curIndex = lastDayIndex + index;
    return curIndex > 6 ? curIndex - 7 : curIndex;
  }).filter((dayIndex) => workDays.has(dayIndex)).length;
  // Total working days
  return startDays + middleDays + endDays;
};

export const change = (markDay: DateTimeType, num: number, unit: ManipulateType = 'day') => {
  if (num >= 0) {
    return getStartOfDate(markDay).add(num, unit);
  }
  return getStartOfDate(markDay).subtract(Math.abs(num), unit);
};

export const originalChange = (markDay: DateTimeType, num: number, unit: ManipulateType = 'day') => {
  if (num >= 0) {
    return getDayjs(markDay).add(num, unit);
  }
  return getDayjs(markDay).subtract(Math.abs(num), unit);
};

/**
 * Get the timestamp from 0:00 of the day
 */
export const getTimeStampOfDate = (dateTime: DateTimeType) => {
  const current = getDayjs(dateTime);
  const startOfDate = getStartOfDate(current);
  return current.valueOf() - startOfDate.valueOf();
};

/**
 * Get start date based on time precision
 */
export const getStartDate = (dateTime: DateTimeType, unit: OpUnitType = 'day') => {
  return getDayjs(dateTime).startOf(unit);
};

/**
 * Get end date based on time precision
 */
export const getEndDate = (dateTime: DateTimeType, unit: OpUnitType = 'day') => {
  return getDayjs(dateTime).endOf(unit);
};

/**
 * Check if it is the last day of the month
 */
export const isLastDayOfMonth = (dateTime: DateTimeType) => {
  return getDayjs(dateTime).date() === getEndDate(dateTime, 'month').date();
};

/**
 * Check if it is the last month of the year
 */
export const isLastMonthOfYear = (dateTime: DateTimeType) => {
  return getDayjs(dateTime).month() === 11;
};
