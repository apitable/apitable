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

import { APIMetaFieldType, FieldType, INumberField } from 'types';
import { IOpenField } from 'types/open/open_field_read_types';
import { IUpdateOpenNumberFieldProperty } from 'types/open/open_field_write_types';
import { getOpenFieldProperty, updateOpenFieldPropertyTransformProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const numberField: INumberField = {
  name: 'Number field',
  id: 'fld1111',
  type: FieldType.Number,
  property: {
    defaultValue: '1',
    precision: 1.0
  }
};

const openNumberField: IOpenField = {
  name: 'Number field',
  id: 'fld1111',
  type: APIMetaFieldType.Number,
  property: {
    defaultValue: '1',
    precision: 1.0
  }
};

const propertyOptionalFill: IUpdateOpenNumberFieldProperty = {
  defaultValue: '1',
  precision: 1.0,
  symbol: '$'
};

const propertyOptionalNotFill: IUpdateOpenNumberFieldProperty = {
  precision: 1.0
};

describe('Number field read property format check', () => {
  const valid = getOpenFieldProperty(numberField);
  it('correct property', function() {
    const [expectValue, receiveValue] = valid(openNumberField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('Number field update property check', () => {
  const valid = validUpdateOpenProperty(numberField);
  it('Do not fill in optional fields', () => {
    const result = valid(propertyOptionalNotFill);
    expect(result).toEqual(true);
  });

  it('fill in optional fields', () => {
    const result = valid(propertyOptionalFill);
    expect(result).toEqual(true);
  });

  it('When the numeric field is updated when the property is empty', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});

describe('Number field update property conversion property check', () => {
  const valid = updateOpenFieldPropertyTransformProperty(numberField);
  it('Do not fill in optional fields', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalFill, propertyOptionalFill);
    expect(expectValue).toEqual(receiveValue);
  });

  it('fill in optional fields', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalNotFill, propertyOptionalNotFill);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('Add property check for numeric fields', () => {
  const valid = validAddOpenProperty(numberField);
  it('Do not fill in optional fields', () => {
    const result = valid(propertyOptionalNotFill);
    expect(result).toEqual(true);
  });

  it('fill in optional fields', () => {
    const result = valid(propertyOptionalFill);
    expect(result).toEqual(true);
  });

  it('when empty', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});