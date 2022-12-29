export enum TokenType {
  Value = 'Value',
  And = 'And',
  Or = 'Or',
  Not = 'Not',
  LeftParen = 'Left_Paren',
  RightParen = 'Right_Paren',
}

export class Token {
  readonly type: TokenType;
  readonly value: string;

  constructor(type: TokenType, value: string) {
    this.type = type;
    this.value = value;
  }

  toString() {
    return `${this.type}::${this.value}`;
  }
}
