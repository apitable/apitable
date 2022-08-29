import { mockState } from '../../../formula_parser/__tests__/mock_state';
import { IField } from '../../../types/field_types';
import { Field } from '../index';

export const commonTestSuit = (valid) => {
  it('输入随机的字符串', function() {
    const [expectValue, receiveValue] = valid(Math.random().toString(36).slice(-8));
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('输入 undefined', function() {
    const [expectValue, receiveValue] = valid(undefined);
    expect(receiveValue).not.toEqual(expectValue);
  });

  it('输入 null', function() {
    const [expectValue, receiveValue] = valid(null);
    expect(receiveValue).toEqual(expectValue);
  });
};

export const getValidCellValue = (field: IField) => {
  const fieldMethod = Field.bindContext(field, mockState as any) as Field;
  return (receiveValue: any) => {
    return [{ value: receiveValue }, fieldMethod.validateCellValue(receiveValue)];
  };
};

export const getValidOpenWriteValue = (field: IField) => {
  const fieldMethod = Field.bindContext(field, mockState as any) as Field;
  return (receiveValue: any) => {
    return [{ value: receiveValue }, fieldMethod.validateOpenWriteValue(receiveValue)];
  };
};

export const validProperty = (field: IField) => {
  const fieldMethod = Field.bindContext(field, mockState as any) as Field;
  const { error } = fieldMethod.validateProperty();
  return !error;
};
