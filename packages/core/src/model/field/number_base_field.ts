import { IReduxState } from 'store';
import { isNumber } from 'lodash';
import { ICellValue } from 'model/record';
import {
  FieldType,
  INumberField,
  ICurrencyField,
  IPercentField,
  IRatingField,
  IStandardValue,
  BasicValueType,
  IAutoNumberField,
  INumberFieldProperty,
} from 'types/field_types';
import { FOperator, IFilterCondition, IFilterNumber } from 'types/view_types';
import { Field } from './field';
import { StatType } from './stat';
import { t, Strings } from 'i18n';
import { str2number, str2NumericStr, numberToShow, str2Currency, times } from 'utils';
import { IAPIMetaNumberBaseFieldProperty } from 'types/field_api_property_types';
import Joi from 'joi';
import { isNullValue } from 'model/utils';

export type ICommonNumberField = INumberField | IRatingField | ICurrencyField | IPercentField | IAutoNumberField;
export const commonNumberFields = new Set([
  FieldType.Number,
  FieldType.Currency,
  FieldType.Percent,
  FieldType.Rating,
  FieldType.AutoNumber,
  FieldType.Formula,
]);
// 科学计数法临界值
export const numberThresholdValue = 1e+16;

export const numberFormat = (cv, formatting) => {
  const { formatType, precision = 0, symbol, commaStyle } = (formatting as any) || {};

  if (formatType === FieldType.Currency) {
    const cellString = numberToShow(cv as number, precision);
    return str2Currency(cellString, symbol);
  } else if (formatType === FieldType.Percent) {
    if (cv == null) {
      return null;
    }
    const cellString = numberToShow(times((cv as number), 100), precision);
    return cellString == null ? null : cellString + '%';
  }
  const cellString = numberToShow(cv as number, precision);
  return commaStyle ? str2Currency(cellString, '', 3, commaStyle) : cellString;
};

export abstract class NumberBaseField extends Field {
  constructor(public field: ICommonNumberField, state: IReduxState) {
    super(field, state);
  }

  get apiMetaProperty(): IAPIMetaNumberBaseFieldProperty {
    const { defaultValue, precision = 0, commaStyle, symbol } = this.field.property as INumberFieldProperty;
    return {
      defaultValue: defaultValue || undefined,
      precision,
      commaStyle: commaStyle || undefined,
      symbol: symbol || undefined
    };
  }

  get openValueJsonSchema() {
    return {
      type: 'number',
      title: this.field.name,
    };
  }

  static _statTypeList = [
    StatType.None,
    StatType.CountAll,
    StatType.Sum,
    StatType.Average,
    StatType.Max,
    StatType.Min,
    StatType.Empty,
    StatType.Filled,
    StatType.Unique,
    StatType.PercentEmpty,
    StatType.PercentFilled,
    StatType.PercentUnique,
  ];

  static _acceptFilterOperators = [
    FOperator.Is,
    FOperator.IsNot,
    FOperator.IsGreater,
    FOperator.IsGreaterEqual,
    FOperator.IsLess,
    FOperator.IsLessEqual,
    FOperator.IsEmpty,
    FOperator.IsNotEmpty,
    FOperator.IsRepeat,
  ];

  static FOperatorDescMap = {
    [FOperator.Is]: '=',
    [FOperator.IsNot]: '≠',
    [FOperator.IsGreater]: '>',
    [FOperator.IsGreaterEqual]: '≥',
    [FOperator.IsLess]: '<',
    [FOperator.IsLessEqual]: '≤',
    [FOperator.IsEmpty]: t(Strings.is_empty),
    [FOperator.IsNotEmpty]: t(Strings.is_not_empty),
    [FOperator.IsRepeat]: t(Strings.is_repeat),
  };

  static cellValueSchema = Joi.number().unsafe().allow(null).required();

  static openWriteValueSchema = Joi.number().allow(null).required();

  showFOperatorDesc(type: FOperator) {
    return NumberBaseField.FOperatorDescMap[type];
  }

  get acceptFilterOperators(): FOperator[] {
    return NumberBaseField._acceptFilterOperators;
  }

  get statTypeList(): StatType[] {
    return NumberBaseField._statTypeList;
  }

  get basicValueType(): BasicValueType {
    return BasicValueType.Number;
  }

  cellValueToString(cellValue: ICellValue): string | null {
    return null;
  }

