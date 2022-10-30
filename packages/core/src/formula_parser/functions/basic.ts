import { BasicValueType, FormulaFuncType, IField } from 'types';
import { AstNode } from 'formula_parser/parser/ast';
import { IRecord, IReduxState } from 'store';

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
 static validateParams(params: AstNode[]) {
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
 static func(params: IFormulaParam[], context?: IFormulaContext): any { return null; }
}

export const isArrayTypeParam = (params: IFormulaParam[]) => {
  return params.length === 1 && Array.isArray(params[0].value);
};
