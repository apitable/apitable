import { APIMetaFieldType } from 'types/field_api_enums';
import { IOpenField, IOpenFieldProperty } from 'types/open/open_field_read_types';
import { FieldType, IAttacheField } from 'types/field_types';
import { getOpenFieldProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const attachmentField: IAttacheField = {
  name: '附件字段',
  id: 'fld1111',
  type: FieldType.Attachment,
  property: null
};

const openTextField: IOpenField = {
  name: '附件字段',
  id: 'fld1111',
  type: APIMetaFieldType.Attachment,
  property: null
};

const writeOpenProperty: IOpenFieldProperty = null;

describe('附件字段读取property格式检查', () => {
  const valid = getOpenFieldProperty(attachmentField);
  it('正确的property', function() {
    const [expectValue, receiveValue] = valid(openTextField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('附件字段更新property检查', () => {
  const valid = validUpdateOpenProperty(attachmentField);
  it('附件字段更新property', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(false);
  });

});

describe('附件字段新增property检查', () => {
  const valid = validAddOpenProperty(attachmentField);
  it('输入新增property参数', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('输入新增property参数，不为空', () => {
    const result = valid({});
    expect(result).toEqual(false);
  });
});
