import Joi from 'joi';
import { DatasheetActions } from '../datasheet';
import { DateTimeBaseField } from './date_time_base_field';
import { DateFormat, FieldType, IDateTimeField, IDateTimeFieldProperty, IField, TimeFormat } from 'types/field_types';
import { IReduxState } from '../../exports/store';
import { enumKeyToArray, enumToArray } from './validate_schema';
import { ICellValue } from 'model/record';
import dayjs from 'dayjs';
import { IOpenDateTimeFieldProperty } from 'types/open/open_field_read_types';
import { IUpdateOpenDateTimeFieldProperty } from 'types/open/open_field_write_types';

export class DateTimeField extends DateTimeBaseField {
  constructor(public override field: IDateTimeField, public override state: IReduxState) {
    super(field, state);
  }

  static propertySchema = Joi.object({
    dateFormat: Joi.valid(...enumToArray(DateFormat)).required(),
    timeFormat: Joi.valid(...enumToArray(TimeFormat)).required(),
    includeTime: Joi.boolean().required(),
    autoFill: Joi.boolean().required(),
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
    return {
      dateFormat: DateFormat['YYYY/MM/DD'],
      timeFormat: TimeFormat['hh:mm'],
      includeTime: false,
      autoFill: false,
    };
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
