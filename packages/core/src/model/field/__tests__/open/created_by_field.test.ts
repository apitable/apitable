import { APIMetaFieldType } from 'types/field_api_enums';
import { IOpenField, IOpenFieldProperty } from 'types/open/open_field_read_types';
import { FieldType, ICreatedByField } from 'types/field_types';
import { getOpenFieldProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const createdByField: ICreatedByField = {
  name: 'Creator Field',
  id: 'fld1111',
  type: FieldType.CreatedBy,
  property: {
    uuids: [],
    datasheetId: 'dst1111'
  }
};

const openCreatedByField: IOpenField = {
  name: 'Creator Field',
  id: 'fld1111',
  type: APIMetaFieldType.CreatedBy,
  property: null
};

const writeOpenProperty: IOpenFieldProperty = null;

describe('Created by field read property format check', () => {
  const valid = getOpenFieldProperty(createdByField);
  it('correct property', function() {
    const [expectValue, receiveValue] = valid(openCreatedByField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('Created by field update property check', () => {
  const valid = validUpdateOpenProperty(createdByField);
  it('Creator field update property', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(false);
  });
});

describe('Added property check to the creator field', () => {
  const valid = validAddOpenProperty(createdByField);
  it('Enter the new property parameter', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });
  it('Enter the new property parameter, not empty', () => {
    const result = valid({});
    expect(result).toEqual(false);
  });
});
