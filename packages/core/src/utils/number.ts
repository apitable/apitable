import { Strings, t } from 'i18n';
import { isString } from 'lodash';
import { ICellValue } from 'model';

/**
 * 将数字列单元格的字符串做过滤，即不合法处理
 * @param value 单元格输入的值
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
 * 从科学计数法变成数字格式（由于大数会自动转回科学计数法，以string方式记录）
 * @param value js里数字会转成科学计数法的部分数据
 */
export function e2number(value: string) {
  const val = value.split('e');
  const p = parseInt(val[1], 10); // 得到指数值
  const num = val[0].split('.');
  const dotLeft: string = num[0]; // 小数点左边值
  const dotRight: string = num[1] || ''; // 小数点右边值

  if (p > 0) {
    value = dotLeft + dotRight.substr(0, p) +
      (dotRight.length > p ? '.' + dotRight.substr(p) : '0'.repeat(p - dotRight.length));
  } else {
    // 由number转换的科学计数法默认的小数点左侧位数为1，所以只考虑这种情况
    const left = parseInt(dotLeft, 10);
    value = (left < 0 ? '-0.' : '0.') + '0'.repeat(-p - 1) + Math.abs(left) + dotRight;
  }

  return value;
}

/**
 * 对数字列数字做统一格式处理，截取前15位有效数字，并转成数字
 * @param value 从单元格输入的合法数字（string格式）
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

  const demarcationLen = 15; // 15位有效数字为截断分界点
  if (len > demarcationLen) {
    let isNegative = 0; // 用0表示正数，1表示负数，方便后面计数，因为负数需要多计算一位长度
    if (Number(value) < 0) {
      isNegative = 1;
    }
    // 整数的长度和len相等，带小数的长度=len + 1，纯小数的长度 - len > 1
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
 * 重写toFixed精度问题
 * 只能支持20位精度
 */
export const toFixed = function(value: number, precision = 0) {
  if (isNaN(value)) return 0;
  const that = Math.abs(value);
  let changenum;
  let index;

  if (precision < 0) precision = 0; // 原来传入参数若为负值，则会报错。这里当作默认为0处理，即不保留位数的形式。
  changenum = that * Math.pow(10, precision) + 0.5;
  changenum = (parseInt(changenum, 10) / Math.pow(10, precision)).toString();
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
 * 展现在单元格里的数字形态，以精度来截取展现
 * @param value 最后保存在model的数据
 * @param precision 保留几位小数值
 * @param demarcationLen 几位数字为科学计数法展示分界点
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

  const integerCount = str.split('.')[0].length;
  const demarcationLen = 17; // 17 位数字为科学计数法展示分界点
  // 当整数位数大于17位时，需要展现成科学计数法形式
  if (integerCount >= demarcationLen || (str.includes('e') && !str.includes('e-'))) {
    const significanceDigitCount = 5; // 小数点后保留几位有效数字
    str = value.toExponential(significanceDigitCount); // 也会有精度问题，但是因为前提里已经是有精度要求，因此不会出现四舍五入的问题
  } else {
    str = toFixed(value, precision);
  }

  return str;
}
const CapacityUnit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
// 小数点进1
// 比如1.23与1.26均返回1.3
export function decimalCeil(decimal: number) {
  return Math.ceil(decimal * 10) / 10;
}
// 小数点不进1
// 比如1.23与1.26均返回1.2
export function normalDecimal(decimal: number) {
  return Math.floor(decimal * 10) / 10;
}

// 存储单位转化,参数单位为b
// 规则：普通转化，不做进1处理
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

