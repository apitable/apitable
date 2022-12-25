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

import { FormulaFunc, IFormulaParam } from './basic';
import { BasicValueType, FormulaFuncType } from 'types';
import { AstNode } from 'formula_parser/parser';
import { noNaN } from 'utils';
import { isString } from 'lodash';
import { flattenParams } from './array';
import { ParamsCountError, ParamsErrorType } from 'formula_parser/errors/params_count.error';

class TextFunc extends FormulaFunc {
  static override readonly type = FormulaFuncType.Text;
}

type TextType = string | null;

export class Find extends TextFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 2) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'FIND', 2);
    }
  }

  static override getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static override func(params: [IFormulaParam<string>, IFormulaParam<string>, IFormulaParam<number>]): number {
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
  static override validateParams(params: AstNode[]) {
    if (params.length < 2) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'SEARCH', 2);
    }
  }

  static override getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static override func(params: [IFormulaParam<string>, IFormulaParam<string>, IFormulaParam<number>]): number | null {
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
  static override acceptValueType = new Set([BasicValueType.Array, ...FormulaFunc.acceptValueType]);

  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'CONCATENATE', 1);
    }
  }

  static override getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static override func(params: IFormulaParam<string>[]): TextType {
    const flattenValue = flattenParams(params);
    return flattenValue.join('');
  }
}

export class EncodeUrlComponent extends TextFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'ENCODE_URL_COMPONENT', 1);
    }
  }

  static override getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static override func(params: [IFormulaParam<string>]): TextType {
    const value = params[0].value;

    if (value == null) {
      return null;
    }
    return encodeURIComponent(String(value));
  }
}

export class Left extends TextFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'LEFT', 1);
    }
  }

  static override getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static override func(params: [IFormulaParam<string>, IFormulaParam<number>]): TextType {
    const value = params[0].value;
    if (value == null) {
      return null;
    }
    const count = params[1] ? params[1].value : 1;
    return String(value).substring(0, count);
  }
}

export class Right extends TextFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'RIGHT', 1);
    }
  }

  static override getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static override func(params: [IFormulaParam<string>, IFormulaParam<number>]): TextType {
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
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'LEN', 1);
    }
  }

  static override getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static override func(params: [IFormulaParam<string>]): number | null {
    const value = params[0].value;
    if (value == null) {
      return null;
    }
    return String(value).length;
  }
}

export class Lower extends TextFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'LOWER', 1);
    }
  }

  static override getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static override func(params: [IFormulaParam<string>]): TextType {
    const value = params[0].value;
    if (value == null) {
      return null;
    }
    return String(value).toLowerCase();
  }
}

export class Upper extends TextFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'UPPER', 1);
    }
  }

  static override getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static override func(params: [IFormulaParam<string>]): TextType {
    const value = params[0].value;
    if (value == null) {
      return null;
    }
    return String(value).toUpperCase();
  }
}

export class Mid extends TextFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 3) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'MID', 3); 
    }
  }

  static override getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static override func(params: [IFormulaParam<string>, IFormulaParam<number>, IFormulaParam<number>]): TextType {
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
  static override validateParams(params: AstNode[]) {
    if (params.length < 4) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'REPLACE', 4);
    }
  }

  static override getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static override func(params: [
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
  static override acceptValueType = new Set([BasicValueType.DateTime, ...FormulaFunc.acceptValueType]);

  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'T', 1);
    }
  }

  static override getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static override func(params: [IFormulaParam<string>]): TextType {
    const str = params[0].value;
    if (isString(str)) {
      return str;
    }
    return null;
  }
}

export class Trim extends TextFunc {
  static override acceptValueType = new Set([BasicValueType.Boolean, BasicValueType.String]);

  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'TRIM', 1);
    }
  }

  static override getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static override func(params: [IFormulaParam<string>]): TextType {
    const str = params[0].value;
    if (str == null) {
      return null;
    }
    return String(str).trim();
  }
}

export class Rept extends TextFunc {
  static override acceptValueType = new Set([BasicValueType.Boolean, BasicValueType.String]);

  static override validateParams(params: AstNode[]) {
    if (params.length < 2) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'REPT', 2);
    }
  }

  static override getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static override func(params: [IFormulaParam<string>, IFormulaParam<number>]): TextType {
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
  static override acceptValueType = new Set([BasicValueType.Boolean, BasicValueType.String]);

  static override validateParams(params: AstNode[]) {
    if (params.length < 3) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'SUBSTITUTE', 3);
    }
  }

  static override getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static override func(params: [
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
