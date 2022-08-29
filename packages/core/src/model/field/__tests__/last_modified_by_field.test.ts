import { ILastModifiedByField } from '../../../types/field_types';
import { validProperty } from './common';

const lastModifiedByField: ILastModifiedByField = {
  name: '更新人字段',
  id: 'fld1111',
  type: 24,
  property: {
    uuids: [],
    datasheetId: 'dst11111',
    collectType: 1,
    fieldIdCollection: []
  }
};

describe('检查更新人字段 property 格式', () => {
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

  it('property 有错误的属性', function() {
    expect(validProperty({
      ...lastModifiedByField,
      property: {
        name: '123'
      }
    } as any)).toEqual(false);
  });

  it('property 格式正确', function() {
    expect(validProperty({
      ...lastModifiedByField
    } as any)).toEqual(true);
  });
});
