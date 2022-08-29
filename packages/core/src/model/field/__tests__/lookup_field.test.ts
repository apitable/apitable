import { validProperty } from './common';
import { ILookUpField } from '../../../types/field_types';

const lookupField: ILookUpField = {
  name: 'lookup 字段',
  id: 'fld1111',
  type: 14,
  property: {
    datasheetId: 'dst123',
    relatedLinkFieldId: 'fldxxxx',
    lookUpTargetFieldId: 'fldccc'
  }
};

describe('检查 lookup 字段 property 格式', () => {
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

  it('property.datasheetId 格式不合法', function() {
    expect(validProperty({
      ...lookupField,
      property: {
        ...lookupField.property,
        datasheetId: 'dsfdsf'
      }
    } as any)).toEqual(false);
  });

  it('property.relatedLinkFieldId 格式不合法', function() {
    expect(validProperty({
      ...lookupField,
      property: {
        ...lookupField.property,
        datasheetId: 'dsfdsf'
      }
    } as any)).toEqual(false);
  });

  it('property 格式正确', function() {
    expect(validProperty({
      ...lookupField,
    } as any)).toEqual(true);
  });

  it('lookup 存在筛选项，且配置齐全', function() {
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

  it('lookup 存在筛选项，缺少 fieldId', function() {
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
