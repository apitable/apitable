import { APIMetaFieldType } from 'types/field_api_enums';
import { IOpenField, IOpenFieldProperty } from 'types/open/open_field_read_types';
import { FieldType, IURLField } from 'types/field_types';
import { getOpenFieldProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const urlField: IURLField = {
  name: 'URL field',
  id: 'fld1111',
  type: FieldType.URL,
  property: { isRecogURLFlag: false },
};

const openTextField: IOpenField = {
  name: 'URL field',
  id: 'fld1111',
  type: APIMetaFieldType.URL,
  property: null
};

const writeOpenProperty: IOpenFieldProperty = null;

describe('URL field read property format check', () => {
  const valid = getOpenFieldProperty(urlField);
  it('correct property', function() {
    const [expectValue, receiveValue] = valid(openTextField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('URL field update property check', () => {
  const valid = validUpdateOpenProperty(urlField);
  it('URL field update property', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(false);
  });

});

describe('Add property check for URL field', () => {
  const valid = validAddOpenProperty(urlField);
  it('Enter new property parameter', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('Enter the new property parameter, not empty', () => {
    const result = valid({});
    expect(result).toEqual(false);
  });
});