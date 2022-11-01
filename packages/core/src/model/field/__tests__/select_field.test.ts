import { ISelectField } from '../../../types/field_types';
import { commonTestSuit, getValidCellValue, validProperty } from './common';

const singleSelectField: ISelectField = {
  name: '单选字段',
  id: 'fld1111',
  type: 3,
  property: {
    options: [{
      id: 'opt000',
      name: '测试标签',
      color: 1
    }]
  }
};

const multiSelectField: ISelectField = {
  name: '多选字段',
  id: 'fld22222',
  type: 4,
  property: {
    options: [{
      id: 'opt000',
      name: '测试标签',
      color: 1
    }]
  }
};

export const selectCommonTestSuit = (valid: any) => {

  commonTestSuit(valid);

  it('输入数字', function() {
    const [expectValue, receiveValue] = valid(12312312);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('输入文本类型的内容', function() {
    const [expectValue, receiveValue] = valid([{ text: '123', type: 1 }]);
    expect(receiveValue).not.toEqual(expectValue);
  });

};

describe('单选字段的格式检查', () => {
  const valid = getValidCellValue(singleSelectField);

  selectCommonTestSuit(valid);

  it('输入多选的内容', function() {
    const [expectValue, receiveValue] = valid(['optxxxxx']);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('输入单选内容，值在 property 中存在', function() {
    const [expectValue, receiveValue] = valid('opt000');
    expect(receiveValue).toEqual(expectValue);
  });

  it('输入单选内容，值在 property 中不存在', function() {
    const [expectValue, receiveValue] = valid('opt111');
    expect(receiveValue).not.toEqual(expectValue);
  });
});

describe('多选字段的格式检查', () => {
  const valid = getValidCellValue(multiSelectField);

  selectCommonTestSuit(valid);

  it('多选的值在 field property 中存在', function() {
    const [expectValue, receiveValue] = valid(['opt000']);
    expect(receiveValue).toEqual(expectValue);
  });

  it('多选的值在 field property 中不存在', function() {
    const [expectValue, receiveValue] = valid(['opt1111']);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('输入单选内容', function() {
    const [expectValue, receiveValue] = valid('optxxxxx');
    expect(receiveValue).not.toEqual(expectValue);
  });
});

// 单选和多选的结构一致，检查一种即可
describe('检查单选字段 property 格式', () => {
  it('property = undefined', function() {
    expect(validProperty({
      ...singleSelectField,
      property: undefined
    } as any)).toEqual(false);
  });

  it('property = null', function() {
    expect(validProperty({
      ...singleSelectField,
      property: null
    } as any)).toEqual(false);
  });

  it('property = {}', function() {
    expect(validProperty({
      ...singleSelectField,
      property: {}
    } as any)).toEqual(false);
  });

  it('property.options = []', function() {
    expect(validProperty({
      ...singleSelectField,
      property: {
        options: []
      }
    } as any)).toEqual(true);
  });

  it('default property', function() {
    expect(validProperty({
      ...singleSelectField
    } as any)).toEqual(true);
  });

  it('property.options 不能为字符串数组', function() {
    expect(validProperty({
      ...singleSelectField,
      property: {
        options: ['1']
      }
    } as any)).toEqual(false);
  });

  it('property 有多余的属性', function() {
    expect(validProperty({
      ...singleSelectField,
      property: {
        ...singleSelectField.property,
        name: '123',
      }
    } as any)).toEqual(false);
  });
});
