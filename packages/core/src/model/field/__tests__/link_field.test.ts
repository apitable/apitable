import { ILinkField } from '../../../types/field_types';
import { commonTestSuit, getValidCellValue, validProperty } from './common';

const linkField: ILinkField = {
  name: '关联字段',
  id: 'fld1111',
  type: 7,
  property: {
    foreignDatasheetId: 'dst111111'
  }
};

describe('关联字段的格式检查', () => {
  const valid = getValidCellValue(linkField);

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

  it('输入 recordId 数组', function() {
    const [expectValue, receiveValue] = valid(['rec12312312']);
    expect(receiveValue).toEqual(expectValue);
  });

});

describe('检查关联字段 property 格式', () => {
  it('property = undefined', function() {
    expect(validProperty({
      ...linkField,
      property: undefined
    } as any)).toEqual(false);
  });

  it('property = null', function() {
    expect(validProperty({
      ...linkField,
      property: null
    } as any)).toEqual(false);
  });

  it('property = {}', function() {
    expect(validProperty({
      ...linkField,
      property: {}
    } as any)).toEqual(false);
  });

  it('property 缺少 foreignDatasheetId', function() {
    expect(validProperty({
      ...linkField,
      property: {
        brotherFieldId: 'fldxxxx'
      }
    } as any)).toEqual(false);
  });

  it('property 记录的 foreignDatasheetId 不存在', function() {
    expect(validProperty({
      ...linkField,
      property: {
        foreignDatasheetId: 'dst12111',
      }
    } as any)).toEqual(false);
  });

  it('property 记录的 foreignDatasheetId 存在', function() {
    expect(validProperty({
      ...linkField,
      property: {
        foreignDatasheetId: 'dst123',
      }
    } as any)).toEqual(true);
  });

  it('brotherFieldId 数据错误', function() {
    expect(validProperty({
      ...linkField,
      property: {
        foreignDatasheetId: 'dst123',
        brotherFieldId: 'dst123',
      }
    } as any)).toEqual(false);
  });

  it('brotherFieldId 数据正确', function() {
    expect(validProperty({
      ...linkField,
      property: {
        foreignDatasheetId: 'dst123',
        brotherFieldId: 'fld123',
      }
    } as any)).toEqual(true);
  });

  it('limitToView 数据错误', function() {
    expect(validProperty({
      ...linkField,
      property: {
        foreignDatasheetId: 'dst123',
        limitToView: 'dst123',
      }
    } as any)).toEqual(false);
  });

  it('limitToView 数据正确', function() {
    expect(validProperty({
      ...linkField,
      property: {
        foreignDatasheetId: 'dst123',
        limitToView: 'viw123123',
      }
    } as any)).toEqual(true);
  });

  it('property 有多余的属性', function() {
    expect(validProperty({
      ...linkField,
      property: {
        name: '123',
        icon: ''
      }
    } as any)).toEqual(false);
  });
});
