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
import { isNumber } from 'lodash';
import { ICellValue } from 'model/record';
import { FieldType, IField, IRatingField, IStandardValue } from 'types/field_types';
import { str2number } from 'utils/convert';
import { DatasheetActions } from '../../commands_actions/datasheet';
import { NumberBaseField, commonNumberFields } from './number_base_field';
import { IReduxState } from '../../exports/store/interfaces';
import { FOperator, IFilterNumber } from 'types';
import { getEmojiIconNativeString } from 'model/utils';
import { IOpenRatingFieldProperty } from 'types/open/open_field_read_types';
import { IUpdateOpenRatingFieldProperty } from 'types/open/open_field_write_types';
import { EmojisConfig } from 'config/emojis_config';
import { joiErrorResult } from './validate_schema';
import { getFieldDefaultProperty } from './const';

export class RatingField extends NumberBaseField {
  constructor(public override field: IRatingField, state: IReduxState) {
    super(field, state);
  }

  static propertySchema = Joi.object({
    icon: Joi.string().required(),
    max: Joi.number().min(0).max(10).required(),
  }).required();

  validateProperty() {
    return RatingField.propertySchema.validate(this.field.property);
  }

  override get apiMetaProperty() {
    return {
      icon: getEmojiIconNativeString(this.field.property.icon),
      max: this.field.property.max,
    };
  }

  static createDefault(fieldMap: { [fieldId: string]: IField }): IRatingField {
    return {
      id: DatasheetActions.getNewFieldId(fieldMap),
      type: FieldType.Rating,
      name: DatasheetActions.getDefaultFieldName(fieldMap),
      property: this.defaultProperty(),
    };
  }

  static defaultProperty() {
    return getFieldDefaultProperty(FieldType.Rating) as IOpenRatingFieldProperty;
  }

  override cellValueToString(cellValue: ICellValue): string | null {
    if (this.validate(cellValue)) {
      return cellValue.toString();
    }
    return null;
  }

  override stdValueToCellValue(stdVal: IStandardValue): number | null {
    const { data, sourceType } = stdVal;

    if (data.length === 0) {
      return null;
    }
    const cValue = commonNumberFields.has(sourceType) ? data[0]!.value : str2number(data[0]!.text);
    if (!cValue) return null;
    if (cValue && cValue >= this.field.property.max) return this.field.property.max;
    if (cValue != null && cValue < 1) return null;
    return parseInt(cValue, 10);
  }

  /**
   * Cancel the verification of property.max, and call cellValueToString during statistics.
   * The result of the summation may be greater than max. Values exceeding max have been handled at the UI layer.
   */
  override validate(value: any): value is number {
    // && value <= this.field.property.max
    return isNumber(value) && !Number.isNaN(value) && value > 0;
  }

  override isMeetFilter(operator: FOperator, cellValue: number | null, conditionValue: Exclude<IFilterNumber, null>) {
    if (conditionValue == null) {
      // Score filter null == 0
      const filterValue = 0;
      const cv = cellValue || 0;
      switch (operator) {
        case FOperator.Is:
          return cellValue === conditionValue;
        case FOperator.IsNot:
          return cellValue !== conditionValue;
        case FOperator.IsGreater:
          return cv > filterValue;
        case FOperator.IsGreaterEqual:
          return cv >= filterValue;
        case FOperator.IsLess:
          return cv < filterValue;
        case FOperator.IsLessEqual:
          return cv <= filterValue;
        default:
          return NumberBaseField._isMeetFilter(operator, cellValue, conditionValue);
      }
    }
    return NumberBaseField._isMeetFilter(operator, cellValue, conditionValue);
  }

  override get openFieldProperty(): IOpenRatingFieldProperty {
    const { max, icon } = this.field.property;
    return {
      icon: getEmojiIconNativeString(icon),
      max,
    };
  }

  override validateUpdateOpenProperty(updateProperty: IUpdateOpenRatingFieldProperty) {
    const result = RatingField.propertySchema.validate(updateProperty);
    if (!result.error && !EmojisConfig[updateProperty.icon]) {
      return joiErrorResult('icon is not Emoji slug');
    }
    return result;
  }
}
