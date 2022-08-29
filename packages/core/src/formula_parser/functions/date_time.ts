// TODO(remove eslint disable)
/* eslint-disable @typescript-eslint/naming-convention */
import dayjs, { Dayjs, isDayjs, QUnitType } from 'dayjs';
import { FormulaBaseError, FormulaFunc, IFormulaContext, IFormulaParam } from './basic';
import { BasicValueType, FormulaFuncType } from 'types';
import { AstNode, ValueOperandNode } from 'formula_parser/parser';
import { dateStrReplaceCN } from 'utils';
import { TokenType } from 'formula_parser/lexer';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isoWeek from 'dayjs/plugin/isoWeek';

import utc from 'dayjs/plugin/utc';

// 支持 国际化(i18n) 的列表
import 'dayjs/locale/zh';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/zh-hk';
import 'dayjs/locale/zh-tw';
import 'dayjs/locale/fr'; // 法语
import 'dayjs/locale/es'; // 西班牙语
import 'dayjs/locale/pt'; // 葡萄牙语
import 'dayjs/locale/ru'; // 俄罗斯语
import 'dayjs/locale/ar'; // 阿拉伯语
import 'dayjs/locale/de'; // 德语
import 'dayjs/locale/ja'; // 日语
import 'dayjs/locale/ko'; // 韩语
import 'dayjs/locale/hi'; // 印地语
import { Strings, t } from 'i18n';

dayjs.extend(quarterOfYear);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(dayOfYear);
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(isoWeek);

enum Units {
  milliseconds = 'milliseconds',
  seconds = 'seconds',
  minutes = 'minutes',
  hours = 'hours',
  days = 'days',
  weeks = 'weeks',
  months = 'months',
  quarters = 'quarters',
  years = 'years',
}

enum WeekdayUnits {
  sunday,
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
}

const UnitMapBase = new Map([
  [Units.milliseconds, [Units.milliseconds, 'ms']],
  [Units.seconds, [Units.seconds, 's']],
  [Units.minutes, [Units.minutes, 'm']],
  [Units.hours, [Units.hours, 'h']],
  [Units.days, [Units.days, 'd']],
  [Units.weeks, [Units.weeks, 'w']],
  [Units.months, [Units.months, 'M']],
  [Units.quarters, [Units.quarters, 'Q']],
  [Units.years, [Units.years, 'y']],
]);

const UnitMap = new Map<string, Units>();
UnitMapBase.forEach((v, k) => {
  UnitMap.set(v[0], k);
  UnitMap.set(v[1], k);
});

const getPureUnit = (unitStr: string) => {
  const unit = UnitMap.get(String(unitStr));
  if (!unit) {
    throw new Error(t(Strings.function_err_wrong_unit_str, {
      unitStr,
    }));
  }
  return UnitMapBase.get(unit)![1] as QUnitType;
};

export const getDayjs = (timeStamp: any) => {
  // TODO 后续和 lookup 同步改造（不应该传入 string 的 timeStamp）
  if (timeStamp == null) {
    throw new FormulaBaseError('');
  }
  // 如果入参已是 dayjs 对象，则直接返回
  if (isDayjs(timeStamp)) {
    return timeStamp;
  }

  const isString = typeof timeStamp === 'string';
  const isTimeStamp = !isString || !Number.isNaN(Number(timeStamp)); // 时间戳格式检查
  const date = isTimeStamp ? dayjs(Number(timeStamp)).locale('en') : dayjs(dateStrReplaceCN(timeStamp)).locale('en');
  // 添加统一的合法时间校验，不通过则抛错
  if (!date.isValid()) {
    throw new FormulaBaseError('');
  }
  return date;
};

// 将日期字符串中的 星期几 和 十二个月份 的首字母转换成大写，
// 以此兼容 dayjs 的本地化处理
const formatDateTimeStr = (dateStr: string | number) => {
  if (typeof dateStr === 'number') {
    return dateStr;
  }
  const reg = /(mon)|(tue)|(wed)|(thu)|(fri)|(sat)|(sun)|(jan)|(feb)|(mar)|(apr)|(may)|(jun)|(jul)|(aug)|(sep)|(oct)|(nov)|(dec)/g;

  return dateStr.replace(reg, (_, $1) => $1.charAt(0).toUpperCase() + $1.slice(1));
};

const DEFAULT_LOCALE = 'zh-cn'; // 默认本地化语言

class DateFunc extends FormulaFunc {
  static readonly type = FormulaFuncType.DateTime;
  static acceptValueType = new Set([BasicValueType.DateTime, ...FormulaFunc.acceptValueType]);
}

