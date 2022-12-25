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
import { ILookUpField } from '../../../types/field_types';

const lookupField: ILookUpField = {
  name: 'lookup field',
  id: 'fld1111',
  type: 14,
  property: {
    datasheetId: 'dst123',
    relatedLinkFieldId: 'fldxxxx',
    lookUpTargetFieldId: 'fldccc'
  }
};

describe('Check lookup field property format', () => {
  it('property = undefined', function() {
    expect(validProperty({
      ...lookupField,
      property: undefined
    } as any)).toEqual(false);
  });

  it('property = null', function() {
    expect(validProperty({
      ...lookupField,
      property: null
    } as any)).toEqual(false);
  });

  it('property = {}', function() {
    expect(validProperty({
      ...lookupField,
      property: {}
    } as any)).toEqual(false);
  });

  it('property.datasheetId =""', function() {
    expect(validProperty({
      ...lookupField,
      property: {
        ...lookupField.property,
        datasheetId: ''
      }
    } as any)).toEqual(false);
  });

  it('property.datasheetId format is invalid', function() {
    expect(validProperty({
      ...lookupField,
      property: {
        ...lookupField.property,
        datasheetId: 'dsfdsf'
      }
    } as any)).toEqual(false);
  });

  it('property.relatedLinkFieldId format is invalid', function() {
    expect(validProperty({
      ...lookupField,
      property: {
        ...lookupField.property,
        datasheetId: 'dsfdsf'
      }
    } as any)).toEqual(false);
  });

  it('property is in the correct format', function() {
    expect(validProperty({
      ...lookupField,
    } as any)).toEqual(true);
  });

  it('Lookup has filter items and is fully configured', function() {
    expect(validProperty({
      ...lookupField,
      filterInfo: {
        conjunction: 'and',
        conditions: [
          {
            conditionId: '123',
            fieldId: 'fldxxx',
            operator: 'is',
            fieldType: 1
          }
        ]
      },
      openFilter: true
    } as any)).toEqual(true);
  });

  it('lookup filter item exists, missing fieldId', function() {
    expect(validProperty({
      ...lookupField,
      property: {
        ...lookupField,
        filterInfo: {
          conjunction: 'and',
          conditions: [
            {
              conditionId: '123',
              operator: 'is',
              fieldType: 1
            }
          ]
        },
        openFilter: true
      },
    } as any)).toEqual(false);
  });
});
