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
 * 从科学计数法变成数字格式（由于大数会自动转回科学计数法，以string方式记录）
 * @param value js里数字会转成科学计数法的部分数据
 */
function e2number(value: string) {
  const val = value.split('e');
  const p = parseInt(val[1], 10); // 得到指数值
  if (p === 0) {
    return val[0];
  }

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
function numberSpecification(value: string) {
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
  return Number(value);
}
