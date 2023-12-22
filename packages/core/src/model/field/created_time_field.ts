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
import dayjs from 'dayjs';
import { ICellValue } from 'model/record';
import { IRecord } from '../../exports/store/interfaces';
import {
  DateFormat, FieldType, ICreatedTimeField, ICreatedTimeFieldProperty, IField,
  TimeFormat
} from 'types/field_types';
import { DatasheetActions } from '../../commands_actions/datasheet';
import { DateTimeBaseField } from './date_time_base_field';
import { datasheetIdString, enumKeyToArray, enumToArray, joiErrorResult } from './validate_schema';
import { IOpenCreatedTimeFieldProperty } from 'types/open/open_field_read_types';
import { IUpdateOpenCreatedTimeFieldProperty } from 'types/open/open_field_write_types';
import { getFieldDefaultProperty } from './const';

export class CreatedTimeField extends DateTimeBaseField {
  static propertySchema = Joi.object({
    datasheetId: datasheetIdString().required(),
    dateFormat: Joi.string().allow(...enumToArray(DateFormat)).required(),
    timeFormat: Joi.string().allow(...enumToArray(TimeFormat)).required(),
    includeTime: Joi.boolean().required(),
    timeZone: Joi.string(),
    includeTimeZone: Joi.boolean(),
  }).required();
  static defaultDateFormat: string = DateFormat[0]!;
  static defaultTimeFormat: string = TimeFormat[0]!;

  static createDefault(fieldMap: { [fieldId: string]: IField }): ICreatedTimeField {
    return {
      id: DatasheetActions.getNewFieldId(fieldMap),
      type: FieldType.CreatedTime,
      name: DatasheetActions.getDefaultFieldName(fieldMap),
      property: this.defaultProperty(),
    };
  }

  static defaultProperty(): ICreatedTimeFieldProperty {
    return getFieldDefaultProperty(FieldType.CreatedTime) as ICreatedTimeFieldProperty;
  }

  override get isComputed() {
    return true;
  }

  override recordEditable() {
    return false;
  }

  validateProperty() {
    return CreatedTimeField.propertySchema.validate(this.field.property);
  }

  validateCellValue() {
    return joiErrorResult("computed field shouldn't validate cellValue");
  }

  validateOpenWriteValue() {
    return joiErrorResult("computed field shouldn't validate cellValue");
  }

  override stdValueToCellValue(): null {
    return null;
  }

  getCellValue(record: IRecord): ICellValue {
    const createdAt = record.recordMeta?.createdAt;
    return createdAt == null ? null : dayjs(createdAt).valueOf();
  }

  override get openFieldProperty(): IOpenCreatedTimeFieldProperty {
    const { includeTime, dateFormat, timeFormat } = this.field.property;
    return {
      dateFormat: DateFormat[dateFormat]!,
      timeFormat: TimeFormat[timeFormat]!,
      includeTime
    };
  }

  static openUpdatePropertySchema = Joi.object({
    dateFormat: Joi.valid(...enumKeyToArray(DateFormat)).required(),
    timeFormat: Joi.valid(...enumKeyToArray(TimeFormat)),
    includeTime: Joi.boolean(),
    timeZone: Joi.string(),
    includeTimeZone: Joi.boolean(),
  }).required();

  override validateUpdateOpenProperty(updateProperty: IUpdateOpenCreatedTimeFieldProperty) {
    return CreatedTimeField.openUpdatePropertySchema.validate(updateProperty);
  }

  override updateOpenFieldPropertyTransformProperty(openFieldProperty: IUpdateOpenCreatedTimeFieldProperty): ICreatedTimeFieldProperty {
    const { dateFormat, timeFormat, includeTime } = openFieldProperty;
    const defaultProperty = CreatedTimeField.defaultProperty();
    return {
      datasheetId: (this.field.property as ICreatedTimeFieldProperty).datasheetId,
      dateFormat: DateFormat[dateFormat],
      timeFormat: timeFormat ? TimeFormat[timeFormat] : defaultProperty.timeFormat,
      includeTime: includeTime ?? defaultProperty.includeTime
    };
  }
}
