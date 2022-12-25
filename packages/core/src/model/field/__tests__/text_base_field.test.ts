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

import { ITextField } from '../../../types/field_types';
import { commonTestSuit, getValidCellValue, validProperty } from './common';

const textField: ITextField = {
  name: 'Text Field',
  id: 'fld1111',
  type: 1,
  property: null
};

/**
 * Mailbox, single-line text, multi-line text, link, phone These four fields use a data structure, 
 * so only one of them can be checked
 */

describe('Format check for text fields', () => {
  const valid = getValidCellValue(textField);

  commonTestSuit(valid);

  it('input number', function() {
    const [expectValue, receiveValue] = valid(12312312);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('input text', function() {
    const [expectValue, receiveValue] = valid([{ text: '123', type: 1 }]);
    expect(receiveValue).toEqual(expectValue);
  });

  it('input multi select', function() {
    const [expectValue, receiveValue] = valid(['optxxxxx']);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('input single select', function() {
    const [expectValue, receiveValue] = valid('optxxxxx');
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('input attachment', function() {
    const [expectValue, receiveValue] = valid({
      id: 'xxxx',
      name: 'xxxx',
      mimeType: 'image/jpg',
      token: 'apitable.com',
      bucket: 'image/xxxx.jpg',
      size: 123111,
    });
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('input 1', function() {
    const [expectValue, receiveValue] = valid(1);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('input 0', function() {
    const [expectValue, receiveValue] = valid(0);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('input true', function() {
    const [expectValue, receiveValue] = valid(true);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('input false', function() {
    const [expectValue, receiveValue] = valid(false);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('input timestamp', function() {
    const [expectValue, receiveValue] = valid(1632153600000);
    expect(receiveValue).not.toEqual(expectValue);
  });
});

// Multi-line text, email, phone, url property interface settings are similar, you can use the same test case
describe('Check multiline text field property format', () => {
  it('property = undefined', function() {
    expect(validProperty({
      ...textField,
      property: undefined
    } as any)).toEqual(true);
  });

  it('property = null', function() {
    expect(validProperty({
      property: null
    } as any)).toEqual(true);
  });

  it('property = {}', function() {
    expect(validProperty({
      ...textField,
      property: {}
    } as any)).toEqual(false);
  });

  it('property has only other properties', function() {
    expect(validProperty({
      ...textField,
      property: {
        name: '123'
      }
    } as any)).toEqual(false);
  });

  it('default property', function() {
    expect(validProperty({
      ...textField
    } as any)).toEqual(true);
  });

  it('property has redundant properties', function() {
    expect(validProperty({
      ...textField,
      property: {
        name: '123',
        icon: ''
      }
    } as any)).toEqual(false);
  });
});

// single line of text
describe('Check single-line text field property format', () => {
  const singleTextField = {
    textField,
    type: 19,
  };
  it('property = null', function() {
    expect(validProperty({
      ...singleTextField,
      property: null
    } as any)).toEqual(false);
  });

  it('defaultValue = ""', function() {
    expect(validProperty({
      ...singleTextField,
      property: {
        defaultValue: '',
      }
    } as any)).toEqual(true);
  });

  it('property.defaultValue =""', function() {
    expect(validProperty({
      ...singleTextField,
      property: {
        defaultValue: '123',
      }
    } as any)).toEqual(true);
  });
});

