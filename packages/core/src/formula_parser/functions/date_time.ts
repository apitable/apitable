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

// TODO(remove eslint disable)
/* eslint-disable @typescript-eslint/naming-convention */
import dayjs, { Dayjs, isDayjs, QUnitType } from 'dayjs';
import { FormulaBaseError, FormulaFunc, IFormulaContext, IFormulaParam } from './basic';
import { BasicValueType, FormulaFuncType } from 'types';
import type { AstNode, ValueOperandNode } from 'formula_parser/parser/ast';
import { dateStrReplaceCN } from 'utils/string';
import { TokenType } from 'formula_parser/lexer';
import { ParamsCountError, ParamsErrorType } from 'formula_parser/errors/params_count.error';
import { UnitError } from 'formula_parser/errors/unit.error';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import utc from 'dayjs/plugin/utc';

// list of supported internationalization (i18n)
import 'dayjs/locale/zh';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/zh-hk';
import 'dayjs/locale/zh-tw';
import 'dayjs/locale/fr'; // French
import 'dayjs/locale/es'; // Spanish
import 'dayjs/locale/pt'; // portuguese
import 'dayjs/locale/ru'; // Russian
import 'dayjs/locale/ar'; // Arabic
import 'dayjs/locale/de'; // german
import 'dayjs/locale/ja'; // Japanese
import 'dayjs/locale/ko'; // Korean
import 'dayjs/locale/hi'; // Hindi

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

type Tuple2Or3<T> = [T, T] | [T, T, T];

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
  UnitMap.set(v[0]!, k);
  UnitMap.set(v[1]!, k);
});

const getPureUnit = (unitStr: string) => {
  const unit = UnitMap.get(String(unitStr));
  if (!unit) {
    throw new UnitError(unitStr);
  }
  return UnitMapBase.get(unit)![1] as QUnitType;
};

export const getDayjs = (timeStamp: any) => {
  // TODO follow-up and lookup synchronous transformation (the timeStamp of string should not be passed in)
  if (timeStamp == null) {
    throw new FormulaBaseError('');
  }
  // If the input parameter is already a dayjs object, return directly
  if (isDayjs(timeStamp)) {
    return timeStamp;
  }

  const isString = typeof timeStamp === 'string';
  const isTimeStamp = !isString || !Number.isNaN(Number(timeStamp)); // timestamp format check
  const date = isTimeStamp ? dayjs(Number(timeStamp)).locale('en') : dayjs(dateStrReplaceCN(timeStamp)).locale('en');
  // Add a unified legal time check, if it fails, throw an error
  if (!date.isValid()) {
    throw new FormulaBaseError('');
  }
  return date;
};

const getStartOfDay = (timeStamp: string | number) => {
  return getDayjs(timeStamp).hour(0).minute(0).second(0).millisecond(0);
};

// Convert the day of the week and the first letter of the month in the date string to uppercase,
// This is compatible with the localization of dayjs
const formatDateTimeStr = (dateStr: string | number) => {
  if (typeof dateStr === 'number') {
    return dateStr;
  }
  const reg = /(mon)|(tue)|(wed)|(thu)|(fri)|(sat)|(sun)|(jan)|(feb)|(mar)|(apr)|(may )|(jun)|(jul)|(aug)|(sep)|(oct)|(nov)|(dec)/g;

  return dateStr.replace(reg, (_, $1) => $1.charAt(0).toUpperCase() + $1.slice(1));
};

const DEFAULT_LOCALE = 'zh-cn'; // default localization language

class DateFunc extends FormulaFunc {
  static override readonly type = FormulaFuncType.DateTime;
  static override acceptValueType = new Set([BasicValueType.DateTime, ...FormulaFunc.acceptValueType]);
}

export class Year extends DateFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.NotEquals, 'YEAR', 1);
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static override func(params: [IFormulaParam<number | string>]): number {
    return getDayjs(params[0].value).year();
  }
}

export class Month extends DateFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.NotEquals, 'MONTH', 1);
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static override func(params: [IFormulaParam<number | string>]): number | null {
    return getDayjs(params[0].value).month() + 1;
  }
}

export class Day extends DateFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.NotEquals, 'DAY', 1);
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static override func(params: [IFormulaParam<number | string>]): number {
    return getDayjs(params[0].value).date();
  }
}

export class Hour extends DateFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.NotEquals, 'HOUR', 1);
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static override func(params: [IFormulaParam<number | string>]): number {
    return getDayjs(params[0].value).hour();
  }
}

export class Minute extends DateFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.NotEquals, 'MINUTE', 1);
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static override func(params: [IFormulaParam<number | string>]): number {
    return getDayjs(params[0].value).minute();
  }
}

export class Second extends DateFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.NotEquals, 'SECOND', 1);
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static override func(params: [IFormulaParam<number | string>]): number {
    return getDayjs(params[0].value).second();
  }
}

