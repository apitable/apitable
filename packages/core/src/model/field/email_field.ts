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

import { IReduxState } from '../../exports/store/interfaces';
import { FieldType, IEmailField, IField } from 'types/field_types';
import { DatasheetActions } from '../../commands_actions/datasheet';
import { TextBaseField } from './text_base_field';
import { getFieldDefaultProperty } from './const';
import { IEmailProperty } from 'types/field_types';
export class EmailField extends TextBaseField {
  constructor(public override field: IEmailField, public override state: IReduxState) {
    super(field, state);
  }

  override get apiMetaProperty() {
    return null;
  }

  static defaultProperty() {
    return getFieldDefaultProperty(FieldType.Email) as IEmailProperty;
  }

  static createDefault(fieldMap: { [fieldId: string]: IField }): IEmailField {
    return {
      id: DatasheetActions.getNewFieldId(fieldMap),
      name: DatasheetActions.getDefaultFieldName(fieldMap),
      type: FieldType.Email,
      property: this.defaultProperty(),
    };
  }
}
