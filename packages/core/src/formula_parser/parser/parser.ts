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

import type { ILexer } from '../lexer/lexer';
import { Token, TokenType } from '../lexer/token';
import {
  AstNode,
  BinaryOperatorNode,
  UnaryOperatorNode,
  ValueOperandNode,
  CallOperandNode,
  NumberOperandNode,
  StringOperandNode,
  PureValueOperandNode,
} from './ast';
import type { IFieldMap, IReduxState } from 'exports/store/interfaces';
import { Functions } from 'formula_parser/functions';
import type { IField } from 'types';
import { t, Strings } from 'exports/i18n';
import { SelfRefError } from 'formula_parser/errors/self_ref.error';

/**
  * operator precedence
  * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
  * In the array below, the priority is sorted from high to low. The same line has the same priority.
  */
const PriorityMap = new Map<TokenType, number>();
[
  [TokenType.Times, TokenType.Div, TokenType.Mod],
  [TokenType.Add, TokenType.Minus],
  [TokenType.Greater, TokenType.GreaterEqual, TokenType.Less, TokenType.LessEqual],
  [TokenType.Equal, TokenType.NotEqual],
  [TokenType.And],
  [TokenType.Or],
  [TokenType.Concat],
].forEach((arr, index) => arr.forEach(type => PriorityMap.set(type, index)));

export class FormulaExprParser {
  private currentToken: Token | null;

  constructor(public lexer: ILexer, public context: { state: IReduxState, field: IField, fieldMap: IFieldMap }) {
    this.currentToken = this.lexer.getNextToken();
  }

  parse(): AstNode {
    const node = this.expr();
    if (this.currentToken != null) {
      console.error(this.currentToken);
      throw new Error(t(Strings.function_err_unrecognized_char, {
        value: this.currentToken.value,
      }));
    }
    return node;
  }

  private next(type: TokenType): Token | null {
    if (this.currentToken == null) {
      return null;
    }
    if (this.currentToken.type === type) {
      this.currentToken = this.lexer.getNextToken();
    } else {
      switch (type) {
        case TokenType.LeftParen:
          throw new SyntaxError(t(Strings.function_err_no_left_bracket));
        case TokenType.RightParen:
          throw new SyntaxError(t(Strings.function_err_end_of_right_bracket));
      }
      throw new SyntaxError(t(Strings.function_err_unable_parse_char, {
        value: this.currentToken.value,
      }));
    }
    return this.currentToken;
  }

