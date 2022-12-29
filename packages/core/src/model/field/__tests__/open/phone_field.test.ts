import { APIMetaFieldType } from 'types/field_api_enums';
import { IOpenField, IOpenFieldProperty } from 'types/open/open_field_read_types';
import { FieldType, IPhoneField } from 'types/field_types';
import { getOpenFieldProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const phoneField: IPhoneField = {
  name: 'Phone field',
  id: 'fld1111',
  type: FieldType.Phone,
  property: null
};

const openTextField: IOpenField = {
  name: 'Phone field',
  id: 'fld1111',
  type: APIMetaFieldType.Phone,
  property: null
};

const writeOpenProperty: IOpenFieldProperty = null;

describe('Phone field read property format check', () => {
  const valid = getOpenFieldProperty(phoneField);
  it('correct property', function() {
    const [expectValue, receiveValue] = valid(openTextField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('Phone field update property check', () => {
  const valid = validUpdateOpenProperty(phoneField);
  it('phone field update property', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(false);
  });

});

describe('Add property check for phone field', () => {
  const valid = validAddOpenProperty(phoneField);
  it('Enter new property parameter', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('Enter the new property parameter, not empty', () => {
    const result = valid({});
    expect(result).toEqual(false);
  });
});