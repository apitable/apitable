import { DateTimeField } from 'model';
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
  it('correct property', function() {
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