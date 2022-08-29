import { APIMetaFieldType } from 'types/field_api_enums';
import { IOpenField, IOpenFieldProperty } from 'types/open/open_field_read_types';
import { FieldType, IURLField } from 'types/field_types';
import { getOpenFieldProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const urlField: IURLField = {
  name: 'URL字段',
  id: 'fld1111',
  type: FieldType.URL,
  property: { isRecogURLFlag: false },
};

const openTextField: IOpenField = {
  name: 'URL字段',
  id: 'fld1111',
  type: APIMetaFieldType.URL,
  property: null
};

const writeOpenProperty: IOpenFieldProperty = null;

describe('URL字段读取property格式检查', () => {
  const valid = getOpenFieldProperty(urlField);
  it('正确的property', function() {
    const [expectValue, receiveValue] = valid(openTextField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('URL字段更新property检查', () => {
  const valid = validUpdateOpenProperty(urlField);
  it('URL字段更新property', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(false);
  });

});

describe('URL字段新增property检查', () => {
  const valid = validAddOpenProperty(urlField);
  it('输入新增property参数', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('输入新增property参数，不为空', () => {
    const result = valid({});
    expect(result).toEqual(false);
  });
});
