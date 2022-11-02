import { IAttacheField } from '../../../types/field_types';
import { commonTestSuit, getValidCellValue, validProperty } from './common';

const attachmentField: IAttacheField = {
  name: 'Attachment Field',
  id: 'fld1111',
  type: 6,
  property: null
};

describe('Format Check for Attachment Fields', () => {
  const valid = getValidCellValue(attachmentField);

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

  it('the attachment value input that missing the id', function() {
    const [expectValue, receiveValue] = valid([{
      name: 'xxxx',
      mimeType: 'image/jpg',
      token: 'vika.cn',
      bucket: 'image/xxxx.jpg',
      size: 123111
    }]);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('the attachment value that includes optional values', function() {
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

  it('the attachment input value that doesn\'t include optional values', function() {
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

describe('Check attachment field\'s property format', () => {
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
