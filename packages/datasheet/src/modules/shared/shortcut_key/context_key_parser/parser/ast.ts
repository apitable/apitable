import { Token } from '../lexer/token';

export enum AstNodeType {
  BinaryOperatorNode = 'BinaryOperatorNode',
  UnaryOperatorNode = 'UnaryOperatorNode',
  ValueOperandNode = 'ValueOperandNode',
}

export class AstNode {
  readonly token: Token;
  readonly name: string;

  constructor(token: Token) {
    this.token = token;
    this.name = '';
  }

  toString() {
    return `AstNode: ${this.token}::${this.name}`;
  }
}

export class BinaryOperatorNode extends AstNode {
  readonly left: AstNode;
  readonly right: AstNode;
  readonly name = AstNodeType.BinaryOperatorNode;

  constructor(left: AstNode, token: Token, right: AstNode) {
    super(token);

    this.left = left;
    this.right = right;
  }
}

export class UnaryOperatorNode extends AstNode {
  readonly child: AstNode;
  readonly name = AstNodeType.UnaryOperatorNode;

  constructor(child: AstNode, token: Token) {
    super(token);
    this.child = child;
  }
}

export class ValueOperandNode extends AstNode {
  readonly value: string;
  readonly name = AstNodeType.ValueOperandNode;

  constructor(token: Token) {
    super(token);
    this.value = token.value;
  }
}
