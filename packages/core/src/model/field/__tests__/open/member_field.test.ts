import { APIMetaFieldType, FieldType, IMemberField } from 'types';
import { IOpenField } from 'types/open/open_field_read_types';
import { IUpdateOpenMemberFieldProperty } from 'types/open/open_field_write_types';
import { getOpenFieldProperty, updateOpenFieldPropertyTransformProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const memberField: IMemberField = {
  name: '成员字段',
  id: 'fld1111',
  type: FieldType.Member,
  property: {
    isMulti: false, // 可选单个或者多个成员。
    shouldSendMsg: false, // 选择成员后是否发送消息通知
    unitIds: []
  }
};

const openMemberField: IOpenField = {
  name: '邮箱字段',
  id: 'fld1111',
  type: APIMetaFieldType.Member,
  property: {
    options: [],
    isMulti: false,
    shouldSendMsg: false
  }
};

const propertyOptionalFill: IUpdateOpenMemberFieldProperty = {
  isMulti: false,
  shouldSendMsg: false
};

const propertyOptionalNotFill: IUpdateOpenMemberFieldProperty = {
};

describe('成员字段读取property格式检查', () => {
  const valid = getOpenFieldProperty(memberField);
  it('正确的property', function() {
    const [expectValue, receiveValue] = valid(openMemberField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('成员字段更新property检查', () => {
  const valid = validUpdateOpenProperty(memberField);
  it('不填可选字段', () => {
    const result = valid(propertyOptionalNotFill);
    expect(result).toEqual(true);
  });

  it('填可选字段', () => {
    const result = valid(propertyOptionalFill);
    expect(result).toEqual(true);
  });

  it('更新property为空的时候', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});

describe('成员字段更新property转换property检查', () => {
  const valid = updateOpenFieldPropertyTransformProperty(memberField);
  it('不填可选字段', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalNotFill, memberField.property);
    expect(expectValue).toEqual(receiveValue);
  });

  it('填可选字段', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalFill, memberField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('成员字段字段新增property检查', () => {
  const valid = validAddOpenProperty(memberField);
  it('不填可选字段', () => {
    const result = valid(propertyOptionalNotFill);
    expect(result).toEqual(true);
  });

  it('填可选字段', () => {
    const result = valid(propertyOptionalFill);
    expect(result).toEqual(true);
  });

  it('为空的时候', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});

