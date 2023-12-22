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
import { AstNode, ValueOperandNode } from 'formula_parser/parser/ast';
import { Field } from 'model/field';
import dayjs from 'dayjs';
import { t, Strings } from '../../exports/i18n';

class ArrayFunc extends FormulaFunc {
  static override readonly type = FormulaFuncType.Array;

  static override acceptValueType = new Set([BasicValueType.Array, ...FormulaFunc.acceptValueType]);
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

/**
 * Flatten the value of the parameter
 */
export const flattenParams = (params: IFormulaParam[]): any[] => {
  const value = params.reduce((prev, cur) => {
    const { value, node } = cur;

    if (cur.node.valueType === BasicValueType.Array) {
      const { field, context } = node as ValueOperandNode;
      if (Field.bindContext(field, context.state).isComputed) {
        const v = (Field.bindContext(field, context.state) as any).arrayValueToArrayStringValueArray(value);
        return v != null ? [...prev, v] : prev;
      }
    }
    return value != null ? [...prev, value] : prev;
  }, [] as IFormulaParam[]);
  return value.flat(Infinity);
};

enum SymbolType {
  Equal = 'Equal',
  NotEqual = 'NotEqual',
  Greater = 'Greater',
  Less = 'Less',
}

export class ArrayJoin extends ArrayFunc {
  static override validateParams(_params: AstNode[]) {
    //
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);

    return BasicValueType.String;
  }

  static override func(
    [valuesParam, separatorParam]: [IFormulaParam, IFormulaParam<string>],
  ): string | null {
    const { value, node } = valuesParam;
    const separator = (separatorParam && separatorParam.value) || ', ';

    if (value && node.valueType === BasicValueType.Array) {
      const { field, context } = node as ValueOperandNode;
      if (context && Field.bindContext(field, context.state).isComputed) {
        const v = (Field.bindContext(field, context.state) as any).arrayValueToArrayStringValueArray(value);
        return v?.join(separator);
      }
      return value?.join(separator);
    }

    return value;
  }
}

export class ArrayUnique extends ArrayFunc {
  static override validateParams(_params: AstNode[]) {
    //
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Array;
  }

  static override func(params: IFormulaParam[]): any[] {
    const flattenValue = flattenParams(params);
    return [...new Set(flattenValue)];
  }
}

export class ArrayFlatten extends ArrayFunc {
  static override validateParams(_params: AstNode[]) {
    //
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Array;
  }

  static override func(params: IFormulaParam[]): any[] {
    return flattenParams(params);
  }
}

export class ArrayCompact extends ArrayFunc {
  static override validateParams(_params: AstNode[]) {
    //
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Array;
  }

  static override func(params: IFormulaParam[]): any[] {
    const flattenValue = flattenParams(params);
    return flattenValue.filter(v => v !== '');
  }
}

export class Count extends ArrayFunc {
  static override acceptValueType = new Set([BasicValueType.Array, ...FormulaFunc.acceptValueType]);

  static override validateParams(_params: AstNode[]) {
    //
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static override func(params: IFormulaParam<any>[]): number {
    const calc = (v: any) => typeof v === 'number' && !isNaN(v);
    if (isArrayParam(params)) {
      const innerValueType = (params[0].node as ValueOperandNode).innerValueType;
      if (innerValueType && innerValueType === BasicValueType.DateTime) {
        return 0;
      }
      if (!params[0].value) { return 0; }
      return params[0].value.filter(calc).length;
    }

    return params.filter(param => calc(param.value)).length;
  }
}

export class Counta extends ArrayFunc {
  static override validateParams(_params: AstNode[]) {
    //
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static override func(params: IFormulaParam<any>[]): number {
    // Due to how other platforms handle this function, false is also included in the range of nulls
    const calc = (v: any) => v != null && v !== '' && v !== false;

    if (isArrayParam(params)) {
      if (!params[0].value) { return 0; }
      return params[0].value.filter(calc).length;
    }

    return params.filter(param => calc(param.value)).length;
  }
}

export class Countall extends ArrayFunc {
  static override validateParams(_params: AstNode[]) {
    //
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static override func(params: IFormulaParam<any>[]): number {
    if (isArrayParam(params)) {
      if (params[0].value == null) { return 0; }
      return params[0].value.length;
    }

    return params.length;
  }
}

export class CountIf extends ArrayFunc {
  static override validateParams(params: AstNode[]) {
    if (params.length < 2) {
      throw new Error(t(Strings.function_validate_params_count_at_least, {
        name: 'COUNTIF',
        count: 2,
      }));
    }
  }

