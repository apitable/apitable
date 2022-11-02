import { IRatingField } from '../../../types/field_types';
import { commonTestSuit, getValidCellValue, validProperty } from './common';

const ratingField: IRatingField = {
  name: 'Rating field',
  id: 'fld1111',
  type: 12,
  property: { icon: 'star', max: 5 }
};

describe('Format Check for Rating Fields', () => {
  const valid = getValidCellValue(ratingField);

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
      ...ratingField,
      property: undefined
    } as any)).toEqual(false);
  });

  it('property = null', function() {
    expect(validProperty({
      ...ratingField,
      property: null
    } as any)).toEqual(false);
  });

  it('property = {}', function() {
    expect(validProperty({
      ...ratingField,
      property: {}
    } as any)).toEqual(false);
  });

  it('property only has other properties', function() {
    expect(validProperty({
      ...ratingField,
      property: {
        name: '123'
      }
    } as any)).toEqual(false);
  });

  it('default property', function() {
    expect(validProperty({
      ...ratingField
    } as any)).toEqual(true);
  });

  it('wrong icon value type', function() {
    expect(validProperty({
      ...ratingField,
      property: {
        ...ratingField.property,
        icon: 12
      }
    } as any)).toEqual(false);
  });

  it('property has redundant properties', function() {
    expect(validProperty({
      ...ratingField,
      property: {
        ...ratingField.property,
        name: '123',
        icon: ''
      }
    } as any)).toEqual(false);
  });
});

