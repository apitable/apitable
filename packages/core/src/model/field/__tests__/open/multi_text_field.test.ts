import { APIMetaFieldType } from 'types/field_api_enums';
import { IOpenField, IOpenFieldProperty } from 'types/open/open_field_read_types';
import { FieldType, ITextField } from 'types/field_types';
import { getOpenFieldProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const textField: ITextField = {
  name: 'text field',
  id: 'fld1111',
  type: FieldType.Text,
  property: null
};

const openTextField: IOpenField = {
  name: 'text field',
  id: 'fld1111',
  type: APIMetaFieldType.Text,
  property: null
};

const writeOpenProperty: IOpenFieldProperty = null;

describe('Text field read property format check', () => {
  const valid = getOpenFieldProperty(textField);
  it('correct property', function() {
    const [expectValue, receiveValue] = valid(openTextField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('Text field update property check', () => {
  const valid = validUpdateOpenProperty(textField);
  it('text field update property', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(false);
  });

});

describe('Add property check to text field', () => {
  const valid = validAddOpenProperty(textField);
  it('Enter new property parameter', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('Enter the new property parameter, not empty', () => {
    const result = valid({});
    expect(result).toEqual(false);
  });
});