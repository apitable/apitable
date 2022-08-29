import dayjs from 'dayjs';
// 支持 国际化(i18n) 的列表
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/zh-hk';
import 'dayjs/locale/zh-tw';
import timezone from 'dayjs/plugin/timezone';
// 时区
import utc from 'dayjs/plugin/utc';
import { getLanguage, Strings, t } from 'i18n';
import { isEqual, isNumber } from 'lodash';
import { DEFAULT_TIMEZONE } from 'model/constants';
import { isNullValue } from 'model/utils';
import { IReduxState } from 'store';
import { IAPIMetaDateTimeBaseFieldProperty } from 'types/field_api_property_types';
import {
  BasicValueType, DateFormat, FieldType, ICreatedTimeField, IDateTimeBaseFieldProperty, IDateTimeField, ILastModifiedTimeField, IStandardValue,
  ITimestamp, TimeFormat
} from 'types/field_types';
import { FilterDuration, FOperator, IFilterCondition, IFilterDateTime } from 'types/view_types';
import { assertNever, dateStrReplaceCN, getToday, notInTimestampRange } from 'utils';
import { ICellValue } from '../record';
import { Field } from './field';
import { StatTranslate, StatType } from './stat';

// 插件在import之后，防止循环引入
dayjs.extend(utc);
dayjs.extend(timezone);
declare const window: any;

export interface IOptionalDateTimeFieldProperty {
  // 日期格式
  dateFormat?: DateFormat;
  // 时间格式
  timeFormat?: TimeFormat;
  // 是否包含时间
  includeTime?: boolean;
}

const defaultProps = {
  dateFormat: DateFormat['YYYY/MM/DD'],
  timeFormat: TimeFormat['HH:mm'],
  includeTime: false,
};

export const getDateTimeFormat = (props: IOptionalDateTimeFieldProperty) => {
  const dateFormat = DateFormat[props.dateFormat || defaultProps.dateFormat];
  const timeFormat = TimeFormat[props.timeFormat || defaultProps.timeFormat];
  return dateFormat + (props.includeTime ? ' ' + timeFormat : '');
};

export const dateTimeFormat = (
  timestamp: any,
  props?: IOptionalDateTimeFieldProperty,
) => {
  if (!timestamp) {
    return null;
  }

  props = props || defaultProps;
  const dateFormat = DateFormat[props.dateFormat || defaultProps.dateFormat];
  const timeFormat = TimeFormat[props.timeFormat || defaultProps.timeFormat];
  let format = dateFormat + (props.includeTime ? ' ' + timeFormat : '');

  if (props.includeTime && timeFormat === 'hh:mm') {
    const locale = getLanguage();
    const formatLocale = locale.toLowerCase().split('_').join('-');
    dayjs.locale(formatLocale);
    format += ' a';
  }
  // 服务端
  if (typeof window === 'undefined' && typeof global === 'object' && global.process) {
    return dayjs(Number(timestamp)).tz(DEFAULT_TIMEZONE).format(format);
  }
  return dayjs(Number(timestamp)).format(format);
};

export type ICommonDateTimeField = IDateTimeField | ICreatedTimeField | ILastModifiedTimeField;

