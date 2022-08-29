// 支持的操作符枚举
export enum OperatorEnums {
  // 逻辑
  And = 'and',
  Or = 'or',
  // 运算
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

  // 通用
  GetNodeOutput = 'getNodeOutput',
  GetObjectProperty = 'getObjectProperty',
  GetArrayObjectProperty = 'getArrayObjectProperty',
  JSONStringify = 'JSONStringify',
  Flatten = 'flatten',
  Length = 'length',
  NewObject = 'newObject',
}

// 操作数的类型，可以是字面量，也可以是表达式
export enum OperandTypeEnums {
  Literal = 'Literal', // 字面量
  Expression = 'Expression', // 表达式
}

// 表达式操作数的值是表达式
export interface IExpressionOperand {
  type: OperandTypeEnums.Expression,
  value: IExpression,
}

// 字面量操作数的值是字面量。。。
export interface ILiteralOperand {
  type: OperandTypeEnums.Literal,
  value: any,
}

// 操作数类型
export type IOperand = IExpressionOperand | ILiteralOperand;

// 筛选表达式，由一个操作符和若干个操作数组成。类似于 AST 树的结构。
// and(=(fieldId1,1),isNull(filedId2))
export interface IExpression {
  operator: OperatorEnums, // 操作符 == 函数
  operands: IOperand[] // 操作数 == 参数
}
