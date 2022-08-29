import { APIMetaFieldType } from 'types/field_api_enums';
import { IOpenField, IOpenFieldProperty } from 'types/open/open_field_read_types';
import { FieldType, ITextField } from 'types/field_types';
import { getOpenFieldProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const textField: ITextField = {
  name: '文本字段',
  id: 'fld1111',
  type: FieldType.Text,
  property: null
};

const openTextField: IOpenField = {
  name: '文本字段',
  id: 'fld1111',
  type: APIMetaFieldType.Text,
  property: null
};

const writeOpenProperty: IOpenFieldProperty = null;

describe('文本字段读取property格式检查', () => {
  const valid = getOpenFieldProperty(textField);
  it('正确的property', function() {
    const [expectValue, receiveValue] = valid(openTextField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('文本字段更新property检查', () => {
  const valid = validUpdateOpenProperty(textField);
  it('文本字段更新property', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(false);
  });

});

describe('文本字段新增property检查', () => {
  const valid = validAddOpenProperty(textField);
  it('输入新增property参数', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('输入新增property参数，不为空', () => {
    const result = valid({});
    expect(result).toEqual(false);
  });
});
