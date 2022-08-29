import { APIMetaFieldType } from 'types/field_api_enums';
import { IOpenField, IOpenFieldProperty } from 'types/open/open_field_read_types';
import { FieldType, IEmailField } from 'types/field_types';
import { getOpenFieldProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const emailField: IEmailField = {
  name: '邮箱字段',
  id: 'fld1111',
  type: FieldType.Email,
  property: null
};

const openTextField: IOpenField = {
  name: '邮箱字段',
  id: 'fld1111',
  type: APIMetaFieldType.Email,
  property: null
};

const writeOpenProperty: IOpenFieldProperty = null;

describe('邮箱字段读取property格式检查', () => {
  const valid = getOpenFieldProperty(emailField);
  it('正确的property', function() {
    const [expectValue, receiveValue] = valid(openTextField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('邮箱字段更新property检查', () => {
  const valid = validUpdateOpenProperty(emailField);
  it('邮箱字段更新property', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(false);
  });
});

describe('邮箱字段新增property检查', () => {
  const valid = validAddOpenProperty(emailField);
  it('输入新增property参数', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('输入新增property参数，不为空', () => {
    const result = valid({});
    expect(result).toEqual(false);
  });
});

