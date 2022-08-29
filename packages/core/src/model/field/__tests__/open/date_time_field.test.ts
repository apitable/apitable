import { DateTimeField } from 'model';
import { APIMetaFieldType, DateFormat, FieldType, IDateTimeField, TimeFormat } from 'types';
import { IOpenField } from 'types/open/open_field_read_types';
import { IUpdateOpenDateTimeFieldProperty } from 'types/open/open_field_write_types';
import { getOpenFieldProperty, updateOpenFieldPropertyTransformProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const dateTimeField: IDateTimeField = {
  name: '日期字段',
  id: 'fld1111',
  type: FieldType.DateTime,
  property: {
    /** 日期格式 */
    dateFormat: DateFormat['YYYY-MM-DD'],
    /** 时间格式 */
    timeFormat: TimeFormat['HH:mm'],
    /** 是否包含时间 */
    includeTime: true,
    /** 新增记录时是否自动填入创建时间 */
    autoFill: false
  }
};

const openDateTimeField: IOpenField = {
  name: '日期字段',
  id: 'fld1111',
  type: APIMetaFieldType.DateTime,
  property: {
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm',
    includeTime: true,
    autoFill: false
  }
};

const propertyOptionalFill: IUpdateOpenDateTimeFieldProperty = {
  dateFormat: 'YYYY-MM-DD',
  timeFormat: 'HH:mm',
  includeTime: true,
  autoFill: false
};

const propertyOptionalNotFill: IUpdateOpenDateTimeFieldProperty = {
  dateFormat: 'YYYY-MM-DD'
};

describe('日期字段读取property格式检查', () => {
  const valid = getOpenFieldProperty(dateTimeField);
  it('正确的property', function() {
    const [expectValue, receiveValue] = valid(openDateTimeField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('日期字段更新property检查', () => {
  const valid = validUpdateOpenProperty(dateTimeField);
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

describe('日期字段更新property转换property检查', () => {
  const valid = updateOpenFieldPropertyTransformProperty(dateTimeField);
  it('不填可选字段', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalNotFill, {
      ...DateTimeField.defaultProperty(),
      dateFormat: DateFormat['YYYY-MM-DD']
    });
    expect(expectValue).toEqual(receiveValue);
  });

  it('填可选字段', () => {
    const [expectValue, receiveValue] = valid(propertyOptionalFill, dateTimeField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('日期字段字段新增property检查', () => {
  const valid = validAddOpenProperty(dateTimeField);
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