  static override getReturnType(params: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Number;
  }

  static override func(params: IFormulaParam<any>[]): number {
    const [{ node: rangeNode, value: range }, { node: conditionNode, value: condition }] = params as [IFormulaParam<any>, IFormulaParam<any>];
    const symbol = params[2]?.value || '=';
    const reg = /^(=)|(!=|！=)|(>)|(<)$/g;
    const finalSymbol = symbol.replace(reg, (_m: string, $1?: string, $2?: string, $3?: string, $4?: string) => {
      return ($1 && SymbolType.Equal) ||
        ($2 && SymbolType.NotEqual) ||
        ($3 && SymbolType.Greater) ||
        ($4 && SymbolType.Less) ||
        SymbolType.Equal;
    });

    if (range == null) return 0;
    if (rangeNode.valueType === BasicValueType.Array) {
      // @ts-ignore
      declare let range: any[];
      const filterTypes = [BasicValueType.String, BasicValueType.Number]; // special convertible type
      switch (finalSymbol) {
        case SymbolType.Equal: {
          if (filterTypes.includes(rangeNode.innerValueType!) && filterTypes.includes(conditionNode.valueType!)) {
            return range.filter(v => v == condition).length;
          }
          if (rangeNode.innerValueType !== conditionNode.valueType) {
            return 0;
          }
          if (rangeNode.innerValueType === BasicValueType.DateTime && conditionNode.valueType === BasicValueType.DateTime) {
            return range.filter(v => dayjs(v).valueOf() === dayjs(condition).valueOf()).length;
          }
          return range.filter(v => v === condition).length;
        }
        case SymbolType.NotEqual: {
          if (filterTypes.includes(rangeNode.innerValueType!) && filterTypes.includes(conditionNode.valueType!)) {
            return range.filter(v => v != condition).length;
          }
          if (rangeNode.innerValueType !== conditionNode.valueType) {
            return range.length;
          }
          if (rangeNode.innerValueType === BasicValueType.DateTime && conditionNode.valueType === BasicValueType.DateTime) {
            return range.filter(v => dayjs(v).valueOf() !== dayjs(condition).valueOf()).length;
          }
          return range.filter(v => v !== condition).length;
        }
        case SymbolType.Greater: {
          if (filterTypes.includes(rangeNode.innerValueType!) && filterTypes.includes(conditionNode.valueType!)) {
            return range.filter(v => v > condition).length;
          }
          if (rangeNode.innerValueType !== conditionNode.valueType) {
            return 0;
          }
          if (rangeNode.innerValueType === BasicValueType.DateTime && conditionNode.valueType === BasicValueType.DateTime) {
            return range.filter(v => dayjs(v).valueOf() > dayjs(condition).valueOf()).length;
          }
          return range.filter(v => v > condition).length;
        }
        case SymbolType.Less: {
          if (filterTypes.includes(rangeNode.innerValueType!) && filterTypes.includes(conditionNode.valueType!)) {
            return range.filter(v => v < condition).length;
          }
          if (rangeNode.innerValueType !== conditionNode.valueType) {
            return 0;
          }
          if (rangeNode.innerValueType === BasicValueType.DateTime && conditionNode.valueType === BasicValueType.DateTime) {
            return range.filter(v => dayjs(v).valueOf() < dayjs(condition).valueOf()).length;
          }
          return range.filter(v => v < condition).length;
        }
      }
    } else if (rangeNode.valueType === BasicValueType.String) {
      switch (finalSymbol) {
        case SymbolType.Equal: {
          const filterTypes = [BasicValueType.String, BasicValueType.Number]; // special convertible type
          if (filterTypes.includes(conditionNode.valueType)) {
            return (range as string).split(condition).length - 1;
          }
          return 0;
        }
        case SymbolType.NotEqual:
          return 1;
        default:
          return 0;
      }
    }
    return 0;
  }
}