export abstract class DateTimeBaseField extends Field {
  constructor(public field: ICommonDateTimeField, public state: IReduxState) {
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

  showFOperatorDesc(type: FOperator) {
    return DateTimeBaseField.FOperatorDescMap[type];
  }

  get apiMetaProperty(): IAPIMetaDateTimeBaseFieldProperty {
    const res: IAPIMetaDateTimeBaseFieldProperty = {
      format: getDateTimeFormat(this.field.property),
      includeTime: this.field.property.includeTime,
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

  get statTypeList(): StatType[] {
    return DateTimeBaseField._statTypeList;
  }

  get basicValueType(): BasicValueType {
    return BasicValueType.DateTime;
  }

  get acceptFilterOperators() {
    return DateTimeBaseField._acceptFilterOperators;
  }

  get dateFormat(): string {
    return DateFormat[this.field.property.dateFormat];
  }

  get timeFormat(): string {
    return TimeFormat[this.field.property.timeFormat];
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

  defaultValue(): number | null {
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
    const dateFormat = DateFormat[property?.dateFormat || defaultProps.dateFormat];
    const hasYear = dateFormat.includes('YYYY');

    //在排序的情况并且包含年的情况下，只需要用原始的 timestamp 比较即可
    if (onlyCompareOriginValue && hasYear) {
      return cv1 > cv2 ? 1 : -1;
    }

    const dateTimeStr1 = dateTimeFormat(cv1, property);
    const dateTimeStr2 = dateTimeFormat(cv2, property);

    // 产品需求是统一使用显示值(即单元格看到的值)排序，理论可以全部使用 str 比较，
    // 但年月日格式存在一个变体：日月年，如果这时用 str 比较顺序会出错，
    // 所以包含年月日的格式统一使用 timestamp 比较
    if (hasYear) {
      return dateTimeStr1 === dateTimeStr2 ?
        0 : (cv1 > cv2 ? 1 : -1);
    }

    // 填充一个统一的年份，再来比较时间戳
    const timestamp1 = dayjs(cv1).year(2000).valueOf();
    const timestamp2 = dayjs(cv2).year(2000).valueOf();
    return dateTimeStr1 === dateTimeStr2 ?
      0 : (timestamp1! > timestamp2! ? 1 : -1);
  }

  compare(cellValue1: ITimestamp, cellValue2: ITimestamp, onlyCompareOriginValue?: boolean): number {
    return DateTimeBaseField._compare(cellValue1, cellValue2, this.field.property, onlyCompareOriginValue);
  }

  eq(cv1: ITimestamp, cv2: ITimestamp): boolean {
    return isEqual(dateTimeFormat(cv1, this.field.property), dateTimeFormat(cv2, this.field.property));
  }

  cellValueToString(cellValue: ICellValue): string | null {
    return dateTimeFormat(cellValue, this.field.property);
  }

  cellValueToStdValue(cellValue: ITimestamp | null): IStandardValue {
    const stdVal: IStandardValue = {
      sourceType: this.field.type,
      data: [],
    };

    if (cellValue != null) {
      /*
       * 从一个日期字段粘贴或者拖拽的数据，要保存两份
       * text 为文本，如 11/02 2020-11-1，用于向非日期字段粘贴时写入数据
       * originValue 为时间戳，用于向日期字段粘贴或者填充数据使用，和 text 最大的不同在于保存了所有的时间信息，可以根据
       * 目标日期字段的格式自由显示
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

    let value = stdVal.data[0].text;

    if (!value) {
      return null;
    }

    const isOperateFromDate = stdVal.sourceType === FieldType.DateTime && stdVal.data[0].originValue;
    if (isOperateFromDate) {
      value = stdVal.data[0].originValue;
    }
    const _value = isOperateFromDate ? value : dateStrReplaceCN(value);
    let datetime = dayjs(_value);
    if (datetime.isValid()) {
      /**
       * @description 自动给日期填充年份
       * 如果是从一个时间字段的单元格内粘贴的数据，不做处理，但针对从文本或者 Excel 等地方粘贴的字符串，会做两个判断
       * 1. 按照给定的格式进行模式匹配，检查是否有可能存在年份，如果存在则使用给定的年份
       * 2. 上面的条件如果不满足，就检查最终格式化的年份是否是 2001 年，满足则定向到当前年份
       * @type {boolean}
       */
      const isIncludesYear = dayjs(_value, ['Y-M-D', 'D/M/Y']).isValid();
      if (datetime.year() === 2001 && !isIncludesYear) {
        datetime = datetime.year(dayjs().year());
      }
      const timestamp = datetime.toDate().getTime();
      // 类型切换时，非法数据设置为 null
      if (notInTimestampRange(timestamp)) {
        return null;
      }
      return timestamp;
    }
    return null;
  }

  /**
   * 假设现在是 2月8日 01:56:55 UTC+8
   * 今天：[今天00:00, 明天23:59] UTC+8
   * 明天：[明天00:00, 后天23:59] UTC+8
   * 昨天：[昨天00:00, 今天23:59] UTC+8
   * 未来 7 天内：[今天00:00, 2月16日23:59] UTC+8
   * 过去 7 天内：[2月1日00:00, 今天23:59] UTC+8
   * 未来 30 天内：[今天00:00, 3月9日23:59] UTC+8
   * 过去 30 天内：[1月8日00:00, 今天23:59] UTC+8
   * 本周：当前所在周的周一至周五
   * 上周：上一周的周一至周五
   * 本月：[2月1日 00:00, 2月28日 23:59] UTC+8
   * 上月：[1月1日 00:00, 1月31日 23:59] UTC+8
   * 今年：[1月1日 00:00, 12月31日 23:59] UTC+8
   */
  static getTimeRange(filterDuration: FilterDuration, time: ITimestamp | string | null): [ITimestamp, ITimestamp] {
    switch (filterDuration) {
      case FilterDuration.ExactDate: {
        if (time != null) {
          return [
            dayjs(time).startOf('day').valueOf(),
            dayjs(time).endOf('day').valueOf()
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
          dayjs().startOf('day').valueOf(),
          dayjs().endOf('day').valueOf()
        ];
      }
      case FilterDuration.Tomorrow: {
        return [
          dayjs().add(1, 'day').startOf('day').valueOf(),
          dayjs().add(1, 'day').endOf('day').valueOf()
        ];
      }
      case FilterDuration.Yesterday: {
        return [
          dayjs().add(-1, 'day').startOf('day').valueOf(),
          dayjs().add(-1, 'day').endOf('day').valueOf()
        ];
      }
      case FilterDuration.TheNextWeek: {
        return [
          dayjs().add(1, 'day').startOf('day').valueOf(),
          dayjs().add(7, 'day').endOf('day').valueOf()
        ];
      }
      case FilterDuration.TheLastWeek: {
        return [
          dayjs().add(-7, 'day').startOf('day').valueOf(),
          dayjs().add(-1, 'day').endOf('day').valueOf(),
        ];
      }
      // 1/29 加一个月会等于 3月1日
      case FilterDuration.TheNextMonth: {
        return [
          dayjs().add(1, 'day').startOf('day').valueOf(),
          dayjs().add(30, 'day').endOf('day').valueOf()
        ];
      }
      case FilterDuration.TheLastMonth: {
        return [
          dayjs().add(-30, 'day').startOf('day').valueOf(),
          dayjs().add(-1, 'day').endOf('day').valueOf(),
        ];
      }
      case FilterDuration.ThisWeek: {
        return [
          dayjs().startOf('week').valueOf(),
          dayjs().endOf('week').valueOf()
        ];
      }
      case FilterDuration.PreviousWeek: {
        return [
          dayjs().add(-1, 'week').startOf('week').valueOf(),
          dayjs().add(-1, 'week').endOf('week').valueOf()
        ];
      }
      case FilterDuration.ThisMonth: {
        return [
          dayjs().startOf('month').valueOf(),
          dayjs().endOf('month').valueOf()
        ];
      }
      case FilterDuration.PreviousMonth: {
        return [
          dayjs().add(-1, 'month').startOf('month').valueOf(),
          dayjs().add(-1, 'month').endOf('month').valueOf()
        ];
      }
      case FilterDuration.ThisYear: {
        return [
          dayjs().startOf('year').valueOf(),
          dayjs().endOf('year').valueOf()
        ];
      }
      case FilterDuration.SomeDayBefore: {
        if (typeof time === 'number') {
          return [
            dayjs().add(-time, 'day').startOf('day').valueOf(),
            dayjs().add(-time, 'day').endOf('day').valueOf()
          ];
        }
        throw new Error('SomeDayBefore has to calculate with number');
      }
      case FilterDuration.SomeDayAfter: {
        if (typeof time === 'number') {
          return [
            dayjs().add(time, 'day').startOf('day').valueOf(),
            dayjs().add(time, 'day').endOf('day').valueOf()
          ];
        }
        throw new Error('SomeDayAfter has to calculate with number');
      }
      default: {
        assertNever(filterDuration);
        throw new Error('Wrong FilterDuration');
      }
    }
  }

  static _isMeetFilter(
    operator: FOperator, cellValue: ITimestamp | null, conditionValue: Exclude<IFilterDateTime, null>,
  ) {
    // 提前判断为空不为空的逻辑。
    if (operator === FOperator.IsEmpty) {
      return cellValue == null;
    }
    if (operator === FOperator.IsNotEmpty) {
      return cellValue != null;
    }
    const [filterDuration] = conditionValue;
    let timestamp;
    if (
      filterDuration === FilterDuration.ExactDate ||
      filterDuration === FilterDuration.DateRange ||
      filterDuration === FilterDuration.SomeDayBefore ||
      filterDuration === FilterDuration.SomeDayAfter
    ) {
      timestamp = conditionValue[1];
      /**
       * 当不存在 timestamp 的时候，说明还没有进行时间选择，此时不进行筛选
       */
      if (timestamp == null) {
        return true;
      }
    }

    /**
     * 当单元格值为空的时候，要被隐藏掉
     * 这里不用考虑是否为空的 operation 条件，这个条件已经在外部处理
     */
    if (cellValue == null) {
      return false;
    }

    const [left, right] = this.getTimeRange(filterDuration, timestamp);

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

  isMeetFilter(operator: FOperator, cellValue: ITimestamp | null, conditionValue: Exclude<IFilterDateTime, null>) {
    return DateTimeBaseField._isMeetFilter(operator, cellValue, conditionValue);
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
   * @description 将统计的参数转换成中文
   */
  statType2text(type: StatType): string {
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
}
