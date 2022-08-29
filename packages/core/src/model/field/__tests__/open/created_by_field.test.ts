import { APIMetaFieldType } from 'types/field_api_enums';
import { IOpenField, IOpenFieldProperty } from 'types/open/open_field_read_types';
import { FieldType, ICreatedByField } from 'types/field_types';
import { getOpenFieldProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const createdByField: ICreatedByField = {
  name: '创建人字段',
  id: 'fld1111',
  type: FieldType.CreatedBy,
  property: {
    uuids: [],
    datasheetId: 'dst1111'
  }
};

const openCreatedByField: IOpenField = {
  name: '创建人字段',
  id: 'fld1111',
  type: APIMetaFieldType.CreatedBy,
  property: null
};

const writeOpenProperty: IOpenFieldProperty = null;

describe('创建人字段读取property格式检查', () => {
  const valid = getOpenFieldProperty(createdByField);
  it('正确的property', function() {
    const [expectValue, receiveValue] = valid(openCreatedByField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('创建人字段更新property检查', () => {
  const valid = validUpdateOpenProperty(createdByField);
  it('创建人字段更新property', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(false);
  });
});

describe('创建人字段新增property检查', () => {
  const valid = validAddOpenProperty(createdByField);
  it('输入新增property参数', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });
  it('输入新增property参数，不为空', () => {
    const result = valid({});
    expect(result).toEqual(false);
  });
});
