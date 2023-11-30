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

import { getComputeRefManager } from 'compute_manager';
import { getSnapshot } from 'modules/database/store/selectors/resource/datasheet/base';
import { getUserTimeZone } from 'modules/user/store/selectors/user';
import { ExpCache, FormulaBaseError, parse } from 'formula_parser';
import Joi from 'joi';
import { isEmpty } from 'lodash';
import { ValueTypeMap } from 'model/constants';
import { ICellToStringOption, ICellValue } from 'model/record';
import { computedFormattingToFormat } from 'model/utils';
import { getApiMetaPropertyFormat } from 'model/field/utils';
import {
  FOperator,
  FOperatorDescMap,
  IAPIMetaFormulaFieldProperty,
  IAPIMetaNoneStringValueFormat,
  IFilterCheckbox,
  IFilterCondition,
  IFilterDateTime,
  IFilterText
} from 'types';
import {
  BasicValueType,
  FieldType,
  IComputedFieldFormattingProperty,
  IDateTimeFieldProperty,
  IFormulaField,
  IFormulaProperty,
  IStandardValue,
  ITimestamp,
} from 'types/field_types';
import { IOpenFormulaFieldProperty } from 'types/open/open_field_read_types';
import { IUpdateOpenFormulaFieldProperty } from 'types/open/open_field_write_types';
import {
  IOpenFilterValue,
  IOpenFilterValueBoolean,
  IOpenFilterValueDataTime,
  IOpenFilterValueNumber,
  IOpenFilterValueString
} from 'types/open/open_filter_types';
import { isClient } from 'utils/env';
import { IReduxState } from '../../exports/store/interfaces';
import { CheckboxField } from './checkbox_field';
import { DateTimeBaseField, dateTimeFormat } from './date_time_base_field';
import { ArrayValueField } from './array_field';
import { NumberBaseField, numberFormat } from './number_base_field';
import { StatTranslate, StatType } from './stat';
import { TextBaseField } from './text_base_field';
import { computedFormatting, computedFormattingStr, datasheetIdString, joiErrorResult } from './validate_schema';
import { getFieldDefaultProperty } from './const';

export class FormulaField extends ArrayValueField {
  constructor(public override field: IFormulaField, public override state: IReduxState) {
    super(field, state);
  }

  static propertySchema = Joi.object({
    datasheetId: datasheetIdString().required(),
    expression: Joi.string().allow('').required(),
    formatting: computedFormatting(),
  }).required();

  validateProperty() {
    return FormulaField.propertySchema.validate(this.field.property);
  }

  validateCellValue() {
    return joiErrorResult('computed field shouldn\'t validate cellValue');
  }

  validateOpenWriteValue() {
    return joiErrorResult('computed field shouldn\'t validate cellValue');
  }

  get apiMetaPropertyFormat(): IAPIMetaNoneStringValueFormat | null {
    return getApiMetaPropertyFormat(this);
  }

  get apiMetaProperty(): IAPIMetaFormulaFieldProperty {
    const res: IAPIMetaFormulaFieldProperty = {
      expression: this.field.property.expression,
      valueType: this.basicValueType,
      hasError: this.hasError,
    };
    if (this.apiMetaPropertyFormat) {
      res.format = this.apiMetaPropertyFormat;
    }
    return res;
  }

  get openValueJsonSchema() {
    switch (this.basicValueType) {
      case BasicValueType.Number:
      case BasicValueType.String:
      case BasicValueType.DateTime:
      case BasicValueType.Boolean:
        return {
          type: ValueTypeMap[this.basicValueType],
          title: this.field.name,
        };
      case BasicValueType.Array:
        const innerBasicValueType = this.innerBasicValueType;
        return {
          type: 'array',
          title: this.field.name,
          items: {
            type: ValueTypeMap[innerBasicValueType],
            title: 'sub project'
          }
        };
      default:
        // By default, it is processed as string
        return {
          type: 'string',
          title: this.field.name,
        };
    }
  }