  private factor(): AstNode {
    // factor : VALUE | LEFT_PAREN expr RIGHT_PAREN | NOT expr

    const token = this.currentToken;

    if (!token) {
      throw new Error(t(Strings.function_err_wrong_function_suffix));
    }

    switch (token.type) {
      // field variable: {value}
      case TokenType.Value: {
        this.next(TokenType.Value);
        const tokenValue = token.value.slice(1, -1);
        if (tokenValue === this.context.field.id) {
          throw new SelfRefError();
        }
        return new ValueOperandNode(token, this.context);
      }

      // field variable: value (without curly braces)
      case TokenType.PureValue: {
        this.next(TokenType.PureValue);
        const tokenValue = token.value;
        if (tokenValue === this.context.field.id) {
          throw new SelfRefError();
        }
        return new PureValueOperandNode(token, this.context, this.context.field);
      }

      // Preset functions: Sum/Average ...
      case TokenType.Call: {
        this.next(TokenType.Call);
        const node = new CallOperandNode(token);
        const FuncClass = Functions.get(node.value.toUpperCase());
        if (!FuncClass) {
          throw new TypeError(t(Strings.function_err_not_definition, {
            name: node.value,
          }));
        }

        this.next(TokenType.LeftParen);

        if (!this.currentToken) {
          throw new Error(t(Strings.function_err_end_of_right_bracket));
        }

        while (this.currentToken.type !== TokenType.RightParen) {
          node.params.push(this.expr());
          if (!this.currentToken) {
            throw new Error(t(Strings.function_err_end_of_right_bracket));
          }
          // Exclude multiple parameters without commas
          if (this.currentToken.type !== TokenType.Comma) {
            break;
          }
        }

        const valueType = FuncClass.func.getReturnType(node.params);
        node.valueType = valueType;

        this.next(TokenType.RightParen);
        return node;
      }

      // number: 123.333
      case TokenType.Number: {
        this.next(TokenType.Number);
        return new NumberOperandNode(token);
      }

      // string: 'xyz'
      case TokenType.String: {
        this.next(TokenType.String);
        return new StringOperandNode(token);
      }

      // Left parenthesis: '('
      case TokenType.LeftParen: {
        this.next(TokenType.LeftParen);
        const node: AstNode = this.expr();
        this.next(TokenType.RightParen);
        return node;
      }

      // Negate sign (unary arithmetic sign): '!'
      case TokenType.Not: {
        this.next(TokenType.Not);
        const node: AstNode = this.factor();
        return new UnaryOperatorNode(node, token);
      }

      // + sign (unary arithmetic sign): '+'
      case TokenType.Add: {
        this.next(TokenType.Add);
        const node: AstNode = this.factor();
        return new UnaryOperatorNode(node, token);
      }

      // -sign (unary arithmetic sign): '-'
      case TokenType.Minus: {
        this.next(TokenType.Minus);
        const node: AstNode = this.factor();
        return new UnaryOperatorNode(node, token);
      }

      case TokenType.Comma: {
        this.next(TokenType.Comma);
        const node: AstNode = this.expr();
        return node;
      }

      case TokenType.Blank: {
        this.next(TokenType.Blank);
        return this.factor();
      }

      default:
        throw new Error(t(Strings.function_err_unknown_operator, {
          type: token.value,
        }));
    }
  }

  private expr(inner?: boolean): AstNode {
    // expr   : factor ((&& | ||) factor)*
    // factor : Number | String | Call | VALUE | LEFT_PAREN expr RIGHT_PAREN | NOT expr

    let node: AstNode = this.factor();

    while (this.currentToken &&
      [
        TokenType.And, TokenType.Or, TokenType.Add, TokenType.Times, TokenType.Div, TokenType.Minus,
        TokenType.Mod, TokenType.Concat, TokenType.Equal, TokenType.NotEqual, TokenType.Greater, TokenType.GreaterEqual,
        TokenType.Less, TokenType.LessEqual,
      ].includes(this.currentToken.type)
    ) {
      const token: Token = this.currentToken;
      this.next(token.type);
      if (!this.currentToken) {
        throw new Error(t(Strings.function_err_wrong_function_suffix));
      }
      let right: AstNode | undefined;
      let nextToken: Token | null = null;
      const currentToken = this.currentToken;
      const currentTokenIndex = this.lexer.currentTokenIndex;
      /**
        * Take a step forward, get the token and go back
        *
        * 1. If you encounter a function or left parenthesis, go forward to test the entire function or parenthesis content,
        * get the following operator and then fall back
        *
        * 2. If it is not a function, just try a token forward, get the operator and then fall back
        */
      if ([TokenType.Call, TokenType.LeftParen].includes(currentToken.type)) {
        this.factor();
        nextToken = this.currentToken;
        this.currentToken = currentToken;
        this.lexer.currentTokenIndex = currentTokenIndex;
      } else {
        nextToken = this.lexer.getNextToken();
        this.lexer.getPrevToken();
      }

      const currentOpIndex = PriorityMap.get(token.type);
      if (nextToken) {
        const nextOpIndex = PriorityMap.get(nextToken.type);

        if (currentOpIndex != null && nextOpIndex != null && nextOpIndex < currentOpIndex) {
          right = this.expr(true);
        }
        // When operators with different priorities are encountered in the loop, the recursion must be exited;
        if (inner && currentOpIndex != null && nextOpIndex != null && nextOpIndex > currentOpIndex) {
          return new BinaryOperatorNode(node, token, right || this.factor());
        }
      }
      node = new BinaryOperatorNode(node, token, right || this.factor());
    }
    // 1 + (1 + 3) * 2
    return node;
  }
}
