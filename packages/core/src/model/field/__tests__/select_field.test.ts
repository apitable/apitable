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

import { ISelectField } from '../../../types/field_types';
import { commonTestSuit, getValidCellValue, validProperty } from './common';

const singleSelectField: ISelectField = {
  name: 'single select field',
  id: 'fld1111',
  type: 3,
  property: {
    options: [{
      id: 'opt000',
      name: 'test tag',
      color: 1
    }]
  }
};

const multiSelectField: ISelectField = {
  name: 'multi selects field',
  id: 'fld22222',
  type: 4,
  property: {
    options: [{
      id: 'opt000',
      name: 'test tag',
      color: 1
    }]
  }
};

export const selectCommonTestSuit = (valid: any) => {

  commonTestSuit(valid);

  it('input number', function() {
    const [expectValue, receiveValue] = valid(12312312);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('input text', function() {
    const [expectValue, receiveValue] = valid([{ text: '123', type: 1 }]);
    expect(receiveValue).not.toEqual(expectValue);
  });

};

describe('Format check for single select fields', () => {
  const valid = getValidCellValue(singleSelectField);

  selectCommonTestSuit(valid);

  it('Enter multiple selections', function() {
    const [expectValue, receiveValue] = valid(['optxxxxx']);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('Enter single select value, the value exists in the property', function() {
    const [expectValue, receiveValue] = valid('opt000');
    expect(receiveValue).toEqual(expectValue);
  });

  it('Enter single select value, the value does not exist in the property', function() {
    const [expectValue, receiveValue] = valid('opt111');
    expect(receiveValue).not.toEqual(expectValue);
  });
});

describe('Format check for multi-select fields', () => {
  const valid = getValidCellValue(multiSelectField);

  selectCommonTestSuit(valid);

  it('The value of the multiple selection exists in the field property', function() {
    const [expectValue, receiveValue] = valid(['opt000']);
    expect(receiveValue).toEqual(expectValue);
  });

  it('The value of the multi-select does not exist in the field property', function() {
    const [expectValue, receiveValue] = valid(['opt1111']);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('input single select content', function() {
    const [expectValue, receiveValue] = valid('optxxxxx');
    expect(receiveValue).not.toEqual(expectValue);
  });
});

// The structure of single-selection and multiple-selection are the same, just check one
describe('Check single select field property format', () => {
  it('property = undefined', function() {
    expect(validProperty({
      ...singleSelectField,
      property: undefined
    } as any)).toEqual(false);
  });

  it('property = null', function() {
    expect(validProperty({
      ...singleSelectField,
      property: null
    } as any)).toEqual(false);
  });

  it('property = {}', function() {
    expect(validProperty({
      ...singleSelectField,
      property: {}
    } as any)).toEqual(false);
  });

  it('property.options = []', function() {
    expect(validProperty({
      ...singleSelectField,
      property: {
        options: []
      }
    } as any)).toEqual(true);
  });

  it('default property', function() {
    expect(validProperty({
      ...singleSelectField
    } as any)).toEqual(true);
  });

  it('property.options cannot be an array of strings', function() {
    expect(validProperty({
      ...singleSelectField,
      property: {
        options: ['1']
      }
    } as any)).toEqual(false);
  });

  it('property has redundant properties', function() {
    expect(validProperty({
      ...singleSelectField,
      property: {
        ...singleSelectField.property,
        name: '123',
      }
    } as any)).toEqual(false);
  });
});