export class Weekday extends DateFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'WEEKDAY', 1);
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static override func(params: [IFormulaParam<number | string>, IFormulaParam<string>]): number | null {
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
  static override validateParams(params: AstNode[]) {
    if (params.length < 3) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'DATEADD', 3);
    }

    const unit = params[2]!.token.value.slice(1, -1);
    if (params[2]!.token.type === TokenType.String && !UnitMap.get(unit)) {
      throw new UnitError(unit);
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.DateTime;
  }

  static override func(params: [IFormulaParam<number>, IFormulaParam<number>, IFormulaParam<string>]): string | number {
    const [{ value: date }, { value: count }, { value: unitStr }] = params;
    const unit = getPureUnit(unitStr);
    const day = getDayjs(date);
    return day.add(Number(count), unit).valueOf();
  }
}

export class DatetimeDiffUtil extends DateFunc {
  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static calc(params: IFormulaParam<number | string>[], float?: boolean): string | number | null {
    const [{ value: dateFrom }, { value: dateTo }] = params as [IFormulaParam<number | string>, IFormulaParam<number | string>];

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
  static override validateParams(params: AstNode[]) {
    if (params.length < 2) {
      throw new ParamsCountError(ParamsErrorType.NotEquals, 'DATETIME_DIFF', 2);
    }
    const unit = params[2]?.token.value.slice(1, -1);
    if (params[2]?.token.type === TokenType.String && unit && !UnitMap.get(unit)) {
      throw new UnitError(unit);
    }
  }

  static override func(params: [IFormulaParam<number>, IFormulaParam<number>, IFormulaParam<string>]): string | number | null {
    const diff = this.calc(params, true);
    return diff;
  }
}

export class Today extends DateFunc {
  static override validateParams(_params: AstNode[]) {
    //
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.DateTime;
  }

  static override func(): number {
    const timeStamp = new Date().setHours(0, 0, 0, 0);
    return timeStamp;
  }
}

export class Now extends DateFunc {
  static override validateParams(_params: AstNode[]) {
    //
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.DateTime;
  }

  static override func(): number {
    return Date.now();
  }
}

export class FromNow extends DatetimeDiffUtil {
  static override validateParams(params: AstNode[]) {
    if (params.length < 2) {
      throw new ParamsCountError(ParamsErrorType.NotEquals, 'FROMNOW', 2);
    }
  }

  static override func(params: [IFormulaParam<number>, IFormulaParam<string>]): number {
    const diff = this.calc([{ value: Date.now() } as IFormulaParam<number>, ...params]);
    return Math.abs(Number(diff));
  }
}
/**
  * Here FromNow and ToNow have the same function,
  * Separately written just to remind the text and modify the relevant logic later to be better differentiated
  */
export class ToNow extends DatetimeDiffUtil {
  static override validateParams(params: AstNode[]) {
    if (params.length < 2) {
      throw new ParamsCountError(ParamsErrorType.NotEquals, 'TONOW', 2);
    }
  }

  static override func(params: [IFormulaParam<number>, IFormulaParam<string>]): number {
    const diff = this.calc([{ value: Date.now() } as IFormulaParam<number>, ...params]);
    return Math.abs(Number(diff));
  }
}

export class IsBefore extends DateFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 2) {
      throw new ParamsCountError(ParamsErrorType.NotEquals, 'IS_BEFORE', 2);
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Boolean;
  }

  static override func(params: [IFormulaParam<number | string>, IFormulaParam<number | string>]): boolean | null {
    if (params?.some(v => v.value == null)) {
      return null;
    }
    const date1 = getDayjs(params[0].value);
    const date2 = getDayjs(params[1].value);
    return date1.isBefore(date2);
  }
}

export class IsAfter extends DateFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 2) {
      throw new ParamsCountError(ParamsErrorType.NotEquals, 'IS_AFTER', 2);
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Boolean;
  }

  static override func(params: [IFormulaParam<number | string>, IFormulaParam<number | string>]): boolean | null {
    if (params?.some(v => v.value == null)) {
      return null;
    }
    const date1 = getDayjs(params[0].value);
    const date2 = getDayjs(params[1].value);
    return date1.isAfter(date2);
  }
}