export class Year extends DateFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new Error(t(Strings.function_validate_params_count, {
        name: 'YEAR',
        count: 1,
      }));
    }
  }

  static getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static func(params: [IFormulaParam<number | string>]): number {
    return getDayjs(params[0].value).year();
  }
}

export class Month extends DateFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new Error(t(Strings.function_validate_params_count, {
        name: 'MONTH',
        count: 1,
      }));
    }
  }

  static getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static func(params: [IFormulaParam<number | string>]): number | null {
    return getDayjs(params[0].value).month() + 1;
  }
}

export class Day extends DateFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new Error(t(Strings.function_validate_params_count, {
        name: 'DAY',
        count: 1,
      }));
    }
  }

  static getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static func(params: [IFormulaParam<number | string>]): number {
    return getDayjs(params[0].value).date();
  }
}

export class Hour extends DateFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new Error(t(Strings.function_validate_params_count, {
        name: 'HOUR',
        count: 1,
      }));
    }
  }

  static getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static func(params: [IFormulaParam<number | string>]): number {
    return getDayjs(params[0].value).hour();
  }
}

export class Minute extends DateFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new Error(t(Strings.function_validate_params_count, {
        name: 'MINUTE',
        count: 1,
      }));
    }
  }

  static getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static func(params: [IFormulaParam<number | string>]): number {
    return getDayjs(params[0].value).minute();
  }
}

export class Second extends DateFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new Error(t(Strings.function_validate_params_count, {
        name: 'SECOND',
        count: 1,
      }));
    }
  }

  static getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static func(params: [IFormulaParam<number | string>]): number {
    return getDayjs(params[0].value).second();
  }
}

export class Weekday extends DateFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new Error(t(Strings.function_validate_params_count_at_least, {
        name: 'WEEKDAY',
        count: 1,
      }));
    }
  }

  static getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static func(params: [IFormulaParam<number | string>, IFormulaParam<string>]): number | null {
    if (params[0].value == null) {
      return null;
    }

    const startDayOfWeek = params[1] && params[1].value;
    const day = getDayjs(params[0].value).day();
    if (String(startDayOfWeek).toLowerCase() === 'monday') {
      return day === 0 ? 6 : day - 1;
    }
    return day;
  }
}

export class Dateadd extends DateFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 3) {
      throw new Error(t(Strings.function_validate_params_count, {
        name: 'DATEADD',
        count: 3,
      }));
    }

    const unit = params[2].token.value.slice(1, -1);
    if (params[2].token.type === TokenType.String && !UnitMap.get(unit)) {
      throw new Error(t(Strings.function_err_wrong_unit_str, {
        unitStr: unit,
      }));
    }
  }

  static getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.DateTime;
  }

  static func(params: [IFormulaParam<number>, IFormulaParam<number>, IFormulaParam<string>]): string | number {
    const [{ value: date }, { value: count }, { value: unitStr }] = params;
    const unit = getPureUnit(unitStr);
    const day = getDayjs(date);
    return day.add(Number(count), unit).valueOf();
  }
}

export class DatetimeDiffUtil extends DateFunc {
  static getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static calc(params: IFormulaParam<number | string>[], float?: boolean): string | number | null {
    const [{ value: dateFrom }, { value: dateTo }] = params;

    if (dateFrom == null || dateTo == null) {
      return null;
    }
    const unitStr = params[2]?.value || Units.days;
    const unit = getPureUnit(unitStr as string);
    const day1 = getDayjs(dateFrom);
    const day2 = getDayjs(dateTo);
    return day1.diff(day2, unit, float);
  }
}

export class DatetimeDiff extends DatetimeDiffUtil {
  static validateParams(params: AstNode[]) {
    if (params.length < 2) {
      throw new Error(t(Strings.function_validate_params_count, {
        name: 'DATETIME_DIFF',
        count: 2,
      }));
    }
    const unit = params[2]?.token.value.slice(1, -1);
    if (params[2]?.token.type === TokenType.String && !UnitMap.get(unit)) {
      throw new Error(t(Strings.function_err_wrong_unit_str, {
        unitStr: unit,
      }));
    }
  }

  static func(params: [IFormulaParam<number>, IFormulaParam<number>, IFormulaParam<string>]): string | number | null {
    const diff = this.calc(params, true);
    return diff;
  }
}

export class Today extends DateFunc {
  static validateParams(params: AstNode[]) {
    //
  }

  static getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.DateTime;
  }

  static func(): number {
    const timeStamp = new Date().setHours(0, 0, 0, 0);
    return timeStamp;
  }
}

