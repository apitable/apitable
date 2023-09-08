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

import { ManipulateType, OpUnitType } from 'dayjs';
import { DateUnitType, DEFAULT_WORK_DAYS } from '@apitable/core';
import { Coordinate } from 'pc/components/konva_grid';
import { IGanttCoordinate } from '../interface';
import { getDiffCount, change, DateTimeType, getDayjs } from '../utils/date';

// Unix time: from 01/01/1970 0:0:0
const unixDate = '1970-01-01';

/**
 * For building the Canvas Gantt base coordinate system
 */
export class GanttCoordinate extends Coordinate {
  // Index corresponding to the start time of the timeline
  private startDateIndex = -1;
  // Index corresponding to the end time of the timeline
  private endDateIndex = -1;
  // Type of time scale (weekly/monthly/quarterly/yearly)
  public dateUnitType: DateUnitType = DateUnitType.Week;
  // List of working days
  private _workDays: Set<number>;
  // Are only working days counted
  public onlyCalcWorkDay: boolean;
  // Maximum number of days
  private _columnThreshold = 60;

  constructor({
    dateUnitType,
    workDays = DEFAULT_WORK_DAYS,
    onlyCalcWorkDay = false,
    columnThreshold = 60,
    initDateTime,
    ...rest
  }: IGanttCoordinate) {
    super(rest);
    this._workDays = new Set(workDays);
    this.onlyCalcWorkDay = onlyCalcWorkDay;
    this._columnThreshold = columnThreshold;
    initDateTime ? this.initTimeline(dateUnitType, initDateTime) : this.initTimeline(dateUnitType);
  }

  get workDays() {
    return this._workDays;
  }

  set workDays(days: any) {
    this._workDays = new Set(days);
  }

  /**
   * Virtual scrolling support
   * Gantt chart timeline limited to a maximum of 60 cells for display
   */
  get columnThreshold() {
    return this._columnThreshold;
  }

  set columnThreshold(count: number) {
    this._columnThreshold = count;
  }

  // Get horizontal spacing
  override get columnWidth() {
    switch (this.dateUnitType) {
      case DateUnitType.Week:
        return 100;
      case DateUnitType.Month:
        return 48;
      case DateUnitType.Quarter:
        return 70;
      case DateUnitType.Year:
        return 64;
    }
  }

  get unitScale(): number {
    switch (this.dateUnitType) {
      case DateUnitType.Week:
      case DateUnitType.Month:
        return 1;
      case DateUnitType.Quarter:
        return 7;
      case DateUnitType.Year:
        return 30;
    }
  }

  // Get the width of a day with different time precision
  get unitWidth(): number {
    switch (this.dateUnitType) {
      case DateUnitType.Week:
      case DateUnitType.Month:
        return this.columnWidth;
      case DateUnitType.Quarter:
        return this.columnWidth / 7;
      case DateUnitType.Year:
        return this.columnWidth / 30;
    }
  }

  // Get the unitType used by dayjs
  get unitType() {
    switch (this.dateUnitType) {
      case DateUnitType.Week:
      case DateUnitType.Month:
        return 'day';
      case DateUnitType.Quarter:
        return 'week';
      case DateUnitType.Year:
        return 'month';
    }
  }

  // Get total width
  override get totalWidth() {
    return 2 * this.columnThreshold * this.columnWidth;
  }

  // Get today's index
  get todayIndex() {
    return this.getIndexFromStartDate(this.nowTime, this.unitType);
  }

  // Get the current timestamp
  get nowTime() {
    return Date.now();
  }

  // Initialisation of timeline related parameters
  public initTimeline(dateUnitType: DateUnitType, dateTime: DateTimeType = this.nowTime) {
    this.dateUnitType = dateUnitType;
    const currentDate = getDayjs(dateTime);
    let rangeStartDate = change(currentDate, -this.columnThreshold, this.unitType);
    let rangeEndDate = change(currentDate, this.columnThreshold, this.unitType);
    if ([DateUnitType.Quarter, DateUnitType.Year].includes(dateUnitType)) {
      const startDate = currentDate.startOf(this.unitType);
      const diffCount = getDiffCount(startDate, currentDate.startOf('day'));
      rangeStartDate = change(rangeStartDate, -diffCount);
      rangeEndDate = change(rangeEndDate, -diffCount);
    }
    this.startDateIndex = this.getIndexFromUnix(rangeStartDate);
    this.endDateIndex = this.getIndexFromUnix(rangeEndDate);
  }

  public nextTimelineStep(count: number = this.columnThreshold) {
    const startDate = this.getDateFromStartDate(count, this.unitType);
    const startIndex = this.getIndexFromUnix(startDate);
    const diffCount = this.endDateIndex - this.startDateIndex;
    this.startDateIndex = startIndex;
    this.endDateIndex = startIndex + diffCount;
  }

  public prevTimelineStep(count: number = this.columnThreshold) {
    const startDate = this.getDateFromStartDate(-count, this.unitType);
    const startIndex = this.getIndexFromUnix(startDate);
    const diffCount = this.endDateIndex - this.startDateIndex;
    this.startDateIndex = startIndex;
    this.endDateIndex = startIndex + diffCount;
  }

  // Gets the index of the time precision from "1970-01-01" to the specified date
  public getIndexFromUnix(current: DateTimeType, unit: OpUnitType = 'day') {
    return Math.abs(getDayjs(current).diff(unixDate, unit));
  }

