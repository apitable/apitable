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

import { getFieldOptionColor } from 'model/color';
import { ISelectField } from 'types';
import { APIMetaFieldType } from 'types/field_api_enums';
import { IOpenField } from 'types/open/open_field_read_types';
import { IUpdateOpenMultiSelectFieldProperty } from 'types/open/open_field_write_types';
import { getOpenFieldProperty, transformProperty, updateOpenFieldPropertyTransformProperty
  , validAddOpenProperty, validUpdateOpenProperty } from './common';

const singleSelectField: ISelectField = {
  name: 'Multiple selection fields',
  id: 'fld1111',
  type: 4,
  property: {
    options: [
      {
        id: 'opt000',
        name: 'Test Label 1',
        color: 1
      },
      {
        id: 'opt001',
        name: 'Test Label 2',
        color: 2
      }
    ]
  }
};
const invalidIdField: ISelectField = {
  name: 'Multiple selection fields',
  id: 'fld1111',
  type: 4,
  property: {
    options: [
      {
        id: '',
        name: 'Test Label 1',
        color: 0
      },
      {
        id: '',
        name: 'Test Label 2',
        color: 0
      }
    ],
    defaultValue: ['Test Label 1']
  }
};

const fieldWithoutDefaultValue: ISelectField = {
  name: 'Multiple selection fields',
  id: 'fld1111',
  type: 4,
  property: {
    options: [
      {
        id: '',
        name: 'Test Label 1',
        color: 0
      },
      {
        id: '',
        name: 'Test Label 2',
        color: 0
      }
    ],
  }
};

const openSingleSelectField: IOpenField = {
  id: 'fld1111',
  name: 'Multiple selection fields',
  type: APIMetaFieldType.MultiSelect,
  property: {
    options: [
      {
        id: 'opt000',
        name: 'Test Label 1',
        color: getFieldOptionColor(1)
      },
      {
        id: 'opt001',
        name: 'Test Label 2',
        color: getFieldOptionColor(2)
      }
    ]
  }
};

const writeOpenPropertyDelete: IUpdateOpenMultiSelectFieldProperty = {
  options: [{
    id: 'opt000',
    name: 'Test Label 1',
    color: 1
  }]
};

const writeOpenProperty: IUpdateOpenMultiSelectFieldProperty = {
  options: [{
    id: 'opt000',
    name: 'Test Label 1',
    color: 1
  }, {
    id: 'opt001',
    name: 'Test Label 2',
    color: 2
  }]
};

describe('Multiple selection fields read property format check', () => {
  const valid = getOpenFieldProperty(singleSelectField);
  it('correct property', function () {
    const [expectValue, receiveValue] = valid(openSingleSelectField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('Multiple selection field update property check', () => {
  const valid = validUpdateOpenProperty(singleSelectField);
  it('Enter the property that will delete the option and take the side effect parameter', () => {
    const result = valid(writeOpenPropertyDelete, { enableSelectOptionDelete: true });
    expect(result).toEqual(true);
  });

  it('Enter the property that deletes the option without side effect parameters', () => {
    const result = valid(writeOpenPropertyDelete);
    expect(result).toEqual(false);
  });

  it('multiple selection field update property is empty', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});

describe('Add property check for multiple selection fields', () => {
  const valid = validAddOpenProperty(singleSelectField);
  it('Enter the correct new property parameter', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('When the new property is empty', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});

describe('Multiple selection field update property conversion property check', () => {
  const valid = updateOpenFieldPropertyTransformProperty(singleSelectField);
  it('Enter the correct update property parameters', () => {
    const [expectValue, receiveValue] = valid(writeOpenProperty, singleSelectField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('Add property check for multi-select fields', () => {
  const valid = validAddOpenProperty(singleSelectField);
  it('property has value check', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('when empty', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});

describe('transform property', () => {
  const property = transformProperty(invalidIdField);
  it('missing id, should generate option.id', () => {
    expect(property).toHaveProperty(['options', 0, 'id']);
  });

  it('missing color, should generate option.color', () => {
    expect(property).toHaveProperty(['options', 0, 'color']);
  });

  it('missing id, should change defaultValue to option.id', () => {
    expect(property).toHaveProperty(['options', 0, 'id'], property.defaultValue[0]);
  });

  it('missing defaultValue, should not change defaultValue to option.id', () => {
    const property = transformProperty(fieldWithoutDefaultValue);
    expect(property).not.toHaveProperty(['options', 'defaultValue']);
  });

});