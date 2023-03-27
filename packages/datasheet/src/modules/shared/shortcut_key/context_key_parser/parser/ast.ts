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
  override readonly name = AstNodeType.BinaryOperatorNode;

  constructor(left: AstNode, token: Token, right: AstNode) {
    super(token);

    this.left = left;
    this.right = right;
  }
}

export class UnaryOperatorNode extends AstNode {
  readonly child: AstNode;
  override readonly name = AstNodeType.UnaryOperatorNode;

  constructor(child: AstNode, token: Token) {
    super(token);
    this.child = child;
  }
}

export class ValueOperandNode extends AstNode {
  readonly value: string;
  override readonly name = AstNodeType.ValueOperandNode;

  constructor(token: Token) {
    super(token);
    this.value = token.value;
  }
}
