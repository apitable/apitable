import { IPercentField } from '../../../types/field_types';
import { commonTestSuit, getValidCellValue, validProperty } from './common';

const percentField: IPercentField = {
  name: 'percentage field',
  id: 'fld1111',
  type: 18,
  property: {
    precision: 1.0
  }
};

describe('Format Check for Percentage Fields', () => {
  const valid = getValidCellValue(percentField);

  commonTestSuit(valid);

  it('input number', function() {
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

  it('input attachments', function() {
    const [expectValue, receiveValue] = valid({
      id: 'xxxx',
      name: 'xxxx',
      mimeType: 'image/jpg',
      token: 'apitable.com',
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

describe('Check numeric field\'s property format', () => {
  it('property = undefined', function() {
    expect(validProperty({
      ...percentField,
      property: undefined
    } as any)).toEqual(false);
  });

  it('property = null', function() {
    expect(validProperty({
      ...percentField,
      property: null
    } as any)).toEqual(false);
  });

  it('property = {}', function() {
    expect(validProperty({
      ...percentField,
      property: {}
    } as any)).toEqual(false);
  });

  it('property only other properties', function() {
    expect(validProperty({
      ...percentField,
      property: {
        name: '123'
      }
    } as any)).toEqual(false);
  });

  it('default property', function() {
    expect(validProperty({
      ...percentField
    } as any)).toEqual(true);
  });

  it('property has redundant properties', function() {
    expect(validProperty({
      ...percentField,
      property: {
        name: '123',
        icon: ''
      }
    } as any)).toEqual(false);
  });
});

