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

import { numberToShow, toFixed, numbersBetween } from '../number';

describe('number utils tests', () => {
  it('toFixed test', () => {
    expect(toFixed(1234567890123450000, 1)).toEqual('1234567890123450000.0');
    expect(toFixed(1234567890123450, 3)).toEqual('1234567890123450.000');
    expect(toFixed(123456789012345, 5)).toEqual('123456789012345.00000');
    expect(toFixed(1234567890123, 0)).toEqual('1234567890123');
    expect(toFixed(1234567890123, -1)).toEqual('1234567890123');
    expect(toFixed(1.345, 1)).toEqual('1.3');
    expect(toFixed(1.345, 2)).toEqual('1.35');
    expect(toFixed(1.345, 3)).toEqual('1.345');
    expect(toFixed(13.45, 1)).toEqual('13.5');
    expect(toFixed(13.45, 3)).toEqual('13.450');
    expect(toFixed(134.5, 1)).toEqual('134.5');
    expect(toFixed(134.5, 3)).toEqual('134.500');

    expect(toFixed(-1234567890123450000, 1)).toEqual('-1234567890123450000.0');
    expect(toFixed(-1234567890123450, 3)).toEqual('-1234567890123450.000');
    expect(toFixed(-123456789012345, 5)).toEqual('-123456789012345.00000');
    expect(toFixed(-1234567890123, 0)).toEqual('-1234567890123');
    expect(toFixed(-1234567890123, -1)).toEqual('-1234567890123');
    expect(toFixed(-1.345, 1)).toEqual('-1.3');
    expect(toFixed(-1.345, 2)).toEqual('-1.35');
    expect(toFixed(-1.345, 3)).toEqual('-1.345');
    expect(toFixed(-13.45, 1)).toEqual('-13.5');
    expect(toFixed(-13.45, 3)).toEqual('-13.450');
    expect(toFixed(-134.5, 1)).toEqual('-134.5');
    expect(toFixed(-134.5, 3)).toEqual('-134.500');

    expect(toFixed(1.2345e11, 1)).toEqual('123450000000.0');
    expect(toFixed(1.2345e11, 3)).toEqual('123450000000.000');
    expect(toFixed(-1.2345e11, 1)).toEqual('-123450000000.0');
    expect(toFixed(-1.2345e11, 3)).toEqual('-123450000000.000');

    expect(toFixed(1.2345e-11, 1)).toEqual('0.0');
    expect(toFixed(1.2345e-11, 3)).toEqual('0.000');
    expect(toFixed(1.2345e-2, 5)).toEqual('0.01235');
    expect(toFixed(-1.2345e-11, 1)).toEqual('-0.0');
    expect(toFixed(-1.2345e-11, 3)).toEqual('-0.000');
    expect(toFixed(-1.2345e-2, 5)).toEqual('-0.01235');

    expect(toFixed(1.55, 1)).toEqual('1.6');
    expect(toFixed(2.55, 1)).toEqual('2.6');
    expect(toFixed(3.55, 1)).toEqual('3.6');
    expect(toFixed(4.55, 1)).toEqual('4.6');
    expect(toFixed(5.55, 1)).toEqual('5.6');
    expect(toFixed(6.55, 1)).toEqual('6.6');
    expect(toFixed(7.55, 1)).toEqual('7.6');
    expect(toFixed(8.55, 1)).toEqual('8.6');
    expect(toFixed(9.55, 1)).toEqual('9.6');
    expect(toFixed(4.54, 1)).toEqual('4.5');
    expect(toFixed(4.56, 1)).toEqual('4.6');
    expect(toFixed(4.45, 1)).toEqual('4.5');

    expect(toFixed(-1.55, 1)).toEqual('-1.6');
    expect(toFixed(-2.55, 1)).toEqual('-2.6');
    expect(toFixed(-3.55, 1)).toEqual('-3.6');
    expect(toFixed(-4.55, 1)).toEqual('-4.6');
    expect(toFixed(-5.55, 1)).toEqual('-5.6');
    expect(toFixed(-6.55, 1)).toEqual('-6.6');
    expect(toFixed(-7.55, 1)).toEqual('-7.6');
    expect(toFixed(-8.55, 1)).toEqual('-8.6');
    expect(toFixed(-9.55, 1)).toEqual('-9.6');
    expect(toFixed(-4.54, 1)).toEqual('-4.5');
    expect(toFixed(-4.56, 1)).toEqual('-4.6');
    expect(toFixed(-4.45, 1)).toEqual('-4.5');
  });

  it('numberToShow test', () => {
    expect(numberToShow(1234567890123450000, 1)).toEqual('1.23457e+18');
    expect(numberToShow(1234567890123450000, 3)).toEqual('1.23457e+18');
    expect(numberToShow(1234567890123450000, 5)).toEqual('1.23457e+18');
    // TODO： 检查下面的测试用例
    expect(numberToShow(1234567890123450, 1)).toEqual('1234567890123450.0');
    expect(numberToShow(1234567890123450, 3)).toEqual('1234567890123450.000');
    expect(numberToShow(1234567890123450, 5)).toEqual('1234567890123450.00000');
    expect(numberToShow(123456789012345, 1)).toEqual('123456789012345.0');
    expect(numberToShow(123456789012345, 3)).toEqual('123456789012344.980');
    expect(numberToShow(123456789012345, 5)).toEqual('123456789012345.00000');
    expect(numberToShow(12345678901234, 1)).toEqual('12345678901234.0');
    expect(numberToShow(12345678901234, 3)).toEqual('12345678901234.000');
    expect(numberToShow(12345678901234, 5)).toEqual('12345678901234.00000');
    expect(numberToShow(1234567890123, 1)).toEqual('1234567890123.0');
    expect(numberToShow(1234567890123, 3)).toEqual('1234567890123.000');
    expect(numberToShow(1234567890123, 5)).toEqual('1234567890123.00000');
    expect(numberToShow(123456789012, 1)).toEqual('123456789012.0');
    expect(numberToShow(123456789012, 3)).toEqual('123456789012.000');
    expect(numberToShow(123456789012, 5)).toEqual('123456789012.00000');
    // expect(numberToShow(123456789012.345, 1)).toEqual('1.23457e+11');
    // expect(numberToShow(123456789012.345, 3)).toEqual('1.23457e+11');
    // expect(numberToShow(123456789012.345, 5)).toEqual('1.23457e+11');
    // expect(numberToShow(1234567890123.45, 1)).toEqual('1.23457e+12');
    // expect(numberToShow(1234567890123.45, 3)).toEqual('1.23457e+12');
    // expect(numberToShow(1234567890123.45, 5)).toEqual('1.23457e+12');
    // expect(numberToShow(12345678901234.5, 1)).toEqual('1.23457e+13');
    // expect(numberToShow(12345678901234.5, 3)).toEqual('1.23457e+13');
    // expect(numberToShow(12345678901234.5, 5)).toEqual('1.23457e+13');
    expect(numberToShow(1234567890.12345, 1)).toEqual('1234567890.1');
    expect(numberToShow(1234567890.12345, 3)).toEqual('1234567890.123');
    expect(numberToShow(1234567890.12345, 5)).toEqual('1234567890.12345');
    expect(numberToShow(123456.789012345, 1)).toEqual('123456.8');
    expect(numberToShow(123456.789012345, 3)).toEqual('123456.789');
    expect(numberToShow(123456.789012345, 5)).toEqual('123456.78901');
    expect(numberToShow(12.3456789012345, 1)).toEqual('12.3');
    expect(numberToShow(12.3456789012345, 3)).toEqual('12.346');
    expect(numberToShow(12.3456789012345, 5)).toEqual('12.34568');
    expect(numberToShow(0.123456789012345, 1)).toEqual('0.1');
    expect(numberToShow(0.123456789012345, 3)).toEqual('0.123');
    expect(numberToShow(0.123456789012345, 5)).toEqual('0.12346');
    expect(numberToShow(0.000123456789012345, 1)).toEqual('0.0');
    expect(numberToShow(0.000123456789012345, 3)).toEqual('0.000');
    expect(numberToShow(0.000123456789012345, 5)).toEqual('0.00012');

    // expect(numberToShow(-1234567890123450000, 1)).toEqual('-1.23457e+18');
    // expect(numberToShow(-1234567890123450000, 3)).toEqual('-1.23457e+18');
    // expect(numberToShow(-1234567890123450000, 5)).toEqual('-1.23457e+18');
    // expect(numberToShow(-1234567890123450, 1)).toEqual('-1.23457e+15');
    // expect(numberToShow(-1234567890123450, 3)).toEqual('-1.23457e+15');
    // expect(numberToShow(-1234567890123450, 5)).toEqual('-1.23457e+15');
    // expect(numberToShow(-123456789012345, 1)).toEqual('-1.23457e+14');
    // expect(numberToShow(-123456789012345, 3)).toEqual('-1.23457e+14');
    // expect(numberToShow(-123456789012345, 5)).toEqual('-1.23457e+14');
    // expect(numberToShow(-12345678901234, 1)).toEqual('-1.23457e+13');
    // expect(numberToShow(-12345678901234, 3)).toEqual('-1.23457e+13');
    // expect(numberToShow(-12345678901234, 5)).toEqual('-1.23457e+13');
    // expect(numberToShow(-1234567890123, 1)).toEqual('-1.23457e+12');
    // expect(numberToShow(-1234567890123, 3)).toEqual('-1.23457e+12');
    // expect(numberToShow(-1234567890123, 5)).toEqual('-1.23457e+12');
    // expect(numberToShow(-123456789012, 1)).toEqual('-1.23457e+11');
    // expect(numberToShow(-123456789012, 3)).toEqual('-1.23457e+11');
    // expect(numberToShow(-123456789012, 5)).toEqual('-1.23457e+11');
    // expect(numberToShow(-123456789012.345, 1)).toEqual('-1.23457e+11');
    // expect(numberToShow(-123456789012.345, 3)).toEqual('-1.23457e+11');
    // expect(numberToShow(-123456789012.345, 5)).toEqual('-1.23457e+11');
    // expect(numberToShow(-1234567890123.45, 1)).toEqual('-1.23457e+12');
    // expect(numberToShow(-1234567890123.45, 3)).toEqual('-1.23457e+12');
    // expect(numberToShow(-1234567890123.45, 5)).toEqual('-1.23457e+12');
    // expect(numberToShow(-12345678901234.5, 1)).toEqual('-1.23457e+13');
    // expect(numberToShow(-12345678901234.5, 3)).toEqual('-1.23457e+13');
    // expect(numberToShow(-12345678901234.5, 5)).toEqual('-1.23457e+13');

    expect(numberToShow(-1234567890.12345, 1)).toEqual('-1234567890.1');
    expect(numberToShow(-1234567890.12345, 3)).toEqual('-1234567890.123');
    expect(numberToShow(-1234567890.12345, 5)).toEqual('-1234567890.12345');
    expect(numberToShow(-123456.789012345, 1)).toEqual('-123456.8');
    expect(numberToShow(-123456.789012345, 3)).toEqual('-123456.789');
    expect(numberToShow(-123456.789012345, 5)).toEqual('-123456.78901');
    expect(numberToShow(-12.3456789012345, 1)).toEqual('-12.3');
    expect(numberToShow(-12.3456789012345, 3)).toEqual('-12.346');
    expect(numberToShow(-12.3456789012345, 5)).toEqual('-12.34568');
    expect(numberToShow(-0.123456789012345, 1)).toEqual('-0.1');
    expect(numberToShow(-0.123456789012345, 3)).toEqual('-0.123');
    expect(numberToShow(-0.123456789012345, 5)).toEqual('-0.12346');
    expect(numberToShow(-0.000123456789012345, 1)).toEqual('-0.0');
    expect(numberToShow(-0.000123456789012345, 3)).toEqual('-0.000');
    expect(numberToShow(-0.000123456789012345, 5)).toEqual('-0.00012');

    // expect(numberToShow(1.2345e11, 1)).toEqual('1.23450e+11');
    // expect(numberToShow(1.2345e11, 3)).toEqual('1.23450e+11');
    // expect(numberToShow(1.2345e11, 5)).toEqual('1.23450e+11');
    // expect(numberToShow(1.2345678e13, 1)).toEqual('1.23457e+13');
    // expect(numberToShow(1.2345678e13, 3)).toEqual('1.23457e+13');
    // expect(numberToShow(1.2345678e13, 5)).toEqual('1.23457e+13');
    // expect(numberToShow(-1.2345e11, 1)).toEqual('-1.23450e+11');
    // expect(numberToShow(-1.2345e11, 3)).toEqual('-1.23450e+11');
    // expect(numberToShow(-1.2345e11, 5)).toEqual('-1.23450e+11');
    // expect(numberToShow(-1.2345678e13, 1)).toEqual('-1.23457e+13');
    // expect(numberToShow(-1.2345678e13, 3)).toEqual('-1.23457e+13');
    // expect(numberToShow(-1.2345678e13, 5)).toEqual('-1.23457e+13');
    expect(numberToShow(1.2345e-11, 1)).toEqual('0.0');
    expect(numberToShow(1.2345e-11, 3)).toEqual('0.000');
    expect(numberToShow(1.2345e-11, 5)).toEqual('0.00000');
    expect(numberToShow(1.2345678e-13, 1)).toEqual('0.0');
    expect(numberToShow(1.2345678e-13, 3)).toEqual('0.000');
    expect(numberToShow(1.2345678e-13, 5)).toEqual('0.00000');
    expect(numberToShow(-1.2345e-11, 1)).toEqual('-0.0');
    expect(numberToShow(-1.2345e-11, 3)).toEqual('-0.000');
    expect(numberToShow(-1.2345e-11, 5)).toEqual('-0.00000');
    expect(numberToShow(-1.2345678e-13, 1)).toEqual('-0.0');
    expect(numberToShow(-1.2345678e-13, 3)).toEqual('-0.000');
    expect(numberToShow(-1.2345678e-13, 5)).toEqual('-0.00000');
  });

  it('numbers between', () => {
    expect(numbersBetween(8, 7)).toEqual([]);
    expect(numbersBetween(8, 6)).toEqual([7]);
    expect(numbersBetween(6, 7)).toEqual([]);
    expect(numbersBetween(5, 7)).toEqual([6]);
    expect(numbersBetween(7, 0)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(numbersBetween(0, 7)).toEqual([1, 2, 3, 4, 5, 6]);
  });
});

