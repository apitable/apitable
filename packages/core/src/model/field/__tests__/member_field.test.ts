import { IMemberField } from '../../../types/field_types';
import { commonTestSuit, getValidCellValue, validProperty } from './common';

const memberField: IMemberField = {
  name: '成员字段',
  id: 'fld1111',
  type: 13,
  property: {
    isMulti: false, // 可选单个或者多个成员。
    shouldSendMsg: false, // 选择成员后是否发送消息通知
    unitIds: []
  }
};

describe('成员字段的格式检查', () => {
  const valid = getValidCellValue(memberField);

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
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('输入 false', function() {
    const [expectValue, receiveValue] = valid(false);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('输入 unitId', function() {
    const [expectValue, receiveValue] = valid(['1632153600000']);
    expect(receiveValue).toEqual(expectValue);
  });

});

describe('检查成员字段 property 格式', () => {
  it('property = undefined', function() {
    expect(validProperty({
      ...memberField,
      property: undefined
    } as any)).toEqual(false);
  });

  it('property = null', function() {
    expect(validProperty({
      ...memberField,
      property: null
    } as any)).toEqual(false);
  });

  it('property = {}', function() {
    expect(validProperty({
      ...memberField,
      property: {}
    } as any)).toEqual(false);
  });

  it('property 有不应该存在的属性', function() {
    expect(validProperty({
      ...memberField,
      property: {
        name: '123'
      }
    } as any)).toEqual(false);
  });

  it('unitIds 不存在', function() {
    expect(validProperty({
      ...memberField,
      property: {
        isMulti: false, // 可选单个或者多个成员。
        shouldSendMsg: false, // 选择成员后是否发送消息通知
      }
    } as any)).toEqual(false);
  });

  it('property 格式正确', function() {
    expect(validProperty({
      ...memberField
    } as any)).toEqual(true);
  });

});
