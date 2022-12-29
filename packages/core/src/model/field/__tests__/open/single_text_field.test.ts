import { APIMetaFieldType } from 'types/field_api_enums';
import { IOpenField, IOpenSingleTextFieldProperty } from 'types/open/open_field_read_types';
import { FieldType, ISingleTextField } from 'types/field_types';
import { getOpenFieldProperty, updateOpenFieldPropertyTransformProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const textField: ISingleTextField = {
  name: 'text field',
  id: 'fld1111',
  type: FieldType.SingleText,
  property: {
    defaultValue: '1'
  }
};

const openSingleTextField: IOpenField = {
  name: 'text field',
  id: 'fld1111',
  type: APIMetaFieldType.SingleText,
  property: {
    defaultValue: '1'
  }
};

const writeOpenProperty: IOpenSingleTextFieldProperty = {
  defaultValue: '1'
};

describe('Text field read property format check', () => {
  const valid = getOpenFieldProperty(textField);
  it('correct property', function() {
    const [expectValue, receiveValue] = valid(openSingleTextField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('Text field update property check', () => {
  const valid = validUpdateOpenProperty(textField);
  it('text field update property', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('text field update property is empty', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});

describe('Add property check to text field', () => {
  const valid = validAddOpenProperty(textField);
  it('Enter the correct new property parameter', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('When the new property is empty', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});

describe('Text field update property conversion property check', () => {
  const valid = updateOpenFieldPropertyTransformProperty(textField);
  it('Enter the correct update property parameters', () => {
    const [expectValue, receiveValue] = valid(writeOpenProperty, textField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('Add property check to text field', () => {
  const valid = validAddOpenProperty(textField);
  it('property has value', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('when empty', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});