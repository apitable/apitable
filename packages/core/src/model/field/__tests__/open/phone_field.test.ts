import { APIMetaFieldType } from 'types/field_api_enums';
import { IOpenField, IOpenFieldProperty } from 'types/open/open_field_read_types';
import { FieldType, IPhoneField } from 'types/field_types';
import { getOpenFieldProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const phoneField: IPhoneField = {
  name: '电话字段',
  id: 'fld1111',
  type: FieldType.Phone,
  property: null
};

const openTextField: IOpenField = {
  name: '电话字段',
  id: 'fld1111',
  type: APIMetaFieldType.Phone,
  property: null
};

const writeOpenProperty: IOpenFieldProperty = null;

describe('电话字段读取property格式检查', () => {
  const valid = getOpenFieldProperty(phoneField);
  it('正确的property', function() {
    const [expectValue, receiveValue] = valid(openTextField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('电话字段更新property检查', () => {
  const valid = validUpdateOpenProperty(phoneField);
  it('电话字段更新property', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(false);
  });

});

describe('电话字段新增property检查', () => {
  const valid = validAddOpenProperty(phoneField);
  it('输入新增property参数', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('输入新增property参数，不为空', () => {
    const result = valid({});
    expect(result).toEqual(false);
  });
});
