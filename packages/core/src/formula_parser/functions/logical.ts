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

import { FormulaFunc, IFormulaParam, FormulaBaseError } from './basic';
import { BasicValueType, FormulaFuncType } from 'types';
import { AstNode } from 'formula_parser/parser/ast';
import dayjs from 'dayjs';
import { handleLookupNullValue } from 'formula_parser/helper';
import { ParamsCountError, ParamsErrorType } from 'formula_parser/errors/params_count.error';
class LogicalFunc extends FormulaFunc {
  static override readonly type = FormulaFuncType.Logical;
}

function isArrayParam(params: IFormulaParam<any>[]): params is [IFormulaParam<any[] | null>] {
  if (params.length !== 1) {
    return false;
  }
  if (params[0]!.node.valueType === BasicValueType.Array) {
    return true;
  }
  return false;
}

export class If extends LogicalFunc {
  static override acceptValueType = new Set([BasicValueType.Array, BasicValueType.DateTime, ...FormulaFunc.acceptValueType]);

  static override validateParams(params: AstNode[]) {
    if (params.length < 3) {
      throw new ParamsCountError(ParamsErrorType.NotEquals, 'IF', 3);
    }
  }

  static override getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);

    if (!params) {
      return BasicValueType.String;
    }

    const [, value1Node, value2Node] = params as [AstNode, AstNode, AstNode];
    if ([value1Node.valueType, value2Node.valueType].some(v => v === BasicValueType.Array)) {
      return BasicValueType.String;
    }
    // If one of the two values is 'BLANK', the result type is determined by the type of the other
    if (value1Node.token.value.toUpperCase() === 'BLANK') {
      return value2Node.valueType;
    }
    if (value2Node.token.value.toUpperCase() === 'BLANK') {
      return value1Node.valueType;
    }
    // When both value parameters are Number/Boolean/DateTime/String, the return value of the corresponding type is inferred
    if (value1Node.valueType === value2Node.valueType) {
      return value1Node.valueType;
    }
    return BasicValueType.String;
  }

  static override func(params: [IFormulaParam<boolean>, IFormulaParam<any>, IFormulaParam<any>]): string | number {
    const [logical, value1Param, value2Param] = params;
    return logical.value ? value1Param.value : value2Param.value;
  }
}

export class Blank extends LogicalFunc {
  static override validateParams(_params: AstNode[]) {
    //
  }

  static override getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static override func(): null {
    return null;
  }
}

export class True extends LogicalFunc {
  static override validateParams(_params: AstNode[]) {
    //
  }

  static override getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Boolean;
  }

  static override func(): boolean {
    return true;
  }
}

export class False extends LogicalFunc {
  static override validateParams(_params: AstNode[]) {
    //
  }

  static override getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Boolean;
  }

  static override func(): boolean {
    return false;
  }
}

export class Or extends LogicalFunc {
  static override acceptValueType = new Set([BasicValueType.Array, ...FormulaFunc.acceptValueType]);

  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'OR', 1);
    }
  }

  static override getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Boolean;
  }

  static override func(params: IFormulaParam<boolean>[]): boolean {
    params = handleLookupNullValue(params);
    if (isArrayParam(params)) {
      if (!params[0].value) { return false; }

      return params[0].value.some(v => Boolean(v));
    }
    return params.some(v => Boolean(v.value));
  }
}

export class And extends LogicalFunc {
  static override acceptValueType = new Set([BasicValueType.Array, ...FormulaFunc.acceptValueType]);

  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'AND', 1);
    }
  }

  static override getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Boolean;
  }

  static override func(params: IFormulaParam<boolean>[]): boolean {
    params = handleLookupNullValue(params);
    if (isArrayParam(params)) {
      if (!params[0].value) { return false; }

      return params[0].value.every(v => Boolean(v));
    }
    return params.every(v => Boolean(v.value));
  }
}

