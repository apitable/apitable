import { FormulaFunc, IFormulaParam, FormulaBaseError } from './basic';
import { BasicValueType, FormulaFuncType } from 'types';
import { AstNode } from 'formula_parser/parser/ast';
import dayjs from 'dayjs';
import { Strings, t } from 'i18n';
import { handleLookupNullValue } from 'formula_parser/helper';
class LogicalFunc extends FormulaFunc {
  static readonly type = FormulaFuncType.Logical;
}

function isArrayParam(params: IFormulaParam<any>[]): params is [IFormulaParam<any[] | null>] {
  if (params.length !== 1) {
    return false;
  }
  if (params[0].node.valueType === BasicValueType.Array) {
    return true;
  }
  return false;
}

export class If extends LogicalFunc {
  static acceptValueType = new Set([BasicValueType.Array, BasicValueType.DateTime, ...FormulaFunc.acceptValueType]);

  static validateParams(params: AstNode[]) {
    if (params.length < 3) {
      throw new Error(t(Strings.function_validate_params_count, {
        name: 'IF',
        count: 3,
      }));
    }
  }

  static getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);

    if (!params) {
      return BasicValueType.String;
    }

    const [, value1Node, value2Node] = params;
    if ([value1Node.valueType, value2Node.valueType].some(v => v === BasicValueType.Array)) {
      return BasicValueType.String;
    }
    // 两个 value 中有一个为 BLANK，则结果类型由另一个的类型决定
    if (value1Node.token.value.toUpperCase() === 'BLANK') {
      return value2Node.valueType;
    }
    if (value2Node.token.value.toUpperCase() === 'BLANK') {
      return value1Node.valueType;
    }
    // 两个 value 参数都为 Number/Boolean/DateTime/String 的时候，才推断为相应类型返回值
    if (value1Node.valueType === value2Node.valueType) {
      return value1Node.valueType;
    }
    return BasicValueType.String;
  }

  static func(params: [IFormulaParam<boolean>, IFormulaParam<any>, IFormulaParam<any>]): string | number {
    const [logical, value1Param, value2Param] = params;
    return logical.value ? value1Param.value : value2Param.value;
  }
}

export class Blank extends LogicalFunc {
  static validateParams(params: AstNode[]) {
    //
  }

  static getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static func(): null {
    return null;
  }
}

export class True extends LogicalFunc {
  static validateParams(params: AstNode[]) {
    //
  }

  static getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Boolean;
  }

  static func(): boolean {
    return true;
  }
}

export class False extends LogicalFunc {
  static validateParams(params: AstNode[]) {
    //
  }

  static getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Boolean;
  }

  static func(): boolean {
    return false;
  }
}

export class Or extends LogicalFunc {
  static acceptValueType = new Set([BasicValueType.Array, ...FormulaFunc.acceptValueType]);

  static validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new Error(t(Strings.function_validate_params_count_at_least, {
        name: 'OR',
        count: 1,
      }));
    }
  }

  static getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Boolean;
  }

  static func(params: IFormulaParam<boolean>[]): boolean {
    params = handleLookupNullValue(params);
    if (isArrayParam(params)) {
      if (!params[0].value) { return false; }

      return params[0].value.some(v => Boolean(v));
    }
    return params.some(v => Boolean(v.value));
  }
}

export class And extends LogicalFunc {
  static acceptValueType = new Set([BasicValueType.Array, ...FormulaFunc.acceptValueType]);

  static validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new Error(t(Strings.function_validate_params_count_at_least, {
        name: 'AND',
        count: 1,
      }));
    }
  }

  static getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Boolean;
  }

  static func(params: IFormulaParam<boolean>[]): boolean {
    params = handleLookupNullValue(params);
    if (isArrayParam(params)) {
      if (!params[0].value) { return false; }

      return params[0].value.every(v => Boolean(v));
    }
    return params.every(v => Boolean(v.value));
  }
}

export class Xor extends LogicalFunc {
  static acceptValueType = new Set([BasicValueType.Array, ...FormulaFunc.acceptValueType]);

