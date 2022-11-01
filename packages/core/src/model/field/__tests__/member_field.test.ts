import { IMemberField } from '../../../types/field_types';
import { commonTestSuit, getValidCellValue, validProperty } from './common';

const memberField: IMemberField = {
  name: 'Member Field',
  id: 'fld1111',
  type: 13,
  property: {
    isMulti: false, // Optional single or multiple members.
    shouldSendMsg: false, // Whether to send a message notification after selecting a member
    unitIds: []
  }
};

describe('Format Check for Member Fields', () => {
  const valid = getValidCellValue(memberField);

  commonTestSuit(valid);

  it('input number', function() {
    const [expectValue, receiveValue] = valid(12312312);
    expect(receiveValue).not.toEqual(expectValue);
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
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('input 0', function() {
    const [expectValue, receiveValue] = valid(0);
    expect(receiveValue).not.toEqual(expectValue);
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
    expect(receiveValue).toEqual(expectValue);
  });

});

describe('Check member field property format', () => {
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

  it('property has properties that shouldn\'t exist', function() {
    expect(validProperty({
      ...memberField,
      property: {
        name: '123'
      }
    } as any)).toEqual(false);
  });

  it('unitIds not exist', function() {
    expect(validProperty({
      ...memberField,
      property: {
        isMulti: false, // Optional single or multiple members.
        shouldSendMsg: false, // Whether to send a message notification after selecting a member
      }
    } as any)).toEqual(false);
  });

  it('property is in the correct format', function() {
    expect(validProperty({
      ...memberField
    } as any)).toEqual(true);
  });

});
