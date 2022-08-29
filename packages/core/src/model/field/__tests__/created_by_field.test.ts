import { ICreatedByField } from '../../../types/field_types';
import { validProperty } from './common';

const createdByField: ICreatedByField = {
  name: '勾选字段',
  id: 'fld1111',
  type: 23,
  property: {
    uuids: [],
    datasheetId: 'dst11111'
  }
};

describe('检查创建人字段 property 格式', () => {
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

  it('property 有错误的属性', function() {
    expect(validProperty({
      ...createdByField,
      property: {
        name: '123'
      }
    } as any)).toEqual(false);
  });

  it('property 格式正确', function() {
    expect(validProperty({
      ...createdByField
    } as any)).toEqual(true);
  });
});
