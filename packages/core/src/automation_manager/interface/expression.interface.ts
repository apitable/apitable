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

// basic support operators
export enum OperatorEnums {
  // logic
  And = 'and',
  Or = 'or',
  // compare
  Equal = 'equal',
  NotEqual = 'notEqual',
  Includes = 'includes',
  NotIncludes = 'notIncludes',
  IsNull = 'isNull',
  IsNotNull = 'isNotNull',
  LessThan = 'lessThan',
  LessThanOrEqual = 'lessThanOrEqual',
  GreaterThan = 'greaterThan',
  GreaterThanOrEqual = 'greaterThanOrEqual',
  Contains = 'contains',

  // built-in functions
  GetNodeOutput = 'getNodeOutput',
  GetObjectProperty = 'getObjectProperty',
  GetArrayObjectProperty = 'getArrayObjectProperty',
  JSONStringify = 'JSONStringify',
  Flatten = 'flatten',
  Length = 'length',
  NewObject = 'newObject',
}

// operand type, can be literal or expression
export enum OperandTypeEnums {
  Literal = 'Literal', // which means the operand is a literal value, just like a 'string' in your code
  Expression = 'Expression', // which means the operand is a expression, just like a 'variable' in your code
}

export interface IExpressionOperand {
  type: OperandTypeEnums.Expression,
  value: IExpression,
}

export interface ILiteralOperand {
  type: OperandTypeEnums.Literal,
  value: any,
}

export type IOperand = IExpressionOperand | ILiteralOperand;

// just like an AST/S-Expression
// eg:  and(=(fieldId1,1),isNull(filedId2))
export interface IExpression {
  operator: OperatorEnums, // like function name
  operands: IOperand[] // like function parameters
}
