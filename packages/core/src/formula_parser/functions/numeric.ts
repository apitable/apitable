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

import { max, min } from 'lodash';
import { FormulaFunc, IFormulaParam } from './basic';
import { BasicValueType, FormulaFuncType } from 'types';
import { AstNode, ValueOperandNodeBase } from 'formula_parser/parser';
import { divide, noNaN, plus, times } from 'utils';
import { ParamsCountError, ParamsErrorType } from 'formula_parser/errors/params_count.error';

class NumericFunc extends FormulaFunc {
  static override readonly type = FormulaFuncType.Numeric;
}

type NumericType = number | null;

function isArrayParam(params: IFormulaParam<any>[]): params is [IFormulaParam<any[] | null>] {
  if (params.length !== 1) {
    return false;
  }
  if (params[0]!.node.valueType === BasicValueType.Array) {
    return true;
  }
  return false;
}

function isArrayNodes(nodes?: AstNode[]) {
  if (!nodes || nodes.length !== 1) {
    return false;
  }
  if (nodes[0]!.valueType === BasicValueType.Array) {
    return true;
  }
  return false;
}
/**
  * Tool class for some public functions
  */
export class NumericUtilsFunc extends NumericFunc {
  static override getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  /**
   * CEILING, FLOOR
   * The output result is aligned with Excel
   */
  static calc2RoundFC(
    params: [IFormulaParam<number>, IFormulaParam<number>],
    calcFn: (collection: any) => any,
  ): NumericType {
    if (params[0].value == null) {
      return null;
    }
    const value = Number(params[0].value);
    let sign = params[1]?.value;
    if (sign != null) {
      sign = Number(sign);
      return times(calcFn(divide(value, sign)), sign);
    }
    return calcFn(value);
  }

  // ROUNDUP、ROUNDDOWN
  static calc2RoundDU(
    params: [IFormulaParam<number>, IFormulaParam<number>],
    calcFn1: (collection: any) => any,
    calcFn2: (collection: any) => any,
  ): NumericType {
    if (params[0].value == null) {
      return null;
    }
    const value = Number(params[0].value);
    const precision = Math.floor(params[1]?.value) || 0;
    const offset = Math.pow(10, precision);
    const roundFn = value > 0 ? calcFn1 : calcFn2;
    const rounded = roundFn(value * offset) / offset;

    return rounded;
  }
}

export class Sum extends NumericFunc {
  static override acceptValueType = new Set([BasicValueType.Array, ...FormulaFunc.acceptValueType]);

  static override validateParams() {
    //
  }

  static override getReturnType() {
    return BasicValueType.Number;
  }

  static override func(params: IFormulaParam<number>[]): number {
    let result = 0;
    // If there is only one parameter and it is an array, it means that the value of the array type field is summed
    if (isArrayParam(params)) {
      const innerValueType = (params[0].node as ValueOperandNodeBase).innerValueType;
      if (innerValueType && innerValueType === BasicValueType.DateTime) {
        return 0;
      }
      if (!params[0].value) {
        return 0;
      }

      result = params[0].value.reduce((pre, cur) => {
        return plus(pre, noNaN(Number(cur)));
      }, 0);
    } else {
      result = params.reduce((pre, cur) => {
        return plus(pre, noNaN(Number(cur.value)));
      }, 0);
    }

    return result;
  }
}

export class Abs extends NumericFunc {
  static override validateParams(_params: AstNode[]) {
    //
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);

    return BasicValueType.Number;
  }

  static override func(params: [IFormulaParam<number>]): number {
    return Math.abs(params[0] && params[0].value);
  }
}

export class Average extends NumericFunc {
  static override acceptValueType = new Set([BasicValueType.Array, ...FormulaFunc.acceptValueType]);

  static override validateParams() {
    //
  }

  static override getReturnType() {
    return BasicValueType.Number;
  }

  static override func(params: IFormulaParam<number>[]): number {
    // If there is only one parameter and it is an array, it means that the value of the array type field is summed
    if (isArrayParam(params)) {
      const innerValueType = (params[0].node as ValueOperandNodeBase).innerValueType;
      if (innerValueType && innerValueType === BasicValueType.DateTime) {
        return 0;
      }

      if (!params[0].value) {
        return 0;
      }
      return params[0].value.reduce((pre, cur) => {
        return plus(pre, noNaN(Number(cur)));
      }, 0) / (params[0].value.length || 1);
    }

    const total = params.filter(cur => {
      // Product requirement, the cell is empty, the cell is not counted in the total
      if (cur.value == null) {
        return false;
      }
      return !Number.isNaN(Number(cur.value));
    }).length || 1;

    return params.reduce((pre, cur) => {
      return plus(pre, noNaN(Number(cur.value)));
    }, 0) / total;
  }
}

export class Ceiling extends NumericUtilsFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'CEILING', 1);
    }
  }

  static override func(params: [IFormulaParam<number>, IFormulaParam<number>]): NumericType {
    return this.calc2RoundFC(params, Math.ceil);
  }
}

export class Floor extends NumericUtilsFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'FLOOR', 1);
    }
  }

  static override func(params: [IFormulaParam<number>, IFormulaParam<number>]): NumericType {
    return this.calc2RoundFC(params, Math.floor);
  }
}

export class Round extends NumericFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'ROUND', 1);
    }
  }

  static override getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static override func(params: [IFormulaParam<number>, IFormulaParam<number>]): NumericType {
    const value = params[0].value;
    if (value == null) {
      return null;
    }
    const num = Number(value);
    const precision = params[1] && Math.floor(params[1].value) || 0;
    const offset = Math.pow(10, precision);
    return divide(Math.round(times(num, offset)), offset);
  }
}