  // Date from "1970-01-01", based on index
  public getDateFromUnix = (diffIndex: number, unit: ManipulateType = 'day') => {
    return change(unixDate, diffIndex, unit);
  };

  // Get index from range time
  public getIndexFromStartDate(current: DateTimeType, unit: ManipulateType = 'day') {
    const startDate = this.getDateFromUnix(this.startDateIndex);
    return getDayjs(current).diff(startDate, unit);
  }

  // Get time from range time
  public getDateFromStartDate(diffIndex: number, unit: ManipulateType = 'day') {
    const startDate = change(unixDate, this.startDateIndex, 'day');
    return change(startDate, diffIndex, unit);
  }

  // Get starting unit offset
  public getUnitStartOffset(dateTime: DateTimeType | null) {
    if (!dateTime) return null;
    const unitIndex = this.getIndexFromStartDate(dateTime);
    return this.getUnitOffset(unitIndex);
  }

  // Get end cell offset
  private getUnitStopOffset(dateTime: DateTimeType | null) {
    if (!dateTime) return null;
    const end = change(dateTime, 1);
    const unitIndex = this.getIndexFromStartDate(end);
    return this.getUnitOffset(unitIndex);
  }

  private checkValid(startTime: DateTimeType | null, endTime: DateTimeType | null) {
    if (!startTime || !endTime) return false;
    const startDate = getDayjs(startTime);
    const endDate = getDayjs(endTime);
    return !endDate.isBefore(startDate);
  }

  public getTaskData(startTime: DateTimeType | null, endTime: DateTimeType | null) {
    const startOffset = this.getUnitStartOffset(startTime);
    const endOffset = this.getUnitStopOffset(endTime);
    const width = this.checkValid(startTime, endTime) ? Number(endOffset) - Number(startOffset) : null;
    return {
      width,
      startOffset,
      endOffset,
    };
  }

  public getRangeIndexByColumnIndex(columnIndex: number) {
    const startOffsetX = this.getColumnOffset(columnIndex);
    const endOffsetX = this.getColumnOffset(columnIndex + 1);
    const startUnitIndex = this.getUnitStartIndex(startOffsetX);
    const endUnitIndex = this.getUnitStopIndex(endOffsetX);
    switch (this.dateUnitType) {
      case DateUnitType.Week:
      case DateUnitType.Month: {
        return {
          startUnitIndex,
          endUnitIndex: startUnitIndex,
        };
      }
      case DateUnitType.Quarter:
      case DateUnitType.Year: {
        return {
          startUnitIndex,
          endUnitIndex: endUnitIndex - 1,
        };
      }
    }
  }

  public override getColumnStartIndex(offset: number) {
    return Math.floor(offset / this.columnWidth);
  }

  public override getColumnStopIndex(offset: number) {
    const totalOffset = offset + this.containerWidth;
    return Math.ceil(totalOffset / this.columnWidth);
  }

  public override getColumnOffset(index: number) {
    return this.columnWidth * index;
  }

  private _getUnitIndex(offset: number, calcFn: (index: number) => number = Math.round) {
    switch (this.dateUnitType) {
      case DateUnitType.Week:
      case DateUnitType.Month:
      case DateUnitType.Quarter: {
        return calcFn(offset / this.unitWidth);
      }
      case DateUnitType.Year: {
        const columnIndex = this.getColumnStartIndex(offset);
        const dateOfMonth = this.getDateFromStartDate(columnIndex, this.unitType);
        const leftUnitIndex = this.getIndexFromStartDate(dateOfMonth);
        const unitOffset = offset - this.getColumnOffset(columnIndex);
        const daysInMonth = dateOfMonth.daysInMonth();
        const rightUnitIndex = calcFn(unitOffset / (this.columnWidth / daysInMonth));
        return leftUnitIndex + rightUnitIndex;
      }
    }
  }

  public getUnitIndex(offset: number) {
    return this._getUnitIndex(offset);
  }

  public getUnitStartIndex(offset: number) {
    return this._getUnitIndex(offset, Math.floor);
  }

  public getUnitStopIndex(offset: number) {
    return this._getUnitIndex(offset, Math.ceil);
  }

  public getUnitOffset(index: number) {
    switch (this.dateUnitType) {
      case DateUnitType.Week:
      case DateUnitType.Month:
      case DateUnitType.Quarter: {
        return index * this.unitWidth;
      }
      case DateUnitType.Year: {
        const currentDate = this.getDateFromStartDate(index);
        const diffColumnIndex = this.getIndexFromStartDate(currentDate, this.unitType);
        const leftOffset = this.getColumnOffset(diffColumnIndex);
        const dateOfMonth = this.getDateFromStartDate(diffColumnIndex, this.unitType);
        const daysInMonth = dateOfMonth.daysInMonth();
        const diffUnitIndex = getDiffCount(dateOfMonth, currentDate);
        const rightOffset = Math.round((this.columnWidth / daysInMonth) * diffUnitIndex);
        return leftOffset + rightOffset;
      }
    }
  }

  // Is it a working day
  public isWorkDay(date: DateTimeType) {
    const dateOfMonth = getDayjs(date);
    const day = dateOfMonth.day();
    return this.workDays.has(day);
  }
}
