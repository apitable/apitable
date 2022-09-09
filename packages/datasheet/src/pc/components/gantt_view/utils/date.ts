import dayjs, { OpUnitType, Dayjs, isDayjs } from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
dayjs.extend(dayOfYear);

export type DateTimeType = Dayjs | string | number;

export const getDayjs = (dateTime: DateTimeType): Dayjs => {
  return isDayjs(dateTime) ? dateTime : dayjs(dateTime);
};

/**
 * 获取一天的开始时间的时间戳
 */
export const getStartOfDate = (dateTime: DateTimeType) => {
  return getDayjs(dateTime)
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0);
};

/**
 * 根据单位获取获取起止时间的时间差
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
 * 根据单位获取获取起止时间的时间差，排除休息日
 */
export const getDiffCountByWorkdays = (startTime: DateTimeType, endTime: DateTimeType, workDays: Set<number>) => {
  const workDayCount = workDays.size;
  const TOTAL_DAY_COUNT = 7;
  // 整周都是工作日，无需进行特殊计算
  if (workDayCount === TOTAL_DAY_COUNT) {
    return getDiffCount(startTime, endTime) + 1;
  }
  const start = getDayjs(startTime);
  const end = getDayjs(endTime);
  const first = getStartOfDate(start.endOf('week'));
  const last = getStartOfDate(end.startOf('week'));
  const middleDays = Math.floor((last.diff(first, 'day') * workDayCount) / TOTAL_DAY_COUNT);
  // 获取第一周的工作日天数
  const startDayIndex = start.day();
  const startDiffCount = getDiffCount(start, first, 'day');
  const startDays = Array.from({ length: startDiffCount + 1 }, (_, index) => {
    const curIndex = startDayIndex + index;
    return curIndex > 6 ? curIndex - 7 : curIndex;
  }).filter(dayIndex => workDays.has(dayIndex)).length;
  // 获取最后周的工作日天数
  const lastDayIndex = last.day();
  const endDiffCount = getDiffCount(end, last, 'day');
  const endDays = Array.from({ length: endDiffCount + 1 }, (_, index) => {
    const curIndex = lastDayIndex + index;
    return curIndex > 6 ? curIndex - 7 : curIndex;
  }).filter(dayIndex => workDays.has(dayIndex)).length;
  // 总工作日
  return startDays + middleDays + endDays;
};

export const change = (markDay: DateTimeType, num: number, unit: OpUnitType = 'day') => {
  if (num >= 0) {
    return getStartOfDate(markDay).add(num, unit);
  }
  return getStartOfDate(markDay).subtract(Math.abs(num), unit);
};

export const originalChange = (markDay: DateTimeType, num: number, unit: OpUnitType = 'day') => {
  if (num >= 0) {
    return getDayjs(markDay).add(num, unit);
  }
  return getDayjs(markDay).subtract(Math.abs(num), unit);
};

/**
 * 获取当天的 0 点开始的时间戳
 */
export const getTimeStampOfDate = (dateTime: DateTimeType) => {
  const current = getDayjs(dateTime);
  const startOfDate = getStartOfDate(current);
  return current.valueOf() - startOfDate.valueOf();
};

/**
 * 根据时间精度获取开始日期
 */
export const getStartDate = (dateTime: DateTimeType, unit: OpUnitType = 'day') => {
  return getDayjs(dateTime).startOf(unit);
};

/**
 * 根据时间精度获取结束日期
 */
export const getEndDate = (dateTime: DateTimeType, unit: OpUnitType = 'day') => {
  return getDayjs(dateTime).endOf(unit);
};

/**
 * 检查是否是当月的最后一天
 */
export const isLastDayOfMonth = (dateTime: DateTimeType) => {
  return getDayjs(dateTime).date() === getEndDate(dateTime, 'month').date();
};

/**
 * 检查是否是当年的最后一月
 */
export const isLastMonthOfYear = (dateTime: DateTimeType) => {
  return getDayjs(dateTime).month() === 11;
};
