import { ICurrencyField } from '../../../types/field_types';
import { commonTestSuit, getValidCellValue, validProperty } from './common';
import { CurrencyField } from '../index';

const currencyField: ICurrencyField = {
  name: '货币字段',
  id: 'fld1111',
  type: 17,
  property: CurrencyField.defaultProperty()
};

describe('货币字段的格式检查', () => {
  const valid = getValidCellValue(currencyField);

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
});

describe('检查货币字段 property 格式', () => {
  it('property = undefined', function() {
    expect(validProperty({
      ...currencyField,
      property: undefined
    } as any)).toEqual(false);
  });

  it('property = null', function() {
    expect(validProperty({
      ...currencyField,
      property: null
    } as any)).toEqual(false);
  });

  it('property = {}', function() {
    expect(validProperty({
      ...currencyField,
      property: {}
    } as any)).toEqual(false);
  });

  it('property 只有必填项', function() {
    expect(validProperty({
      ...currencyField,
      property: {
        symbol: '&',
        precision: 0
      }
    } as any)).toEqual(true);
  });

  it('property precision 缺失', function() {
    expect(validProperty({
      ...currencyField,
      property: {
        symbol: '&',
      }
    } as any)).toEqual(false);
  });

  it('property symbol 为空字符串', function() {
    expect(validProperty({
      ...currencyField,
      property: {
        ...currencyField.property,
        symbol: ''
      }
    } as any)).toEqual(true);
  });

  it('property.symbolAlign = 2', function() {
    expect(validProperty({
      ...currencyField,
      property: {
        ...currencyField.property,
        symbolAlign: 2
      }
    } as any)).toEqual(true);
  });

  it('property.symbolAlign = 3', function() {
    expect(validProperty({
      ...currencyField,
      property: {
        ...currencyField.property,
        symbolAlign: 3
      }
    } as any)).toEqual(false);
  });

  it('property 属性正确', function() {
    expect(validProperty({
      ...currencyField
    } as any)).toEqual(true);
  });

  it('property 有多余的属性', function() {
    expect(validProperty({
      ...currencyField,
      property: {
        ...currencyField.property,
        icon: ''
      }
    } as any)).toEqual(false);
  });
});