  static validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new Error(t(Strings.function_validate_params_count_at_least, {
        name: 'XOR',
        count: 1,
      }));
    }
  }

  static getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Boolean;
  }

  static func(params: IFormulaParam<boolean>[]): boolean {
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
  static validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new Error(t(Strings.function_validate_params_count, {
        name: 'NOT',
        count: 1,
      }));
    }
  }

  static getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Boolean;
  }

  static func(params: [IFormulaParam<boolean>]): boolean {
    params = handleLookupNullValue(params) as [IFormulaParam<boolean>];
    const logical1Param = params[0].value;
    return !logical1Param;
  }
}

export class Switch extends LogicalFunc {
  static acceptValueType = new Set([BasicValueType.DateTime, ...FormulaFunc.acceptValueType]);

  static validateParams(params: AstNode[]) {
    if (params.length < 2) {
      throw new Error(t(Strings.function_validate_params_count_at_least, {
        name: 'SWITCH',
        count: 2,
      }));
    }
  }

  static getReturnType(params: AstNode[]) {
    params && this.validateParams(params);

    if (!params) {
      return BasicValueType.String;
    }

    // 只有当所有匹配到的表达式的值返回类型都为 Number/Boolean/DateTime/String，才推断为对应类型的返回值
    const argsLength = params.length - 1;
    let resultType: BasicValueType | null = argsLength & 1 ? params[argsLength].valueType : null;
    for (let i = 2; i <= argsLength; i += 2) {
      const curParams = params[i];
      // 如果匹配的表达式中包含 BLANK，则由其它返回类型决定
      if (curParams.token.value.toUpperCase() === 'BLANK') continue;
      if (resultType != null && resultType !== curParams.valueType) {
        return BasicValueType.String;
      }
      resultType = curParams.valueType;
    }
    resultType = resultType || BasicValueType.String;
    return resultType === BasicValueType.Array ? BasicValueType.String : resultType;
  }

  static func(params: IFormulaParam[]): string | number | null {
    params = handleLookupNullValue(params);
    let targetValue = params[0].value;
    const argsLength = params.length - 1;
    const switchCount = Math.floor(argsLength / 2);
    const defaultValue: any = argsLength & 1 ? params[argsLength].value : null;
    const isDateTimeType = params[0].node.innerValueType === BasicValueType.DateTime; // 对 DateTime 类型做特殊处理
    const isEmptyArray = param => param.node.valueType === BasicValueType.Array && !param.value?.length; // 特殊处理 Array 类型字段对于 BLANK 的匹配

    if (isDateTimeType) {
      targetValue = dayjs(targetValue).valueOf();
    }
    if (isEmptyArray(params[0])) {
      targetValue = null;
    }
    if (switchCount > 0) {
      for (let i = 0; i < switchCount; i++) {
        const currentParam = params[i * 2 + 1];
        let currentValue = currentParam.value;

        if (isDateTimeType) {
          currentValue = dayjs(currentValue).valueOf();
        }
        if (isEmptyArray(currentParam)) {
          currentValue = null;
        }
        if (targetValue === currentValue) {
          return params[i * 2 + 2].value;
        }
      }
    }
    return defaultValue;
  }
}

// 所有方程式的 运行报错 或 手动触发，都会继承此类
export class FormulaError extends LogicalFunc {
  static validateParams(params: AstNode[]) {
    //
  }

  static getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static func(params: [IFormulaParam<string>]) {
    const errText = params[0]?.value;
    throw new FormulaBaseError(errText || '');
  }
}

export class IsError extends LogicalFunc {
  static validateParams(params: AstNode[]) {
    if (params.length < 1) {
      throw new Error(t(Strings.function_validate_params_count, {
        name: 'IS_ERROR',
        count: 1,
      }));
    }
  }

  static getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.Boolean;
  }

  static func(params: [IFormulaParam<any>]): boolean {
    const value = params[0].value;
    const isError = value instanceof FormulaBaseError || isNaN(value) || value === Infinity;
    return isError;
  }
}
