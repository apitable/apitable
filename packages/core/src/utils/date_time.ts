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

export function getToday() {
  const today = new Date();
  return getDay(today);
}

export function getDay(day: Date, dayOffset?: number) {
  if (dayOffset != null) {
    day.setDate(day.getDate() + dayOffset);
  }

  day.setMilliseconds(0);
  day.setSeconds(0);
  day.setMinutes(0);
  day.setHours(0);
  return day;
}

export function isSameDay(day1: Date | number, day2: Date | number): boolean { // Determine if it is the same day
  day1 = new Date(day1);
  day2 = new Date(day2);
  return day1.getFullYear() === day2.getFullYear() &&
    day1.getMonth() === day2.getMonth() &&
    day1.getDate() === day2.getDate();
}

export function getDate(date: Date | number): number { // Get timestamp accurate to year month day
  date = new Date(date);
  const { getMonth, getDate, getFullYear } = Date.prototype;
  return new Date(getFullYear.call(date), getMonth.call(date), getDate.call(date)).valueOf();
}