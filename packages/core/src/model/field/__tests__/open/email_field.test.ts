import { APIMetaFieldType } from 'types/field_api_enums';
import { IOpenField, IOpenFieldProperty } from 'types/open/open_field_read_types';
import { FieldType, IEmailField } from 'types/field_types';
import { getOpenFieldProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const emailField: IEmailField = {
  name: 'Email field',
  id: 'fld1111',
  type: FieldType.Email,
  property: null
};

const openTextField: IOpenField = {
  name: 'Email field',
  id: 'fld1111',
  type: APIMetaFieldType.Email,
  property: null
};

const writeOpenProperty: IOpenFieldProperty = null;

describe('Email field read property format check', () => {
  const valid = getOpenFieldProperty(emailField);
  it('correct property', function() {
    const [expectValue, receiveValue] = valid(openTextField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('Email field update property check', () => {
  const valid = validUpdateOpenProperty(emailField);
  it('email field update property', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(false);
  });
});

describe('Add property check for mailbox field', () => {
  const valid = validAddOpenProperty(emailField);
  it('Enter new property parameter', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('Enter the new property parameter, not empty', () => {
    const result = valid({});
    expect(result).toEqual(false);
  });
});