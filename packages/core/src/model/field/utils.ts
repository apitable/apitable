
import {
  BasicValueType,
  DateFormat,
  FieldType,
  IAPIMetaNoneStringValueFormat,
  ICurrencyFieldProperty,
  IDateTimeFieldPropertyFormat,
  INumberBaseFieldPropertyFormat,
  INumberFieldProperty,
  IPercentFieldProperty,
  TimeFormat,
} from 'types';
import { getFieldDefaultProperty } from './const';
// import type { CurrencyField } from './currency_field';
// import type { DateTimeField } from './date_time_field';
// import type { NumberField } from './number_field';
// import type { PercentField } from './percent_field';
import type { FormulaField } from './formula_field';
import type { LookUpField } from './lookup_field';
import { APIMetaFieldPropertyFormatEnums } from 'types/field_api_enums';

export const getApiMetaPropertyFormat = (fieldInstance: LookUpField | FormulaField): IAPIMetaNoneStringValueFormat | null => {
  // format to datetime
  if (BasicValueType.DateTime === fieldInstance.basicValueType) {
    if (!fieldInstance.field.property.formatting) {
      return {
        type: APIMetaFieldPropertyFormatEnums.DateTime,
        format: {
          dateFormat: DateFormat[0]!,//DateTimeField.defaultDateFormat,
          timeFormat: DateFormat[0]!,//DateTimeField.defaultTimeFormat,
          includeTime: false,
        },
      };
    }
    const { dateFormat, timeFormat, includeTime, timeZone, includeTimeZone } = (fieldInstance.field.property.formatting ||
      {}) as IDateTimeFieldPropertyFormat;
    return {
      type: APIMetaFieldPropertyFormatEnums.DateTime,
      format: {
        dateFormat: DateFormat[dateFormat]!,
        timeFormat: TimeFormat[timeFormat]!,
        includeTime,
        timeZone,
        includeTimeZone,
      },
    };
  }
  // format to number
  if (BasicValueType.Number === fieldInstance.basicValueType) {
    const formatting = fieldInstance.field.property.formatting as INumberBaseFieldPropertyFormat;
    switch (formatting?.formatType) {
      case FieldType.Number:
        return {
          type: APIMetaFieldPropertyFormatEnums.Number,
          format: {
            precision: formatting?.precision || (getFieldDefaultProperty(FieldType.Number) as INumberFieldProperty).precision,
          },
        };
      case FieldType.Percent:
        return {
          type: APIMetaFieldPropertyFormatEnums.Percent,
          format: {
            precision: formatting?.precision || (getFieldDefaultProperty(FieldType.Percent) as IPercentFieldProperty).precision,
          },
        };
      case FieldType.Currency:
        return {
          type: APIMetaFieldPropertyFormatEnums.Currency,
          format: {
            precision: formatting?.precision || (getFieldDefaultProperty(FieldType.Currency) as ICurrencyFieldProperty).precision,
            symbol: formatting?.symbol || (getFieldDefaultProperty(FieldType.Currency) as ICurrencyFieldProperty).symbol,
          },
        };
      default:
        return {
          type: APIMetaFieldPropertyFormatEnums.Number,
          format: {
            precision: formatting?.precision || (getFieldDefaultProperty(FieldType.Number) as INumberFieldProperty).precision,
          },
        };
    }
  }
  return null;
};