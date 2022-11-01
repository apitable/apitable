import { ICreatedByField } from '../../../types/field_types';
import { validProperty } from './common';

const createdByField: ICreatedByField = {
  name: 'CreatedBy Field',
  id: 'fld1111',
  type: 23,
  property: {
    uuids: [],
    datasheetId: 'dst11111'
  }
};

describe('Check creator field property format', () => {
  it('property = undefined', function() {
    expect(validProperty({
      ...createdByField,
      property: undefined
    } as any)).toEqual(false);
  });

  it('property = null', function() {
    expect(validProperty({
      ...createdByField,
      property: null
    } as any)).toEqual(false);
  });

  it('property = {}', function() {
    expect(validProperty({
      ...createdByField,
      property: {}
    } as any)).toEqual(false);
  });

  it('property has the wrong property', function() {
    expect(validProperty({
      ...createdByField,
      property: {
        name: '123'
      }
    } as any)).toEqual(false);
  });

  it('property is in the correct format', function() {
    expect(validProperty({
      ...createdByField
    } as any)).toEqual(true);
  });
});
