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

import { Strings, t } from '../../../exports/i18n';
import Joi from 'joi';
import { find, isArray, isString, uniq, uniqBy } from 'lodash';
import { getFieldOptionColor } from 'model/color';
import { ICellValue } from 'model/record';
import { handleEmptyCellValue, isNullValue } from 'model/utils';
import { IReduxState } from '../../../exports/store/interfaces';
import { BasicValueType, FieldType, IField, IMultiSelectField, ISelectFieldProperty, IStandardValue } from 'types/field_types';
import { ISelectFieldBaseOpenValue } from 'types/field_types_open';
import { IEffectOption, IWriteOpenSelectBaseFieldProperty } from 'types/open';
import { FOperator, IFilterCondition, IFilterMultiSelect } from 'types/view_types';
import { hasIntersect, isSameSet, isSelectType } from 'utils';
import { DatasheetActions } from '../../../commands_actions/datasheet';
import { isOptionId, SelectField } from './common_select_field';
import { IOpenFilterValueMultiSelect } from 'types/open/open_filter_types';

export class MultiSelectField extends SelectField {
  constructor(public override field: IMultiSelectField, public override state: IReduxState) {
    super(field, state);
  }

  static createDefault(fieldMap: { [fieldId: string]: IField }): IMultiSelectField {
    return {
      id: DatasheetActions.getNewFieldId(fieldMap),
      type: FieldType.MultiSelect,
      name: DatasheetActions.getDefaultFieldName(fieldMap),
      property: this.defaultProperty(),
    };
  }

  static cellValueSchema = Joi.custom((optionIds: string[], helpers) => {
    const field = helpers.prefs['context']?.['field'];
    if (!isArray(optionIds)) {
      return helpers.message({ en: 'cellValue is not array' });
    }
    if (!optionIds.every(id => (field.property as ISelectFieldProperty).options.some(option => option.id === id))) {
      return helpers.message({ en: 'option not exist field property' });
    }
    return optionIds;
  }).allow(null).required();

  static openWriteValueSchema = Joi.array().custom((owv: string[] | ISelectFieldBaseOpenValue[], helpers) => {
    const field = helpers.prefs['context']?.['field'];
    const optionIdsOrNames = (owv as any).map((v: string | ISelectFieldBaseOpenValue) => isString(v) ? v : (v.id || v.name));
    if (!optionIdsOrNames) {
      return helpers.error('value format error');
    }
    if ((field.property as ISelectFieldProperty).options.every(option => option.id === optionIdsOrNames || option.name === optionIdsOrNames)) {
      return helpers.error('option not exist field property');
    }
    return optionIdsOrNames;
  }).allow(null).required();

  validateCellValue(cv: ICellValue): Joi.ValidationResult {
    return MultiSelectField.cellValueSchema.validate(cv, { context: { field: this.field } });
  }

  validateOpenWriteValue(owv: string[] | ISelectFieldBaseOpenValue[] | null): Joi.ValidationResult {
    return MultiSelectField.openWriteValueSchema.validate(owv, { context: { field: this.field } });
  }

  override defaultValue(): string[] | null {
    const defaultValue = this.field.property.defaultValue as string[] | undefined;
    if (!defaultValue || !defaultValue.length) {
      return null;
    }
    return defaultValue;
  }

  get basicValueType(): BasicValueType {
    return BasicValueType.Array;
  }

