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

import { ILexer } from '../lexer/lexer';
import { Token, TokenType } from '../lexer/token';
import { AstNode, BinaryOperatorNode, UnaryOperatorNode, ValueOperandNode } from './ast';

export class BooleanExprParser {
  readonly lexer: ILexer;

  private currentToken: Token | null;

  constructor(lexer: ILexer) {
    this.lexer = lexer;
    this.currentToken = this.lexer.getNextToken();
  }

  parse(): AstNode {
    return this.expr();
  }

  private createError(): void {
    throw new Error('Invalid parser syntax');
  }

  private next(type: TokenType): void {
    if (this.currentToken == null) {
      return;
    }
    if (this.currentToken.type === type) {
      this.currentToken = this.lexer.getNextToken();
    } else {
      this.createError();
    }
  }

  private factor(): AstNode {
    // factor : VALUE | LEFT_PAREN expr RIGHT_PAREN | NOT expr

    const token: Token = this.currentToken!;

    switch (token.type) {
      case TokenType.Value: {
        this.next(TokenType.Value);
        return new ValueOperandNode(token);
      }

      case TokenType.LeftParen: {
        this.next(TokenType.LeftParen);
        const node: AstNode = this.expr();
        this.next(TokenType.RightParen);
        return node;
      }

      case TokenType.Not: {
        this.next(TokenType.Not);
        const node: AstNode = this.factor();
        return new UnaryOperatorNode(node, token);
      }

      default:
        throw new Error(`Factor cannot determine what to do with: ${token}`);
    }
  }

  private expr(): AstNode {
    // expr   : factor ((&& | ||) factor)*
    // factor : VALUE | LEFT_PAREN expr RIGHT_PAREN | NOT expr

    let node: AstNode = this.factor();

    while (this.currentToken && (this.currentToken.type === TokenType.And || this.currentToken.type === TokenType.Or)) {
      const token: Token = this.currentToken;

      if (token.type === TokenType.And) {
        this.next(TokenType.And);
      } else if (token.type === TokenType.Or) {
        this.next(TokenType.Or);
      }

      node = new BinaryOperatorNode(node, token, this.factor());
    }

    return node;
  }
}
