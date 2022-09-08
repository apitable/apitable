import { OpUnitType } from 'dayjs';
import { DateUnitType, DEFAULT_WORK_DAYS } from '@vikadata/core';
import { IGanttCoordinate } from '../interface';
import { Coordinate } from 'pc/components/konva_grid';
import { getDiffCount, change, DateTimeType, getDayjs } from '../utils/date';

// Unix 时间: 从 1970年1月1日0时0分0秒 起开始计算
const unixDate = '1970-01-01';

/**
 * 用于构建 Canvas Gantt 基础坐标系
 */
export class GanttCoordinate extends Coordinate {
  // 时间轴开始时间对应的索引
  private startDateIndex = -1;
  // 时间轴结束时间对应的索引
  private endDateIndex = -1;
  // 时间刻度类型（周/月/季/年）
  public dateUnitType: DateUnitType = DateUnitType.Week;
  // 工作日列表
  private _workDays: Set<number>;
  // 是否只计算工作日
  public onlyCalcWorkDay: boolean;
  // 最大天数
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
   * 支持虚拟滚动
   * 甘特图时间轴限制最多 60 个单元进行展示
   */
  get columnThreshold() {
    return this._columnThreshold;
  }

  set columnThreshold(count: number) {
    this._columnThreshold = count;
  }

  // 获取横向间隔
  get columnWidth() {
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

  // 获取不同时间精度下的一天的宽度
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

  // 获取 dayjs 使用到的 unitType
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

  // 获取总宽度
  get totalWidth() {
    return 2 * this.columnThreshold * this.columnWidth;
  }

  // 获取今天的 index
  get todayIndex() {
    return this.getIndexFromStartDate(this.nowTime, this.unitType);
  }

  // 获取当前时间戳
  get nowTime() {
    return Date.now();
  }

  // 初始化时间轴相关的参数
  public initTimeline(dateUnitType: DateUnitType, dateTime: DateTimeType = this.nowTime) {
    this.dateUnitType = dateUnitType;
    const isQuarter = dateUnitType === DateUnitType.Quarter;
    const currentDate = getDayjs(dateTime);
    const startDate = isQuarter ? currentDate.startOf('week') : currentDate.startOf('month');
    const diffCount = getDiffCount(startDate, currentDate.startOf('day'));
    const rangeStartDate = change(change(currentDate, - this.columnThreshold, this.unitType), - diffCount);
    const rangeEndDate = change(change(currentDate, this.columnThreshold, this.unitType), - diffCount);
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
    const startDate = this.getDateFromStartDate(- count, this.unitType);
    const startIndex = this.getIndexFromUnix(startDate);
    const diffCount = this.endDateIndex - this.startDateIndex;
    this.startDateIndex = startIndex;
    this.endDateIndex = startIndex + diffCount;
  }

  // 获取从 "1970-01-01" 至指定日期的时间精度的 index
  public getIndexFromUnix(current: DateTimeType, unit: OpUnitType = 'day') {
    return Math.abs(getDayjs(current).diff(unixDate, unit));
  }

  // 从 "1970-01-01" 开始，根据 index 得出日期
  public getDateFromUnix = (diffIndex: number, unit: OpUnitType = 'day') => {
    return change(unixDate, diffIndex, unit);
  };

  // 从范围时间中获取 index
  public getIndexFromStartDate(current: DateTimeType, unit: OpUnitType = 'day') {
    const startDate = this.getDateFromUnix(this.startDateIndex);
    return getDayjs(current).diff(startDate, unit);
  }

  // 从范围时间中获取时间
  public getDateFromStartDate(diffIndex: number, unit: OpUnitType = 'day') {
    const startDate = change(unixDate, this.startDateIndex, 'day');
    return change(startDate, diffIndex, unit);
  }

  // 获取起始单元 offset
  public getUnitStartOffset(dateTime: DateTimeType | null) {
    if (!dateTime) return null;
    const unitIndex = this.getIndexFromStartDate(dateTime);
    return this.getUnitOffset(unitIndex);
  }

  // 获取结束单元 offset
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

  public getColumnStartIndex(offset: number) {
    return Math.floor(offset / this.columnWidth);
  }

  public getColumnStopIndex(offset: number) {
    const totalOffset = offset + this.containerWidth;
    return Math.ceil(totalOffset / this.columnWidth);
  }

  public getColumnOffset(index: number) {
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

  // 是否是工作日
  public isWorkDay(date: DateTimeType) {
    const dateOfMonth = getDayjs(date);
    const day = dateOfMonth.day();
    return this.workDays.has(day);
  }
}