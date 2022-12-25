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
import { IOpenField, IOpenCheckboxFieldProperty } from 'types/open/open_field_read_types';
import { FieldType, ICheckboxField } from 'types/field_types';
import { getOpenFieldProperty, updateOpenFieldPropertyTransformProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const checkboxField: ICheckboxField = {
  name: 'checkbox field',
  id: 'fld1111',
  type: FieldType.Checkbox,
  property: {
    icon: 'flag-ni'
  }
};

const openCheckboxField: IOpenField = {
  name: 'checkbox field',
  id: 'fld1111',
  type: APIMetaFieldType.Checkbox,
  property: {
    icon: '🇳🇮'
  }
};

const writeOpenProperty: IOpenCheckboxFieldProperty = {
  icon: 'flag-ni'
};

describe('the format check of checkbox reads property', () => {
  const valid = getOpenFieldProperty(checkboxField);
  it('the correct property', function() {
    const [expectValue, receiveValue] = valid(openCheckboxField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('the check of checkbox field update property', () => {
  const valid = validUpdateOpenProperty(checkboxField);
  it('checkbox field update property', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('checkbox update property is error icon', () => {
    const result = valid({ icon: 'test' });
    expect(result).toEqual(false);
  });

  it('Checkbox field update property is empty', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});

describe('checkbox new property', () => {
  const valid = validAddOpenProperty(checkboxField);
  it('input correct new property arguments', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('new a empty property', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});

describe('checkbox field, update property convert to other property', () => {
  const valid = updateOpenFieldPropertyTransformProperty(checkboxField);
  it('input correct update property arguments', () => {
    const [expectValue, receiveValue] = valid(writeOpenProperty, checkboxField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});