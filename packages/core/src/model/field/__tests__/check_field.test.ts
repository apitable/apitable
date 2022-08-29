import { ICheckboxField } from '../../../types/field_types';
import { commonTestSuit, getValidCellValue, validProperty } from './common';

const checkboxField: ICheckboxField = {
  name: '勾选字段',
  id: 'fld1111',
  type: 11,
  property: {
    icon: 'ice'
  }
};

describe('勾选字段的格式检查', () => {
  const valid = getValidCellValue(checkboxField);

  commonTestSuit(valid);

  it('输入数字', function() {
    const [expectValue, receiveValue] = valid(12312312);
    expect(receiveValue).not.toEqual(expectValue);
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
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('输入 0', function() {
    const [expectValue, receiveValue] = valid(0);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('输入 true', function() {
    const [expectValue, receiveValue] = valid(true);
    expect(receiveValue).toEqual(expectValue);
  });

  it('输入 false', function() {
    const [expectValue, receiveValue] = valid(false);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('检查勾选字段 property 格式', () => {
  it('property = undefined', function() {
    expect(validProperty({
      ...checkboxField,
      property: undefined
    } as any)).toEqual(false);
  });

  it('property = null', function() {
    expect(validProperty({
      ...checkboxField,
      property: null
    } as any)).toEqual(false);
  });

  it('property = {}', function() {
    expect(validProperty({
      ...checkboxField,
      property: {}
    } as any)).toEqual(false);
  });

  it('property 只有其他属性', function() {
    expect(validProperty({
      ...checkboxField,
      property: {
        name: '123'
      }
    } as any)).toEqual(false);
  });

  it('property 格式正确', function() {

    expect(validProperty({
      ...checkboxField
    } as any)).toEqual(true);
  });

  it('property 有多余的属性', function() {
    expect(validProperty({
      ...checkboxField,
      property: {
        name: '123',
        icon: ''
      }
    } as any)).toEqual(false);
  });
});
