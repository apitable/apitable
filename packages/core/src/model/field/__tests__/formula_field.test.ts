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

import { validProperty } from './common';
import { IFormulaField } from '../../../types/field_types';

const formulaField: IFormulaField = {
  name: 'Formula Field',
  id: 'fld1111',
  type: 16,
  property: {
    expression: '1',
    datasheetId: 'dst123'
  }
};

describe('Check formula field property format', () => {
  it('property = undefined', function() {
    expect(validProperty({
      ...formulaField,
      property: undefined
    } as any)).toEqual(false);
  });

  it('property = null', function() {
    expect(validProperty({
      ...formulaField,
      property: null
    } as any)).toEqual(false);
  });

  it('property = {}', function() {
    expect(validProperty({
      ...formulaField,
      property: {}
    } as any)).toEqual(false);
  });

  it('property.datasheetId =""', function() {
    expect(validProperty({
      ...formulaField,
      property: {
        ...formulaField.property,
        datasheetId: ''
      }
    } as any)).toEqual(false);
  });

  it('property.expression =""', function() {
    expect(validProperty({
      ...formulaField,
      property: {
        ...formulaField.property,
        expression: ''
      }
    } as any)).toEqual(true);
  });

  it('property.datasheetId format is invalid', function() {
    expect(validProperty({
      ...formulaField,
      property: {
        ...formulaField.property,
        datasheetId: 'dsfdsf'
      }
    } as any)).toEqual(false);
  });

  it('property is in the correct format', function() {
    expect(validProperty({
      ...formulaField,
    } as any)).toEqual(true);
  });
});