export class Xor extends LogicalFunc {
  static override acceptValueType = new Set([BasicValueType.Array, ...FormulaFunc.acceptValueType]);

  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'XOR', 1);
    }
  }

  static override getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Boolean;
  }

  static override func(params: IFormulaParam<boolean>[]): boolean {
    let count: number;
    params = handleLookupNullValue(params);
    if (isArrayParam(params)) {
      if (!params[0].value) { return false; }

      count = params[0].value.reduce((prev, cur) => cur ? prev + 1 : prev, 0);
    } else {
      count = params.reduce((prev, cur) => cur.value ? prev + 1 : prev, 0);
    }
    return Boolean(count & 1);
  }
}

export class Not extends LogicalFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.NotEquals, 'NOT', 1);
    }
  }

  static override getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Boolean;
  }

  static override func(params: [IFormulaParam<boolean>]): boolean {
    params = handleLookupNullValue(params) as [IFormulaParam<boolean>];
    const logical1Param = params[0].value;
    return !logical1Param;
  }
}

export class Switch extends LogicalFunc {
  static override acceptValueType = new Set([BasicValueType.DateTime, ...FormulaFunc.acceptValueType]);

  static override validateParams(params: AstNode[]) {
    if (params.length < 2) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'SWITCH', 2);
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);

    if (!params) {
      return BasicValueType.String;
    }

    // Only when the return type of the value of all matched expressions is Number/Boolean/DateTime/String,
    // it is inferred as the return value of the corresponding type
    const argsLength = params.length - 1;
    let resultType: BasicValueType | null = argsLength & 1 ? params[argsLength]!.valueType : null;
    for (let i = 2; i <= argsLength; i += 2) {
      const curParams = params[i]!;
      // If the matched expression contains BLANK, it is determined by other return types
      if (curParams.token.value.toUpperCase() === 'BLANK') continue;
      if (resultType != null && resultType !== curParams.valueType) {
        return BasicValueType.String;
      }
      resultType = curParams.valueType;
    }
    resultType = resultType || BasicValueType.String;
    return resultType === BasicValueType.Array ? BasicValueType.String : resultType;
  }

  static override func(params: IFormulaParam[]): string | number | null {
    params = handleLookupNullValue(params);
    let targetValue = params[0]!.value;
    const argsLength = params.length - 1;
    const switchCount = Math.floor(argsLength / 2);
    const defaultValue: any = argsLength & 1 ? params[argsLength]!.value : null;
    const isDateTimeType = params[0]!.node.innerValueType === BasicValueType.DateTime; // Do special handling for DateTime types

    // Specially handle the matching of Array type fields to BLANK
    const isEmptyArray = (param: IFormulaParam) => param.node.valueType === BasicValueType.Array && !param.value?.length;

    if (isDateTimeType) {
      targetValue = dayjs(targetValue).valueOf();
    }
    if (isEmptyArray(params[0]!)) {
      targetValue = null;
    }
    if (switchCount > 0) {
      for (let i = 0; i < switchCount; i++) {
        const currentParam = params[i * 2 + 1]!;
        let currentValue = currentParam.value;

        if (isDateTimeType) {
          currentValue = dayjs(currentValue).valueOf();
        }
        if (isEmptyArray(currentParam)) {
          currentValue = null;
        }
        if (targetValue === currentValue) {
          return params[i * 2 + 2]!.value;
        }
      }
    }
    return defaultValue;
  }
}

// All equations' running errors or manual triggers will inherit this class
export class FormulaError extends LogicalFunc {
  static override validateParams(_params: AstNode[]) {
    //
  }

  static override getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static override func(params: [IFormulaParam<string>]) {
    const errText = params[0]?.value;
    throw new FormulaBaseError(errText || '');
  }
}

export class IsError extends LogicalFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.NotEquals, 'IS_ERROR', 1);
    }
  }

  static override getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Boolean;
  }

  static override func(params: [IFormulaParam<any>]): boolean {
    const value = params[0].value;
    const isError = value instanceof FormulaBaseError || isNaN(value) || value === Infinity || value === -Infinity;
    return isError;
  }
}
