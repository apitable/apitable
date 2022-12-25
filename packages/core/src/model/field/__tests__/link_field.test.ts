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

import { ILinkField } from '../../../types/field_types';
import { commonTestSuit, getValidCellValue, validProperty } from './common';

const linkField: ILinkField = {
  name: 'Link Field',
  id: 'fld1111',
  type: 7,
  property: {
    foreignDatasheetId: 'dst111111'
  }
};

describe('Format Check for Relation Fields', () => {
  const valid = getValidCellValue(linkField);

  commonTestSuit(valid);

  it('input number', function() {
    const [expectValue, receiveValue] = valid(12312312);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('input text', function() {
    const [expectValue, receiveValue] = valid([{ text: '123', type: 1 }]);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('input multi choices', function() {
    const [expectValue, receiveValue] = valid(['optxxxxx']);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('input single choice', function() {
    const [expectValue, receiveValue] = valid('optxxxxx');
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('input attachment', function() {
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

  it('input recordId array', function() {
    const [expectValue, receiveValue] = valid(['rec12312312']);
    expect(receiveValue).toEqual(expectValue);
  });

});

describe('Check the relation field property format', () => {
  it('property = undefined', function() {
    expect(validProperty({
      ...linkField,
      property: undefined
    } as any)).toEqual(false);
  });

  it('property = null', function() {
    expect(validProperty({
      ...linkField,
      property: null
    } as any)).toEqual(false);
  });

  it('property = {}', function() {
    expect(validProperty({
      ...linkField,
      property: {}
    } as any)).toEqual(false);
  });

  it('property is missing foreignDatasheetId', function() {
    expect(validProperty({
      ...linkField,
      property: {
        brotherFieldId: 'fldxxxx'
      }
    } as any)).toEqual(false);
  });

  it('property record foreignDatasheetId does not exist', function() {
    expect(validProperty({
      ...linkField,
      property: {
        foreignDatasheetId: 'dst12111',
      }
    } as any)).toEqual(false);
  });

  it('The foreignDatasheetId of the property record exists', function() {
    expect(validProperty({
      ...linkField,
      property: {
        foreignDatasheetId: 'dst123',
      }
    } as any)).toEqual(true);
  });

  it('brotherFieldId data error', function() {
    expect(validProperty({
      ...linkField,
      property: {
        foreignDatasheetId: 'dst123',
        brotherFieldId: 'dst123',
      }
    } as any)).toEqual(false);
  });

  it('brotherFieldId data is correct', function() {
    expect(validProperty({
      ...linkField,
      property: {
        foreignDatasheetId: 'dst123',
        brotherFieldId: 'fld123',
      }
    } as any)).toEqual(true);
  });

  it('limitToView data error', function() {
    expect(validProperty({
      ...linkField,
      property: {
        foreignDatasheetId: 'dst123',
        limitToView: 'dst123',
      }
    } as any)).toEqual(false);
  });

  it('limitToView data is correct', function() {
    expect(validProperty({
      ...linkField,
      property: {
        foreignDatasheetId: 'dst123',
        limitToView: 'viw123123',
      }
    } as any)).toEqual(true);
  });

  it('property has redundant properties', function() {
    expect(validProperty({
      ...linkField,
      property: {
        name: '123',
        icon: ''
      }
    } as any)).toEqual(false);
  });
});