export class WorkDay extends DateFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 2) {
      throw new ParamsCountError(ParamsErrorType.NotEquals, 'WORKDAY', 2);
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.DateTime;
  }

  static override func(params: IFormulaParam<number | string>[]): number | null {
    let startDate = getDayjs(params[0]!.value);
    const startDay = startDate.day();
    // Specify which days the weekend is
    const weekends = [0, 6];
    // number of working days elapsed
    const totalWorkDays = Number(params[1]!.value);

    if (typeof totalWorkDays !== 'number') {
      return null;
    }

    if (totalWorkDays > 10000000 || Number.isNaN(totalWorkDays)) {
      throw new Error('NaN');
    }

    /**
      * Ideas:
      * Take WORKDAY('2021-10-15',8) as an example, 2021-10-15 is Friday, add 8 days to get 2021-10-23,
      * and check the difference between the two dates through the dayjs.diff method One week, that is to say on 2021-10-23
      * Add 2 days to the base (with two days off a week) to get 2021-10-25
      * At this time, take 2021-10-23 as the start date and the revised 2021-10-25 as the end date to do a diff check,
      * you will find that there is another week, repeat the above process,
      * until the start date and end date are in the same week , and the end date is not in
      * The calculation ends on Saturday and Sunday
      */
    if (weekends.includes(startDay)) {
      const startDayDiff = totalWorkDays >= 0 ? (startDay === 6 ? -1 : -2) : (startDay === 6 ? 2 : 1);
      startDate = startDate.add(startDayDiff, 'day');
    }

    let endDate = startDate.add(totalWorkDays, 'day');

    const getDiffWeek = () => endDate.week() === startDate.week() ? 0 : endDate.startOf('week').diff(startDate.startOf('week'), 'week');

    // handle the case where the end date encounters a weekend
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

    // holiday list
    const holidayStrList = params.length > 2 ? String(params[2]!.value).split(',') : [];
    const holidays = holidayStrList.filter(v => v !== 'null').map(v => getDayjs(v.trim()));

    // calculate holidays
    for (let i = 0; i < holidays.length; i++) {
      const holiday = holidays[i]!;
      const [_start, _end] = totalWorkDays >= 0 ? [getDayjs(params[0]!.value), finalDate] : [finalDate, getDayjs(params[0]!.value)];

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
  static override validateParams(params: AstNode[]) {
    if (params.length < 2) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'WORKDAY_DIFF', 2);
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static override func(params: Tuple2Or3<IFormulaParam<number | string>>): number {
    let startDate = getStartOfDay(params[0].value);
    let endDate = getStartOfDay(params[1].value);
    const isMinus = startDate.valueOf() > endDate.valueOf(); // Whether with a negative sign
    isMinus && ([startDate, endDate] = [endDate, startDate]);
    const holidayStrList = params.length > 2 ? String(params[2]!.value).split(',') : [];
    const holidays = holidayStrList.filter(v => v !== 'null').map(v => getDayjs(v.trim()));
    const weekends = [0, 6]; // specify which days are the weekends

    const startDay = startDate.day();
    const endDay = endDate.day();
    // for size comparison
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

    // calculate holidays
    for (let i = 0; i < holidays.length; i++) {
      const holiday = holidays[i]!;
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
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.NotEquals, 'TIMESTR', 1);
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static override func(params: [IFormulaParam<number | string>]): string {
    const date = getDayjs(params[0].value);
    return date.format('HH:mm:ss');
  }
}

export class DateStr extends DateFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.NotEquals, 'DATESTR', 1);
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static override func(params: [IFormulaParam<number | string>]): string {
    const date = getDayjs(params[0].value);
    return date.format('YYYY-MM-DD');
  }
}

export class WeekNum extends DateFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'WEEKNUM', 1);
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static override func(params: [IFormulaParam<number | string>, IFormulaParam<string>]): number {
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
  static override validateParams(params: AstNode[]) {
    if (params.length < 2) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'IS_SAME', 2);
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Boolean;
  }

  static override func(
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
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'DATETIME_PARSE', 1);
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.DateTime;
  }

  static override func(params: [IFormulaParam<string | number>, IFormulaParam<string>]): number {
    const dateStr = formatDateTimeStr(params[0].value);
    // If it is a timestamp, don't pass this parameter directly, let dayjs convert it by itself
    const formatStr = typeof dateStr === 'number' ? '' : String(params[1]?.value);
    const length = params.length;

    if (length >= 2) {
      return dayjs(dateStr, formatStr).valueOf();
    }
    return dayjs(dateStr).valueOf();
  }
}

export class DateTimeFormat extends DateFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'DATETIME_FORMAT', 1);
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static override func(params: [IFormulaParam<string | number>, IFormulaParam<string>]): string {
    const date = getDayjs(params[0].value);
    const formatStr = String(params[1]?.value || 'YYYY-MM-DD HH:mm');

    return date.format(formatStr);
  }
}

export class SetLocale extends DateFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'SET_LOCALE', 1);
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.DateTime;
  }

  static override func(params: [IFormulaParam<string | number>, IFormulaParam<string>]): Dayjs {
    const localeDate = params[0].value;
    const locale = params[1]?.value || DEFAULT_LOCALE;

    return getDayjs(localeDate).locale(locale);
  }
}

export class SetTimeZone extends DateFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'SET_TIMEZONE', 1);
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.DateTime;
  }

  static override func(params: [IFormulaParam<string | number>, IFormulaParam<number>]): Dayjs {
    const date = getDayjs(params[0].value);
    let timezoneOffset = Number(params[1]?.value);

    if (!timezoneOffset && timezoneOffset !== 0) {
      timezoneOffset = 8; // The default time zone is +8 District —— "Asia/Singapore"
    }
    return date.utcOffset(timezoneOffset);
  }
}

export class CreatedTime extends DateFunc {
  static override validateParams(_params: AstNode[]) {
    //
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.DateTime;
  }

  static override func(_params: IFormulaParam[], context: IFormulaContext): number | Date | null {
    const createdAt = context.record?.recordMeta?.createdAt;
    return createdAt == null ? null : createdAt;
  }
}

export class LastModifiedTime extends DateFunc {
  static override validateParams(_params: AstNode[]) {
    //
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.DateTime;
  }

  static override func(params: IFormulaParam[], context: IFormulaContext): number | Date | null {
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
