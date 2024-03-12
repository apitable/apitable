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

import { t, Strings } from '../../../exports/i18n';
import Joi from 'joi';
import { find, isString } from 'lodash';
import { isNullValue } from 'model/utils';
import { getFieldOptionColor } from 'model/color';
import { ICellValue } from 'model/record';
import { IReduxState } from '../../../exports/store/interfaces';
import { BasicValueType, FieldType, IField, ISelectFieldProperty, ISingleSelectField, IStandardValue } from 'types/field_types';
import { ISelectFieldBaseOpenValue } from 'types/field_types_open';
import { FOperator, IFilterCondition, IFilterSingleSelect } from 'types/view_types';
import { DatasheetActions } from '../../../commands_actions/datasheet';
import { isOptionId, SelectField } from './common_select_field';
import { IEffectOption, IWriteOpenSelectBaseFieldProperty } from 'types/open';
import { IOpenFilterValueSelect } from 'types/open/open_filter_types';

export class SingleSelectField extends SelectField {
  constructor(public override field: ISingleSelectField, public override state: IReduxState) {
    super(field, state);
  }

  static createDefault(fieldMap: { [fieldId: string]: IField }): ISingleSelectField {
    return {
      id: DatasheetActions.getNewFieldId(fieldMap),
      type: FieldType.SingleSelect,
      name: DatasheetActions.getDefaultFieldName(fieldMap),
      property: this.defaultProperty(),
    };
  }

  static cellValueSchema = Joi.custom((optionId: string, helpers) => {
    const field = helpers.prefs['context']?.['field'];

    if (!isString(optionId)) {
      return helpers.message({ en: 'option is not string' });
    }

    if (!(field.property as ISelectFieldProperty).options.some(option => option.id === optionId)) {
      return helpers.message({ en: 'option not exist field property' });
    }
    return optionId;
  }).allow(null).required();

  static openWriteValueSchema = Joi.custom((owv: string | ISelectFieldBaseOpenValue, helpers) => {
    const field = helpers.prefs['context']?.['field'];
    const optionIdOrName = isString(owv) ? owv : (owv.id || owv.name);
    if (!optionIdOrName) {
      return helpers.error('value format error');
    }
    if (!(field.property as ISelectFieldProperty).options.some(option => option.id === optionIdOrName || option.name === optionIdOrName)) {
      return helpers.error('option not exist field property');
    }
    return optionIdOrName;
  }).allow(null).required();

  validateCellValue(cv: ICellValue): Joi.ValidationResult {
    return SingleSelectField.cellValueSchema.validate(cv, { context: { field: this.field } });
  }

  validateOpenWriteValue(owv: string | ISelectFieldBaseOpenValue | null): Joi.ValidationResult {
    return SingleSelectField.openWriteValueSchema.validate(owv, { context: { field: this.field } });
  }

  override defaultValue(): string | null {
    const defaultValue = this.field.property.defaultValue as string | undefined;
    if (!defaultValue || !defaultValue.trim().length) {
      return null;
    }
    return defaultValue;
  }

  get basicValueType(): BasicValueType {
    return BasicValueType.String;
  }