  getParseResult() {
    const snapshot = getSnapshot(this.state, this.field.property.datasheetId);
    const fieldMap = snapshot?.meta.fieldMap!;
    return parse(this.field.property.expression, { field: this.field, fieldMap, state: this.state });
  }

  override get hasError(): boolean {
    const { datasheetId, expression } = this.field.property;
    const cacheResult = ExpCache.get(datasheetId, this.field.id, expression);
    if (isClient()) {
      const computeRefManager = getComputeRefManager(this.state);
      if (!computeRefManager.checkRef(`${datasheetId}-${this.field.id}`)) {
        return true;
      }
    }

    return Boolean(cacheResult && 'error' in cacheResult);
  }

  override get statTypeList() {
    switch (this.valueType) {
      case BasicValueType.Number:
        return NumberBaseField._statTypeList;
      case BasicValueType.Boolean:
        return CheckboxField._statTypeList;
      case BasicValueType.DateTime:
        return DateTimeBaseField._statTypeList;
      case BasicValueType.String:
        return TextBaseField._statTypeList;
      default:
        return TextBaseField._statTypeList;
    }
  }

  get basicValueType(): BasicValueType {
    const formulaExpr = this.getParseResult();
    if ('error' in formulaExpr) {
      return BasicValueType.String;
    }

    return formulaExpr.ast.valueType;
  }

  override get innerBasicValueType(): BasicValueType {
    const formulaExpr = this.getParseResult();
    if ('error' in formulaExpr) {
      return BasicValueType.String;
    }

    return formulaExpr.ast.innerValueType || BasicValueType.String;
  }

  override showFOperatorDesc(type: FOperator) {
    switch (this.valueType) {
      case BasicValueType.Number:
        return NumberBaseField.FOperatorDescMap[type];
      case BasicValueType.Boolean:
        return FOperatorDescMap[type];
      case BasicValueType.String:
        return FOperatorDescMap[type];
      case BasicValueType.DateTime:
        return DateTimeBaseField.FOperatorDescMap[type];
      default:
        return '';
    }
  }

  override get acceptFilterOperators(): FOperator[] {
    switch (this.valueType) {
      case BasicValueType.Number:
        return NumberBaseField._acceptFilterOperators;
      case BasicValueType.Boolean:
        return CheckboxField._acceptFilterOperators;
      case BasicValueType.String:
        return TextBaseField._acceptFilterOperators;
      case BasicValueType.DateTime:
        return DateTimeBaseField._acceptFilterOperators;
      default:
        return [];
    }
  }

  override get isComputed() {
    return true;
  }

  // getExpression2Display() {
  //   const
  //   this.field.property.expression;
  // }

  static defaultProperty() {
    return getFieldDefaultProperty(FieldType.Formula) as IFormulaProperty;
  }

  override compare(cv1: ICellValue, cv2: ICellValue, orderInCellValueSensitive?: boolean) {
    // Compatible with sorting formula error
    const isCv1Error = cv1 instanceof FormulaBaseError;
    const isCv2Error = cv2 instanceof FormulaBaseError;
    if (isCv1Error && isCv2Error) {
      return 0;
    }
    if (isCv1Error && !isCv2Error) {
      return -1;
    }
    if (!isCv1Error && isCv2Error) {
      return 1;
    }
    switch (this.valueType) {
      case BasicValueType.Number:
        return NumberBaseField._compare(cv1 as number, cv2 as number);
      case BasicValueType.DateTime:
        return DateTimeBaseField._compare(cv1 as ITimestamp, cv2 as ITimestamp,
          this.field.property.formatting as IDateTimeFieldProperty);
      case BasicValueType.Boolean:
        return CheckboxField._compare(cv1, cv2, orderInCellValueSensitive);
      default:
        return super.compare(cv1, cv2, orderInCellValueSensitive);
    }
  }

  override recordEditable() {
    return false;
  }