// 存储单位转化,参数单位为b
// 规则：小数点进1，小数点后保留一位，只有'MB', 'GB'两种单位,返回的arr[2]是小数点进1之后所对应的的bytes值
// 例：区间（大于0小于0.1mb）返回['0.1', 'MB', 104857.6]
// 例：传入的存储大小为0.13mb则返回['0.2','MB', 209715.2]
export function byteMGArr(bytes: number, isCell = true) :[number, string, number]{
  const minMb = 104857.6;
  if (bytes <= minMb) {
    //  0-0.1MB直接显示0.1MB,<0MB直接显示0MB
    const res = bytes <= 0 ? 0 : isCell ? 0.1 : 0;
    return [res, CapacityUnit[2], res * Math.pow(1024, 2)];
  }
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  if (i < 2) {
    const num = bytes / Math.pow(1024, 2);
    const res = isCell ? decimalCeil(num) : normalDecimal(num);
    return [res, CapacityUnit[2], res * Math.pow(1024, 2)];
  }
  if (i === 2 || i === 3) {
    const num = bytes / Math.pow(1024, i);
    const res = isCell ? decimalCeil(num) : normalDecimal(num);
    return (res === 1024 && i === 2) ? [1, CapacityUnit[i + 1], Math.pow(1024, 3)]
      : [res, CapacityUnit[i], res * Math.pow(1024, i)];
  }
  if (i > 3) {
    const num = bytes / Math.pow(1024, 3);
    const res = isCell ? decimalCeil(num) : normalDecimal(num);
    return [res, CapacityUnit[3], res * Math.pow(1024, 3)];
  }
  return [bytes, CapacityUnit[0], bytes];
}
export function byteMG(bytes: number) {
  if (bytes === Number.POSITIVE_INFINITY) {
    return t(Strings.unlimited);
  }
  return `${byteMGArr(bytes)[0]} ${byteMGArr(bytes)[1]}`;
}

// @description: 给定两个整数，生成处于两个数中间的数组成的有序集合。以数组的形式，从小到大排列。
// left: 5, right: 8
// @return [6, 7];
export function numbersBetween(left: number, right: number) {
  const _left = Math.min(left, right);
  const _right = Math.max(left, right);
  const diff = _right - _left - 1;
  return Array.from({ length: diff }).map((_, index) => _left + index + 1);
}

// 把数字转换成正确的值非 NaN;
export function noNaN(n: number) {
  return isNaN(n) ? 0 : n;
}

// 修正错误的数据
export function strip(num: number, precision = 15): number {
  return parseFloat(Number(num).toPrecision(precision));
}

// 取小数点后的位数
export function digitLength(num: number): number {
  const eSplit = num.toString().split(/[eE]/);
  const dLen = (eSplit[0].split('.')[1] || '').length;
  const power = Number(eSplit[1]) || 0;
  const len = dLen - power;
  return len > 0 ? len : 0;
}

// 将浮点数放大为整型，
export function float2Fixed(num: number): number {
  if (num.toString().indexOf('e') === -1) {
    return Number(num.toString().replace('.', ''));
  }
  const dLen = digitLength(num);
  return dLen > 0 ? strip(Number(num) * Math.pow(10, dLen)) : Number(num);
}

/**
 * 精确乘法（解决精度丢失）
 */
export function times(num1: number, num2: number): number {
  const intNum1 = float2Fixed(num1);
  const intNum2 = float2Fixed(num2);
  const baseNum = digitLength(num1) + digitLength(num2);
  const dividend = intNum1 * intNum2;
  return dividend / Math.pow(10, baseNum);
}

/**
 * 精确除法（解决精度丢失）
 * @param num1 被除数
 * @param num2 除数
 */
export function divide(num1: number, num2: number): number {
  const intNum1 = float2Fixed(num1);
  const intNum2 = float2Fixed(num2);
  const baseNum = digitLength(num2) - digitLength(num1);
  const dividend = intNum1 / intNum2;
  return times(dividend, strip(Math.pow(10, baseNum)));
}

/**
 * 精确加法（解决精度丢失）
 */
export function plus(num1: number, num2: number): number {
  const baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)));
  return (times(num1, baseNum) + times(num2, baseNum)) / baseNum;
}

/**
 * 精确减法（解决精度丢失）
 */
export function minus(num1: number, num2: number): number {
  const baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)));
  return (times(num1, baseNum) - times(num2, baseNum)) / baseNum;
}
