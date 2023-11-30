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

import { IReduxState } from '../../exports/store/interfaces';
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
  IComputedFieldFormattingProperty,
} from 'types/field_types';
import { FOperator, IFilterCondition, IFilterNumber } from 'types/view_types';
import { Field } from './field';
import { StatType } from './stat';
import { t, Strings } from '../../exports/i18n';
import { str2number, str2NumericStr, numberToShow, str2Currency, times } from 'utils';
import { IAPIMetaNumberBaseFieldProperty } from 'types/field_api_property_types';
import Joi from 'joi';
import { isNullValue } from 'model/utils';
import { IOpenFilterValueNumber } from 'types/open/open_filter_types';

export type ICommonNumberField = INumberField | IRatingField | ICurrencyField | IPercentField | IAutoNumberField;
export const commonNumberFields = new Set([
  FieldType.Number,
  FieldType.Currency,
  FieldType.Percent,
  FieldType.Rating,
  FieldType.AutoNumber,
  FieldType.Formula,
]);

export const numberFormat = (cv: ICellValue, formatting?: IComputedFieldFormattingProperty) => {
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
  constructor(public override field: ICommonNumberField, state: IReduxState) {
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

  override showFOperatorDesc(type: FOperator) {
    return NumberBaseField.FOperatorDescMap[type];
  }

  get acceptFilterOperators(): FOperator[] {
    return NumberBaseField._acceptFilterOperators;
  }

  override get statTypeList(): StatType[] {
    return NumberBaseField._statTypeList;
  }

  get basicValueType(): BasicValueType {
    return BasicValueType.Number;
  }

  cellValueToString(_cellValue: ICellValue): string | null {
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

  override compare(cellValue1: number, cellValue2: number): number {
    return NumberBaseField._compare(cellValue1, cellValue2);
  }

  cellValueToStdValue(val: number | null): IStandardValue {
    const stdVal: IStandardValue = {
      sourceType: this.field.type,
      data: [],
    };

    if (val != null) {
      stdVal.data.push({
        // For fields related to Number type, ensure that the data source accuracy is accurate
        text: this.cellValueToString(val) || '',
        value: val,
      });
    }

    return stdVal;
  }

  // StandardValue -> CellValue needs to undergo data conversion, otherwise it will affect cell copying, filling and other operations
  stdValueToCellValue(stdVal: IStandardValue): number | null {
    const { data, sourceType } = stdVal;

    if (data.length === 0) {
      return null;
    }
    const { text, value } = data[0]!;
    // Convert from Number & Formula related fields
    if (commonNumberFields.has(sourceType) && this.validate(value)) {
      return value;
    }
    // other fields
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
    // TODO: Tidy up the logic here.
    // Field -> NumberBaseField -> [NumberField,RatingField,PercentField,CurrencyField] -> LookupField
    // + getVisibleRows will pre-validate if it is empty or not. Logically speaking, it should not be used, and all filter logic should go here.
    // + When implementing the field isMeetFilter, the unary operator should be judged in advance,
    // and then the polynomial operator should be processed. In this way,
    // the following processing of the comparison value will not affect the normal judgment logic.
    // + Now the field filter also needs to be provided to the single record of automation, and it is determined in advance if it is empty or not.
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

  override isMeetFilter(operator: FOperator, cellValue: number | null, conditionValue: Exclude<IFilterNumber, null>) {
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

  static _filterValueToOpenFilterValue(value: IFilterNumber): IOpenFilterValueNumber {
    const num = Number(value?.[0]);
    return isNaN(num) ? null : num;
  }

  override filterValueToOpenFilterValue(value: IFilterNumber): IOpenFilterValueNumber {
    return NumberBaseField._filterValueToOpenFilterValue(value);
  }

  static _openFilterValueToFilterValue(value: IOpenFilterValueNumber): IFilterNumber {
    return value === null ? null : [value.toString()];
  }

  override openFilterValueToFilterValue(value: IOpenFilterValueNumber): IFilterNumber {
    return NumberBaseField._openFilterValueToFilterValue(value);
  }

  static validateOpenFilterSchema = Joi.number().allow(null);

  static _validateOpenFilterValue(value: IOpenFilterValueNumber) {
    return NumberBaseField.validateOpenFilterSchema.validate(value);
  }

  override validateOpenFilterValue(value: IOpenFilterValueNumber) {
    return NumberBaseField._validateOpenFilterValue(value);
  }
}
