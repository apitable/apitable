import { BasicValueType, FormulaFuncType, IField } from 'types';
import { AstNode } from 'formula_parser/parser/ast';
import { IRecord, IReduxState } from 'store';

export interface IFormulaParam<T = any> {
  node: AstNode;
  value: T;
}

// 给每个单元格值提供的上下文，对应公式中的 {字段} 类型，包含单元格所在的 field 和 record
export interface ICellContext {
  field: IField;
  record: IRecord;
}

// 公式附加上下文，包含全部的 fieldMap 和一条 record；
export interface IFormulaContext {
  state: IReduxState;
  field: IField; // 注意，这个当前方程式字段的 field，非引用字段的 field
  record: IRecord;
}

// 公式附加上下文，供公式计算使用（忽略稀疏的 fieldMap）
export interface IFormulaEvaluateContext {
  state: IReduxState;
  field: IField;
  record: IRecord;
}

// 方程式错误基类，统一方程式的报错机制
export class FormulaBaseError extends Error {
  constructor(public message: string) {
    super();
    this.message = message ? '#Error: ' + message : '#Error!';
  }
}

export const getBlankValueByType = function(type: string, value: any) {
  if (value == null) {
    return null;
  }
  switch (type) {
    case BasicValueType.Number: {
      return 0;
    }
    case BasicValueType.String: {
      return '';
    }
    case BasicValueType.Boolean: {
      return false;
    }
    default: {
      return null;
    }
  }
};

export abstract class FormulaFunc {
  static readonly type: FormulaFuncType;

  /**
   * 函数参数能够接受的值类型。
   * 如果参数类型不在 acceptValueType 中，则会由解释器 interpreter 统一转换成 string 类型。
   * 如果参数类型在 acceptValueType 则会返回原始值，交由函数实现自行处理。
   */
  static acceptValueType = new Set([BasicValueType.Boolean, BasicValueType.Number, BasicValueType.String]);

  /**
   * 函数需要在解析 AST 树的阶段进行参数类型和数量校验。如果不满足函数需要，直接 throw new Error 并带上友好的提示
   * 抛错原则：
   * 1. 必填参数少了抛错，参数多了忽略
   * 2. 参数类型遇到无法转换和忽略的，抛错
   * 3. 错误信息里面需要明确给出函数名
   * 4. 错误信息里的数字需要使用阿拉伯数字比如："3 个" 而不是 "三个"
   */
  static validateParams(params: AstNode[]) {
    //
  }

  /**
   * @param params 参数为可选，当参数不传时，返回静态的默认类型。当传参时，不同函数根据参数类型动态计算返回类型。
   * 函数返回类型，从 AstNode 直接推断，不需要获取实际值
   */
  static getReturnType(params?: AstNode[]): BasicValueType {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  // 函数体实现
  static func(params: IFormulaParam[], context?: IFormulaContext): any { return null; }
}

export const isArrayTypeParam = (params: IFormulaParam[]) => {
  return params.length === 1 && Array.isArray(params[0].value);
};
