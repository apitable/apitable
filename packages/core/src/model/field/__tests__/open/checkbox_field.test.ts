import { APIMetaFieldType } from 'types/field_api_enums';
import { IOpenField, IOpenCheckboxFieldProperty } from 'types/open/open_field_read_types';
import { FieldType, ICheckboxField } from 'types/field_types';
import { getOpenFieldProperty, updateOpenFieldPropertyTransformProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const textField: ICheckboxField = {
  name: '勾选字段',
  id: 'fld1111',
  type: FieldType.Checkbox,
  property: {
    icon: 'flag-ni'
  }
};

const openCheckboxField: IOpenField = {
  name: '勾选字段',
  id: 'fld1111',
  type: APIMetaFieldType.Checkbox,
  property: {
    icon: '🇳🇮'
  }
};

const writeOpenProperty: IOpenCheckboxFieldProperty = {
  icon: 'flag-ni'
};

describe('勾选字段读取property格式检查', () => {
  const valid = getOpenFieldProperty(textField);
  it('正确的property', function() {
    const [expectValue, receiveValue] = valid(openCheckboxField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('勾选字段更新property检查', () => {
  const valid = validUpdateOpenProperty(textField);
  it('勾选字段更新property', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('勾选字段更新property为错误的icon', () => {
    const result = valid({ icon: 'test' });
    expect(result).toEqual(false);
  });

  it('勾选字段更新property为空的时候', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});

describe('勾选字段新增property检查', () => {
  const valid = validAddOpenProperty(textField);
  it('输入正确的新增property参数', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('新增property为空的时候', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});

describe('勾选字段更新property转换property检查', () => {
  const valid = updateOpenFieldPropertyTransformProperty(textField);
  it('输入正确的更新property参数', () => {
    const [expectValue, receiveValue] = valid(writeOpenProperty, textField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});