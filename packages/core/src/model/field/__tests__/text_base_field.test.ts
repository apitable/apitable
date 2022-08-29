import { ITextField } from '../../../types/field_types';
import { commonTestSuit, getValidCellValue, validProperty } from './common';

const textField: ITextField = {
  name: '文本字段',
  id: 'fld1111',
  type: 1,
  property: null
};

/**
 * 邮箱、单行文本、多行文本、链接、电话 这四种字段用的都是一种数据结构，所以只检查其中一种即可
 */

describe('文本字段的格式检查', () => {
  const valid = getValidCellValue(textField);

  commonTestSuit(valid);

  it('输入数字', function() {
    const [expectValue, receiveValue] = valid(12312312);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('输入文本类型的内容', function() {
    const [expectValue, receiveValue] = valid([{ text: '123', type: 1 }]);
    expect(receiveValue).toEqual(expectValue);
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
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('输入 0', function() {
    const [expectValue, receiveValue] = valid(0);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('输入 true', function() {
    const [expectValue, receiveValue] = valid(true);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('输入 false', function() {
    const [expectValue, receiveValue] = valid(false);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('输入时间戳', function() {
    const [expectValue, receiveValue] = valid(1632153600000);
    expect(receiveValue).not.toEqual(expectValue);
  });
});

// 多行文本,email,phone,url 的 property 接口设置相似，可以用同一个测试用例
describe('检查多行文本字段 property 格式', () => {
  it('property = undefined', function() {
    expect(validProperty({
      ...textField,
      property: undefined
    } as any)).toEqual(true);
  });

  it('property = null', function() {
    expect(validProperty({
      property: null
    } as any)).toEqual(true);
  });

  it('property = {}', function() {
    expect(validProperty({
      ...textField,
      property: {}
    } as any)).toEqual(false);
  });

  it('property 只有其他属性', function() {
    expect(validProperty({
      ...textField,
      property: {
        name: '123'
      }
    } as any)).toEqual(false);
  });

  it('default property', function() {
    expect(validProperty({
      ...textField
    } as any)).toEqual(true);
  });

  it('property 有多余的属性', function() {
    expect(validProperty({
      ...textField,
      property: {
        name: '123',
        icon: ''
      }
    } as any)).toEqual(false);
  });
});

// 单行文本
describe('检查单行文本字段 property 格式', () => {
  const singleTextField = {
    textField,
    type: 19,
  };
  it('property = null', function() {
    expect(validProperty({
      ...singleTextField,
      property: null
    } as any)).toEqual(false);
  });

  it('defaultValue = ""', function() {
    expect(validProperty({
      ...singleTextField,
      property: {
        defaultValue: '',
      }
    } as any)).toEqual(true);
  });

  it('property.defaultValue =""', function() {
    expect(validProperty({
      ...singleTextField,
      property: {
        defaultValue: '123',
      }
    } as any)).toEqual(true);
  });
});

