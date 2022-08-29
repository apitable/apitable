import { APIMetaFieldType } from 'types/field_api_enums';
import { IOpenField, IOpenSingleTextFieldProperty } from 'types/open/open_field_read_types';
import { FieldType, ISingleTextField } from 'types/field_types';
import { getOpenFieldProperty, updateOpenFieldPropertyTransformProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const textField: ISingleTextField = {
  name: '文本字段',
  id: 'fld1111',
  type: FieldType.SingleText,
  property: {
    defaultValue: '1'
  }
};

const openSingleTextField: IOpenField = {
  name: '文本字段',
  id: 'fld1111',
  type: APIMetaFieldType.SingleText,
  property: {
    defaultValue: '1'
  }
};

const writeOpenProperty: IOpenSingleTextFieldProperty = {
  defaultValue: '1'
};

describe('文本字段读取property格式检查', () => {
  const valid = getOpenFieldProperty(textField);
  it('正确的property', function() {
    const [expectValue, receiveValue] = valid(openSingleTextField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('文本字段更新property检查', () => {
  const valid = validUpdateOpenProperty(textField);
  it('文本字段更新property', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('文本字段更新property为空的时候', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});

describe('文本字段新增property检查', () => {
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

describe('文本字段更新property转换property检查', () => {
  const valid = updateOpenFieldPropertyTransformProperty(textField);
  it('输入正确的更新property参数', () => {
    const [expectValue, receiveValue] = valid(writeOpenProperty, textField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('文本字段字段新增property检查', () => {
  const valid = validAddOpenProperty(textField);
  it('property 有值', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('为空的时候', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});