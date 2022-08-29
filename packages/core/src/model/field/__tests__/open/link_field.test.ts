import { APIMetaFieldType, FieldType, ILinkField } from 'types';
import { IOpenField } from 'types/open/open_field_read_types';
import { Conversion, IUpdateOpenMagicLinkFieldProperty } from 'types/open/open_field_write_types';
import { getOpenFieldProperty, updateOpenFieldPropertyTransformProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const linkField: ILinkField = {
  name: '关联字段',
  id: 'fld1111',
  type: FieldType.Link,
  property: {
    foreignDatasheetId: 'dst111111',
    brotherFieldId: 'fld1111111',
    limitToView: 'viw111111',
    limitSingleRecord: false,
  }
};

const openLinkField: IOpenField = {
  name: '关联字段',
  id: 'fld1111',
  type: APIMetaFieldType.MagicLink,
  property: {
    foreignDatasheetId: 'dst111111',
    brotherFieldId: 'fld1111111',
    limitToViewId: 'viw111111',
    limitSingleRecord: false,
  }
};

const propertyOptionalFill: IUpdateOpenMagicLinkFieldProperty = {
  foreignDatasheetId: 'dst2222',
  limitToViewId: 'viw22222',
  limitSingleRecord: false,
  conversion: Conversion.KeepText
};

const propertyOptionalNotFill: IUpdateOpenMagicLinkFieldProperty = {
  foreignDatasheetId: 'dst2222',
};

describe('神奇关联字段读取property格式检查', () => {
  const valid = getOpenFieldProperty(linkField);
  it('正确的property', function() {
    const [expectValue, receiveValue] = valid(openLinkField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('神奇关联字段更新property检查', () => {
  const valid = validUpdateOpenProperty(linkField);
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

describe('神奇关联字段更新property转换property检查', () => {
  const valid = updateOpenFieldPropertyTransformProperty(linkField);
  it('不填可选字段', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalNotFill, propertyOptionalNotFill);
    expect(expectValue).toEqual(receiveValue);
  });

  it('填可选字段', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalFill, {
      foreignDatasheetId: 'dst2222',
      limitToView: 'viw22222',
      limitSingleRecord: false
    });
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('神奇关联字段字段新增property检查', () => {
  const valid = validAddOpenProperty(linkField);
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