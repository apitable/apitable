import { IAutoNumberField } from '../../../types/field_types';
import { validProperty } from './common';

const autoNumberField: IAutoNumberField = {
  name: 'Auto Increment Number Field',
  id: 'fld1111',
  type: 20,
  property: {
    nextId: 0,
    viewIdx: 0,
    datasheetId: 'dst123'
  }
};

describe('Check auto-incrementing numeric field property format', () => {
  it('property = undefined', function() {
    expect(validProperty({
      ...autoNumberField,
      property: undefined
    } as any)).toEqual(false);
  });

  it('property = null', function() {
    expect(validProperty({
      ...autoNumberField,
      property: null
    } as any)).toEqual(false);
  });

  it('property = {}', function() {
    expect(validProperty({
      ...autoNumberField,
      property: {}
    } as any)).toEqual(false);
  });

  it('property has the wrong property', function() {
    expect(validProperty({
      ...autoNumberField,
      property: {
        ...autoNumberField,
        name: '123'
      }
    } as any)).toEqual(false);
  });

  it('property is in the correct format', function() {
    expect(validProperty({
      ...autoNumberField
    } as any)).toEqual(true);
  });
});
