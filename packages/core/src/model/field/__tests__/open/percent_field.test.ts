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

import { APIMetaFieldType, FieldType, IPercentField } from 'types';
import { IOpenField } from 'types/open/open_field_read_types';
import { IUpdateOpenPercentFieldProperty } from 'types/open/open_field_write_types';
import { getOpenFieldProperty, updateOpenFieldPropertyTransformProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const percentField: IPercentField = {
  name: 'Percentage field',
  id: 'fld1111',
  type: FieldType.Percent,
  property: {
    defaultValue: '1',
    precision: 1
  }
};

const openPercentField: IOpenField = {
  name: 'Percentage field',
  id: 'fld1111',
  type: APIMetaFieldType.Percent,
  property: {
    defaultValue: '1',
    precision: 1
  }
};

const propertyOptionalFill: IUpdateOpenPercentFieldProperty = {
  defaultValue: '1',
  precision: 1
};

const propertyOptionalNotFill: IUpdateOpenPercentFieldProperty = {
  precision: 1
};

describe('Percentage field read property format check', () => {
  const valid = getOpenFieldProperty(percentField);
  it('correct property', function() {
    const [expectValue, receiveValue] = valid(openPercentField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('Percentage field update property check', () => {
  const valid = validUpdateOpenProperty(percentField);
  it('Do not fill in optional fields', () => {
    const result = valid(propertyOptionalNotFill);
    expect(result).toEqual(true);
  });

  it('fill in optional fields', () => {
    const result = valid(propertyOptionalFill);
    expect(result).toEqual(true);
  });

  it('When the update property is empty', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});

describe('Percentage field update property conversion property check', () => {
  const valid = updateOpenFieldPropertyTransformProperty(percentField);
  it('Do not fill in optional fields', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalNotFill, propertyOptionalNotFill);
    expect(expectValue).toEqual(receiveValue);
  });

  it('fill in optional fields', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalFill, propertyOptionalFill);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('Percentage field added property check', () => {
  const valid = validAddOpenProperty(percentField);
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