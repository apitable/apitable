import { str2number } from '../other2number';
import assert from 'assert';
import cases from './other2number.test.json';

describe('test convert text to number', () => {
  it('should convert string to number correctly', () => {
    for (let i = 0; i < cases.length; i++) {
      const { args, expected } = cases[i]!;
      const result = str2number.apply(null, args as [string]);
      assert.deepEqual(result, expected, `case: str2number("${args.join(', ')}")`);
    }

    expect(str2number('1.23456789e-20')).toEqual(0.0000000000000000000123456789);
    expect(str2number('-1.23456789e+20')).toEqual(-123456789000000000000);
    expect(str2number('-1.23456789e-5')).toEqual(-0.0000123456789);
    expect(str2number('-1234567890')).toEqual(-1234567890);
    expect(str2number('-0.0000000001123457789')).toEqual(-0.0000000001123457789);
    expect(str2number('-1234567890e23')).toEqual(-1.234567890e32);
  });

  it('数字有效位超过15位截断', () => {
    expect(str2number('1.234567890123456789e20')).toEqual(123456789012345000000);
    expect(str2number('-1.23456789123456789e20')).toEqual(-123456789123456000000);
    expect(str2number('1.2345678901234567890e+20')).toEqual(123456789012345000000);
    expect(str2number('-1.2345678901234567e-5')).toEqual(-0.0000123456789012345);
    expect(str2number('12345678901234567890')).toEqual(12345678901234500000);
    expect(str2number('-12345678901234567890')).toEqual(-12345678901234500000);
    expect(str2number('-123456789012345.678')).toEqual(-123456789012345);
    expect(str2number('-123456.789012345678')).toEqual(-123456.789012345);
    expect(str2number('-0.1234567890123456789012345678')).toEqual(-0.123456789012345);
  });
});