export class Now extends DateFunc {
  static validateParams(params: AstNode[]) {
    //
  }

  static getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.DateTime;
  }

  static func(): number {
    return Date.now();
  }
}

export class FromNow extends DatetimeDiffUtil {
  static validateParams(params: AstNode[]) {
    if (params.length < 2) {
      throw new Error(t(Strings.function_validate_params_count, {
        name: 'FROMNOW',
        count: 2,
      }));
    }
  }

  static func(params: [IFormulaParam<number>, IFormulaParam<string>]): number {
    const diff = this.calc([{ value: Date.now() } as IFormulaParam<number>, ...params]);
    return Math.abs(Number(diff));
  }
}

/**
 * 这里 FromNow 和 ToNow 的功能一致，
 * 分开写只是为了 提示文案 和 之后修改相关逻辑 能更好区分
 */
export class ToNow extends DatetimeDiffUtil {
  static validateParams(params: AstNode[]) {
    if (params.length < 2) {
      throw new Error(t(Strings.function_validate_params_count, {
        name: 'TONOW',
        count: 2,
      }));
    }
  }

  static func(params: [IFormulaParam<number>, IFormulaParam<string>]): number {
    const diff = this.calc([{ value: Date.now() } as IFormulaParam<number>, ...params]);
    return Math.abs(Number(diff));
  }
}

export class IsBefore extends DateFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 2) {
      throw new Error(t(Strings.function_validate_params_count, {
        name: 'IS_BEFORE',
        count: 2,
      }));
    }
  }

  static getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Boolean;
  }

  static func(params: [IFormulaParam<number | string>, IFormulaParam<number | string>]): boolean | null {
    if (params?.some(v => v.value == null)) {
      return null;
    }
    const date1 = getDayjs(params[0].value);
    const date2 = getDayjs(params[1].value);
    return date1.isBefore(date2);
  }
}

export class IsAfter extends DateFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 2) {
      throw new Error(t(Strings.function_validate_params_count, {
        name: 'IS_AFTER',
        count: 2,
      }));
    }
  }

  static getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Boolean;
  }

  static func(params: [IFormulaParam<number | string>, IFormulaParam<number | string>]): boolean | null {
    if (params?.some(v => v.value == null)) {
      return null;
    }
    const date1 = getDayjs(params[0].value);
    const date2 = getDayjs(params[1].value);
    return date1.isAfter(date2);
  }
}

export class WorkDay extends DateFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 2) {
      throw new Error(t(Strings.function_validate_params_count_at_least, {
        name: 'WORKDAY',
        count: 2,
      }));
    }
  }

  static getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.DateTime;
  }

  static func(params: IFormulaParam<number | string>[]): number | null {
    let startDate = getDayjs(params[0].value);
    const startDay = startDate.day();
    // 规定周末是哪几天
    const weekends = [0, 6];
    // 经过的工作日数量
    const totalWorkDays = Number(params[1].value);

    if (typeof totalWorkDays !== 'number') {
      return null;
    }

    if (totalWorkDays > 10000000 || Number.isNaN(totalWorkDays)) {
      throw new Error('NaN');
    }

    /**
     * 思路：
     * 以 WORKDAY('2021-10-15',8) 举例，2021-10-15 为周五，加 8 天，得到 2021-10-23，通过 dayjs.diff 方法检查到两个日期之间差了一周，也就是说要在 2021-10-23 的
     * 基础上加上 2 天（一周有两天休息日）得到 2021-10-25
     * 此时再以 2021-10-23 为开始日期，以修正后的 2021-10-25 为结束日期做 diff 检查，会发现又差了一周，重复上述过程，直到开始日期和结束日期在同一周，且结束日期不在
     * 周六和周日里时说明计算结束
     */
    if (weekends.includes(startDay)) {
      const startDayDiff = totalWorkDays >= 0 ? (startDay === 6 ? -1 : -2) : (startDay === 6 ? 2 : 1);
      startDate = startDate.add(startDayDiff, 'day');
    }

    let endDate = startDate.add(totalWorkDays, 'day');

    const getDiffWeek = () => endDate.week() === startDate.week() ? 0 : endDate.startOf('week').diff(startDate.startOf('week'), 'week');

    // 处理结束日期遇到周末的情况
    const skipWeekends = (date: dayjs.Dayjs) => {
      const dayDiff = totalWorkDays >= 0 ? 2 : -2;
      return weekends.includes(date.day()) ? date.add(dayDiff, 'day') : date;
    };

    let diffWeek = getDiffWeek();
    while (diffWeek != 0) {
      startDate = endDate;
      endDate = endDate.add(diffWeek * 2, 'day');
      diffWeek = getDiffWeek();
    }
    let finalDate = skipWeekends(endDate);

    // 假日列表
    const holidayStrList = params.length > 2 ? String(params[2].value).split(',') : [];
    const holidays = holidayStrList.filter(v => v !== 'null').map(v => getDayjs(v.trim()));

    // 计算节假日
    for (let i = 0; i < holidays.length; i++) {
      const holiday = holidays[i];
      const [_start, _end] = totalWorkDays >= 0 ? [getDayjs(params[0].value), finalDate] : [finalDate, getDayjs(params[0].value)];

      if (holiday.isBefore(_start, 'date') || holiday.isSame(totalWorkDays >= 0 ? _start : _end, 'date') || holiday.isAfter(_end, 'date')) {
        continue;
      }

      finalDate = totalWorkDays >= 0 ? finalDate.add(1, 'day') : finalDate.add(-1, 'day');
      finalDate = skipWeekends(finalDate);
    }
    return finalDate.valueOf();
  }
}

