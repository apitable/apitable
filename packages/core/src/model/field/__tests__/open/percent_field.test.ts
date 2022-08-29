import { APIMetaFieldType, FieldType, IPercentField } from 'types';
import { IOpenField } from 'types/open/open_field_read_types';
import { IUpdateOpenPercentFieldProperty } from 'types/open/open_field_write_types';
import { getOpenFieldProperty, updateOpenFieldPropertyTransformProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const percentField: IPercentField = {
  name: '百分比字段',
  id: 'fld1111',
  type: FieldType.Percent,
  property: {
    defaultValue: '1',
    precision: 1
  }
};

const openPercentField: IOpenField = {
  name: '百分比字段',
  id: 'fld1111',
  type: APIMetaFieldType.Percent,
  property: {
    defaultValue: '1',
    precision: 1
  }
};

const propertyOptionalFill: IUpdateOpenPercentFieldProperty = {
  defaultValue: '1',
  precision: 1
};

const propertyOptionalNotFill: IUpdateOpenPercentFieldProperty = {
  precision: 1
};

describe('百分比字段读取property格式检查', () => {
  const valid = getOpenFieldProperty(percentField);
  it('正确的property', function() {
    const [expectValue, receiveValue] = valid(openPercentField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('百分比字段更新property检查', () => {
  const valid = validUpdateOpenProperty(percentField);
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

describe('百分比字段更新property转换property检查', () => {
  const valid = updateOpenFieldPropertyTransformProperty(percentField);
  it('不填可选字段', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalNotFill, propertyOptionalNotFill);
    expect(expectValue).toEqual(receiveValue);
  });

  it('填可选字段', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalFill, propertyOptionalFill);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('百分比字段字段新增property检查', () => {
  const valid = validAddOpenProperty(percentField);
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
