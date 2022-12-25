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
import { IOpenField, IOpenRatingFieldProperty } from 'types/open/open_field_read_types';
import { FieldType, IRatingField } from 'types/field_types';
import { getOpenFieldProperty, updateOpenFieldPropertyTransformProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const ratingField: IRatingField = {
  name: 'rating field',
  id: 'fld1111',
  type: FieldType.Rating,
  property: {
    max: 2,
    icon: 'flag-ni'
  }
};

const openRatingField: IOpenField = {
  name: 'rating field',
  id: 'fld1111',
  type: APIMetaFieldType.Rating,
  property: {
    max: 2,
    icon: '🇳🇮'
  }
};

const writeOpenProperty: IOpenRatingFieldProperty = {
  max: 2,
  icon: 'flag-ni'
};

describe('The rating field reads the property format check', () => {
  const valid = getOpenFieldProperty(ratingField);
  it('correct property', function() {
    const [expectValue, receiveValue] = valid(openRatingField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('Rating field update property check', () => {
  const valid = validUpdateOpenProperty(ratingField);
  it('Rating field update property', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('The rating field updates the property to the wrong icon', () => {
    const result = valid({ icon: 'test', max: 5 });
    expect(result).toEqual(false);
  });

  it('The rating field is updated with a property of the wrong range', () => {
    const result = valid({ icon: 'flag-ni', max: 11 });
    expect(result).toEqual(false);
  });

  it('The rating field is updated when the property is empty', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});

describe('Rating field update property conversion property check', () => {
  const valid = updateOpenFieldPropertyTransformProperty(ratingField);
  it('Enter the correct update property parameters', () => {
    const [expectValue, receiveValue] = valid(writeOpenProperty, ratingField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('Added property check for scoring field', () => {
  const valid = validAddOpenProperty(ratingField);
  it('property has value', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('when empty', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});