export class WorkDayDiff extends DateFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 2) {
      throw new Error(t(Strings.function_validate_params_count_at_least, {
        name: 'WORKDAY_DIFF',
        count: 2,
      }));
    }
  }

  static getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static func(params: IFormulaParam<number | string>[]): number {
    let startDate = getDayjs(params[0].value);
    let endDate = getDayjs(params[1].value);
    const isMinus = startDate.valueOf() > endDate.valueOf(); // 是否带负号
    isMinus && ([startDate, endDate] = [endDate, startDate]);
    const holidayStrList = params.length > 2 ? String(params[2].value).split(',') : [];
    const holidays = holidayStrList.filter(v => v !== 'null').map(v => getDayjs(v.trim()));
    const weekends = [0, 6]; // 规定周末是哪几天

    const startDay = startDate.day();
    const endDay = endDate.day();
    // 用于比较大小
    const calcStartDay = startDay === 0 ? 7 : startDay;
    const calcEndDay = endDay === 0 ? 7 : endDay;
    const realStartDay = weekends.includes(startDay) ? 5 : startDay;
    const realEndDay = weekends.includes(endDay) ? 5 : endDay;
    let diffDay = 0;
    if (calcStartDay === calcEndDay) {
      diffDay = weekends.includes(startDay) ? 0 : 1;
    }
    if (calcStartDay < calcEndDay && calcStartDay !== 6) {
      diffDay = realEndDay - realStartDay + 1;
    }
    if (calcStartDay > calcEndDay) {
      diffDay = weekends.includes(startDay) ? 5 + realEndDay - realStartDay : 5 + realEndDay - realStartDay + 1;
    }
    const diffWeekCount = endDate.diff(startDate, 'week');
    let finalCount = diffWeekCount * 5 + diffDay;

    // 计算节假日
    for (let i = 0; i < holidays.length; i++) {
      const holiday = holidays[i];
      const holidayDay = holiday.day();
      if (
        endDate.isAfter(holiday, 'date') &&
        (
          startDate.isBefore(holiday, 'date') ||
          startDate.isSame(holiday, 'date')
        ) &&
        !weekends.includes(holidayDay)
      ) {
        finalCount--;
      }
    }
    return isMinus ? -finalCount : finalCount;
  }
}

export class TimeStr extends DateFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new Error(t(Strings.function_validate_params_count, {
        name: 'TIMESTR',
        count: 1,
      }));
    }
  }

  static getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static func(params: [IFormulaParam<number | string>]): string {
    const date = getDayjs(params[0].value);
    return date.format('HH:mm:ss');
  }
}

export class DateStr extends DateFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new Error(t(Strings.function_validate_params_count, {
        name: 'DATESTR',
        count: 1,
      }));
    }
  }

  static getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static func(params: [IFormulaParam<number | string>]): string {
    const date = getDayjs(params[0].value);
    return date.format('YYYY-MM-DD');
  }
}

export class WeekNum extends DateFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new Error(t(Strings.function_validate_params_count_at_least, {
        name: 'WEEKNUM',
        count: 1,
      }));
    }
  }

  static getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static func(params: [IFormulaParam<number | string>, IFormulaParam<string>]): number {
    const currentDate = getDayjs(params[0].value);
    const startDayOfWeek = String(params[1]?.value).toLowerCase();
    const startOfWeek = startDayOfWeek === 'undefined' ? 0 : WeekdayUnits[startDayOfWeek];

    if (![0, 1].includes(startOfWeek)) {
      throw new Error('NaN');
    }

    if (currentDate.weekYear() !== currentDate.year() && currentDate.week() === 1) {
      const weekOffset = startOfWeek === 0 ? 1 : (currentDate.day() === 0 ? 0 : 1);
      return currentDate.add(-1, 'week').week() + weekOffset;
    }

    if (currentDate.add(-startOfWeek, 'day').startOf('week').year() !== currentDate.year()) {
      return 1;
    }

    if (startOfWeek === 1 && currentDate.day() === 0) {
      return currentDate.week() - 1;
    }

    return currentDate.week();

  }
}

