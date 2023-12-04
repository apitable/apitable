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

import { BasicValueType, FormulaFuncType, IField } from 'types';
import type { AstNode } from 'formula_parser/parser/ast';
import type { IRecord, IReduxState } from 'exports/store/interfaces';

export interface IFormulaParam<T = any> {
  node: AstNode;
  value: T;
}
// The context provided for each cell value,
// corresponding to the {field} type in the formula, including the field and record where the cell is located
export interface ICellContext {
  field: IField;
  record: IRecord;
}

// formula additional context, including all fieldMap and a record;
export interface IFormulaContext {
  state: IReduxState;
  field: IField; // Note that the field of the current equation field, the field of the non-referenced field
  record: IRecord;
}

// formula additional context for formula calculation (ignoring sparse fieldMap)
export interface IFormulaEvaluateContext {
  state: IReduxState;
  field: IField;
  record: IRecord;
}

// Equation error base class, error reporting mechanism for unified equations
export class FormulaBaseError extends Error {
  constructor(message: string) {
    super();
    this.message = message ? '#Error: ' + message : '#Error!';
  }
}
export const getBlankValueByType = function (type: string, value: any) {
  if (value == null) {
    return null;
  }
  switch (type) {
    // https://github.com/vikadata/vikadata/issues/6359
    // case BasicValueType.Number: {
    //   return 0;
    // }
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
    * The value type that the function parameter can accept.
    * If the parameter type is not in acceptValueType, it will be uniformly converted to string type by the interpreter.
    * If the parameter type is in acceptValueType, the original value will be returned, which will be handled by the function implementation.
    */
  static acceptValueType = new Set([BasicValueType.Boolean, BasicValueType.Number, BasicValueType.String]);

  /**
  * The function needs to check the parameter type and number in the stage of parsing the AST tree.
  * If it does not meet the needs of the function, directly throw new Error and bring a friendly prompt
  * Error throwing principle:
  * 1. If there are fewer required parameters, an error will be thrown, and if there are too many parameters, it will be ignored
  * 2. If the parameter type cannot be converted and ignored, throw an error
  * 3. The function name needs to be explicitly given in the error message
  * 4. The numbers in the error message need to use Arabic numerals such as: "3" instead of "three"
  */
  static validateParams(_params: AstNode[]) {
    //
  }
  /**
    * @param params The parameter is optional.
    * When the parameter is not passed, the static default type is returned.
    * When passing parameters, different functions dynamically calculate the return type based on the parameter types.
    * Function return type, inferred directly from AstNode, no need to get the actual value
    */
  static getReturnType(params?: AstNode[]): BasicValueType {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  // function body implementation
  static func(_params: IFormulaParam[], _context?: IFormulaContext): any { return null; }
}

export const isArrayTypeParam = (params: IFormulaParam[]) => {
  return params.length === 1 && Array.isArray(params[0]!.value);
};
