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

import { LastModifiedByField } from 'model/field/last_modified_by_field';
import { APIMetaFieldType, CollectType, FieldType, ILastModifiedByField } from 'types';
import { IOpenField } from 'types/open/open_field_read_types';
import { IUpdateOpenLastModifiedByFieldProperty } from 'types/open/open_field_write_types';
import { getOpenFieldProperty, updateOpenFieldPropertyTransformProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const lastModifiedByField: ILastModifiedByField = {
  name: 'Modifier field',
  id: 'fld1111',
  type: FieldType.LastModifiedBy,
  property: {
    datasheetId: 'dst1111',
    uuids: [],
    collectType: CollectType.SpecifiedFields,
    fieldIdCollection: ['fld2222']
  }
};

const openLastModifiedByField: IOpenField = {
  name: 'Modifier field',
  id: 'fld1111',
  type: APIMetaFieldType.LastModifiedBy,
  property: {
    collectType: CollectType.SpecifiedFields,
    fieldIdCollection: ['fld2222']
  }
};

const propertyOptionalFill: IUpdateOpenLastModifiedByFieldProperty = {
  collectType: CollectType.SpecifiedFields,
  fieldIdCollection: ['fld2222']
};

const propertyOptionalNotFill: IUpdateOpenLastModifiedByFieldProperty = {
  collectType: CollectType.AllFields,
};

describe('Modifier field read property format check', () => {
  const valid = getOpenFieldProperty(lastModifiedByField);
  it('correct property', function () {
    const [expectValue, receiveValue] = valid(openLastModifiedByField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('Modifier field update property check', () => {
  const valid = validUpdateOpenProperty(lastModifiedByField);
  it('Do not fill in optional fields', () => {
    const result = valid(propertyOptionalNotFill);
    expect(result).toEqual(true);
  });

  it('fill in optional fields', () => {
    const result = valid(propertyOptionalFill);
    expect(result).toEqual(true);
  });

  it('When the update property is empty', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});

describe('Modifier field update property conversion property check', () => {
  const valid = updateOpenFieldPropertyTransformProperty(lastModifiedByField);
  it('Do not fill in optional fields', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalNotFill, {
      ...LastModifiedByField.defaultProperty(),
      collectType: CollectType.AllFields,
      datasheetId: lastModifiedByField.property.datasheetId
    });
    expect(expectValue).toEqual(receiveValue);
  });

  it('fill in optional fields', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalFill, lastModifiedByField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('Modify the person field to add a property check', () => {
  const valid = validAddOpenProperty(lastModifiedByField);
  it('Do not fill in optional fields', () => {
    const result = valid(propertyOptionalNotFill);
    expect(result).toEqual(true);
  });

  it('fill in optional fields', () => {
    const result = valid(propertyOptionalFill);
    expect(result).toEqual(true);
  });

  it('when empty', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});