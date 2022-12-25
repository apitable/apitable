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

import { ICreatedByField } from '../../../types/field_types';
import { validProperty } from './common';

const createdByField: ICreatedByField = {
  name: 'CreatedBy Field',
  id: 'fld1111',
  type: 23,
  property: {
    uuids: [],
    datasheetId: 'dst11111'
  }
};

describe('Check creator field property format', () => {
  it('property = undefined', function() {
    expect(validProperty({
      ...createdByField,
      property: undefined
    } as any)).toEqual(false);
  });

  it('property = null', function() {
    expect(validProperty({
      ...createdByField,
      property: null
    } as any)).toEqual(false);
  });

  it('property = {}', function() {
    expect(validProperty({
      ...createdByField,
      property: {}
    } as any)).toEqual(false);
  });

  it('property has the wrong property', function() {
    expect(validProperty({
      ...createdByField,
      property: {
        name: '123'
      }
    } as any)).toEqual(false);
  });

  it('property is in the correct format', function() {
    expect(validProperty({
      ...createdByField
    } as any)).toEqual(true);
  });
});
