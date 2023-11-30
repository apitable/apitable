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

import { FieldType, IField, ITextField } from 'types/field_types';
import { DatasheetActions } from '../../commands_actions/datasheet';
import { TextBaseField } from './text_base_field';
import { getFieldDefaultProperty } from './const';
import { ITextFieldProperty } from 'types/field_types';

export class TextField extends TextBaseField {
  static defaultProperty() {
    return getFieldDefaultProperty(FieldType.Text) as ITextFieldProperty;
  }

  static createDefault(fieldMap: { [fieldId: string]: IField }): ITextField {
    return {
      id: DatasheetActions.getNewFieldId(fieldMap),
      name: DatasheetActions.getDefaultFieldName(fieldMap),
      type: FieldType.Text,
      property: this.defaultProperty(),
    };
  }
}
