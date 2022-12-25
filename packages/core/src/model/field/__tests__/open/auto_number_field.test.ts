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

import { APIMetaFieldType } from 'types/field_api_enums';
import { IOpenField, IOpenFieldProperty } from 'types/open/open_field_read_types';
import { FieldType, IAutoNumberField } from 'types/field_types';
import { getOpenFieldProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const autoNumberField: IAutoNumberField = {
  name: 'Auto incremental number field',
  id: 'fld1111',
  type: FieldType.AutoNumber,
  property: {
    nextId: 0,
    viewIdx: 0,
    datasheetId: 'dst123'
  }
};

const openAutoNumberField: IOpenField = {
  name: 'Auto incremental number field',
  id: 'fld1111',
  type: APIMetaFieldType.AutoNumber,
  property: null
};

const writeOpenProperty: IOpenFieldProperty = null;

describe('Auto-Self-incrementing numeric fields read property format check', () => {
  const valid = getOpenFieldProperty(autoNumberField);
  it('the correct property', function() {
    const [expectValue, receiveValue] = valid(openAutoNumberField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('Auto-Self-incrementing numeric field update property check', () => {
  const valid = validUpdateOpenProperty(autoNumberField);
  it('Auto-increment numeric field update property', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(false);
  });
});

describe('Added property check for auto-incrementing numeric fields', () => {
  const valid = validAddOpenProperty(autoNumberField);
  it('Enter the new property parameter', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('Enter the new property parameter, not empty', () => {
    const result = valid({});
    expect(result).toEqual(false);
  });
});
