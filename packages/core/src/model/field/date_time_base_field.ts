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

import { format as dfzFormat, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import dayjs, { PluginFunc } from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/zh-hk';
import 'dayjs/locale/zh-tw';
import timezone from 'dayjs/plugin/timezone';
import weekday from 'dayjs/plugin/weekday';
import utc from 'dayjs/plugin/utc';
import { getUserLocale, getUserTimeZone } from 'modules/user/store/selectors/user';
import Joi from 'joi';
import { isEqual, isNumber } from 'lodash';
import { DEFAULT_TIME_ZONE } from 'model/constants';
import { isNullValue } from 'model/utils';
import { IAPIMetaDateTimeBaseFieldProperty } from 'types/field_api_property_types';
import {
  BasicValueType,
  DateFormat,
  FieldType,
  ICreatedTimeField,
  IDateTimeBaseFieldProperty,
  IDateTimeField,
  IDateTimeFieldProperty,
  ILastModifiedTimeField,
  IStandardValue,
  ITimestamp,
  TimeFormat,
} from 'types/field_types';
import { IOpenFilterValueDataTime } from 'types/open/open_filter_types';
import { FilterDuration, FOperator, IFilterCondition, IFilterDateTime } from 'types/view_types';
import { assertNever, dateStrReplaceCN, getToday, notInTimestampRange } from 'utils';
import { isServer } from 'utils/env';
import { covertDayjsFormat2DateFnsFormat, getTimeZone, getTimeZoneAbbrByUtc } from '../../config';
import { getLanguage, Strings, t } from '../../exports/i18n';
import { IReduxState } from '../../exports/store/interfaces';
import { ICellValue } from '../record';
import { Field } from './field';
import { StatTranslate, StatType } from './stat';

const dfzFormatWithValid = (date: any, format: string, timeZone?: string) => {
  /**
   * fix issue: https://github.com/vikadata/vikadata/issues/8805
   */
  if (!dayjs(Number(date)).isValid()) {
    return null;
  }
  try {
    return dfzFormat(date, covertDayjsFormat2DateFnsFormat(format), timeZone ? { timeZone } : undefined);
  } catch(_e) {
    return dayjs(Number(date)).tz(timeZone).format(format);
  }
};

const patchDayjsTimezone = (timezone: PluginFunc): PluginFunc => {
  // The original version of the functions `getDateTimeFormat` and `tz` comes from
  // https://github.com/iamkun/dayjs/blob/dev/src/plugin/timezone/index.js
  // which is published under the MIT license. See https://github.com/iamkun/dayjs/blob/dev/LICENSE for more information.

  const dtfCache: { [timezone: string]: Intl.DateTimeFormat } = {};
  const getDateTimeFormat = (timezone: string, options: {
    timeZoneName?: Intl.DateTimeFormatOptions['timeZoneName']
  } = {}) => {
    const timeZoneName = options.timeZoneName || 'short';
    const key = `${timezone}|${timeZoneName}`;
    let dtf = dtfCache[key];
    if (!dtf) {
      dtf = new Intl.DateTimeFormat('en-US', {
        // hour12: false,
        hour12: true,
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        // timeZoneName
      });
      dtfCache[key] = dtf;
    }
    return dtf;
  };

  const MS = 'millisecond';
  const MIN = 'minute';

  return (o, c, d) => {
    let defaultTimezone: string | undefined;
    timezone(o, c, d);
    // The following function integrates a performance tuning from https://github.com/iamkun/dayjs/issues/1236#issuecomment-1262907180
    c.prototype.tz = function (this: dayjs.Dayjs, timezone = defaultTimezone, keepLocalTime = undefined) {
      const oldOffset = this.utcOffset();
      const date = this.toDate();
      const target = getDateTimeFormat(timezone!).format(date);
      const diff = Math.round((+date - +new Date(target)) / 1000 / 60);
      let ins = (d(target) as any).$set(MS, (this as any).$ms)
        .utcOffset((-Math.round(date.getTimezoneOffset() / 15) * 15) - diff, true);
      if (keepLocalTime) {
        const newOffset = ins.utcOffset();
        ins = ins.add(oldOffset - newOffset, MIN);
      }
      ins.$x.$timezone = timezone;
      return ins;
    };

    const setDefaultTimezone = d.tz.setDefault;
    d.tz.setDefault = (timezone) => {
      setDefaultTimezone(timezone);
      defaultTimezone = timezone;
    };
  };
};

// plugin before import, prevent circular import
dayjs.extend(utc);
dayjs.extend(patchDayjsTimezone(timezone));
dayjs.extend(weekday);

export type IOptionalDateTimeFieldProperty = Partial<IDateTimeFieldProperty>;

const DEFAULT_DATETIME_PROPS = {
  dateFormat: DateFormat['YYYY/MM/DD'],
  timeFormat: TimeFormat['HH:mm'],
  includeTime: false,
  timeZone: getTimeZone(),
};

export const getDateTimeFormat = (props: IOptionalDateTimeFieldProperty) => {
  const dateFormat = DateFormat[props.dateFormat || DEFAULT_DATETIME_PROPS.dateFormat];
  const timeFormat = TimeFormat[props.timeFormat || DEFAULT_DATETIME_PROPS.timeFormat];
  return dateFormat + (props.includeTime ? ' ' + timeFormat : '');
};

export const dateTimeFormat = (
  timestamp: any,
  props?: IOptionalDateTimeFieldProperty,
  userTimeZone?: string,
) => {
  if (!timestamp) {
    return null;
  }

  props = props || DEFAULT_DATETIME_PROPS;
  const dateFormat = DateFormat[props.dateFormat || DEFAULT_DATETIME_PROPS.dateFormat];
  const timeFormat = TimeFormat[props.timeFormat || DEFAULT_DATETIME_PROPS.timeFormat];
  let format = dateFormat + (props.includeTime ? ' ' + timeFormat : '');

  if (props.includeTime && timeFormat === 'hh:mm') {
    const locale = getLanguage();
    const formatLocale = locale.toLowerCase().split('_').join('-');
    dayjs.locale(formatLocale);
    format += ' a';
  }
  let timeZone = props.timeZone || userTimeZone;
  if (isServer()) {
    timeZone = timeZone || DEFAULT_TIME_ZONE;
  }
  try {
    if (props.includeTimeZone) {
      timeZone = timeZone || DEFAULT_DATETIME_PROPS.timeZone;
      const abbr = getTimeZoneAbbrByUtc(timeZone)!;
      return dfzFormatWithValid(utcToZonedTime(Number(timestamp), timeZone), covertDayjsFormat2DateFnsFormat(format), timeZone ) + ` (${abbr})`;
    }
    if (!props.includeTimeZone && timeZone) {
      // dayjs(Number(timestamp)).tz(timeZone).format(format);
      // Frequent invocations of the "tz" function here will result in severe page lag.
      return dfzFormatWithValid(utcToZonedTime(Number(timestamp), timeZone), covertDayjsFormat2DateFnsFormat(format), timeZone );
    }
  } catch (e) {
    if (e instanceof RangeError) {
      return 'Invalid Date';
    }
    throw e;
  }
  return dfzFormatWithValid(timestamp, covertDayjsFormat2DateFnsFormat(format));
};

const withTimeZone = (timestamp: number | undefined | string, timeZone?: string, locale?: string) => {
  if (timeZone) {
    // https://stackoverflow.com/questions/66029964/timezone-conversion-using-date-fns
    const unixTime = Number(timestamp);
    const ts = !isNaN(Number(timestamp)) ? unixTime : dayjs(timestamp).valueOf();
    const zonedDate = utcToZonedTime(ts, timeZone);
    const utcDate = zonedTimeToUtc(zonedDate, timeZone);
    if (locale) {
      return dayjs(utcDate.getTime()).locale(locale);
    }
    return dayjs(utcDate.getTime());
  }
  return dayjs(timestamp);
};

export type ICommonDateTimeField = IDateTimeField | ICreatedTimeField | ILastModifiedTimeField;

export abstract class DateTimeBaseField extends Field {
  constructor(public override field: ICommonDateTimeField, public override state: IReduxState) {
    super(field, state);
  }

  static _statTypeList = [
    StatType.None,
    StatType.CountAll,
    StatType.Empty,
    StatType.Filled,
    StatType.Unique,
    StatType.PercentEmpty,
    StatType.PercentFilled,
    StatType.PercentUnique,
    StatType.Min,
    StatType.Max,
    StatType.DateRangeOfDays,
    StatType.DateRangeOfMonths,
  ];

  static _acceptFilterOperators = [
    FOperator.Is,
    FOperator.IsGreater,
    FOperator.IsGreaterEqual,
    FOperator.IsLess,
    FOperator.IsLessEqual,
    FOperator.IsEmpty,
    FOperator.IsNotEmpty,
    FOperator.IsRepeat,
  ];

  static FOperatorDescMap = {
    [FOperator.Is]: t(Strings.equal),
    [FOperator.IsNot]: t(Strings.not_equal),
    [FOperator.IsGreater]: t(Strings.function_date_time_after),
    [FOperator.IsGreaterEqual]: t(Strings.date_after_or_equal),
    [FOperator.IsLess]: t(Strings.function_date_time_before),
    [FOperator.IsLessEqual]: t(Strings.date_before_or_equal),
    [FOperator.IsEmpty]: t(Strings.is_empty),
    [FOperator.IsNotEmpty]: t(Strings.is_not_empty),
    [FOperator.IsRepeat]: t(Strings.is_repeat),
  };

  override showFOperatorDesc(type: FOperator) {
    return DateTimeBaseField.FOperatorDescMap[type];
  }

  override get apiMetaProperty(): IAPIMetaDateTimeBaseFieldProperty {
    const res: IAPIMetaDateTimeBaseFieldProperty = {
      format: getDateTimeFormat(this.field.property),
      includeTime: this.field.property.includeTime,
      timeZone: this.field.property.timeZone,
      includeTimeZone: this.field.property.includeTimeZone
    };
    if ((this.field.property as any).autoFill) {
      res.autoFill = true;
    }
    return res;
  }

  get openValueJsonSchema() {
    return {
      type: 'string',
      title: this.field.name,
    };
  }

  override get statTypeList(): StatType[] {
    return DateTimeBaseField._statTypeList;
  }

  get basicValueType(): BasicValueType {
    return BasicValueType.DateTime;
  }

  get acceptFilterOperators() {
    return DateTimeBaseField._acceptFilterOperators;
  }

  get dateFormat(): string {
    return DateFormat[this.field.property.dateFormat]!;
  }

  get timeFormat(): string {
    return TimeFormat[this.field.property.timeFormat]!;
  }

  get mergeFormat(): string {
    return this.dateFormat + (this.field.property.includeTime ? ' ' + this.timeFormat : '');
  }

  static _validate(value: any): value is ITimestamp {
    return isNumber(value) && !Number.isNaN(value);
  }

  validate(value: any): value is ITimestamp {
    return DateTimeBaseField._validate(value);
  }

  static _defaultValueForCondition(condition: IFilterCondition): ITimestamp | null {
    if (condition.operator !== FOperator.Is) {
      return null;
    }

    const { value } = condition;
    if (!value || value.length === 0) {
      return null;
    }

    const duration = value[0];
    if (duration === FilterDuration.ExactDate) {
      const timestamp = value[1];
      if (DateTimeBaseField._validate(timestamp)) {
        return timestamp;
      }
      return null;
    }
    if (duration === FilterDuration.Today) {
      const today = getToday();
      return today.getTime();
    }
    if (duration === FilterDuration.Tomorrow) {
      const day = getToday();
      day.setDate(day.getDate() + 1);
      return day.getTime();
    }
    if (duration === FilterDuration.Yesterday) {
      const day = getToday();
      day.setDate(day.getDate() - 1);
      return day.getTime();
    }
    return null;
  }

  defaultValueForCondition(condition: IFilterCondition): ITimestamp | null {
    return DateTimeBaseField._defaultValueForCondition(condition);
  }

  override defaultValue(): number | null {
    return null;
  }

  static _compare(cv1: ITimestamp, cv2: ITimestamp, property?: IDateTimeBaseFieldProperty, onlyCompareOriginValue?: boolean) {
    if (cv1 === cv2) {
      return 0;
    }
    if (cv1 === null) {
      return -1;
    }
    if (cv2 === null) {
      return 1;
    }
    const dateFormat = DateFormat[property?.dateFormat || DEFAULT_DATETIME_PROPS.dateFormat]!;
    const hasYear = dateFormat.includes('YYYY');

    // In the case of sorting and including the year, just use the original timestamp to compare
    if (onlyCompareOriginValue && hasYear) {
      return cv1 > cv2 ? 1 : -1;
    }

    const dateTimeStr1 = dateTimeFormat(cv1, property);
    const dateTimeStr2 = dateTimeFormat(cv2, property);

    // The product requirement is to use the displayed value (that is, the value seen by the cell) to be sorted uniformly.
    // In theory, all of them can be compared using str.
    // But there is a variant of the year-month-day format: day-month-year,
    // if you use str to compare the order at this time, there will be an error,
    // So the format containing the year, month and day uses timestamp comparison uniformly
    if (hasYear) {
      return dateTimeStr1 === dateTimeStr2 ?
        0 : (cv1 > cv2 ? 1 : -1);
    }

    // Fill in a uniform year, then compare the timestamps
    const timestamp1 = dayjs(cv1).year(2000).valueOf();
    const timestamp2 = dayjs(cv2).year(2000).valueOf();
    return dateTimeStr1 === dateTimeStr2 ?
      0 : (timestamp1! > timestamp2! ? 1 : -1);
  }

  override compare(cellValue1: ITimestamp, cellValue2: ITimestamp, onlyCompareOriginValue?: boolean): number {
    return DateTimeBaseField._compare(cellValue1, cellValue2, this.field.property, onlyCompareOriginValue);
  }

  override eq(cv1: ITimestamp, cv2: ITimestamp): boolean {
    return isEqual(dateTimeFormat(cv1, this.field.property), dateTimeFormat(cv2, this.field.property));
  }

  override cellValueToString(cellValue: ICellValue): string | null {
    return dateTimeFormat(cellValue, this.field.property, getUserTimeZone(this.state));
  }

  cellValueToStdValue(cellValue: ITimestamp | null): IStandardValue {
    const stdVal: IStandardValue = {
      sourceType: this.field.type,
      data: [],
    };

    if (cellValue != null) {
      /*
        * Data pasted or dragged from a date field should be saved twice
        * text is text, such as 11/02 2020-11-1, used to write data when pasting to non-date fields
        * originValue is a timestamp, which is used to paste or fill data into the date field.
        * The biggest difference from text is that all the time information is saved, which can be used according to
        * The format of the target date field is displayed freely
        */
      stdVal.data.push({
        text: this.cellValueToString(cellValue) || '',
        originValue: cellValue,
      });
    }
    return stdVal;
  }

  stdValueToCellValue(stdVal: IStandardValue): ITimestamp | null {
    if (stdVal.data.length === 0) {
      return null;
    }

    let value = stdVal.data[0]!.text;

    if (!value) {
      return null;
    }

    const isOperateFromDate = stdVal.sourceType === FieldType.DateTime && stdVal.data[0]!.originValue;
    if (isOperateFromDate) {
      value = stdVal.data[0]!.originValue;
    }
    const _value = isOperateFromDate ? value : dateStrReplaceCN(value);
    let datetime = dayjs(_value);
    if (datetime.isValid()) {
      /**
       * automatically fills the date with the year
       * If the data is pasted from a cell of a time field,
       * it will not be processed, but for strings pasted from text or Excel, two judgments will be made
       *
       * 1. Perform pattern matching according to the given format, check if there is a possible year,
       * if there is, use the given year
       *
       * 2. If the above conditions are not satisfied, check whether the final formatted year is 2001,
       * if it is satisfied, it will be directed to the current year
       *
       * @type {boolean}
       */
      // const isIncludesYear = dayjs(_value, ['Y-M-D', 'Y/M/D']).isValid();
      const isIncludesYear = dayjs(_value).isValid();
      if (datetime.year() === 2001 && !isIncludesYear) {
        datetime = datetime.year(dayjs().year());
      }
      const timestamp = datetime.toDate().getTime();
      // When the type is switched, the illegal data is set to null
      if (notInTimestampRange(timestamp)) {
        return null;
      }
      return timestamp;
    }
    return null;
  }

  /**
   * Assuming it is now Feb 8 01:56:55 UTC+8
   * Today: [Today 00:00, Tomorrow 23:59] UTC+8
   * Tomorrow: [Tomorrow 00:00, The day after tomorrow 23:59] UTC+8
   * Yesterday: [yesterday 00:00, today 23:59] UTC+8
   * Next 7 days: [Today 00:00, Feb 16 23:59] UTC+8
   * Last 7 days: [February 1st 00:00, today 23:59] UTC+8
   * In the next 30 days: [Today 00:00, March 9th 23:59] UTC+8
   * In the past 30 days: [January 8th 00:00, today 23:59] UTC+8
   * This week: Monday to Friday of the current week
   * Last week: Monday to Friday of the previous week
   * This month: [February 1st 00:00, February 28th 23:59] UTC+8
   * Last month: [January 1st 00:00, January 31st 23:59] UTC+8
   * This year: [January 1st 00:00, December 31st 23:59] UTC+8
   */
  private static getTimeRange(filterDuration: FilterDuration, time: ITimestamp | string | null | undefined, timeZone?: string,
    locale?: string): [ITimestamp, ITimestamp] {
    switch (filterDuration) {
      case FilterDuration.ExactDate: {
        if (time != undefined) {
          return [
            withTimeZone(time, timeZone, locale).startOf('day').valueOf(),
            withTimeZone(time, timeZone, locale).endOf('day').valueOf()
          ];
        }
        throw new Error('ExactDate has to calculate with timestamp');
      }
      case FilterDuration.DateRange: {
        if (typeof time === 'string') {
          const [startDate, endDate] = time.split('-');
          return [Number(startDate), Number(endDate)];
        }
        throw new Error('ExactDate has to calculate with timestamp');
      }
      case FilterDuration.Today: {
        return [
          withTimeZone(Date.now(), timeZone, locale).startOf('day').valueOf(),
          withTimeZone(Date.now(), timeZone, locale).endOf('day').valueOf()
        ];
      }
      case FilterDuration.Tomorrow: {
        return [
          withTimeZone(Date.now(), timeZone, locale).add(1, 'day').startOf('day').valueOf(),
          withTimeZone(Date.now(), timeZone, locale).add(1, 'day').endOf('day').valueOf()
        ];
      }
      case FilterDuration.Yesterday: {
        return [
          withTimeZone(Date.now(), timeZone, locale).add(-1, 'day').startOf('day').valueOf(),
          withTimeZone(Date.now(), timeZone, locale).add(-1, 'day').endOf('day').valueOf()
        ];
      }
      case FilterDuration.TheNextWeek: {
        return [
          withTimeZone(Date.now(), timeZone, locale).add(1, 'day').startOf('day').valueOf(),
          withTimeZone(Date.now(), timeZone, locale).add(7, 'day').endOf('day').valueOf()
        ];
      }
      case FilterDuration.TheLastWeek: {
        return [
          withTimeZone(Date.now(), timeZone, locale).add(-7, 'day').startOf('day').valueOf(),
          withTimeZone(Date.now(), timeZone, locale).add(-1, 'day').endOf('day').valueOf(),
        ];
      }
      // 1/29 plus one month equals March 1st
      case FilterDuration.TheNextMonth: {
        return [
          withTimeZone(Date.now(), timeZone, locale).add(1, 'day').startOf('day').valueOf(),
          withTimeZone(Date.now(), timeZone, locale).add(30, 'day').endOf('day').valueOf()
        ];
      }
      case FilterDuration.TheLastMonth: {
        return [
          withTimeZone(Date.now(), timeZone, locale).add(-30, 'day').startOf('day').valueOf(),
          withTimeZone(Date.now(), timeZone, locale).add(-1, 'day').endOf('day').valueOf(),
        ];
      }
      case FilterDuration.ThisWeek: {
        return [
          withTimeZone(Date.now(), timeZone, locale).startOf('week').valueOf(),
          withTimeZone(Date.now(), timeZone, locale).endOf('week').valueOf()
        ];
      }
      case FilterDuration.PreviousWeek: {
        return [
          withTimeZone(Date.now(), timeZone, locale).add(-1, 'week').startOf('week').valueOf(),
          withTimeZone(Date.now(), timeZone, locale).add(-1, 'week').endOf('week').valueOf()
        ];
      }
      case FilterDuration.ThisMonth: {
        return [
          withTimeZone(Date.now(), timeZone, locale).startOf('month').valueOf(),
          withTimeZone(Date.now(), timeZone, locale).endOf('month').valueOf()
        ];
      }
      case FilterDuration.PreviousMonth: {
        return [
          withTimeZone(Date.now(), timeZone, locale).add(-1, 'month').startOf('month').valueOf(),
          withTimeZone(Date.now(), timeZone, locale).add(-1, 'month').endOf('month').valueOf()
        ];
      }
      case FilterDuration.ThisYear: {
        return [
          withTimeZone(Date.now(), timeZone, locale).startOf('year').valueOf(),
          withTimeZone(Date.now(), timeZone, locale).endOf('year').valueOf()
        ];
      }
      case FilterDuration.SomeDayBefore: {
        if (typeof time === 'number') {
          return [
            withTimeZone(Date.now(), timeZone, locale).add(-time, 'day').startOf('day').valueOf(),
            withTimeZone(Date.now(), timeZone, locale).add(-time, 'day').endOf('day').valueOf()
          ];
        }
        throw new Error('SomeDayBefore has to calculate with number');
      }
      case FilterDuration.SomeDayAfter: {
        if (typeof time === 'number') {
          return [
            withTimeZone(Date.now(), timeZone, locale).add(time, 'day').startOf('day').valueOf(),
            withTimeZone(Date.now(), timeZone, locale).add(time, 'day').endOf('day').valueOf()
          ];
        }
        throw new Error('SomeDayAfter has to calculate with number');
      }
      default: {
        assertNever(filterDuration);
      }
    }
  }

  static _isMeetFilter(
    operator: FOperator, cellValue: ITimestamp | null, conditionValue: Exclude<IFilterDateTime, null>, timeZone?: string, locale?: string
  ) {
    // The logic to judge in advance that it is empty or not.
    if (operator === FOperator.IsEmpty) {
      return cellValue == null;
    }
    if (operator === FOperator.IsNotEmpty) {
      return cellValue != null;
    }
    const [filterDuration] = conditionValue;
    if (!filterDuration) {
      return false;
    }
    let timestamp: string | number | undefined | null;
    if (
      filterDuration === FilterDuration.ExactDate ||
      filterDuration === FilterDuration.DateRange ||
      filterDuration === FilterDuration.SomeDayBefore ||
      filterDuration === FilterDuration.SomeDayAfter
    ) {
      timestamp = conditionValue[1];
      /**
       * When there is no timestamp, it means that time selection has not been performed, and no filtering is performed at this time
       */
      if (timestamp == null) {
        return true;
      }
    }

    /**
     * When the cell value is empty, it will be hidden
     * There is no need to consider the operation condition of whether it is empty or not, this condition has been processed externally
     */
    if (cellValue == null) {
      return false;
    }

    const [left, right] = this.getTimeRange(filterDuration, timestamp, timeZone, locale);

    switch (operator) {
      case FOperator.Is: {
        return left <= cellValue && cellValue < right;
      }

      case FOperator.IsGreater: {
        return cellValue > right;
      }

      case FOperator.IsGreaterEqual: {
        return cellValue >= left;
      }

      case FOperator.IsLess: {
        return cellValue < left;
      }

      case FOperator.IsLessEqual: {
        return cellValue <= right;
      }

      default: {
        return false;
        // return this.isMeetFilter(operator, cellValue, conditionValue);
      }
    }
  }

  override isMeetFilter(operator: FOperator, cellValue: ITimestamp | null, conditionValue: Exclude<IFilterDateTime, null>) {
    let timeZone = getUserTimeZone(this.state);
    const _locale = getLanguage();
    const locale = getUserLocale(this.state) || _locale;
    if (isServer()) {
      timeZone = timeZone || DEFAULT_TIME_ZONE;
    }
    return DateTimeBaseField._isMeetFilter(operator, cellValue, conditionValue, timeZone, locale);
  }

  static _statType2text(type: StatType): string {
    if (type === StatType.Max) {
      return t(Strings.stat_max_date);
    }
    if (type === StatType.Min) {
      return t(Strings.stat_min_date);
    }
    return StatTranslate[type];
  }

  /**
   * @description convert the statistical parameters into Chinese
   */
  override statType2text(type: StatType): string {
    return DateTimeBaseField._statType2text(type);
  }

  cellValueToApiStandardValue(cellValue: ICellValue): ICellValue {
    return cellValue;
  }

  cellValueToApiStringValue(cellValue: ICellValue): string | null {
    return cellValue ? this.cellValueToString(cellValue) : null;
  }

  cellValueToOpenValue(cellValue: ICellValue): string | null {
    return cellValue ? this.cellValueToString(cellValue) : null;
  }

  openWriteValueToCellValue(openWriteValue: string | Date | null) {
    return isNullValue(openWriteValue) ? null : new Date(openWriteValue).getTime();
  }

  static _filterValueToOpenFilterValue(value: IFilterDateTime): IOpenFilterValueDataTime {
    if (!value || !Array.isArray(value)) {
      return null;
    }
    const operator = value[0];
    const _value = value[1];
    if (operator === FilterDuration.DateRange) {
      const range = typeof _value === 'string' ? _value.split('-').map(v => Number(v)) : [];
      return range.length === 2 ? [operator, range[0]!, range[1]!] : [operator, null];
    }
    if (operator === FilterDuration.ExactDate) {
      return [operator, _value as number | null];
    }
    if (operator === FilterDuration.SomeDayBefore || operator === FilterDuration.SomeDayAfter) {
      return [operator, _value == null ? null : Number(_value)];
    }
    return [operator];
  }

  override filterValueToOpenFilterValue(value: IFilterDateTime): IOpenFilterValueDataTime {
    return DateTimeBaseField._filterValueToOpenFilterValue(value);
  }

  static _openFilterValueToFilterValue(value: IOpenFilterValueDataTime): IFilterDateTime {
    if (!value || !Array.isArray(value)) {
      return null;
    }
    const [operator, ..._value] = value;
    if (operator === FilterDuration.DateRange) {
      return _value.length === 2 ? [operator, _value.join('-')] : [operator, null];
    }
    if (operator === FilterDuration.ExactDate) {
      return [operator, _value.length === 1 ? _value[0] : null];
    }
    if (operator === FilterDuration.SomeDayBefore || operator === FilterDuration.SomeDayAfter) {
      return [operator, _value.length === 1 ? _value[0] : null] as any;
    }
    return [operator];
  }

  override openFilterValueToFilterValue(value: IOpenFilterValueDataTime): IFilterDateTime {
    return DateTimeBaseField._openFilterValueToFilterValue(value);
  }

  static _validateOpenFilterValue(value: IOpenFilterValueDataTime) {
    if (!value) {
      return Joi.allow(null).validate(value);
    }
    const [op, ..._value] = value;
    if (op === FilterDuration.DateRange) {
      return Joi.array().items(Joi.number().allow(null)).min(2).max(2).allow(null).validate(_value);
    }
    if (op === FilterDuration.ExactDate) {
      return Joi.array().items(Joi.number().allow(null)).max(1).allow(null).validate(_value);
    }
    if (op === FilterDuration.SomeDayBefore || op === FilterDuration.SomeDayAfter) {
      return Joi.array().items(Joi.number().allow(null)).max(1).allow(null).validate(_value);
    }
    return Joi.array().max(0).validate(_value);

  }

  override validateOpenFilterValue(value: IOpenFilterValueDataTime) {
    return DateTimeBaseField._validateOpenFilterValue(value);
  }
}
