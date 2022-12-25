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

export function str2number(value: string): number | null {
  if (value.trim() === '') {
    return null;
  }

  const num = Number(value);
  return num2number(num);
}

export function num2number(num: number): number | null {
  if (num == null || !Number.isFinite(num)) {
    return null;
  }

  return numberSpecification(num.toString());
}

/**
 * Change from scientific notation to number format 
 * (because large numbers will be automatically converted back to scientific notation, recorded in string mode)
 * @param value The numbers in js will be converted to part of the data in scientific notation
 */
function e2number(value: string): string {
  const val = value.split('e') as [string, string];
  const p = parseInt(val[1], 10); // get the index value
  if (p === 0) {
    return val[0];
  }

  const num = val[0].split('.');
  const dotLeft: string = num[0]!; // value to the left of the decimal point
  const dotRight: string = num[1] || ''; // value to the right of the decimal point

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
function numberSpecification(value: string) {
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
  return Number(value);
}