export class IsSame extends DateFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 2) {
      throw new Error(t(Strings.function_validate_params_count_at_least, {
        name: 'IS_SAME',
        count: 2,
      }));
    }
  }

  static getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Boolean;
  }

  static func(
    params: [IFormulaParam<number | string>, IFormulaParam<number | string>, IFormulaParam<string>],
  ): boolean {
    const [{ value: dateFrom }, { value: dateTo }] = params;
    const unitStr = params[2]?.value || 'ms';
    const unit = getPureUnit(unitStr);
    const day1 = getDayjs(dateFrom);
    const day2 = getDayjs(dateTo);

    return day1.isSame(day2, unit);
  }
}

export class DateTimeParse extends DateFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new Error(t(Strings.function_validate_params_count_at_least, {
        name: 'DATETIME_PARSE',
        count: 1,
      }));
    }
  }

  static getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.DateTime;
  }

  static func(params: [IFormulaParam<string | number>, IFormulaParam<string>]): number {
    const dateStr = formatDateTimeStr(params[0].value);
    const formatStr = typeof dateStr === 'number' ? '' : String(params[1]?.value); // 如果是时间戳，直接不传此参数，让 dayjs 自行转换
    const length = params.length;

    if (length >= 2) {
      return dayjs(dateStr, formatStr).valueOf();
    }
    return dayjs(dateStr).valueOf();
  }
}

export class DateTimeFormat extends DateFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new Error(t(Strings.function_validate_params_count_at_least, {
        name: 'DATETIME_FORMAT',
        count: 1,
      }));
    }
  }

  static getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static func(params: [IFormulaParam<string | number>, IFormulaParam<string>]): string {
    const date = getDayjs(params[0].value);
    const formatStr = String(params[1]?.value || 'YYYY-MM-DD HH:mm');

    return date.format(formatStr);
  }
}

export class SetLocale extends DateFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new Error(t(Strings.function_validate_params_count_at_least, {
        name: 'SET_LOCALE',
        count: 1,
      }));
    }
  }

  static getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.DateTime;
  }

  static func(params: [IFormulaParam<string | number>, IFormulaParam<string>]): Dayjs {
    const localeDate = params[0].value;
    const locale = params[1]?.value || DEFAULT_LOCALE;

    return getDayjs(localeDate).locale(locale);
  }
}

export class SetTimeZone extends DateFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new Error(t(Strings.function_validate_params_count_at_least, {
        name: 'SET_TIMEZONE',
        count: 1,
      }));
    }
  }

  static getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.DateTime;
  }

  static func(params: [IFormulaParam<string | number>, IFormulaParam<number>]): Dayjs {
    const date = getDayjs(params[0].value);
    let timezoneOffset = Number(params[1]?.value);

    if (!timezoneOffset && timezoneOffset !== 0) {
      timezoneOffset = 8; // 默认时区为东八区 —— "Asia/Shanghai"
    }
    return date.utcOffset(timezoneOffset);
  }
}

export class CreatedTime extends DateFunc {
  static validateParams(params: AstNode[]) {
    //
  }

  static getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.DateTime;
  }

  static func(params: IFormulaParam[], context: IFormulaContext): number | Date | null {
    const createdAt = context.record?.recordMeta?.createdAt;
    return createdAt == null ? null : createdAt;
  }
}

export class LastModifiedTime extends DateFunc {
  static validateParams(params: AstNode[]) {
    //
  }

  static getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.DateTime;
  }

  static func(params: IFormulaParam[], context: IFormulaContext): number | Date | null {
    const record = context.record;
    const updatedMap = record.recordMeta?.fieldUpdatedMap;

    if (!updatedMap) {
      return null;
    }

    const fieldIds = !params.length ? Object.keys(updatedMap) : params.map(param => (param.node as ValueOperandNode).field?.id);
    const timestamps = fieldIds.map(fieldId => updatedMap[fieldId]?.at).filter(v => v);
    return timestamps.length ? Math.max(...timestamps as number[]) : null;
  }
}
