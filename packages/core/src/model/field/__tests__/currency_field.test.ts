import { ICurrencyField } from '../../../types/field_types';
import { commonTestSuit, getValidCellValue, validProperty } from './common';
import { CurrencyField } from '../index';

const currencyField: ICurrencyField = {
  name: 'Currency Field',
  id: 'fld1111',
  type: 17,
  property: CurrencyField.defaultProperty()
};

describe('Format check for currency fields', () => {
  const valid = getValidCellValue(currencyField);

  commonTestSuit(valid);

  it('input humber', function() {
    const [expectValue, receiveValue] = valid(12312312);
    expect(receiveValue).toEqual(expectValue);
  });

  it('input text', function() {
    const [expectValue, receiveValue] = valid([{ text: '123', type: 1 }]);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('input multi choices', function() {
    const [expectValue, receiveValue] = valid(['optxxxxx']);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('input single choice', function() {
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

  it('nput 1', function() {
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
});

describe('Check currency field property format', () => {
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

  it('property only required', function() {
    expect(validProperty({
      ...currencyField,
      property: {
        symbol: '&',
        precision: 0
      }
    } as any)).toEqual(true);
  });

  it('property precision is missing', function() {
    expect(validProperty({
      ...currencyField,
      property: {
        symbol: '&',
      }
    } as any)).toEqual(false);
  });

  it('property symbol is an empty string', function() {
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

  it('property attribute is correct', function() {
    expect(validProperty({
      ...currencyField
    } as any)).toEqual(true);
  });

  it('property has redundant properties', function() {
    expect(validProperty({
      ...currencyField,
      property: {
        ...currencyField.property,
        icon: ''
      }
    } as any)).toEqual(false);
  });
});
