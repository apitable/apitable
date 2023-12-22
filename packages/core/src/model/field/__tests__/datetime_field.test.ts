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

import { IDateTimeField } from '../../../types/field_types';
import { commonTestSuit, getValidCellValue, validProperty } from './common';
import { DateTimeField } from 'model/field/date_time_field';

const datetimeField: IDateTimeField = {
  name: 'Datetime Field',
  id: 'fld1111',
  type: 5,
  property: DateTimeField.defaultProperty()
};

describe('Format check for date fields', () => {
  const valid = getValidCellValue(datetimeField);

  commonTestSuit(valid);

  it('input number', function () {
    const [expectValue, receiveValue] = valid(12312312);
    expect(receiveValue).toEqual(expectValue);
  });

  it('input text', function () {
    const [expectValue, receiveValue] = valid([{ text: '123', type: 1 }]);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('input multiple choices', function () {
    const [expectValue, receiveValue] = valid(['optxxxxx']);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('input single choice', function () {
    const [expectValue, receiveValue] = valid('optxxxxx');
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('input attachment', function () {
    const [expectValue, receiveValue] = valid({
      id: 'xxxx',
      name: 'xxxx',
      mimeType: 'image/jpg',
      token: 'vika.cn',
      bucket: 'image/xxxx.jpg',
      size: 123111,
    });
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('input 1', function () {
    const [expectValue, receiveValue] = valid(1);
    expect(receiveValue).toEqual(expectValue);
  });

  it('input 0', function () {
    const [expectValue, receiveValue] = valid(0);
    expect(receiveValue).toEqual(expectValue);
  });

  it('input true', function () {
    const [expectValue, receiveValue] = valid(true);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('input false', function () {
    const [expectValue, receiveValue] = valid(false);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('input timestamp', function () {
    const [expectValue, receiveValue] = valid(1632153600000);
    expect(receiveValue).toEqual(expectValue);
  });

});

describe('Check the tick field property format', () => {
  it('property = undefined', function () {
    expect(validProperty({
      ...datetimeField,
      property: undefined
    } as any)).toEqual(false);
  });

  it('property = null', function () {
    expect(validProperty({
      ...datetimeField,
      property: null
    } as any)).toEqual(false);
  });

  it('property = {}', function () {
    expect(validProperty({
      ...datetimeField,
      property: {}
    } as any)).toEqual(false);
  });

  it('property only other properties', function () {
    expect(validProperty({
      ...datetimeField,
      property: {
        name: '123'
      }
    } as any)).toEqual(false);
  });

  it('property required field is missing', function () {
    expect(validProperty({
      ...datetimeField,
      property: {
        dateFormat: 'YYYY/MM/DD',
        timeFormat: 'HH:mm',
        includeTime: false
      }
    } as any)).toEqual(false);
  });

  it('wrong property value', function () {
    expect(validProperty({
      ...datetimeField,
      property: {
        dateFormat: 'mm',
        timeFormat: 'HH:mm',
        includeTime: false
      }
    } as any)).toEqual(false);
  });

  it('property is in the correct format', function () {
    expect(validProperty({
      ...datetimeField
    } as any)).toEqual(true);
  });

  it('property has redundant properties', function () {
    expect(validProperty({
      ...datetimeField,
      property: {
        ...datetimeField.property,
        name: '123',
        icon: ''
      }
    } as any)).toEqual(false);
  });
});