  override get innerBasicValueType() {
    return BasicValueType.String;
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

  get openValueJsonSchema() {
    return {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            title: t(Strings.robot_variables_join_option_IDs)
          },
          name: {
            type: 'string',
            title: t(Strings.robot_variables_join_option_names),
          },
          color: {
            type: 'object',
            title: t(Strings.robot_variables_join_option_colors),
            properties: {
              name: {
                type: 'string',
                title: t(Strings.robot_variables_join_color_names),
              },
              value: {
                type: 'string',
                title: t(Strings.robot_variables_join_color_values),
              }
            }
          },
        },
      }
    };
  }

  override isMultiValueField() {
    return true;
  }

  defaultValueForCondition(
    condition: IFilterCondition<FieldType.MultiSelect>,
  ): string[] | null {
    const { value } = condition;
    if (condition.operator === FOperator.Is) {
      if (!value || value.length === 0) {
        return null;
      }

      const result = value.reduce((prev, v) => {
        if (this.validate([v])) {
          prev.push(v);
        }
        return prev;
      }, [] as string[]);
      return result.length === value.length ? result : null;
    }

    if (condition.operator === FOperator.Contains) {
      // `contains` only fills in when there is only one value
      if (value && value.length === 1 && value[0] && this.validate([value[0]])) {
        return [value[0]];
      }
      return null;
    }
    return null;
  }

  override compare(cellValue1: string[] | null, cellValue2: string[] | null, orderInCellValueSensitive?: boolean) {
    // grouping sort
    if (!orderInCellValueSensitive) {
      const sortCellValue1 = this.sortValueByOptionOrder(cellValue1);
      const sortCellValue2 = this.sortValueByOptionOrder(cellValue2);
      return super.compare(sortCellValue1, sortCellValue2);
    }
    return super.compare(cellValue1, cellValue2);
  }

  override isMeetFilter(
    operator: FOperator,
    cellValue: string[] | null,
    conditionValue: Exclude<IFilterMultiSelect, null>,
  ) {
    switch (operator) {
      case FOperator.Is: {
        return cellValue != null && isSameSet(cellValue, conditionValue);
      }

      case FOperator.IsNot: {
        return cellValue == null || !isSameSet(cellValue, conditionValue);
      }

      case FOperator.Contains: {
        return cellValue != null && hasIntersect(cellValue, conditionValue);
      }

      case FOperator.DoesNotContain: {
        return cellValue == null || !hasIntersect(cellValue, conditionValue);
      }

      default: {
        return super.isMeetFilter(operator, cellValue, conditionValue);
      }
    }
  }

  cellValueToStdValue(val: string[] | null): IStandardValue {
    const stdVal: IStandardValue = {
      sourceType: FieldType.MultiSelect,
      data: [],
    };

    if (Array.isArray(val)) {
      stdVal.data = val.map(currOptId => {
        const option = find(this.field.property.options, opt => {
          return opt.id === currOptId;
        }) as any;
        return {
          text: option.name,
          id: option.id,
        };
      });
    }

    return stdVal;
  }

  stdValueToCellValue(stdValue: IStandardValue): string[] | null {
    // filter the empty text
    let data = stdValue.data.filter(d => d.text);
    data = uniqBy(data, 'text');
    const isSelect2multi = isSelectType(stdValue.sourceType);
    const ids = data.reduce((ids, { text }) => {
      const textTmp = isSelect2multi ? [text] : uniq(text.split(/, ?/));
      textTmp.forEach(text => {
        const option = this.field.property.options.find(option => option.name === text);
        if (option) {
          ids.push(option.id);
        }
      });
      return ids;
    }, [] as string[]);
    return handleEmptyCellValue(ids, this.basicValueType);
  }

  cellValueToString(cellValue: string[]): string | null {
    return this.arrayValueToString(this.cellValueToArray(cellValue));
  }

  cellValueToArray(cellValue: string[]): string[] | null {
    if (!cellValue) {
      return null;
    }
    const result: string[] = [];
    for (let i = 0, l = cellValue.length; i < l; i++) {
      const option = this.findOptionById(cellValue[i]!);
      if (option) {
        result.push(option.name);
      }
    }
    return handleEmptyCellValue(result, this.basicValueType);
  }

  arrayValueToString(cellValues: string[] | null): string | null {
    return cellValues && cellValues.length ? cellValues.join(', ') : null;
  }

  // sort vales by option ascending order
  sortValueByOptionOrder(value: string[] | null) {
    if (!value) {
      return null;
    }

    const mapOptions = this.getMapOption(this.field.property.options);

    return Array.from(value).sort((id1, id2) => {
      const idx1 = mapOptions.get(id1) as number;
      const idx2 = mapOptions.get(id2) as number;
      return idx1 - idx2;
    });
  }

  validate(value: any): value is string[] {
    return isArray(value) && value.every(id => this.field.property.options.some(option => option.id === id));
  }

  cellValueToApiStandardValue(cellValue: string[]): string[] | null {
    return this.cellValueToArray(cellValue);
  }

  cellValueToApiStringValue(cellValue: string[]): string | null {
    return this.cellValueToString(cellValue);
  }

  cellValueToOpenValue(cellValue: string[]): ISelectFieldBaseOpenValue[] | null {
    if (!cellValue) {
      return null;
    }
    const optionMap = this.getMapOption(this.field.property.options);
    return cellValue.reduce((prev, curr) => {
      if (optionMap.has(curr)) {
        const optionIndex = optionMap.get(curr) as number;
        const option = this.field.property.options[optionIndex]!;
        prev.push({
          id: option.id,
          name: option.name,
          color: getFieldOptionColor(option.color)
        });
      }
      return prev;
    }, [] as ISelectFieldBaseOpenValue[]);
  }

  openWriteValueToCellValue(openWriteValue: string[] | ISelectFieldBaseOpenValue[] | null): string[] | null {
    if (isNullValue(openWriteValue)) {
      return null;
    }
    const isSimple = openWriteValue.length && typeof openWriteValue[0] === 'string';
    const writeValue = isSimple ? openWriteValue as string[] : (openWriteValue as ISelectFieldBaseOpenValue[]).map(v => v.id || v.name);
    const optionIds: string[] = [];
    writeValue.forEach(value => {
      this.field.property.options.forEach(option => {
        if (isOptionId(value) && value === option.id) {
          optionIds.push(option.id);
        } else if (value === option.name) {
          optionIds.push(option.id);
        }
      });
    });
    return optionIds;
  }

  static override openUpdatePropertySchema = Joi.object({
    options: Joi.array().items(Joi.object({
      id: Joi.string(),
      name: Joi.string().required(),
      color: Joi.number(),
    })).required(),
    defaultValue: Joi.array().items(Joi.string())
  }).required();

  override validateUpdateOpenProperty(updateProperty: IWriteOpenSelectBaseFieldProperty, effectOption?: IEffectOption): Joi.ValidationResult {
    const result = MultiSelectField.openUpdatePropertySchema.validate(updateProperty);
    if (result.error) {
      return result;
    }
    return this.validateWriteOpenOptionsEffect(updateProperty, effectOption);
  }

  override filterValueToOpenFilterValue(value: IFilterMultiSelect): IOpenFilterValueMultiSelect {
    if (Array.isArray(value)) {
      const _value = value.filter(v => this.findOptionById(v));
      return _value.length ? _value : null;
    }
    return value;
  }

  override openFilterValueToFilterValue(value: IOpenFilterValueMultiSelect): IFilterMultiSelect {
    if (Array.isArray(value)) {
      const _value = value.filter(v => this.findOptionById(v));
      return _value.length ? _value : null;
    }
    return value;
  }

  static validateOpenFilterSchema = Joi.array().items(Joi.string()).allow(null);

  override validateOpenFilterValue(value: IOpenFilterValueMultiSelect) {
    return MultiSelectField.validateOpenFilterSchema.validate(value);
  }
}
