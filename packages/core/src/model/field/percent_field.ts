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
import { IReduxState } from '../../exports/store/interfaces';
import { FieldType, IField, IPercentField, IPercentFieldProperty } from 'types/field_types';
import { DatasheetActions } from '../../commands_actions/datasheet';
import { NumberBaseField } from './number_base_field';
import { ICellValue, ICellToStringOption } from 'model/record';
import { numberToShow, str2number, times } from 'utils';
import { IOpenPercentFieldProperty } from 'types/open/open_field_read_types';
import { IUpdateOpenPercentFieldProperty } from 'types/open/open_field_write_types';
import { getFieldDefaultProperty } from './const';
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

  static defaultProperty(): IPercentFieldProperty {
    return getFieldDefaultProperty(FieldType.Percent) as IPercentFieldProperty;
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