  cellValueToStdValue(cellValue: string | number | null): IStandardValue {
    const stdValue: IStandardValue = {
      sourceType: this.field.type,
      data: [],
    };

    if (cellValue != null) {
      stdValue.data.push({
        text: this.cellValueToString(cellValue) || '',
        value: cellValue
      });
    }

    return stdValue;
  }

  cellValueToArray(cellValue: any) {
    return cellValue;
  }

  arrayValueToString(cellValue: any, options?: ICellToStringOption): string | null {
    if (Array.isArray(cellValue)) {
      const vArray = this.arrayValueToArrayStringValueArray(cellValue, options);
      return vArray == null ? null : vArray.join(', ');
    }
    return String(cellValue);
  }

  arrayValueToArrayStringValueArray(cellValue: any[], _options?: ICellToStringOption) {
    return (cellValue as any[]).map(cv => {
      switch (this.innerBasicValueType) {
        case BasicValueType.Number:
        case BasicValueType.Boolean: {
          return numberFormat(cv, this.field.property?.formatting);
        }
        case BasicValueType.DateTime:
          return dateTimeFormat(cv, this.field.property.formatting as any, getUserTimeZone(this.state));
        case BasicValueType.String:
          return String(cv);
        default:
          return String(cv);
      }
    });
  }

  stdValueToCellValue(_stdField: IStandardValue): null {
    return null;
  }

  validate(_value: any): _value is string | number {
    return true;
  }

  defaultValueForCondition(_condition: IFilterCondition<FieldType.Text>): null {
    return null;
  }

  cellValueToString(cellValue: ICellValue, options?: ICellToStringOption): string | null {
    if (cellValue == null) {
      return null;
    }
    switch (this.basicValueType) {
      case BasicValueType.Number:
      case BasicValueType.Boolean: {
        return numberFormat(cellValue, this.field.property?.formatting);
      }
      case BasicValueType.DateTime:
        return dateTimeFormat(cellValue, this.field.property.formatting as any, getUserTimeZone(this.state));
      case BasicValueType.String:
        return String(cellValue);
      case BasicValueType.Array: {
        return this.arrayValueToString(cellValue, options);
      }
      default:
        return null;
    }
  }

  override isMeetFilter(operator: FOperator, cellValue: ICellValue, conditionValue: Exclude<any, null>) {
    const innerBasicValueTypeFilter = (cv: ICellValue) => {
      switch (this.innerBasicValueType) {
        case BasicValueType.Number:
          return NumberBaseField._isMeetFilter(operator, cv as number | null, conditionValue);
        case BasicValueType.Boolean:
          return CheckboxField._isMeetFilter(operator, cv, conditionValue);
        case BasicValueType.DateTime:
          return DateTimeBaseField._isMeetFilter(operator, cv as number | null, conditionValue);
        case BasicValueType.String:
          return TextBaseField._isMeetFilter(operator, this.cellValueToString(cv), conditionValue);
        default:
          return false;
      }
    };
    switch (this.basicValueType) {
      case BasicValueType.Number:
        return NumberBaseField._isMeetFilter(operator, cellValue as number | null, conditionValue);
      case BasicValueType.Boolean:
        return CheckboxField._isMeetFilter(operator, cellValue, conditionValue);
      case BasicValueType.DateTime:
        return DateTimeBaseField._isMeetFilter(operator, cellValue as number | null, conditionValue);
      case BasicValueType.String:
        return TextBaseField._isMeetFilter(operator, this.cellValueToString(cellValue), conditionValue);
      case BasicValueType.Array:
        switch (operator) {
          // The filter operation of negative semantics requires that each item in the array satisfies
          case FOperator.DoesNotContain:
          case FOperator.IsNot:
          case FOperator.IsEmpty:
            if (isEmpty(cellValue)) {
              return true;
            }
            return (cellValue as ICellValue[]).every(innerBasicValueTypeFilter);
          default:
            if (isEmpty(cellValue)) {
              return false;
            }
            return (cellValue as ICellValue[]).some(innerBasicValueTypeFilter);
        }
      default:
        return false;
    }
  }

