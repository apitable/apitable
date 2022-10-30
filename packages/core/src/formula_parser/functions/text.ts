import { FormulaFunc, IFormulaParam } from './basic';
import { BasicValueType, FormulaFuncType } from 'types';
import { AstNode } from 'formula_parser/parser';
import { noNaN } from 'utils';
import { isString } from 'lodash';
import { Strings, t } from 'i18n';
import { flattenParams } from './array';

class TextFunc extends FormulaFunc {
  static readonly type = FormulaFuncType.Text;
}

type TextType = string | null;

export class Find extends TextFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 2) {
      throw new Error(t(Strings.function_validate_params_count_at_least, {
        name: 'FIND',
        count: 2,
      }));
    }
  }

  static getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static func(params: [IFormulaParam<string>, IFormulaParam<string>, IFormulaParam<number>]): number {
    const stringToFind = params[0].value;
    const whereToSearch = params[1].value;
    if (stringToFind == null || whereToSearch == null) {
      return 0;
    }
    if (!params[2] || params[2].value >= 0) {
      const startFromPosition = params[2]?.value > 0 ? params[2].value - 1 : 0;
      return whereToSearch.indexOf(stringToFind, startFromPosition) + 1;
    }
    // positionIndex supports negative numbers, if a negative number is filled in, the position is calculated from the back to the front
    const startFromPosition = whereToSearch.length + params[2].value;
    return whereToSearch.lastIndexOf(stringToFind, startFromPosition) + 1;
  }
}

export class Search extends TextFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 2) {
      throw new Error(t(Strings.function_validate_params_count_at_least, {
        name: 'SEARCH',
        count: 2,
      }));
    }
  }

  static getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static func(params: [IFormulaParam<string>, IFormulaParam<string>, IFormulaParam<number>]): number | null {
    const stringToFind = params[0].value;
    const whereToSearch = params[1].value;
    if (stringToFind == null || whereToSearch == null) {
      return null;
    }
    const startFromPosition = params[2] ? (params[2].value > 0 ? params[2].value - 1 : 0) : 0;
    const result = whereToSearch.indexOf(stringToFind, startFromPosition) + 1;
    if (result === 0) {
      return null;
    }
    return result;
  }
}

export class Concatenate extends TextFunc {
  static acceptValueType = new Set([BasicValueType.Array, ...FormulaFunc.acceptValueType]);

  static validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new Error(t(Strings.function_validate_params_count_at_least, {
        name: 'CONCATENATE',
        count: 1,
      }));
    }
  }

  static getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static func(params: IFormulaParam<string>[]): TextType {
    const flattenValue = flattenParams(params);
    return flattenValue.join('');
  }
}

export class EncodeUrlComponent extends TextFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new Error(t(Strings.function_validate_params_count_at_least, {
        name: 'ENCODE_URL_COMPONENT',
        count: 1,
      }));
    }
  }

  static getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static func(params: [IFormulaParam<string>]): TextType {
    const value = params[0].value;

    if (value == null) {
      return null;
    }
    return encodeURIComponent(String(value));
  }
}

export class Left extends TextFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new Error(t(Strings.function_validate_params_count_at_least, {
        name: 'LEFT',
        count: 1,
      }));
    }
  }

  static getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static func(params: [IFormulaParam<string>, IFormulaParam<number>]): TextType {
    const value = params[0].value;
    if (value == null) {
      return null;
    }
    const count = params[1] ? params[1].value : 1;
    return String(value).substring(0, count);
  }
}

export class Right extends TextFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new Error(t(Strings.function_validate_params_count_at_least, {
        name: 'RIGHT',
        count: 1,
      }));
    }
  }

  static getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static func(params: [IFormulaParam<string>, IFormulaParam<number>]): TextType {
    const value = params[0].value;
    if (value == null) {
      return null;
    }
    const valueStr = String(value);
    const count = params[1] ? params[1].value : 1;
    const startIndex = valueStr.length - count;
    return valueStr.substring(startIndex);
  }
}

export class Len extends TextFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new Error(t(Strings.function_validate_params_count_at_least, {
        name: 'LEN',
        count: 1,
      }));
    }
  }

  static getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static func(params: [IFormulaParam<string>]): number | null {
    const value = params[0].value;
    if (value == null) {
      return null;
    }
    return String(value).length;
  }
}

export class Lower extends TextFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new Error(t(Strings.function_validate_params_count_at_least, {
        name: 'LOWER',
        count: 1,
      }));
    }
  }

  static getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static func(params: [IFormulaParam<string>]): TextType {
    const value = params[0].value;
    if (value == null) {
      return null;
    }
    return String(value).toLowerCase();
  }
}

