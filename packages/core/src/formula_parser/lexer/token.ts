export enum TokenType {
  Call = 'Call',
  PureValue = 'PureValue',
  Value = 'Value',
  And = 'And',
  Comma = 'Comma',
  Number = 'Number',
  String = 'String',
  Less = 'Less',
  LessEqual = 'LessEqual',
  Greater = 'Greater',
  GreaterEqual = 'GreaterEqual',
  Equal = 'Equal',
  NotEqual = 'NotEqual',
  Add = 'Add',
  Minus = 'Minus',
  Times = 'Times',
  Mod = 'Mod',
  Div = 'Div',
  Concat = 'Concat',
  Or = 'Or',
  Not = 'Not',
  LeftParen = 'LeftParen',
  RightParen = 'RightParen',
  Blank = 'Blank',
  Unknown = 'Unknown',
}

export class Token {
  constructor(readonly type: TokenType, readonly index: number, readonly value: string) {
    // String 和 Value 要去掉引号和大括号包裹
    this.value = value;
  }

  toString() {
    return `${this.type}::${this.value}`;
  }
}
