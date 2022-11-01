import { INumberField } from '../../../types/field_types';
import { commonTestSuit, getValidCellValue, validProperty } from './common';

const numberField: INumberField = {
  name: 'number field',
  id: 'fld1111',
  type: 2,
  property: {
    precision: 1.0
  }
};

describe('Format Check for Numeric Fields', () => {
  const valid = getValidCellValue(numberField);

  commonTestSuit(valid);

  it('input number', function() {
    const [expectValue, receiveValue] = valid(12312312);
    expect(receiveValue).toEqual(expectValue);
  });

  it('Enter the content of type text', function() {
    const [expectValue, receiveValue] = valid([{ text: '123', type: 1 }]);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('Enter multiple choices', function() {
    const [expectValue, receiveValue] = valid(['optxxxxx']);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('enter single choice', function() {
    const [expectValue, receiveValue] = valid('optxxxxx');
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('input attachment', function() {
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

  it('input 1', function() {
    const [expectValue, receiveValue] = valid(1);
    expect(receiveValue).toEqual(expectValue);
  });

  it('input 0', function() {
    const [expectValue, receiveValue] = valid(0);
    expect(receiveValue).toEqual(expectValue);
  });

  it('input true', function() {
    const [expectValue, receiveValue] = valid(true);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('input false', function() {
    const [expectValue, receiveValue] = valid(false);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('input unitId', function() {
    const [expectValue, receiveValue] = valid(['1632153600000']);
    expect(receiveValue).not.toEqual(expectValue);
  });

});

describe('Check numeric field property format', () => {
  it('property = undefined', function() {
    expect(validProperty({
      ...numberField,
      property: undefined
    } as any)).toEqual(false);
  });

  it('property = null', function() {
    expect(validProperty({
      ...numberField,
      property: null
    } as any)).toEqual(false);
  });

  it('property = {}', function() {
    expect(validProperty({
      ...numberField,
      property: {}
    } as any)).toEqual(false);
  });

  it('property only other properties', function() {
    expect(validProperty({
      ...numberField,
      property: {
        name: '123'
      }
    } as any)).toEqual(false);
  });

  it('default property', function() {
    expect(validProperty({
      ...numberField
    } as any)).toEqual(true);
  });

  it('property.symbolAlign = 2', function() {
    expect(validProperty({
      ...numberField,
      property: {
        ...numberField.property,
        symbolAlign: 2
      }
    } as any)).toEqual(true);
  });

  it('property.symbolAlign = 3', function() {
    expect(validProperty({
      ...numberField,
      property: {
        ...numberField.property,
        symbolAlign: 3
      }
    } as any)).toEqual(false);
  });

  it('property 有多余的属性', function() {
    expect(validProperty({
      ...numberField,
      property: {
        name: '123',
        icon: ''
      }
    } as any)).toEqual(false);
  });
});

