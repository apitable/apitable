import { APIMetaFieldType } from 'types/field_api_enums';
import { IOpenField, IOpenFieldProperty } from 'types/open/open_field_read_types';
import { FieldType, IAutoNumberField } from 'types/field_types';
import { getOpenFieldProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const autoNumberField: IAutoNumberField = {
  name: '自增数字字段',
  id: 'fld1111',
  type: FieldType.AutoNumber,
  property: {
    nextId: 0,
    viewIdx: 0,
    datasheetId: 'dst123'
  }
};

const openAutoNumberField: IOpenField = {
  name: '自增数字字段',
  id: 'fld1111',
  type: APIMetaFieldType.AutoNumber,
  property: null
};

const writeOpenProperty: IOpenFieldProperty = null;

describe('自增数字字段读取property格式检查', () => {
  const valid = getOpenFieldProperty(autoNumberField);
  it('正确的property', function() {
    const [expectValue, receiveValue] = valid(openAutoNumberField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('自增数字字段更新property检查', () => {
  const valid = validUpdateOpenProperty(autoNumberField);
  it('自增数字字段更新property', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(false);
  });
});

describe('自增数字字段新增property检查', () => {
  const valid = validAddOpenProperty(autoNumberField);
  it('输入新增property参数', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('输入新增property参数，不为空', () => {
    const result = valid({});
    expect(result).toEqual(false);
  });
});
