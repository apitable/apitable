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

import { LastModifiedTimeField } from 'model/field/last_modified_time_field';
import { APIMetaFieldType, CollectType, DateFormat, FieldType, ILastModifiedTimeField, TimeFormat } from 'types';
import { IOpenField } from 'types/open/open_field_read_types';
import { IUpdateOpenLastModifiedTimeFieldProperty } from 'types/open/open_field_write_types';
import { getOpenFieldProperty, updateOpenFieldPropertyTransformProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const lastModifiedTimeField: ILastModifiedTimeField = {
  name: 'Modify time field',
  id: 'fld1111',
  type: FieldType.LastModifiedTime,
  property: {
    datasheetId: 'dst1111',
    dateFormat: DateFormat['YYYY-MM-DD'],
    timeFormat: TimeFormat['HH:mm'],
    includeTime: true,
    collectType: CollectType.SpecifiedFields,
    fieldIdCollection: ['fld2222']
  }
};

const openLastModifiedTimeField: IOpenField = {
  name: 'Modify time field',
  id: 'fld1111',
  type: APIMetaFieldType.LastModifiedTime,
  property: {
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm',
    includeTime: true,
    collectType: CollectType.SpecifiedFields,
    fieldIdCollection: ['fld2222']
  }
};

const propertyOptionalFill: IUpdateOpenLastModifiedTimeFieldProperty = {
  dateFormat: 'YYYY-MM-DD',
  timeFormat: 'HH:mm',
  includeTime: true,
  collectType: CollectType.SpecifiedFields,
  fieldIdCollection: ['fld2222']
};

const propertyOptionalNotFill: IUpdateOpenLastModifiedTimeFieldProperty = {
  dateFormat: 'YYYY-MM-DD',
  collectType: CollectType.SpecifiedFields,
};

describe('Modify time field read property format check', () => {
  const valid = getOpenFieldProperty(lastModifiedTimeField);
  it('correct property', function () {
    const [expectValue, receiveValue] = valid(openLastModifiedTimeField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('Modify time field update property check', () => {
  const valid = validUpdateOpenProperty(lastModifiedTimeField);
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

describe('Modify time field update property conversion property check', () => {
  const valid = updateOpenFieldPropertyTransformProperty(lastModifiedTimeField);
  it('Do not fill in optional fields', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalNotFill, {
      ...LastModifiedTimeField.defaultProperty(),
      dateFormat: DateFormat['YYYY-MM-DD'],
      collectType: CollectType.SpecifiedFields,
      datasheetId: lastModifiedTimeField.property.datasheetId
    });
    expect(expectValue).toEqual(receiveValue);
  });

  it('fill in optional fields', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalFill, lastModifiedTimeField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('Modify the time field to add a property check', () => {
  const valid = validAddOpenProperty(lastModifiedTimeField);
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