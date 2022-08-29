import { LastModifiedTimeField } from 'model';
import { APIMetaFieldType, CollectType, DateFormat, FieldType, ILastModifiedTimeField, TimeFormat } from 'types';
import { IOpenField } from 'types/open/open_field_read_types';
import { IUpdateOpenLastModifiedTimeFieldProperty } from 'types/open/open_field_write_types';
import { getOpenFieldProperty, updateOpenFieldPropertyTransformProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const lastModifiedTimeField: ILastModifiedTimeField = {
  name: '修改时间字段',
  id: 'fld1111',
  type: FieldType.LastModifiedTime,
  property: {
    datasheetId: 'dst1111',
    dateFormat: DateFormat['YYYY-MM-DD'],
    timeFormat: TimeFormat['HH:mm'],
    includeTime: true,
    collectType: CollectType.SpecifiedFields,
    fieldIdCollection: ['fld2222']
  }
};

const openLastModifiedTimeField: IOpenField = {
  name: '修改时间字段',
  id: 'fld1111',
  type: APIMetaFieldType.LastModifiedTime,
  property: {
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm',
    includeTime: true,
    collectType: CollectType.SpecifiedFields,
    fieldIdCollection: ['fld2222']
  }
};

const propertyOptionalFill: IUpdateOpenLastModifiedTimeFieldProperty = {
  dateFormat: 'YYYY-MM-DD',
  timeFormat: 'HH:mm',
  includeTime: true,
  collectType: CollectType.SpecifiedFields,
  fieldIdCollection: ['fld2222']
};

const propertyOptionalNotFill: IUpdateOpenLastModifiedTimeFieldProperty = {
  dateFormat: 'YYYY-MM-DD',
  collectType: CollectType.SpecifiedFields,
};

describe('修改时间字段读取property格式检查', () => {
  const valid = getOpenFieldProperty(lastModifiedTimeField);
  it('正确的property', function() {
    const [expectValue, receiveValue] = valid(openLastModifiedTimeField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('修改时间字段更新property检查', () => {
  const valid = validUpdateOpenProperty(lastModifiedTimeField);
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

describe('修改时间字段更新property转换property检查', () => {
  const valid = updateOpenFieldPropertyTransformProperty(lastModifiedTimeField);
  it('不填可选字段', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalNotFill, {
      ...LastModifiedTimeField.defaultProperty(),
      dateFormat: DateFormat['YYYY-MM-DD'],
      collectType: CollectType.SpecifiedFields,
      datasheetId: lastModifiedTimeField.property.datasheetId
    });
    expect(expectValue).toEqual(receiveValue);
  });

  it('填可选字段', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalFill, lastModifiedTimeField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('修改时间字段字段新增property检查', () => {
  const valid = validAddOpenProperty(lastModifiedTimeField);
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

