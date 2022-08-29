import Joi from 'joi';
import dayjs from 'dayjs';
import { ICellValue } from 'model/record';
import { IRecord } from 'store';
import {
  DateFormat, FieldType, ICreatedTimeField, ICreatedTimeFieldProperty, IField,
  TimeFormat
} from 'types/field_types';
import { DatasheetActions } from '../datasheet';
import { DateTimeBaseField } from './date_time_base_field';
import { datasheetIdString, enumKeyToArray, enumToArray, joiErrorResult } from './validate_schema';
import { IOpenCreatedTimeFieldProperty } from 'types/open/open_field_read_types';
import { IUpdateOpenCreatedTimeFieldProperty } from 'types/open/open_field_write_types';

export class CreatedTimeField extends DateTimeBaseField {
  static propertySchema = Joi.object({
    datasheetId: datasheetIdString().required(),
    dateFormat: Joi.string().allow(...enumToArray(DateFormat)).required(),
    timeFormat: Joi.string().allow(...enumToArray(TimeFormat)).required(),
    includeTime: Joi.boolean().required(),
  }).required();
  static defaultDateFormat: string = DateFormat[0];
  static defaultTimeFormat: string = TimeFormat[0];

  static createDefault(fieldMap: { [fieldId: string]: IField }): ICreatedTimeField {
    return {
      id: DatasheetActions.getNewFieldId(fieldMap),
      type: FieldType.CreatedTime,
      name: DatasheetActions.getDefaultFieldName(fieldMap),
      property: this.defaultProperty(),
    };
  }

  static defaultProperty(): ICreatedTimeFieldProperty {
    return {
      datasheetId: '',
      dateFormat: DateFormat['YYYY/MM/DD'],
      timeFormat: TimeFormat['hh:mm'],
      includeTime: false,
    };
  }

  get isComputed() {
    return true;
  }

  recordEditable() {
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

  stdValueToCellValue(): null {
    return null;
  }

  getCellValue(record: IRecord): ICellValue {
    const createdAt = record.recordMeta?.createdAt;
    return createdAt == null ? null : dayjs(createdAt).valueOf();
  }

  get openFieldProperty(): IOpenCreatedTimeFieldProperty {
    const { includeTime, dateFormat, timeFormat } = this.field.property;
    return {
      dateFormat: DateFormat[dateFormat],
      timeFormat: TimeFormat[timeFormat],
      includeTime
    };
  }

  static openUpdatePropertySchema = Joi.object({
    dateFormat: Joi.valid(...enumKeyToArray(DateFormat)).required(),
    timeFormat: Joi.valid(...enumKeyToArray(TimeFormat)),
    includeTime: Joi.boolean()
  }).required();

  validateUpdateOpenProperty(updateProperty: IUpdateOpenCreatedTimeFieldProperty) {
    return CreatedTimeField.openUpdatePropertySchema.validate(updateProperty);
  }

  updateOpenFieldPropertyTransformProperty(openFieldProperty: IUpdateOpenCreatedTimeFieldProperty): ICreatedTimeFieldProperty {
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
