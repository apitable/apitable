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

import { CreatedTimeField } from 'model/field/created_time_field';
import { APIMetaFieldType, DateFormat, FieldType, ICreatedTimeField, TimeFormat } from 'types';
import { IOpenField } from 'types/open/open_field_read_types';
import { IUpdateOpenCreatedTimeFieldProperty } from 'types/open/open_field_write_types';
import { getOpenFieldProperty, updateOpenFieldPropertyTransformProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const createdTimeField: ICreatedTimeField = {
  name: 'Created time field',
  id: 'fld1111',
  type: FieldType.CreatedTime,
  property: {
    datasheetId: 'dst1111',
    /** Create time format */
    dateFormat: DateFormat['YYYY-MM-DD'],
    /** Time format */
    timeFormat: TimeFormat['HH:mm'],
    /** Whether to include time */
    includeTime: true
  }
};

const openCreatedTimeField: IOpenField = {
  name: 'Created time field',
  id: 'fld1111',
  type: APIMetaFieldType.CreatedTime,
  property: {
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm',
    includeTime: true,
  }
};

const propertyOptionalFill: IUpdateOpenCreatedTimeFieldProperty = {
  dateFormat: 'YYYY-MM-DD',
  timeFormat: 'HH:mm',
  includeTime: true,
};

const propertyOptionalNotFill: IUpdateOpenCreatedTimeFieldProperty = {
  dateFormat: 'YYYY-MM-DD'
};

describe('Create time field read property format check', () => {
  const valid = getOpenFieldProperty(createdTimeField);
  it('correct property', function () {
    const [expectValue, receiveValue] = valid(openCreatedTimeField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('Create time field update property check', () => {
  const valid = validUpdateOpenProperty(createdTimeField);
  it('Do not fill in optional fields', () => {
    const result = valid(propertyOptionalNotFill);
    expect(result).toEqual(true);
  });

  it('Fill in optional fields', () => {
    const result = valid(propertyOptionalFill);
    expect(result).toEqual(true);
  });

  it('When the update property is empty', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});

describe('Create time field update property transform property check', () => {
  const valid = updateOpenFieldPropertyTransformProperty(createdTimeField);
  it('Do not fill in optional fields', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalNotFill, {
      ...CreatedTimeField.defaultProperty(),
      dateFormat: DateFormat['YYYY-MM-DD'],
      datasheetId: createdTimeField.property.datasheetId
    });
    expect(expectValue).toEqual(receiveValue);
  });

  it('Fill in optional fields', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalFill, createdTimeField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('Added property check for creation time field', () => {
  const valid = validAddOpenProperty(createdTimeField);
  it('Do not fill in optional fields', () => {
    const result = valid(propertyOptionalNotFill);
    expect(result).toEqual(true);
  });

  it('Fill in optional fields', () => {
    const result = valid(propertyOptionalFill);
    expect(result).toEqual(true);
  });

  it('when empty', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});
