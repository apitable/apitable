import { APIMetaFieldType, FieldType, INumberField } from 'types';
import { IOpenField } from 'types/open/open_field_read_types';
import { IUpdateOpenNumberFieldProperty } from 'types/open/open_field_write_types';
import { getOpenFieldProperty, updateOpenFieldPropertyTransformProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const numberField: INumberField = {
  name: '数字字段',
  id: 'fld1111',
  type: FieldType.Number,
  property: {
    defaultValue: '1',
    precision: 1.0
  }
};

const openNumberField: IOpenField = {
  name: '数字字段',
  id: 'fld1111',
  type: APIMetaFieldType.Number,
  property: {
    defaultValue: '1',
    precision: 1.0
  }
};

const propertyOptionalFill: IUpdateOpenNumberFieldProperty = {
  defaultValue: '1',
  precision: 1.0,
  symbol: '$'
};

const propertyOptionalNotFill: IUpdateOpenNumberFieldProperty = {
  precision: 1.0
};

describe('数字字段读取property格式检查', () => {
  const valid = getOpenFieldProperty(numberField);
  it('正确的property', function() {
    const [expectValue, receiveValue] = valid(openNumberField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('数字字段更新property检查', () => {
  const valid = validUpdateOpenProperty(numberField);
  it('不填可选字段', () => {
    const result = valid(propertyOptionalNotFill);
    expect(result).toEqual(true);
  });

  it('填可选字段', () => {
    const result = valid(propertyOptionalFill);
    expect(result).toEqual(true);
  });

  it('数字字段更新property为空的时候', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});

describe('数字字段更新property转换property检查', () => {
  const valid = updateOpenFieldPropertyTransformProperty(numberField);
  it('不填可选字段', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalFill, propertyOptionalFill);
    expect(expectValue).toEqual(receiveValue);
  });

  it('填可选字段', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalNotFill, propertyOptionalNotFill);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('数字字段字段新增property检查', () => {
  const valid = validAddOpenProperty(numberField);
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