  get openValueJsonSchema() {
    return {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          title: t(Strings.robot_variables_option_ID),
        },
        name: {
          type: 'string',
          title: t(Strings.robot_variables_option_name),
        },
        color: {
          type: 'object',
          title: t(Strings.robot_variables_option_color),
          properties: {
            name: {
              type: 'string',
              title: t(Strings.robot_variables_join_option_color_names),
            },
            value: {
              type: 'string',
              title: t(Strings.robot_variables_join_option_color_values),
            }
          }
        },
      }
    };
  }

  get acceptFilterOperators(): FOperator[] {
    return [
      FOperator.Is,
      FOperator.IsNot,
      FOperator.Contains,
      FOperator.DoesNotContain,
      FOperator.IsEmpty,
      FOperator.IsNotEmpty,
      FOperator.IsRepeat,
    ];
  }

  defaultValueForCondition(
    condition: IFilterCondition<FieldType.SingleSelect>,
  ): string | null {
    const { operator, value } = condition;
    if (operator === FOperator.Is || operator === FOperator.Contains) {
      // only one value will auto fill
      if (value && value.length === 1 && value[0] && this.validate(value[0])) {
        return value[0];
      }
      return null;
    }
    return null;
  }

  cellValueToStdValue(val: string | null): IStandardValue {
    const stdVal: IStandardValue = {
      sourceType: FieldType.SingleSelect,
      data: [],
    };

    if (val) {
      const option = find(this.field.property.options, opt => {
        return opt.id === val;
      }) as any;

      if (!option) {
        console.error(`option: ${val} is not in field property!`, this.field.property);
        return stdVal;
      }

      stdVal.data.push({
        text: option.name,
        id: option.id,
      });
    }

    return stdVal;
  }

  stdValueToCellValue(stdValue: IStandardValue) {
    // filter empty text
    const data = stdValue.data.filter(d => d.text);
    if (data.length === 0) {
      return null;
    }
    const currentOptionText = data[0]!.text;
    const option = this.field.property.options.find(opt => opt.name === currentOptionText);
    return option ? option.id : null;
  }

  cellValueToString(cellValue: string) {
    if (!cellValue) {
      return null;
    }
    const value = this.findOptionById(cellValue);
    return value ? value.name : null;
  }

  validate(value: any): value is string {
    return isString(value) && this.field.property.options.some(option => option.id === value);
  }

  override isMeetFilter(
    operator: FOperator, cellValue: string | null, conditionValue: Exclude<IFilterSingleSelect, null>,
  ) {
    if (operator === FOperator.IsEmpty) {
      return cellValue == null;
    }
    if (operator === FOperator.IsNotEmpty) {
      return cellValue != null;
    }
    switch (operator) {
      case FOperator.Is: {
        return Array.isArray(conditionValue) && cellValue === conditionValue[0];
      }

      case FOperator.IsNot: {
        return Array.isArray(conditionValue) && cellValue !== conditionValue[0];
      }

      case FOperator.Contains: {
        return Array.isArray(conditionValue) && conditionValue.some(value => value === cellValue);
      }

      case FOperator.DoesNotContain: {
        return !Array.isArray(conditionValue) || !conditionValue.some(value => value === cellValue);
      }

      default: {
        return super.isMeetFilter(operator, cellValue, conditionValue);
      }
    }
  }

  cellValueToApiStandardValue(cellValue: string): string | null {
    return this.cellValueToString(cellValue);
  }

  cellValueToApiStringValue(cellValue: string): string | null {
    return this.cellValueToString(cellValue);
  }

  cellValueToOpenValue(cellValue: string): ISelectFieldBaseOpenValue | null {
    if (!cellValue) {
      return null;
    }
    const value = this.findOptionById(cellValue);
    if (!value) {
      return null;
    }
    // FIXME: here's color need to transfer
    return { ...value, color: getFieldOptionColor(value.color) };
  }

  openWriteValueToCellValue(openWriteValue: string | ISelectFieldBaseOpenValue | null): string | null {
    if (isNullValue(openWriteValue)) {
      return null;
    }
    const fieldValue = typeof openWriteValue === 'string' ? openWriteValue : (openWriteValue.id || openWriteValue!.name);
    const option = this.field.property.options.find(option => (
      isOptionId(fieldValue as string) && fieldValue === option.id || fieldValue === option.name
    ));
    return option?.id ?? null;
  }

  static override openUpdatePropertySchema = Joi.object({
    options: Joi.array().items(Joi.object({
      id: Joi.string(),
      name: Joi.string().required(),
      color: Joi.number(),
    })).required(),
    defaultValue: Joi.string()
  }).required();

  override validateUpdateOpenProperty(updateProperty: IWriteOpenSelectBaseFieldProperty, effectOption?: IEffectOption): Joi.ValidationResult {
    const result = SingleSelectField.openUpdatePropertySchema.validate(updateProperty);
    if (result.error) {
      return result;
    }
    return this.validateWriteOpenOptionsEffect(updateProperty, effectOption);
  }

  override filterValueToOpenFilterValue(value: IFilterSingleSelect): IOpenFilterValueSelect {
    if (Array.isArray(value)) {
      const _value = value.filter(v => this.findOptionById(v));
      return _value.length ? _value[0]! : null;
    }
    return null;
  }

  override openFilterValueToFilterValue(value: IOpenFilterValueSelect): IFilterSingleSelect {
    if (value) {
      return this.findOptionById(value) ? [value] : null;
    }
    return null;
  }

  static validateOpenFilterSchema = Joi.string().allow(null);

  override validateOpenFilterValue(value: IOpenFilterValueSelect) {
    return SingleSelectField.validateOpenFilterSchema.validate(value);
  }
}
