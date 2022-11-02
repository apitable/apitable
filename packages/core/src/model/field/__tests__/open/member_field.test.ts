import { APIMetaFieldType, FieldType, IMemberField } from 'types';
import { IOpenField } from 'types/open/open_field_read_types';
import { IUpdateOpenMemberFieldProperty } from 'types/open/open_field_write_types';
import { getOpenFieldProperty, updateOpenFieldPropertyTransformProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const memberField: IMemberField = {
  name: 'Member field',
  id: 'fld1111',
  type: FieldType.Member,
  property: {
    isMulti: false, // Optional single or multiple members.
    shouldSendMsg: false, // Whether to send a message notification after selecting a member
    unitIds: []
  }
};

const openMemberField: IOpenField = {
  name: 'Email field',
  id: 'fld1111',
  type: APIMetaFieldType.Member,
  property: {
    options: [],
    isMulti: false,
    shouldSendMsg: false
  }
};

const propertyOptionalFill: IUpdateOpenMemberFieldProperty = {
  isMulti: false,
  shouldSendMsg: false
};

const propertyOptionalNotFill: IUpdateOpenMemberFieldProperty = {
};

describe('Member field read property format check', () => {
  const valid = getOpenFieldProperty(memberField);
  it('correct property', function() {
    const [expectValue, receiveValue] = valid(openMemberField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('Member field update property check', () => {
  const valid = validUpdateOpenProperty(memberField);
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

describe('Member field update property conversion property check', () => {
  const valid = updateOpenFieldPropertyTransformProperty(memberField);
  it('Do not fill in optional fields', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalNotFill, memberField.property);
    expect(expectValue).toEqual(receiveValue);
  });

  it('fill in optional fields', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalFill, memberField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('Add property check to member field field', () => {
  const valid = validAddOpenProperty(memberField);
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