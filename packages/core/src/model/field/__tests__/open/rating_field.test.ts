import { APIMetaFieldType } from 'types/field_api_enums';
import { IOpenField, IOpenRatingFieldProperty } from 'types/open/open_field_read_types';
import { FieldType, IRatingField } from 'types/field_types';
import { getOpenFieldProperty, updateOpenFieldPropertyTransformProperty, validAddOpenProperty, validUpdateOpenProperty } from './common';

const ratingField: IRatingField = {
  name: '评分字段',
  id: 'fld1111',
  type: FieldType.Rating,
  property: {
    max: 2,
    icon: 'flag-ni'
  }
};

const openRatingField: IOpenField = {
  name: '评分字段',
  id: 'fld1111',
  type: APIMetaFieldType.Rating,
  property: {
    max: 2,
    icon: '🇳🇮'
  }
};

const writeOpenProperty: IOpenRatingFieldProperty = {
  max: 2,
  icon: 'flag-ni'
};

describe('评分字段读取property格式检查', () => {
  const valid = getOpenFieldProperty(ratingField);
  it('正确的property', function() {
    const [expectValue, receiveValue] = valid(openRatingField.property);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('评分字段更新property检查', () => {
  const valid = validUpdateOpenProperty(ratingField);
  it('评分字段更新property', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('评分字段更新property为错误的icon', () => {
    const result = valid({ icon: 'test', max: 5 });
    expect(result).toEqual(false);
  });

  it('评分字段更新property为错误的范围', () => {
    const result = valid({ icon: 'flag-ni', max: 11 });
    expect(result).toEqual(false);
  });

  it('评分字段更新property为空的时候', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});

describe('评分字段更新property转换property检查', () => {
  const valid = updateOpenFieldPropertyTransformProperty(ratingField);
  it('输入正确的更新property参数', () => {
    const [expectValue, receiveValue] = valid(writeOpenProperty, ratingField.property);
    expect(expectValue).toEqual(receiveValue);
  });
});

describe('评分字段字段新增property检查', () => {
  const valid = validAddOpenProperty(ratingField);
  it('property 有值', () => {
    const result = valid(writeOpenProperty);
    expect(result).toEqual(true);
  });

  it('为空的时候', () => {
    const result = valid(null);
    expect(result).toEqual(false);
  });
});
