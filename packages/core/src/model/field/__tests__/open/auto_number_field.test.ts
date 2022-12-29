import { APIMetaFieldType } from 'types/field_api_enums';
import { IOpenField, IOpenFieldProperty } from 'types/open/open_field_read_types';
import { FieldType, IAutoNumberField } from 'types/field_types';
import { getOpenFieldProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const autoNumberField: IAutoNumberField = {
  name: 'Auto incremental number field',
  id: 'fld1111',
  type: FieldType.AutoNumber,
  property: {
    nextId: 0,
    viewIdx: 0,
    datasheetId: 'dst123'
  }
};

const openAutoNumberField: IOpenField = {
  name: 'Auto incremental number field',
  id: 'fld1111',
  type: APIMetaFieldType.AutoNumber,
  property: null
};

const writeOpenProperty: IOpenFieldProperty = null;

describe('Auto-Self-incrementing numeric fields read property format check', () => {
  const valid = getOpenFieldProperty(autoNumberField);
  it('the correct property', function() {
    const [expectValue, receiveValue] = valid(openAutoNumberField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('Auto-Self-incrementing numeric field update property check', () => {
  const valid = validUpdateOpenProperty(autoNumberField);
  it('Auto-increment numeric field update property', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(false);
  });
});

describe('Added property check for auto-incrementing numeric fields', () => {
  const valid = validAddOpenProperty(autoNumberField);
  it('Enter the new property parameter', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('Enter the new property parameter, not empty', () => {
    const result = valid({});
    expect(result).toEqual(false);
  });
});
