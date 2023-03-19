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

import { Token, TokenType } from './token';
import { t, Strings } from 'exports/i18n';
import { isNumber } from 'lodash';
export const EXPR_GRAMMAR: { key: TokenType; exp: RegExp }[] = [
  // The value in the record obtained by the field name constant
  { key: TokenType.Value, exp: /(\{\})|(\{(\\[{}])*[\s\S]*?[^\\]\})/ },
  // string literal
  { key: TokenType.String, exp: /(["”“](([^\\"“”])*?\\["”“])*.*?["”“])|(['‘’](([^\\'‘’])*?\\['‘’])*.*?['‘’])/ },
  // function name or field name constant
  { key: TokenType.Call, exp: /[^0-9.+\-|=*/><()（）!&%'"“”‘’^`~,，\s][^+\-|=*/><()（）!&%'"“”‘’^`~,，\s]*/ },
  // number literal
  { key: TokenType.Number, exp: /[0-9.]+/ },
  // not equal to
  { key: TokenType.NotEqual, exp: /!=/ },
  // and
  { key: TokenType.And, exp: /&&/ },
  // greater or equal to
  { key: TokenType.GreaterEqual, exp: />=/ },
  // less than or equal to
  { key: TokenType.LessEqual, exp: /<=/ },
  // or
  { key: TokenType.Or, exp: /\|\|/ },
  // comma, parameter separator
  { key: TokenType.Comma, exp: /[,，]/ },
  // Not
  { key: TokenType.Not, exp: /!/ },
  // add +
  { key: TokenType.Add, exp: /\+/ },
  // reduce -
  { key: TokenType.Minus, exp: /-/ },
  // take *
  { key: TokenType.Times, exp: /\*/ },
  // remove /
  { key: TokenType.Div, exp: /\// },
  // take remainder %
  { key: TokenType.Mod, exp: /%/ },
  // string concatenation
  { key: TokenType.Concat, exp: /&/ },
  // more than the
  { key: TokenType.Greater, exp: />/ },
  // less than
  { key: TokenType.Less, exp: /</ },
  // equal to
  { key: TokenType.Equal, exp: /=/ },
  // Left parenthesis
  { key: TokenType.LeftParen, exp: /[(（]/ },
  // closing parenthesis
  { key: TokenType.RightParen, exp: /[)）]/ },
  // whitespace characters
  { key: TokenType.Blank, exp: /\s+/ },
  // all other
  { key: TokenType.Unknown, exp: /.+/ },
];
// {} - {midterm test scores}
export interface ILexer {
  expression: string;
  currentTokenIndex: number;

  getNextToken(): Token | null;
  getPrevToken(): Token | null;
  reset(): void;
}
// The lexical analyzer of the formula, according to the incoming expression, exper -> token
export class FormulaExprLexer implements ILexer {
  readonly expression: string;

  readonly fullMatches: Token[];
  readonly matches: Token[];
  readonly errors: Error[] = []; // The lexer does not throw errors directly, but temporarily stores the errors for the caller to handle
  public currentIndex: number;

  constructor(expression: string) {
    this.expression = expression;

    this.fullMatches = this.getFullMatches();
    this.matches = this.filterUselessToken(this.fullMatches);
    this.currentIndex = -1;
  }

  get currentTokenIndex() {
    return this.currentIndex;
  }

  set currentTokenIndex(index: number) {
    if (!isNumber(index)) return;
    this.currentIndex = index;
  }

  getNextToken(): Token | null {
    this.currentIndex++;

    if (this.currentIndex > this.matches.length - 1) {
      return null;
    }

    const token = this.matches[this.currentIndex]!;
    return token;
  }

  getPrevToken(): Token | null {
    this.currentIndex--;

    if (this.currentIndex < 0) {
      return null;
    }

    const token = this.matches[this.currentIndex]!;
    return token;
  }

  reset(): void {
    this.currentIndex = -1;
  }

  private getFullMatches(): Token[] {
    const matched: string[] = this.expression.match(this.pattern()) || [];
    let index = 0;
    return matched.map((str, i) => {
      const token = this.tokenizer(index, str, matched[i + 1]);
      index += token.value.length;
      return token;
    });
  }

  private filterUselessToken(tokens: Token[]) {
    return tokens.filter(token => {
      if (token.type === TokenType.Unknown) {
        this.errors.push(
          new Error(
            t(Strings.function_err_unrecognized_operator, {
              token: token.value,
            }),
          ),
        );
      }
      return token.type !== TokenType.Blank && token.type !== TokenType.Unknown;
    });
  }

  private tokenizer(index: number, str: string, nextStr?: string): Token {
    for (let i = 0; i < EXPR_GRAMMAR.length; i++) {
      const key = EXPR_GRAMMAR[i]!.key;
      const regex = EXPR_GRAMMAR[i]!.exp;
      const type = key;

      if (regex.test(str)) {
        // When the tokenType matches Call, it is necessary to judge whether there is a left bracket, if not,
        // it means a pureValue without curly brackets
        if (type === TokenType.Call) {
          if (!nextStr || this.tokenizer(index, nextStr).type !== TokenType.LeftParen) {
            return new Token(TokenType.PureValue, index, str);
          }
        }
        return new Token(type, index, str);
      }
    }

    throw new Error(`Unexpected token: ${str}`);
  }

  private pattern(): RegExp {
    const pattern: string = EXPR_GRAMMAR.map(g => `(${g.exp.source})`).join('|');

    return new RegExp(pattern, 'g');
  }
}
