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

import add from 'date-fns/add';
import differenceInDays from 'date-fns/differenceInDays';
import format from 'date-fns/format';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import isValid from 'date-fns/isValid';
import max from 'date-fns/max';
import min from 'date-fns/min';
import subDays from 'date-fns/subDays';
import { COUNT, Direction, FORMAT, FORMAT_MONTH, MONTHS } from './constants';
import { ILevel, ILevelResult, IResizeFormat } from './interface';
import { getLanguage } from '@apitable/core';

const date2Day = (date: Date) => {
  if (!isValid(date)) {
    return new Date();
  }
  return new Date(format(date, FORMAT));
};

export const date2Month = (date: Date) => {
  // Firefox: new Date('2021/09') => Invalid Date
  const formatDate = format(date, FORMAT_MONTH) + '/01';
  return new Date(formatDate);
};

export const resizeFormat = (resizeData: IResizeFormat) => {
  let { startDate, endDate } = resizeData;
  endDate = endDate || startDate;
  startDate = startDate || endDate;
  const { day, direction } = resizeData;
  const isRight = direction === Direction.Right;
  const isWarning = isAfter(startDate, endDate);
  // update end date
  if (isRight) {
    // Correction date in case of alarm
    endDate = add(isWarning ? startDate : endDate, { days: day });
    // Right stretching is not allowed to be less than the start date
    if (isAfter(startDate, endDate)) {
      endDate = startDate;
    }
  } else { // update start date
    const calcStartDate = subDays(startDate, day);
    // Normal record left stretching is not allowed to be greater than the end date
    if (!isWarning && isAfter(calcStartDate, endDate)) {
      startDate = endDate;
    } else if (
      // The left stretch of abnormal records cannot be greater than the original start date
      !(isWarning && isAfter(calcStartDate, startDate))
    ) {
      startDate = calcStartDate;
    }
  }
  return { startDate, endDate };
};

/**
 * Get the number of days in the current month
 * @param year
 * @param month
 */
export const daysInMonth = (year: number, month: number) => {
  const d = new Date(year, month - 1, 0);
  return d.getDate();
};

/**
 * Get the week of the first day of the current month
 * @param year
 * @param month
 */
export const firstDayOfMonth = (year: number, month: number) => {
  const d = new Date(year, month - 1, 1);
  const day = d.getDay();
  return day === 0 ? 7 : day;
};

export const formatDate = (year: number, month: number, lang: string) => {
  return lang === 'zh' ? `${year}年${month}月` : `${MONTHS[month - 1]} ${year}`;
};

/**
 * Get current calendar panel data
 * @param step
 */
export const getPanelData = (step: number) => {
  const now = new Date();
  const currMonth = now.getMonth();
  const totalMonth = step + currMonth + 1;
  const year = now.getFullYear() + Math.ceil(totalMonth / 12) - 1;
  let month = totalMonth % 12;
  if (month <= 0) {
    month += 12;
  }
  const days = daysInMonth(year, month + 1);
  const preDays = daysInMonth(year, month);
  const firstDay = firstDayOfMonth(year, month);
  const data: { day: number, month: number }[] = [];
  let i = 1;
  const count = COUNT + (days + firstDay - 1 > COUNT ? 7 : 0);
  while (count >= i) {
    if (firstDay >= i + 1) {
      data.push({
        day: preDays - firstDay + i + 1,
        month: month - 1
      });
    } else if (days < i + 1 - firstDay) {
      data.push({
        day: i + 1 - firstDay - days,
        month: month + 1,
      });
    } else {
      data.push({
        day: i + 1 - firstDay,
        month,
      });
    }
    i++;
  }
  return {
    data,
    year,
    month,
  };
};

export const isMouseEvent = (event: MouseEvent | TouchEvent): event is MouseEvent => {
  return Boolean(
    ((event as MouseEvent).clientX || (event as MouseEvent).clientX === 0) &&
    ((event as MouseEvent).clientY || (event as MouseEvent).clientY === 0),
  );
};

export const isTouchEvent = (event: MouseEvent | TouchEvent): event is TouchEvent => {
  return Boolean((event as TouchEvent).touches && (event as TouchEvent).touches.length);
};

export const getLevels = ({ week, year, tasks, resizeMsg }: ILevel) => {
  const start = week[0]!;
  const end = week[week.length - 1]!;
  const startDate = new Date(year, start.month - 1, start.day);
  const endDate = new Date(year, end.month - 1, end.day);
  let updateTasks = tasks;
  if (resizeMsg) {
    const { id, day, direction } = resizeMsg;
    updateTasks = tasks.map(task => {
      if (id === task.id) {
        const { startDate, endDate } = task;
        const formatData = resizeFormat({ startDate, endDate, day, direction });
        return {
          ...task,
          ...formatData,
        };
      }
      return task;
    });
  }

  const rowTasks = updateTasks.filter(task =>
    (!isAfter(date2Day(task.startDate || task.endDate), endDate) && !isAfter(startDate, task.endDate || task.startDate)) ||
    // The start date is greater than the end date. Exception task processing
    (isAfter(task.startDate, task.endDate) && !isBefore(task.startDate, startDate) && !isBefore(endDate, task.startDate))
  ).map(task => {
    const isWarning = isAfter(task.startDate, task.endDate);
    const taskStartDate = date2Day(task.startDate || task.endDate);
    const taskEndDate = date2Day(task.endDate || task.startDate);
    const currMaxStartDay = date2Day(max([startDate, taskStartDate]));
    const currMinLastDay = date2Day(min([endDate, taskEndDate]));
    const len = isWarning ? 1 : (differenceInDays(currMinLastDay, currMaxStartDay) + 1);
    const diffStart = differenceInDays(taskStartDate, startDate);
    const diffEnd = differenceInDays(endDate, taskEndDate);
    const left = diffStart < 0 ? 0 : diffStart;
    return {
      task,
      len,
      left: left + 1,
      right: left + len,
      isStart: diffStart >= 0 || isWarning,
      isEmptyStart: !task.startDate,
      isEnd: diffEnd >= 0 || isWarning,
      isEmptyEnd: !task.endDate,
      warn: isWarning,
    };
  });
  const levels: ILevelResult[][] = [];
  let j: number;
  for (let i = 0; i < rowTasks.length; i++) {
    const task = rowTasks[i]!;
    for (j = 0; j < levels.length; j++) {
      const isOver = levels[j]!.some(seg =>
        seg.left <= task.right && seg.right >= task.left
      );
      if (!isOver) {
        break;
      }
    }
    (levels[j] || (levels[j] = [])).push(task);
  }
  return levels;
};

export const formatDayValue = (month: number, day: number, lang?: 'en' | 'zh',) => {
  if (!lang) {
    lang = getLanguage().split('-')[0];
  }
  return lang === 'zh' ? `${month}月${day}日` : `${MONTHS[month - 1]} ${day}`;
};
