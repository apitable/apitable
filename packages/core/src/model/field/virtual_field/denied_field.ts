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
import { ICellValue } from '../../record';
import { Field } from '../field';
import { IFilterCondition } from 'types/view_types';
import { IStandardValue, BasicValueType } from 'types/field_types';

export class DeniedField extends Field {
  static propertySchema = Joi.equal(null);

  get basicValueType() {
    return BasicValueType.String;
  }

  get apiMetaProperty() {
    return null;
  }

  get openValueJsonSchema() {
    return {
      title: this.field.name,
      type: 'string'
    };
  }

  acceptFilterOperators = [];

  static defaultProperty() {
    return null;
  }

  validateProperty() {
    return DeniedField.propertySchema.validate(this.field.property);
  }

  validateCellValue() {
    return this.validateProperty();
  }

  validateOpenWriteValue() {
    return this.validateProperty();
  }

  cellValueToStdValue(_cellValue: any): IStandardValue {
    return {
      sourceType: this.field.type,
      data: [],
    };
  }

  stdValueToCellValue(_stdValue: IStandardValue): null {
    return null;
  }

  override recordEditable() {
    return false;
  }

  validate(_value: any): false {
    return false;
  }

  cellValueToString(_cellValue: ICellValue): null {
    return null;
  }

  defaultValueForCondition(_condition: IFilterCondition): null {
    return null;
  }

  cellValueToApiStandardValue(_cellValue: ICellValue): null {
    return null;
  }

  cellValueToApiStringValue(_cellValue: ICellValue) {
    return null;
  }

  cellValueToOpenValue(_cellValue: ICellValue): null {
    return null;
  }

  openWriteValueToCellValue(_openWriteValue: string): null {
    return null;
  }
}
