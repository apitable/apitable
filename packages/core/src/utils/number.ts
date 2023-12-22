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

import { Strings, t } from 'exports/i18n';
import { isString } from 'lodash';
import type { ICellValue } from 'model/record';

/**
 * Filter the strings in the cells of the numeric column, that is, illegal processing
 * @param value The value entered in the cell
 */
export function convertToNumber(value: ICellValue): number | null {
  const num = Number(value);
  if (
    value == null ||
    !Number.isFinite(num) ||
    (isString(value) && value.trim() === '')
  ) {
    return null;
  }
  return num;
}

/**
 * Change from scientific notation to number format
 * (because large numbers will be automatically converted back to scientific notation, recorded in string mode)
 * @param value The numbers in js will be converted to part of the data in scientific notation
 */
export function e2number(value: string) {
  const val = value.split('e');
  const p = parseInt(val[1]!, 10); // get index value
  const num = val[0]!.split('.');
  const dotLeft: string = num[0]!; // value to the left of the decimal point
  const dotRight: string = num[1] || ''; // right value of decimal point

  if (p > 0) {
    value = dotLeft + dotRight.substr(0, p) +
      (dotRight.length > p ? '.' + dotRight.substr(p) : '0'.repeat(p - dotRight.length));
  } else {
    // Scientific notation converted by number has 1 digits to the left of the decimal point by default, so only consider this case
    const left = parseInt(dotLeft, 10);
    value = (left < 0 ? '-0.' : '0.') + '0'.repeat(-p - 1) + Math.abs(left) + dotRight;
  }

  return value;
}

/**
 * Perform unified format processing on the numbers in the digital column, intercept the first 15 significant digits, and convert them into numbers
 * @param value A legal number entered from the cell (string format)
 */
export function numberSpecification(value: string) {
  return Number(number2str(value));
}

export function number2str(value: string) {
  if (value.includes('e')) {
    value = e2number(value);
  }
  const str = value.replace('.', '').replace('-', '').replace(/^[0]+/, '');
  const len = str.length;

  const demarcationLen = 15; // 15 significant digits are the cutoff point
  if (len > demarcationLen) {
    // Use 0 for positive numbers and 1 for negative numbers,
    // which is convenient for counting later, because negative numbers need to calculate one more bit of length
    let isNegative = 0;
    if (Number(value) < 0) {
      isNegative = 1;
    }
    // The length of an integer is equal to len, the length with decimals = len + 1, the length of pure decimals - len > 1
    const valLen = value.length - isNegative;
    if (valLen === len) {
      value = value.substr(0, demarcationLen + isNegative) + '0'.repeat(len - demarcationLen);
    } else if (valLen === len + 1) {
      const dotIndex = value.indexOf('.') - isNegative;
      if (dotIndex > demarcationLen) {
        value = value.substr(0, demarcationLen + isNegative) + '0'.repeat(dotIndex - demarcationLen);
      } else if (dotIndex === demarcationLen) {
        value = value.substr(0, demarcationLen + isNegative);
      } else {
        value = value.substr(0, demarcationLen + isNegative + 1);
      }
    } else {
      value = (isNegative > 0 ? '-0.' : '0.') + '0'.repeat(valLen - len - 2) + str.substr(0, demarcationLen);
    }
  }
  return value;
}

/**
 * Rewrite toFixed precision problem
 * Only supports 20 digits of precision
 */
export const toFixed = function (value: number, precision = 0): string {
  if (isNaN(value)) return '0';
  const that = Math.abs(value);
  let changenum;
  let index;

  // If the input parameter is negative, an error will be reported. Here, it is treated as 0 by default, that is, the form of bits is not reserved.
  if (precision < 0) precision = 0;
  changenum = that * Math.pow(10, precision) + 0.5;
  changenum = (parseInt(String(changenum), 10) / Math.pow(10, precision)).toString();
  index = changenum.indexOf('.');
  if (index < 0 && precision > 0) {
    changenum = changenum + '.' + '0'.repeat(precision);
  } else {
    index = precision - changenum.length + index + 1;
    if (index < 0) index = 0;
    changenum = changenum + '0'.repeat(index);
  }

  if (value < 0) {
    return '-' + changenum;
  }
  return changenum;
};

/**
 * The digital form displayed in the cell, intercepted and displayed with precision
 * @param value The last data saved in the model
 * @param precision retains several decimal places
 * @param demarcationLen Several digits show the demarcation point for scientific notation
 */
export function numberToShow(value: number, precision = 0): string | null {
  value = Number(value);
  if (isNaN(value)) {
    return 'NaN';
  }

  if (value === Infinity) {
    return 'Infinity';
  }

  let str = value.toString();

  const integerCount = str.split('.')[0]!.length;
  const demarcationLen = 17; // 17 digits represent the demarcation point for scientific notation
  // When the integer number is greater than 17, it needs to be displayed in scientific notation form
  if (integerCount >= demarcationLen || (str.includes('e') && !str.includes('e-'))) {
    const significanceDigitCount = 5; // number of significant digits after the decimal point
    // There will also be precision problems, but because there are already precision requirements in the premise, there will be no rounding problems
    str = value.toExponential(significanceDigitCount);
  } else {
    str = toFixed(value, precision);
  }

  return str;
}
const CapacityUnit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
// decimal point by 1
// For example, 1.23 and 1.26 both return 1.3
export function decimalCeil(decimal: number) {
  return Math.ceil(decimal * 10) / 10;
}
// decimal point does not advance by 1
// For example, 1.23 and 1.26 both return 1.2
export function normalDecimal(decimal: number) {
  return Math.floor(decimal * 10) / 10;
}

