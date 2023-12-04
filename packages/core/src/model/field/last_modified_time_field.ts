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
import { IReduxState, IRecord } from '../../exports/store/interfaces';
import {
  ILastModifiedTimeField, ILastModifiedTimeFieldProperty, FieldType, IField,
  DateFormat, TimeFormat, CollectType,
} from 'types/field_types';
import { DatasheetActions } from '../../commands_actions/datasheet';
import { DateTimeBaseField } from './date_time_base_field';
import { ICellValue } from 'model/record';
import { datasheetIdString, enumKeyToArray, enumToArray, joiErrorResult } from './validate_schema';
import { IOpenLastModifiedTimeFieldProperty } from 'types/open/open_field_read_types';
import { IUpdateOpenLastModifiedTimeFieldProperty } from 'types/open/open_field_write_types';
import { getFieldDefaultProperty } from './const';

export class LastModifiedTimeField extends DateTimeBaseField {
  constructor(public override field: ILastModifiedTimeField, state: IReduxState) {
    super(field, state);
  }

  static propertySchema = Joi.object({
    datasheetId: datasheetIdString().required(),
    collectType: Joi.number().allow(CollectType.AllFields, CollectType.SpecifiedFields).required(),
    fieldIdCollection: Joi.array().items(Joi.string()).required(),
    dateFormat: Joi.string().allow(...enumToArray(DateFormat)).required(),
    timeFormat: Joi.string().allow(...enumToArray(TimeFormat)).required(),
    includeTime: Joi.boolean().required(),
    timeZone: Joi.string(),
    includeTimeZone: Joi.boolean(),
  }).required();

  static defaultDateFormat: string = DateFormat[0]!;
  static defaultTimeFormat: string = TimeFormat[0]!;

  static createDefault(fieldMap: { [fieldId: string]: IField }): ILastModifiedTimeField {
    return {
      id: DatasheetActions.getNewFieldId(fieldMap),
      type: FieldType.LastModifiedTime,
      name: DatasheetActions.getDefaultFieldName(fieldMap),
      property: this.defaultProperty(),
    };
  }

  static defaultProperty(): ILastModifiedTimeFieldProperty {
    return getFieldDefaultProperty(FieldType.LastModifiedTime) as ILastModifiedTimeFieldProperty;
  }

  override get isComputed() {
    return true;
  }

  override recordEditable() {
    return false;
  }

  validateProperty() {
    return LastModifiedTimeField.propertySchema.validate(this.field.property);
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
    const { collectType, fieldIdCollection } = this.field.property;
    const updatedMap = record.recordMeta?.fieldUpdatedMap;

    // Depends on fieldUpdatedMap, otherwise returns null
    if (!updatedMap) {
      return null;
    }

    const isAllField = collectType === CollectType.AllFields;
    const fieldIds = isAllField ? Object.keys(updatedMap) : fieldIdCollection;
    const timestamps = fieldIds.reduce((acc, fieldId) => {
      if (updatedMap[fieldId]?.at) {
        acc.push(updatedMap[fieldId]!.at!);
      }
      return acc;
    }, [] as number[]);
    return timestamps.length ? Math.max(...timestamps as number[]) : null;
  }

  override get openFieldProperty(): IOpenLastModifiedTimeFieldProperty {
    const { includeTime, dateFormat, timeFormat, collectType, fieldIdCollection } = this.field.property;
    return {
      dateFormat: DateFormat[dateFormat]!,
      timeFormat: TimeFormat[timeFormat]!,
      includeTime,
      collectType,
      fieldIdCollection
    };
  }

  static openUpdatePropertySchema = Joi.object({
    dateFormat: Joi.string().valid(...enumKeyToArray(DateFormat)).required(),
    timeFormat: Joi.valid(...enumKeyToArray(TimeFormat)),
    includeTime: Joi.boolean(),
    collectType: Joi.number().valid(CollectType.AllFields, CollectType.SpecifiedFields),
    fieldIdCollection: Joi.array().items(Joi.string()),
    timeZone: Joi.string(),
    includeTimeZone: Joi.boolean(),
  }).required();

  override validateUpdateOpenProperty(updateProperty: IUpdateOpenLastModifiedTimeFieldProperty) {
    return LastModifiedTimeField.openUpdatePropertySchema.validate(updateProperty);
  }

  override updateOpenFieldPropertyTransformProperty(openFieldProperty: IUpdateOpenLastModifiedTimeFieldProperty): ILastModifiedTimeFieldProperty {
    const { dateFormat, timeFormat, includeTime, collectType, fieldIdCollection } = openFieldProperty;
    const defaultProperty = LastModifiedTimeField.defaultProperty();
    return {
      datasheetId: (this.field.property as ILastModifiedTimeFieldProperty).datasheetId,
      dateFormat: DateFormat[dateFormat],
      timeFormat: timeFormat ? TimeFormat[timeFormat] : defaultProperty.timeFormat,
      collectType: collectType ?? defaultProperty.collectType,
      fieldIdCollection: fieldIdCollection || [],
      includeTime: includeTime ?? defaultProperty.includeTime
    };
  }
}
