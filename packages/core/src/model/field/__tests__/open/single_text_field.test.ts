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
import { IOpenField, IOpenSingleTextFieldProperty } from 'types/open/open_field_read_types';
import { FieldType, ISingleTextField } from 'types/field_types';
import { getOpenFieldProperty, updateOpenFieldPropertyTransformProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const textField: ISingleTextField = {
  name: 'text field',
  id: 'fld1111',
  type: FieldType.SingleText,
  property: {
    defaultValue: '1'
  }
};

const openSingleTextField: IOpenField = {
  name: 'text field',
  id: 'fld1111',
  type: APIMetaFieldType.SingleText,
  property: {
    defaultValue: '1'
  }
};

const writeOpenProperty: IOpenSingleTextFieldProperty = {
  defaultValue: '1'
};

describe('Text field read property format check', () => {
  const valid = getOpenFieldProperty(textField);
  it('correct property', function() {
    const [expectValue, receiveValue] = valid(openSingleTextField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('Text field update property check', () => {
  const valid = validUpdateOpenProperty(textField);
  it('text field update property', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('text field update property is empty', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});

describe('Add property check to text field', () => {
  const valid = validAddOpenProperty(textField);
  it('Enter the correct new property parameter', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('When the new property is empty', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});

describe('Text field update property conversion property check', () => {
  const valid = updateOpenFieldPropertyTransformProperty(textField);
  it('Enter the correct update property parameters', () => {
    const [expectValue, receiveValue] = valid(writeOpenProperty, textField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('Add property check to text field', () => {
  const valid = validAddOpenProperty(textField);
  it('property has value', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('when empty', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});