  static _compare(cellValue1: number | null, cellValue2: number | null): number {
    if (cellValue1 === null && cellValue2 === null) {
      return 0;
    }
    if (cellValue1 === null) {
      return -1;
    }
    if (cellValue2 === null) {
      return 1;
    }
    return cellValue1 === cellValue2 ?
      0 : (cellValue1 > cellValue2 ? 1 : -1);
  }

  compare(cellValue1: number, cellValue2: number): number {
    return NumberBaseField._compare(cellValue1, cellValue2);
  }

  cellValueToStdValue(val: number | null): IStandardValue {
    const stdVal: IStandardValue = {
      sourceType: this.field.type,
      data: [],
    };

    if (val != null) {
      stdVal.data.push({
        // 对于 Number 类型相关字段，需保证数据源精确度是准确的
        text: this.cellValueToString(val) || '',
        value: val,
      });
    }

    return stdVal;
  }

  // StandardValue -> CellValue 需经过数据转换，否则会影响单元格复制、填充等操作
  stdValueToCellValue(stdVal: IStandardValue): number | null {
    const { data, sourceType } = stdVal;

    if (data.length === 0) {
      return null;
    }
    const { text, value } = data[0];
    // 从 Number & Formula 相关字段转换过来
    if (commonNumberFields.has(sourceType) && this.validate(value)) {
      return value;
    }
    // 其它字段
    const cellValue: ICellValue = str2NumericStr(text);
    return cellValue == null ? null : str2number(cellValue);
  }

  validate(value: any): value is number {
    return isNumber(value) && !Number.isNaN(value);
  }

  defaultValueForCondition(condition: IFilterCondition<FieldType.Number>): number | null {
    if (condition.operator !== FOperator.Is) {
      return null;
    }

    const { value } = condition;
    if (value && value.length && value[0]) {
      return str2number(value[0]);
    }
    return null;
  }

  static _isMeetFilter(operator: FOperator, cellValue: number | null, conditionValue: Exclude<IFilterNumber, null>) {
    // TODO: 整理这里的逻辑.
    // Field -> NumberBaseField -> [NumberField,RatingField,PercentField,CurrencyField] -> LookupField
    // + getVisibleRows 会提前效验为空不为空的情况。按道理来说应该不用，全部的 filter 逻辑都应该走这里。
    // + 在实现字段 isMeetFilter 时，应该提前判断单目运算符，然后再处理多目运算符号。这样下面对比较值的处理，就不会影响正常的判断逻辑。
    // + 现在字段 filter 也需要提供给 automation 的单记录使用，为空不为空提前判断。
    if (operator === FOperator.IsEmpty) {
      return cellValue == null;
    }
    if (operator === FOperator.IsNotEmpty) {
      return cellValue != null;
    }

    if (conditionValue == null) return true;
    const filterValue: number | null = conditionValue[0].trim() === '' ? null : Number(conditionValue[0]);
    if (filterValue == null) {
      return true;
    }

    switch (operator) {
      case FOperator.Is: {
        return !Number.isNaN(filterValue) && cellValue != null && filterValue === cellValue;
      }

      case FOperator.IsNot: {
        return cellValue == null || Number.isNaN(filterValue) || cellValue !== filterValue;
      }

      case FOperator.IsGreater: {
        return cellValue != null && cellValue > filterValue;
      }

      case FOperator.IsGreaterEqual: {
        return cellValue != null && cellValue >= filterValue;
      }

      case FOperator.IsLess: {
        return cellValue != null && cellValue < filterValue;
      }

      case FOperator.IsLessEqual: {
        return cellValue != null && cellValue <= filterValue;
      }
      default: {
        return false;
      }
    }
  }

  isMeetFilter(operator: FOperator, cellValue: number | null, conditionValue: Exclude<IFilterNumber, null>) {
    return NumberBaseField._isMeetFilter(operator, cellValue, conditionValue);
  }

  cellValueToApiStandardValue(cellValue: ICellValue): ICellValue {
    return cellValue;
  }

  cellValueToApiStringValue(cellValue: ICellValue): string | null {
    return this.cellValueToString(cellValue);
  }
  cellValueToOpenValue(cellValue: ICellValue): number | null {
    return cellValue as number;
  }

  openWriteValueToCellValue(openWriteValue: number | null) {
    if (isNullValue(openWriteValue)) {
      return null;
    }
    return openWriteValue;
  }

  validateCellValue(cellValue: ICellValue) {
    return NumberBaseField.cellValueSchema.validate(cellValue);
  }

  validateOpenWriteValue(owv: number | null) {
    return NumberBaseField.openWriteValueSchema.validate(owv);
  }
}
