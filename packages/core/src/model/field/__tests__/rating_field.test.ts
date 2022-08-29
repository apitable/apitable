import { IRatingField } from '../../../types/field_types';
import { commonTestSuit, getValidCellValue, validProperty } from './common';

const ratingField: IRatingField = {
  name: '评分字段',
  id: 'fld1111',
  type: 12,
  property: { icon: 'star', max: 5 }
};

describe('评分字段的格式检查', () => {
  const valid = getValidCellValue(ratingField);

  commonTestSuit(valid);

  it('输入数字', function() {
    const [expectValue, receiveValue] = valid(12312312);
    expect(receiveValue).toEqual(expectValue);
  });

  it('输入文本类型的内容', function() {
    const [expectValue, receiveValue] = valid([{ text: '123', type: 1 }]);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('输入多选的内容', function() {
    const [expectValue, receiveValue] = valid(['optxxxxx']);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('输入单选内容', function() {
    const [expectValue, receiveValue] = valid('optxxxxx');
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('输入的附件内容', function() {
    const [expectValue, receiveValue] = valid({
      id: 'xxxx',
      name: 'xxxx',
      mimeType: 'image/jpg',
      token: 'vika.cn',
      bucket: 'image/xxxx.jpg',
      size: 123111,
    });
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('输入 1', function() {
    const [expectValue, receiveValue] = valid(1);
    expect(receiveValue).toEqual(expectValue);
  });

  it('输入 0', function() {
    const [expectValue, receiveValue] = valid(0);
    expect(receiveValue).toEqual(expectValue);
  });

  it('输入 true', function() {
    const [expectValue, receiveValue] = valid(true);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('输入 false', function() {
    const [expectValue, receiveValue] = valid(false);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('输入 unitId', function() {
    const [expectValue, receiveValue] = valid(['1632153600000']);
    expect(receiveValue).not.toEqual(expectValue);
  });

});

describe('检查数字字段 property 格式', () => {
  it('property = undefined', function() {
    expect(validProperty({
      ...ratingField,
      property: undefined
    } as any)).toEqual(false);
  });

  it('property = null', function() {
    expect(validProperty({
      ...ratingField,
      property: null
    } as any)).toEqual(false);
  });

  it('property = {}', function() {
    expect(validProperty({
      ...ratingField,
      property: {}
    } as any)).toEqual(false);
  });

  it('property 只有其他属性', function() {
    expect(validProperty({
      ...ratingField,
      property: {
        name: '123'
      }
    } as any)).toEqual(false);
  });

  it('default property', function() {
    expect(validProperty({
      ...ratingField
    } as any)).toEqual(true);
  });

  it('icon 值类型错误', function() {
    expect(validProperty({
      ...ratingField,
      property: {
        ...ratingField.property,
        icon: 12
      }
    } as any)).toEqual(false);
  });

  it('property 有多余的属性', function() {
    expect(validProperty({
      ...ratingField,
      property: {
        ...ratingField.property,
        name: '123',
        icon: ''
      }
    } as any)).toEqual(false);
  });
});

