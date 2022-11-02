import { APIMetaFieldType } from 'types/field_api_enums';
import { IOpenField, IOpenFieldProperty } from 'types/open/open_field_read_types';
import { FieldType, IAttacheField } from 'types/field_types';
import { getOpenFieldProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const attachmentField: IAttacheField = {
  name: 'Attachment Field',
  id: 'fld1111',
  type: FieldType.Attachment,
  property: null
};

const openTextField: IOpenField = {
  name: 'Attachment Field',
  id: 'fld1111',
  type: APIMetaFieldType.Attachment,
  property: null
};

const writeOpenProperty: IOpenFieldProperty = null;

describe('Attachment field read property format check', () => {
  const valid = getOpenFieldProperty(attachmentField);
  it('correct property', function() {
    const [expectValue, receiveValue] = valid(openTextField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('Attachment field update property check', () => {
  const valid = validUpdateOpenProperty(attachmentField);
  it('Attachment field update property', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(false);
  });

});

describe('Add a property check to the attachment field', () => {
  const valid = validAddOpenProperty(attachmentField);
  it('Enter the new property parameter', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('Enter the new property parameter, not empty', () => {
    const result = valid({});
    expect(result).toEqual(false);
  });
});