export class Max extends NumericFunc {
  static override acceptValueType = new Set([BasicValueType.DateTime, BasicValueType.Array, ...FormulaFunc.acceptValueType]);

  static override validateParams(_params: AstNode[]) {
    //
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    if (!params) {
      return BasicValueType.Number;
    }

    if (isArrayNodes(params)) {
      const innerValueType = (params[0] as ValueOperandNodeBase).innerValueType;
      if (innerValueType === BasicValueType.DateTime) {
        return BasicValueType.DateTime;
      }
      return BasicValueType.Number;
    }

    // All parameters are date type, return date type
    if (params.every(node => node.valueType === BasicValueType.DateTime)) {
      return BasicValueType.DateTime;
    }

    return BasicValueType.Number;
  }

  static override func(params: IFormulaParam<number>[]): NumericType {
    return this.calc(params, max);
  }

  static calc(params: IFormulaParam<number>[], calcFn: (collection: any[]) => any): NumericType {
    // If there is only one parameter and it is an array, it means that the value of the array type field is summed
    if (isArrayParam(params)) {
      if (!params[0].value) {
        return null;
      }
      const v = calcFn(params[0].value.map(Number).filter(d => !isNaN(d)));
      return v == null ? null : Number(v);
    }

    // If the return value is DateTime, the node of DateTime type should be filtered out,
    // otherwise the timestamp will be introduced to disturb the calculation result
    if (this.getReturnType(params.map(p => p.node)) !== BasicValueType.DateTime) {
      params = params.filter(p => p.node.valueType !== BasicValueType.DateTime);
    }

    const v = calcFn(params.map(p => Number(p.value)).filter(d => !isNaN(d)));
    return v == null ? 0 : Number(v);
  }
}

// The Min function is different from Max only in the calculation method calcFn
export class Min extends Max {
  static override func(params: IFormulaParam<number>[]): NumericType {
    return this.calc(params, min);
  }
}

export class Log extends NumericFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'LOG', 1);
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static override func(params: [IFormulaParam<number>, IFormulaParam<number>]): NumericType {
    const value = params[0].value;
    if (value == null) {
      return null;
    }
    const num = Number(value);
    const base = params[1] ? Number(params[1].value) : 10;
    return Math.log(num) / Math.log(base);
  }
}

export class Int extends NumericFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'INT', 1);
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static override func(params: [IFormulaParam<number>]): NumericType {
    const value = params[0].value;
    if (value == null) {
      return null;
    }
    return Math.floor(value);
  }
}

export class Exp extends NumericFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'EXP', 1);
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static override func(params: [IFormulaParam<number>]): NumericType {
    const value = params[0].value;
    if (value == null) {
      return null;
    }
    return Math.exp(value);
  }
}

export class Odd extends NumericFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'ODD', 1);
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static override func(params: [IFormulaParam<number>]): NumericType {
    const value = params[0].value;
    if (params[0].value == null) {
      return null;
    }
    const num = Number(value);
    const rounded = value > 0 ? Math.ceil(num) : Math.floor(num);
    if (rounded % 2 !== 0) {
      return rounded;
    }

    return rounded >= 0 ? rounded + 1 : rounded - 1;
  }
}

export class Even extends NumericFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'EVEN', 1);
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static override func(params: [IFormulaParam<number>]): NumericType {
    const value = params[0].value;
    if (params[0].value == null) {
      return null;
    }
    const num = Number(params[0].value);
    const rounded = value > 0 ? Math.ceil(num) : Math.floor(num);
    if (rounded % 2 === 0) {
      return rounded;
    }

    return rounded > 0 ? rounded + 1 : rounded - 1;
  }
}

export class RoundUp extends NumericUtilsFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'ROUNDUP', 1);
    }
  }

  static override func(params: [IFormulaParam<number>, IFormulaParam<number>]): NumericType {
    return this.calc2RoundDU(params, Math.ceil, Math.floor);
  }
}

export class RoundDown extends NumericUtilsFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'ROUNDDOWN', 1);
    }
  }

  static override func(params: [IFormulaParam<number>, IFormulaParam<number>]): NumericType {
    return this.calc2RoundDU(params, Math.floor, Math.ceil);
  }
}

export class Power extends NumericFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 2) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'POWER', 2);
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static override func(params: [IFormulaParam<number>, IFormulaParam<number>]): NumericType {
    const value = params[0].value;
    if (params[0].value == null) {
      return null;
    }
    return Math.pow(value, params[1].value);
  }
}

export class Sqrt extends NumericFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'SQRT', 1);
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static override func(params: [IFormulaParam<number>]): NumericType {
    const value = params[0].value;
    if (params[0].value == null) {
      return null;
    }
    return Math.sqrt(value);
  }
}

export class Mod extends NumericFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 2) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'MOD', 2);
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static override func(params: [IFormulaParam<number>, IFormulaParam<number>]): NumericType {
    const value = params[0].value;
    if (params[0].value == null) {
      return null;
    }
    const num = Number(value);
    const divisor = Number(params[1].value);
    const mod = num % divisor;

    if ((num ^ divisor) < 0) {
      return mod * (-1);
    }
    return mod;
  }
}

export class Value extends NumericFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new ParamsCountError(ParamsErrorType.AtLeastCount, 'VALUE', 1);
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static override func(params: [IFormulaParam<string>]): number {
    const text = String(params[0].value);
    const regNumber = /[^0-9.+-]/g;
    const regSymbol = /(\+|-|\.)+/g;
    const value = text
      .replace(regNumber, '')
      .replace(regSymbol, '$1');

    return parseFloat(value);
  }
}

