import { APIMetaFieldType, FieldType, INumberField } from 'types';
import { IOpenField } from 'types/open/open_field_read_types';
import { IUpdateOpenNumberFieldProperty } from 'types/open/open_field_write_types';
import { getOpenFieldProperty, updateOpenFieldPropertyTransformProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const numberField: INumberField = {
  name: 'Number field',
  id: 'fld1111',
  type: FieldType.Number,
  property: {
    defaultValue: '1',
    precision: 1.0
  }
};

const openNumberField: IOpenField = {
  name: 'Number field',
  id: 'fld1111',
  type: APIMetaFieldType.Number,
  property: {
    defaultValue: '1',
    precision: 1.0
  }
};

const propertyOptionalFill: IUpdateOpenNumberFieldProperty = {
  defaultValue: '1',
  precision: 1.0,
  symbol: '$'
};

const propertyOptionalNotFill: IUpdateOpenNumberFieldProperty = {
  precision: 1.0
};

describe('Number field read property format check', () => {
  const valid = getOpenFieldProperty(numberField);
  it('correct property', function() {
    const [expectValue, receiveValue] = valid(openNumberField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('Number field update property check', () => {
  const valid = validUpdateOpenProperty(numberField);
  it('Do not fill in optional fields', () => {
    const result = valid(propertyOptionalNotFill);
    expect(result).toEqual(true);
  });

  it('fill in optional fields', () => {
    const result = valid(propertyOptionalFill);
    expect(result).toEqual(true);
  });

  it('When the numeric field is updated when the property is empty', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});

describe('Number field update property conversion property check', () => {
  const valid = updateOpenFieldPropertyTransformProperty(numberField);
  it('Do not fill in optional fields', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalFill, propertyOptionalFill);
    expect(expectValue).toEqual(receiveValue);
  });

  it('fill in optional fields', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalNotFill, propertyOptionalNotFill);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('Add property check for numeric fields', () => {
  const valid = validAddOpenProperty(numberField);
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