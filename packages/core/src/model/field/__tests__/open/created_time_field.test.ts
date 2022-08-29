import { CreatedTimeField } from 'model';
import { APIMetaFieldType, DateFormat, FieldType, ICreatedTimeField, TimeFormat } from 'types';
import { IOpenField } from 'types/open/open_field_read_types';
import { IUpdateOpenCreatedTimeFieldProperty } from 'types/open/open_field_write_types';
import { getOpenFieldProperty, updateOpenFieldPropertyTransformProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const createdTimeField: ICreatedTimeField = {
  name: '创建时间字段',
  id: 'fld1111',
  type: FieldType.CreatedTime,
  property: {
    datasheetId: 'dst1111',
    /** 创建时间格式 */
    dateFormat: DateFormat['YYYY-MM-DD'],
    /** 时间格式 */
    timeFormat: TimeFormat['HH:mm'],
    /** 是否包含时间 */
    includeTime: true
  }
};

const openCreatedTimeField: IOpenField = {
  name: '创建时间字段',
  id: 'fld1111',
  type: APIMetaFieldType.CreatedTime,
  property: {
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm',
    includeTime: true,
  }
};

const propertyOptionalFill: IUpdateOpenCreatedTimeFieldProperty = {
  dateFormat: 'YYYY-MM-DD',
  timeFormat: 'HH:mm',
  includeTime: true,
};

const propertyOptionalNotFill: IUpdateOpenCreatedTimeFieldProperty = {
  dateFormat: 'YYYY-MM-DD'
};

describe('创建时间字段读取property格式检查', () => {
  const valid = getOpenFieldProperty(createdTimeField);
  it('正确的property', function() {
    const [expectValue, receiveValue] = valid(openCreatedTimeField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('创建时间字段更新property检查', () => {
  const valid = validUpdateOpenProperty(createdTimeField);
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

describe('创建时间字段更新property转换property检查', () => {
  const valid = updateOpenFieldPropertyTransformProperty(createdTimeField);
  it('不填可选字段', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalNotFill, {
      ...CreatedTimeField.defaultProperty(),
      dateFormat: DateFormat['YYYY-MM-DD'],
      datasheetId: createdTimeField.property.datasheetId
    });
    expect(expectValue).toEqual(receiveValue);
  });

  it('填可选字段', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalFill, createdTimeField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('创建时间字段新增property检查', () => {
  const valid = validAddOpenProperty(createdTimeField);
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
