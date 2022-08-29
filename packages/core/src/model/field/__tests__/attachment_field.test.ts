import { IAttacheField } from '../../../types/field_types';
import { commonTestSuit, getValidCellValue, validProperty } from './common';

const attachmentField: IAttacheField = {
  name: '附件字段',
  id: 'fld1111',
  type: 6,
  property: null
};

describe('附件字段的格式检查', () => {
  const valid = getValidCellValue(attachmentField);

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

  it('输入的附件值缺少 id', function() {
    const [expectValue, receiveValue] = valid([{
      name: 'xxxx',
      mimeType: 'image/jpg',
      token: 'vika.cn',
      bucket: 'image/xxxx.jpg',
      size: 123111
    }]);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('输入的附件包括可选值', function() {
    const [expectValue, receiveValue] = valid([{
      bucket: 'QNY1',
      height: 225,
      id: 'atcR5x9T1ncI7',
      mimeType: 'image/gif',
      name: '2021-09-22 17.24.13.gif',
      size: 37299,
      token: 'space/2021/09/26/50dc9eb9ad73457b9f598e36e29670d6',
      width: 310
    }]);
    expect(receiveValue).toEqual(expectValue);
  });

  it('输入的附件不包括可选值', function() {
    const [expectValue, receiveValue] = valid([{
      id: 'xxxx',
      name: 'xxxx',
      mimeType: 'image/jpg',
      token: 'vika.cn',
      bucket: 'image/xxxx.jpg',
      size: 123111,
    }]);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('检查附件字段 property 格式', () => {
  it('property = undefined', function() {
    expect(validProperty({
      ...attachmentField,
      property: undefined
    } as any)).toEqual(true);
  });

  it('property = null', function() {

    expect(validProperty(attachmentField)).toEqual(true);
  });

  it('property = {}', function() {
    expect(validProperty({
      ...attachmentField,
      property: {}
    } as any)).toEqual(false);
  });
});
