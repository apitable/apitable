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

import Joi from 'joi';
import { ICellValue } from '../record';
import { Field } from './field';
import { IFilterCondition, FOperator, IFilterCheckbox } from '../../types/view_types';
import {
  ICheckboxField, ICheckboxFieldProperty, IStandardValue,
  FieldType, IField, BasicValueType,
} from '../../types/field_types';
import { DatasheetActions } from '../../commands_actions/datasheet';
import { isEmpty } from 'lodash';
import { StatType } from './stat';
import { t, Strings } from '../../exports/i18n';
import { getEmojiIconNativeString, isNullValue } from 'model/utils';
import { IAPIMetaCheckboxFieldProperty } from 'types';
import { IOpenCheckboxFieldProperty } from 'types/open/open_field_read_types';
import { IUpdateOpenCheckboxFieldProperty } from 'types/open/open_field_write_types';
import { EmojisConfig } from 'config/emojis_config';
import { joiErrorResult } from './validate_schema';
import { IOpenFilterValueBoolean } from 'types/open/open_filter_types';
import { getFieldDefaultProperty } from './const';

const trueText = ['1', 'true', t(Strings.stat_checked)];
const falseText = ['0', 'false', t(Strings.stat_un_checked)];
export class CheckboxField extends Field {
  static propertySchema = Joi.object({
    icon: Joi.string().required(),
  }).required();

  static cellValueSchema = Joi.boolean().allow(null).required();

  static openWriteValueValueSchema = Joi.boolean().allow(null).required();

  static _statTypeList = [
    StatType.None,
    StatType.CountAll,
    StatType.Checked,
    StatType.UnChecked,
    StatType.PercentChecked,
    StatType.PercentUnChecked,
  ];

  static _acceptFilterOperators = [FOperator.Is];

  get apiMetaProperty(): IAPIMetaCheckboxFieldProperty {
    return {
      icon: getEmojiIconNativeString(this.field.property.icon),
    };
  }

  get openValueJsonSchema() {
    return {
      title: this.field.name,
      type: 'boolean',
    };
  }

  override get statTypeList(): StatType[] {
    return CheckboxField._statTypeList;
  }

  get basicValueType(): BasicValueType {
    return BasicValueType.Boolean;
  }

  get acceptFilterOperators(): FOperator[] {
    return CheckboxField._acceptFilterOperators;
  }

  static _isMeetFilter(operator: FOperator, cellValue: ICellValue, conditionValue: IFilterCondition['value']) {
    switch (operator) {
      case FOperator.Is:
        return Boolean(conditionValue) === Boolean(cellValue);
      default: {
        console.warn('Method should be overwrite!');
        return true;
      }
    }
  }

  override isMeetFilter(operator: FOperator, cellValue: ICellValue, conditionValue: IFilterCondition['value']) {
    return CheckboxField._isMeetFilter(operator, cellValue, conditionValue);
  }

  static defaultProperty(): ICheckboxFieldProperty {
    return getFieldDefaultProperty(FieldType.Checkbox) as ICheckboxFieldProperty;
  }

  static createDefault(fieldMap: { [fieldId: string]: IField }): ICheckboxField {
    return {
      id: DatasheetActions.getNewFieldId(fieldMap),
      type: FieldType.Checkbox,
      name: DatasheetActions.getDefaultFieldName(fieldMap),
      property: this.defaultProperty(),
    };
  }

  validateProperty() {
    return CheckboxField.propertySchema.validate(this.field.property);
  }

  validateCellValue(cv: ICellValue) {
    return CheckboxField.cellValueSchema.validate(cv);
  }

  validateOpenWriteValue(owv: boolean | null) {
    return CheckboxField.openWriteValueValueSchema.validate(owv);
  }

  cellValueToStdValue(cellValue: boolean): IStandardValue {
    return {
      sourceType: this.field.type,
      data: [{
        text: this.cellValueToString(cellValue) || '',
      }],
    };
  }

  stdValueToCellValue(stdValue: IStandardValue): boolean | null {
    if (isEmpty(stdValue) || isEmpty(stdValue.data)) {
      return null;
    }
    if (trueText.includes(stdValue.data[0]!.text)) {
      return true;
    }
    if (falseText.includes(stdValue.data[0]!.text)) {
      return null;
    }
    if (stdValue.data[0]!.text) {
      return true;
    }
    return null;
  }

  validate(value: any): boolean {
    if (value == null || typeof value === 'boolean') {
      return true;
    }
    return false;
  }

  cellValueToString(cellValue: ICellValue): string {
    return cellValue ? '1' : '0';
  }

  defaultValueForCondition(_condition: IFilterCondition<FieldType.Checkbox>): boolean | null {
    return true;
  }

  static _compare(cellValue1: ICellValue, cellValue2: ICellValue, _orderInCellValueSensitive?: boolean): number {
    return Boolean(cellValue1) === Boolean(cellValue2) ? 0 : (Boolean(cellValue1) > Boolean(cellValue2) ? 1 : -1);
  }

  override compare(cellValue1: ICellValue, cellValue2: ICellValue, orderInCellValueSensitive?: boolean): number {
    return CheckboxField._compare(cellValue1, cellValue2, orderInCellValueSensitive);
  }

  cellValueToApiStandardValue(cellValue: ICellValue): boolean | null {
    if (cellValue === true) {
      return true;
    }
    return null;
  }

  cellValueToApiStringValue(cellValue: ICellValue): string | null {
    return this.cellValueToString(cellValue);
  }
  cellValueToOpenValue(cellValue: ICellValue): boolean | null {
    if (cellValue === true) {
      return true;
    }
    return null;
  }

  openWriteValueToCellValue(openWriteValue: boolean | null) {
    if (isNullValue(openWriteValue)) {
      return null;
    }
    return openWriteValue;
  }

  override get openFieldProperty(): IOpenCheckboxFieldProperty {
    return {
      icon: getEmojiIconNativeString(this.field.property.icon),
    };
  }

  override validateUpdateOpenProperty(updateProperty: IUpdateOpenCheckboxFieldProperty) {
    const result = CheckboxField.propertySchema.validate(updateProperty);
    if (!result.error && !EmojisConfig[updateProperty.icon]) {
      return joiErrorResult('icon is not Emoji slug');
    }
    return result;
  }

  static _filterValueToOpenFilterValue(value: IFilterCheckbox): IOpenFilterValueBoolean {
    return value;
  }

  override filterValueToOpenFilterValue(value: IFilterCheckbox): IOpenFilterValueBoolean {
    return CheckboxField._filterValueToOpenFilterValue(value);
  }

  static _openFilterValueToFilterValue(value: IOpenFilterValueBoolean): IFilterCheckbox {
    return value;
  }

  override openFilterValueToFilterValue(value: IOpenFilterValueBoolean): IFilterCheckbox {
    return CheckboxField._openFilterValueToFilterValue(value);
  }

  static validateOpenFilterSchema = Joi.boolean().allow(null);

  static _validateOpenFilterValue(value: IOpenFilterValueBoolean) {
    return CheckboxField.validateOpenFilterSchema.validate(value);
  }

  override validateOpenFilterValue(value: IOpenFilterValueBoolean) {
    return CheckboxField._validateOpenFilterValue(value);
  }
}
