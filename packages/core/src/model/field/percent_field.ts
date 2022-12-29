import Joi from 'joi';
import { IReduxState } from '../../exports/store';
import { FieldType, IField, IPercentField } from 'types/field_types';
import { DatasheetActions } from '../datasheet';
import { NumberBaseField } from './number_base_field';
import { ICellValue, ICellToStringOption } from 'model/record';
import { numberToShow, str2number, times } from 'utils';
import { IOpenPercentFieldProperty } from 'types/open/open_field_read_types';
import { IUpdateOpenPercentFieldProperty } from 'types/open/open_field_write_types';

export class PercentField extends NumberBaseField {
  constructor(public override field: IPercentField, public override state: IReduxState) {
    super(field, state);
  }

  static propertySchema = Joi.object({
    precision: Joi.number().min(0).max(10).required(),
    defaultValue: Joi.string().allow('')
  }).required();

  // preview state data
  override cellValueToString(cellValue: ICellValue, cellToStringOption?: ICellToStringOption): string | null {
    if (this.validate(cellValue)) {
      const cellString = numberToShow(times(cellValue, 100), this.field.property.precision);
      const { hideUnit } = cellToStringOption || {};
      return cellString == null ? null : `${cellString}${hideUnit ? '' : '%'}`;
    }
    return null;
  }

  // Return the default value of the field attribute configuration when adding a record
  override defaultValue(): ICellValue {
    const { defaultValue } = this.field.property;
    return defaultValue ? str2number(defaultValue) : null;
  }

  compareCellValue(cellValue: ICellValue): number | null {
    const cellValue2Str = this.cellValueToString(cellValue, { hideUnit: true });
    return cellValue2Str === null ? null : str2number(cellValue2Str as string);
  }

  override compare(cellValue1: number | null, cellValue2: number | null): number {
    return NumberBaseField._compare(
      this.compareCellValue(cellValue1),
      this.compareCellValue(cellValue2),
    );
  }

  validateProperty() {
    return PercentField.propertySchema.validate(this.field.property);
  }

  static createDefault(fieldMap: { [fieldId: string]: IField }): IPercentField {
    return {
      id: DatasheetActions.getNewFieldId(fieldMap),
      type: FieldType.Percent,
      name: DatasheetActions.getDefaultFieldName(fieldMap),
      property: this.defaultProperty(),
    };
  }

  static defaultProperty() {
    return {
      precision: 0,
    };
  }

  override get openFieldProperty(): IOpenPercentFieldProperty {
    const { defaultValue, precision } = this.field.property;
    return {
      defaultValue,
      precision
    };
  }

  override validateUpdateOpenProperty(updateProperty: IUpdateOpenPercentFieldProperty): Joi.ValidationResult {
    return PercentField.propertySchema.validate(updateProperty);
  }
}
