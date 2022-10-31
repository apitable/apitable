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
