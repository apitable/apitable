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
import { DatasheetActions } from '../../commands_actions/datasheet';
import { DateTimeBaseField } from './date_time_base_field';
import { DateFormat, FieldType, IDateTimeField, IDateTimeFieldProperty, IField, TimeFormat } from 'types/field_types';
import { IReduxState } from '../../exports/store/interfaces';
import { enumKeyToArray, enumToArray } from './validate_schema';
import { ICellValue } from 'model/record';
import dayjs from 'dayjs';
import { IOpenDateTimeFieldProperty } from 'types/open/open_field_read_types';
import { IUpdateOpenDateTimeFieldProperty } from 'types/open/open_field_write_types';
import { getUserTimeZone } from 'modules/user/store/selectors/user';
import { getFieldDefaultProperty } from './const';

export class DateTimeField extends DateTimeBaseField {
  constructor(public override field: IDateTimeField, public override state: IReduxState) {
    super(field, state);
  }

  static propertySchema = Joi.object({
    dateFormat: Joi.valid(...enumToArray(DateFormat)).required(),
    timeFormat: Joi.valid(...enumToArray(TimeFormat)).required(),
    includeTime: Joi.boolean().required(),
    autoFill: Joi.boolean().required(),
    timeZone: Joi.string(),
    includeTimeZone: Joi.boolean(),
  }).required();

  static cellValueSchema = Joi.number().custom((value, helpers) => {
    if (dayjs(value).isValid()) {
      return value;
    }
    return helpers.error('valid date');
  }, 'custom validation').allow(null).required();

  static openWriteValueSchema = Joi.custom((value: Date | string, helpers) => {
    if (dayjs(value).isValid()) {
      return value;
    }
    return helpers.error('valid date');
  }).allow(null).required();

  static defaultDateFormat: string = DateFormat[0]!;
  static defaultTimeFormat: string = TimeFormat[0]!;

  static createDefault(fieldMap: { [fieldId: string]: IField }): IDateTimeField {
    return {
      id: DatasheetActions.getNewFieldId(fieldMap),
      type: FieldType.DateTime,
      name: DatasheetActions.getDefaultFieldName(fieldMap),
      property: this.defaultProperty(),
    };
  }

  static defaultProperty(): IDateTimeFieldProperty {
    return getFieldDefaultProperty(FieldType.DateTime) as IDateTimeFieldProperty;
  }

  override defaultValue(): number | null {
    if (this.field.property.autoFill) {
      return Date.now();
    }
    return null;
  }

  /* Due to the need to traverse the DateTimeFormat enumeration value,
  but DateTimeFormat will have the form of keyValue and valueKey after compilation
    Need to filter out the case of number key */
  validateProperty() {
    return DateTimeField.propertySchema.validate(this.field.property);
  }

  validateCellValue(cv: ICellValue) {
    return DateTimeField.cellValueSchema.validate(cv);
  }

  validateOpenWriteValue(owv: string | Date | null) {
    return DateTimeField.openWriteValueSchema.validate(owv);
  }

  get includeTimeZone() {
    return this.field.property?.includeTimeZone;
  }

  get timeZone() {
    return this.field.property.timeZone || getUserTimeZone(this.state);
  }

  override get openFieldProperty(): IOpenDateTimeFieldProperty {
    const { autoFill, includeTime, dateFormat, timeFormat } = this.field.property;
    return {
      dateFormat: DateFormat[dateFormat]!,
      timeFormat: TimeFormat[timeFormat]!,
      autoFill,
      includeTime
    };
  }

  static openUpdatePropertySchema = Joi.object({
    dateFormat: Joi.valid(...enumKeyToArray(DateFormat)).required(),
    timeFormat: Joi.valid(...enumKeyToArray(TimeFormat)),
    includeTime: Joi.boolean(),
    autoFill: Joi.boolean(),
    timeZone: Joi.string(),
    includeTimeZone: Joi.boolean(),
  }).required();

  override validateUpdateOpenProperty(updateProperty: IUpdateOpenDateTimeFieldProperty) {
    return DateTimeField.openUpdatePropertySchema.validate(updateProperty);
  }

  override updateOpenFieldPropertyTransformProperty(openFieldProperty: IUpdateOpenDateTimeFieldProperty): IDateTimeFieldProperty {
    const { dateFormat, timeFormat, autoFill, includeTime } = openFieldProperty;
    const defaultProperty = DateTimeField.defaultProperty();
    return {
      dateFormat: DateFormat[dateFormat],
      timeFormat: timeFormat ? TimeFormat[timeFormat] : defaultProperty.timeFormat,
      autoFill: autoFill ?? defaultProperty.autoFill,
      includeTime: includeTime ?? defaultProperty.includeTime
    };
  }
}
