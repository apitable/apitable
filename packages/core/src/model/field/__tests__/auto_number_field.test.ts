import { IAutoNumberField } from '../../../types/field_types';
import { validProperty } from './common';

const autoNumberField: IAutoNumberField = {
  name: '自增数字字段',
  id: 'fld1111',
  type: 20,
  property: {
    nextId: 0,
    viewIdx: 0,
    datasheetId: 'dst123'
  }
};

describe('检查自增数字字段 property 格式', () => {
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

  it('property 有错误的属性', function() {
    expect(validProperty({
      ...autoNumberField,
      property: {
        ...autoNumberField,
        name: '123'
      }
    } as any)).toEqual(false);
  });

  it('property 格式正确', function() {
    expect(validProperty({
      ...autoNumberField
    } as any)).toEqual(true);
  });
});