// Storage unit conversion, parameter unit is b
// Rule: normal conversion, do not do 1 processing
export function normalByteMGArr(bytes: number) {
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  if (i < 2) {
    const res = normalDecimal(bytes / Math.pow(1024, 2));
    return [res, CapacityUnit[2]];
  }
  if (i === 2 || i === 3) {
    const res = normalDecimal(bytes / Math.pow(1024, i));
    return (res === 1024 && i === 2) ? [1, CapacityUnit[i + 1]] : [res, CapacityUnit[i]];
  }
  if (i > 3) {
    const res = normalDecimal(bytes / Math.pow(1024, 3));
    return [res.toLocaleString(), CapacityUnit[3]];
  }
  return [normalDecimal(bytes), CapacityUnit[0]];
}

// Storage unit conversion, parameter unit is b
// Rule: The decimal point is advanced by 1, and one place is reserved after the decimal point.
// There are only two units of 'MB' and 'GB'. The returned arr[2] is the corresponding bytes value after the decimal point is advanced by 1.
// Example: interval (greater than 0 and less than 0.1mb) returns ['0.1', 'MB', 104857.6]
// Example: If the incoming storage size is 0.13mb, then return ['0.2','MB', 209715.2]
export function byteMGArr(bytes: number, isCell = true) :[number, string, number]{
  const minMb = 104857.6;
  if (bytes <= minMb) {
    // 0-0.1MB directly displays 0.1MB, <0MB directly displays 0MB
    const res = bytes <= 0 ? 0 : isCell ? 0.1 : 0;
    return [res, CapacityUnit[2]!, res * Math.pow(1024, 2)];
  }
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  if (i < 2) {
    const num = bytes / Math.pow(1024, 2);
    const res = isCell ? decimalCeil(num) : normalDecimal(num);
    return [res, CapacityUnit[2]!, res * Math.pow(1024, 2)];
  }
  if (i === 2 || i === 3) {
    const num = bytes / Math.pow(1024, i);
    const res = isCell ? decimalCeil(num) : normalDecimal(num);
    return (res === 1024 && i === 2) ? [1, CapacityUnit[i + 1]!, Math.pow(1024, 3)]
      : [res, CapacityUnit[i]!, res * Math.pow(1024, i)];
  }
  if (i > 3) {
    const num = bytes / Math.pow(1024, 3);
    const res = isCell ? decimalCeil(num) : normalDecimal(num);
    return [res, CapacityUnit[3]!, res * Math.pow(1024, 3)];
  }
  return [bytes, CapacityUnit[0]!, bytes];
}
export function byteMG(bytes: number) {
  if (bytes === Number.POSITIVE_INFINITY) {
    return t(Strings.unlimited);
  }
  return `${byteMGArr(bytes)[0]} ${byteMGArr(bytes)[1]}`;
}

// @description: Given two integers, generate an ordered set of numbers in between. In the form of an array, arranged from smallest to largest.
// left: 5, right: 8
// @return [6, 7];
export function numbersBetween(left: number, right: number) {
  const _left = Math.min(left, right);
  const _right = Math.max(left, right);
  const diff = _right - _left - 1;
  return Array.from({ length: diff }).map((_, index) => _left + index + 1);
}

// Convert the number to the correct value not NaN;
export function noNaN(n: number) {
  return isNaN(n) ? 0 : n;
}

// fix wrong data
export function strip(num: number, precision = 15): number {
  return parseFloat(Number(num).toPrecision(precision));
}

// get the number of digits after the decimal point
export function digitLength(num: number): number {
  const eSplit = num.toString().split(/[eE]/);
  const dLen = (eSplit[0]!.split('.')[1] || '').length;
  const power = Number(eSplit[1]) || 0;
  const len = dLen - power;
  return len > 0 ? len : 0;
}

// Scale the float to an integer,
export function float2Fixed(num: number): number {
  if (num.toString().indexOf('e') === -1) {
    return Number(num.toString().replace('.', ''));
  }
  const dLen = digitLength(num);
  return dLen > 0 ? strip(Number(num) * Math.pow(10, dLen)) : Number(num);
}

/**
 * Exact multiplication (to resolve loss of precision)
 */
export function times(num1: number, num2: number): number {
  const intNum1 = float2Fixed(num1);
  const intNum2 = float2Fixed(num2);
  const baseNum = digitLength(num1) + digitLength(num2);
  const dividend = intNum1 * intNum2;
  return dividend / Math.pow(10, baseNum);
}

/**
 * Exact division (to resolve loss of precision)
  * @param num1 dividend
  * @param num2 divisor
 */
export function divide(num1: number, num2: number): number {
  const intNum1 = float2Fixed(num1);
  const intNum2 = float2Fixed(num2);
  const baseNum = digitLength(num2) - digitLength(num1);
  const dividend = intNum1 / intNum2;
  return times(dividend, strip(Math.pow(10, baseNum)));
}

/**
 * Precise addition (to resolve loss of precision)
 */
export function plus(num1: number, num2: number): number {
  const baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)));
  return (times(num1, baseNum) + times(num2, baseNum)) / baseNum;
}

/**
 * Precise subtraction (to resolve loss of precision)
 */
export function minus(num1: number, num2: number): number {
  const baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)));
  return (times(num1, baseNum) - times(num2, baseNum)) / baseNum;
}
