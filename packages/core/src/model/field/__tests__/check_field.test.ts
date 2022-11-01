import { ICheckboxField } from '../../../types/field_types';
import { commonTestSuit, getValidCellValue, validProperty } from './common';

const checkboxField: ICheckboxField = {
  name: 'CheckBox Field',
  id: 'fld1111',
  type: 11,
  property: {
    icon: 'ice'
  }
};

describe('Format check for checkbox fields', () => {
  const valid = getValidCellValue(checkboxField);

  commonTestSuit(valid);

  it('input number', function() {
    const [expectValue, receiveValue] = valid(12312312);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('Enter the content of type text', function() {
    const [expectValue, receiveValue] = valid([{ text: '123', type: 1 }]);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('Enter multiple selections', function() {
    const [expectValue, receiveValue] = valid(['optxxxxx']);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('Enter radio content', function() {
    const [expectValue, receiveValue] = valid('optxxxxx');
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('Entered attachment content', function() {
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

  it('Input 1', function() {
    const [expectValue, receiveValue] = valid(1);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('Input 0', function() {
    const [expectValue, receiveValue] = valid(0);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('Input true', function() {
    const [expectValue, receiveValue] = valid(true);
    expect(receiveValue).toEqual(expectValue);
  });

  it('Input false', function() {
    const [expectValue, receiveValue] = valid(false);
    expect(receiveValue).toEqual(expectValue);
  });
});

describe('Check the checkbox field property format', () => {
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

  it('property only other properties', function() {
    expect(validProperty({
      ...checkboxField,
      property: {
        name: '123'
      }
    } as any)).toEqual(false);
  });

  it('property is in the correct format', function() {

    expect(validProperty({
      ...checkboxField
    } as any)).toEqual(true);
  });

  it('property has redundant properties', function() {
    expect(validProperty({
      ...checkboxField,
      property: {
        name: '123',
        icon: ''
      }
    } as any)).toEqual(false);
  });
});
