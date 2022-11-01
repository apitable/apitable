import { ILastModifiedByField } from '../../../types/field_types';
import { validProperty } from './common';

const lastModifiedByField: ILastModifiedByField = {
  name: 'LastModifiedBy Field',
  id: 'fld1111',
  type: 24,
  property: {
    uuids: [],
    datasheetId: 'dst11111',
    collectType: 1,
    fieldIdCollection: []
  }
};

describe('Check the updated by field property format', () => {
  it('property = undefined', function() {
    expect(validProperty({
      ...lastModifiedByField,
      property: undefined
    } as any)).toEqual(false);
  });

  it('property = null', function() {
    expect(validProperty({
      ...lastModifiedByField,
      property: null
    } as any)).toEqual(false);
  });

  it('property = {}', function() {
    expect(validProperty({
      ...lastModifiedByField,
      property: {}
    } as any)).toEqual(false);
  });

  it('property has the wrong property', function() {
    expect(validProperty({
      ...lastModifiedByField,
      property: {
        name: '123'
      }
    } as any)).toEqual(false);
  });

  it('property is in the correct format', function() {
    expect(validProperty({
      ...lastModifiedByField
    } as any)).toEqual(true);
  });
});