  override statType2text(type: StatType): string {
    switch (this.valueType) {
      case BasicValueType.DateTime:
        return DateTimeBaseField._statType2text(type);
      case BasicValueType.Number:
      case BasicValueType.Boolean:
      case BasicValueType.String:
        return StatTranslate[type];
      default:
        return '';
    }
  }

  cellValueToApiStandardValue(cellValue: ICellValue): ICellValue | null {
    return cellValue;
  }

  cellValueToApiStringValue(cellValue: ICellValue): string | null {
    return this.cellValueToString(cellValue);
  }

  cellValueToOpenValue(
    cellValue: null | string | number | boolean | string[] | number[] | boolean[]):
    null | string | number | boolean | string[] | number[] | boolean[] {
    return cellValue;
  }

  openWriteValueToCellValue() {
    return null;
  }

  override get openFieldProperty(): IOpenFormulaFieldProperty {
    const res: IOpenFormulaFieldProperty = {
      expression: this.field.property.expression,
      valueType: this.basicValueType,
      hasError: this.hasError,
    };
    if (this.apiMetaPropertyFormat) {
      res.format = this.apiMetaPropertyFormat;
    }
    return res;
  }

  static openUpdatePropertySchema = Joi.object({
    expression: Joi.string(),
    format: computedFormattingStr(),
  }).required();

  override validateUpdateOpenProperty(updateProperty: IUpdateOpenFormulaFieldProperty) {
    return FormulaField.openUpdatePropertySchema.validate(updateProperty);
  }

  override updateOpenFieldPropertyTransformProperty(openFieldProperty: IUpdateOpenFormulaFieldProperty): IFormulaProperty {
    const { expression, format } = openFieldProperty;
    const formatting: IComputedFieldFormattingProperty | undefined = format ? computedFormattingToFormat(format) : undefined;
    return {
      datasheetId: this.field.property.datasheetId,
      expression: expression || '',
      formatting
    };

  }

  override filterValueToOpenFilterValue(value: IFilterText | IFilterCheckbox | IFilterDateTime): IOpenFilterValue {
    switch (this.valueType) {
      case BasicValueType.Number:
        return NumberBaseField._filterValueToOpenFilterValue(value as IFilterText);
      case BasicValueType.Boolean:
        return CheckboxField._filterValueToOpenFilterValue(value as IFilterCheckbox);
      case BasicValueType.String:
        return TextBaseField._filterValueToOpenFilterValue(value as IFilterText);
      case BasicValueType.DateTime:
        return DateTimeBaseField._filterValueToOpenFilterValue(value as IFilterDateTime);
      default:
        return null;
    }
  }

  override openFilterValueToFilterValue(value: IOpenFilterValue): IFilterText | IFilterCheckbox | IFilterDateTime {
    switch (this.valueType) {
      case BasicValueType.Number:
        return NumberBaseField._openFilterValueToFilterValue(value as IOpenFilterValueNumber);
      case BasicValueType.Boolean:
        return CheckboxField._openFilterValueToFilterValue(value as IOpenFilterValueBoolean);
      case BasicValueType.String:
        return TextBaseField._openFilterValueToFilterValue(value as IOpenFilterValueString);
      case BasicValueType.DateTime:
        return DateTimeBaseField._openFilterValueToFilterValue(value as IOpenFilterValueDataTime);
      default:
        return null;
    }
  }

  override validateOpenFilterValue(value: IOpenFilterValue) {
    switch (this.valueType) {
      case BasicValueType.Number:
        return NumberBaseField._validateOpenFilterValue(value as IOpenFilterValueNumber);
      case BasicValueType.Boolean:
        return CheckboxField._validateOpenFilterValue(value as IOpenFilterValueBoolean);
      case BasicValueType.String:
        return TextBaseField._validateOpenFilterValue(value as IOpenFilterValueString);
      case BasicValueType.DateTime:
        return DateTimeBaseField._validateOpenFilterValue(value as IOpenFilterValueDataTime);
      default:
        return joiErrorResult('formula no support Array filter');
    }
  }
}