export class Upper extends TextFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new Error(t(Strings.function_validate_params_count_at_least, {
        name: 'UPPER',
        count: 1,
      }));
    }
  }

  static getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static func(params: [IFormulaParam<string>]): TextType {
    const value = params[0].value;
    if (value == null) {
      return null;
    }
    return String(value).toUpperCase();
  }
}

export class Mid extends TextFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 3) {
      throw new Error(t(Strings.function_validate_params_count_at_least, {
        name: 'MID',
        count: 3,
      }));
    }
  }

  static getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static func(params: [IFormulaParam<string>, IFormulaParam<number>, IFormulaParam<number>]): TextType {
    let [{ value: str }, { value: whereToStart }, { value: count }] = params;

    if (str == null) {
      return null;
    }
    str = String(str);
    whereToStart = Number(whereToStart) - 1;
    count = Number(count);

    return str.slice(whereToStart, whereToStart + count);
  }
}

export class Replace extends TextFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 4) {
      throw new Error(t(Strings.function_validate_params_count_at_least, {
        name: 'REPLACE',
        count: 4,
      }));
    }
  }

  static getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static func(params: [
    IFormulaParam<string>, IFormulaParam<number>, IFormulaParam<number>, IFormulaParam<string>
  ]): TextType {
    let [{ value: str }, { value: whereToStart }, { value: count }, { value: replaceStr }] = params;
    if (str == null) {
      return null;
    }
    str = String(str);
    whereToStart = noNaN(Number(whereToStart) - 1);
    count = noNaN(Number(count));
    replaceStr = replaceStr == null ? '' : String(replaceStr);

    if (str.length <= whereToStart) {
      return str + replaceStr;
    }

    let ret = str.substring(0, whereToStart) + replaceStr;
    ret += str.substring(whereToStart + count);

    return ret;
  }
}

export class T extends TextFunc {
  static acceptValueType = new Set([BasicValueType.DateTime, ...FormulaFunc.acceptValueType]);

  static validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new Error(t(Strings.function_validate_params_count_at_least, {
        name: 'T',
        count: 1,
      }));
    }
  }

  static getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static func(params: [IFormulaParam<string>]): TextType {
    const str = params[0].value;
    if (isString(str)) {
      return str;
    }
    return null;
  }
}

export class Trim extends TextFunc {
  static acceptValueType = new Set([BasicValueType.Boolean, BasicValueType.String]);

  static validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new Error(t(Strings.function_validate_params_count_at_least, {
        name: 'TRIM',
        count: 1,
      }));
    }
  }

  static getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static func(params: [IFormulaParam<string>]): TextType {
    const str = params[0].value;
    if (str == null) {
      return null;
    }
    return String(str).trim();
  }
}

export class Rept extends TextFunc {
  static acceptValueType = new Set([BasicValueType.Boolean, BasicValueType.String]);

  static validateParams(params: AstNode[]) {
    if (params.length < 2) {
      throw new Error(t(Strings.function_validate_params_count_at_least, {
        name: 'REPT',
        count: 2,
      }));
    }
  }

  static getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static func(params: [IFormulaParam<string>, IFormulaParam<number>]): TextType {
    let [{ value: str }, { value: count }] = params;
    if (str == null) {
      return null;
    }
    str = String(str);
    count = noNaN(Number(count));
    return str.repeat(count);
  }
}

export class Substitute extends TextFunc {
  static acceptValueType = new Set([BasicValueType.Boolean, BasicValueType.String]);

  static validateParams(params: AstNode[]) {
    if (params.length < 3) {
      throw new Error(t(Strings.function_validate_params_count_at_least, {
        name: 'SUBSTITUTE',
        count: 3,
      }));
    }
  }

  static getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static func(params: [
    IFormulaParam<string>, IFormulaParam<string>, IFormulaParam<string>, IFormulaParam<number>
  ]): TextType {
    const [{ value: str }, { value: oldText }, { value: newText }] = params;
    const index = params[3] && noNaN(Number(params[3].value) - 1);
    const splitArr = String(str).split(oldText);

    if (str == null) {
      return null;
    }
    if (index < 1 || index > splitArr.length - 2) { // When the starting position does not match the range value, return the original string directly
      return String(str);
    }
    if (index) {
      const substituter = [splitArr[index], splitArr[index + 1]].join(newText);
      splitArr.splice(index, 2, substituter);
      return splitArr.join(oldText);
    }
    return splitArr.join(newText);
  }
}
