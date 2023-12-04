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

import { DateTimeField } from 'model/field/date_time_field';
import { APIMetaFieldType, DateFormat, FieldType, IDateTimeField, TimeFormat } from 'types';
import { IOpenField } from 'types/open/open_field_read_types';
import { IUpdateOpenDateTimeFieldProperty } from 'types/open/open_field_write_types';
import { getOpenFieldProperty, updateOpenFieldPropertyTransformProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const dateTimeField: IDateTimeField = {
  name: 'date field',
  id: 'fld1111',
  type: FieldType.DateTime,
  property: {
    /** date format */
    dateFormat: DateFormat['YYYY-MM-DD'],
    /** Time format */
    timeFormat: TimeFormat['HH:mm'],
    /** Whether to include time */
    includeTime: true,
    /** Whether to automatically fill in the creation time when adding a new record */
    autoFill: false
  }
};

const openDateTimeField: IOpenField = {
  name: 'date field',
  id: 'fld1111',
  type: APIMetaFieldType.DateTime,
  property: {
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm',
    includeTime: true,
    autoFill: false
  }
};

const propertyOptionalFill: IUpdateOpenDateTimeFieldProperty = {
  dateFormat: 'YYYY-MM-DD',
  timeFormat: 'HH:mm',
  includeTime: true,
  autoFill: false
};

const propertyOptionalNotFill: IUpdateOpenDateTimeFieldProperty = {
  dateFormat: 'YYYY-MM-DD'
};

describe('Date field read property format check', () => {
  const valid = getOpenFieldProperty(dateTimeField);
  it('correct property', function () {
    const [expectValue, receiveValue] = valid(openDateTimeField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('Date field update property check', () => {
  const valid = validUpdateOpenProperty(dateTimeField);
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

describe('date field update property conversion property check', () => {
  const valid = updateOpenFieldPropertyTransformProperty(dateTimeField);
  it('Do not fill in optional fields', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalNotFill, {
      ...DateTimeField.defaultProperty(),
      dateFormat: DateFormat['YYYY-MM-DD']
    });
    expect(expectValue).toEqual(receiveValue);
  });

  it('fill in optional fields', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalFill, dateTimeField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('Add property check for date field field', () => {
  const valid = validAddOpenProperty(dateTimeField);
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