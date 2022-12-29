import { validProperty } from './common';
import { ILookUpField } from '../../../types/field_types';

const lookupField: ILookUpField = {
  name: 'lookup field',
  id: 'fld1111',
  type: 14,
  property: {
    datasheetId: 'dst123',
    relatedLinkFieldId: 'fldxxxx',
    lookUpTargetFieldId: 'fldccc'
  }
};

describe('Check lookup field property format', () => {
  it('property = undefined', function() {
    expect(validProperty({
      ...lookupField,
      property: undefined
    } as any)).toEqual(false);
  });

  it('property = null', function() {
    expect(validProperty({
      ...lookupField,
      property: null
    } as any)).toEqual(false);
  });

  it('property = {}', function() {
    expect(validProperty({
      ...lookupField,
      property: {}
    } as any)).toEqual(false);
  });

  it('property.datasheetId =""', function() {
    expect(validProperty({
      ...lookupField,
      property: {
        ...lookupField.property,
        datasheetId: ''
      }
    } as any)).toEqual(false);
  });

  it('property.datasheetId format is invalid', function() {
    expect(validProperty({
      ...lookupField,
      property: {
        ...lookupField.property,
        datasheetId: 'dsfdsf'
      }
    } as any)).toEqual(false);
  });

  it('property.relatedLinkFieldId format is invalid', function() {
    expect(validProperty({
      ...lookupField,
      property: {
        ...lookupField.property,
        datasheetId: 'dsfdsf'
      }
    } as any)).toEqual(false);
  });

  it('property is in the correct format', function() {
    expect(validProperty({
      ...lookupField,
    } as any)).toEqual(true);
  });

  it('Lookup has filter items and is fully configured', function() {
    expect(validProperty({
      ...lookupField,
      filterInfo: {
        conjunction: 'and',
        conditions: [
          {
            conditionId: '123',
            fieldId: 'fldxxx',
            operator: 'is',
            fieldType: 1
          }
        ]
      },
      openFilter: true
    } as any)).toEqual(true);
  });

  it('lookup filter item exists, missing fieldId', function() {
    expect(validProperty({
      ...lookupField,
      property: {
        ...lookupField,
        filterInfo: {
          conjunction: 'and',
          conditions: [
            {
              conditionId: '123',
              operator: 'is',
              fieldType: 1
            }
          ]
        },
        openFilter: true
      },
    } as any)).toEqual(false);
  });
});
