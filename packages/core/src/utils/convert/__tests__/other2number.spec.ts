/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { str2number } from '../other2number';
import assert from 'assert';
import * as cases from './other2number.test.json';

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

