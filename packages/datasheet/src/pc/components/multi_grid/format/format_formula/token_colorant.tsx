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

import { memo } from 'react';
import * as React from 'react';
import { TokenType, assertNever, FormulaExprLexer } from '@apitable/core';

interface IExpressionColorant {
  expression: string;
}

export const ExpressionColorantBase: React.FC<React.PropsWithChildren<IExpressionColorant>> = (props) => {
  const { expression } = props;
  const tokens = new FormulaExprLexer(expression).fullMatches;
  const elements = tokens.map((token, index) => {
    switch (token.type) {
      case TokenType.Add:
      case TokenType.And:
      case TokenType.Comma:
      case TokenType.Concat:
      case TokenType.Div:
      case TokenType.Equal:
      case TokenType.NotEqual:
      case TokenType.Greater:
      case TokenType.GreaterEqual:
      case TokenType.Less:
      case TokenType.LessEqual:
      case TokenType.Minus:
      case TokenType.Mod:
      case TokenType.Not:
      case TokenType.Or:
      case TokenType.Times: {
        return (
          <span key={index} className="token t_operator">
            {token.value}
          </span>
        );
      }

      case TokenType.Value:
      case TokenType.PureValue: {
        return (
          <span key={index} className="token t_value">
            {token.value}
          </span>
        );
      }

      case TokenType.String: {
        return (
          <span key={index} className="token t_string">
            {token.value}
          </span>
        );
      }
      case TokenType.Number: {
        return (
          <span key={index} className="token t_number">
            {token.value}
          </span>
        );
      }
      case TokenType.LeftParen:
      case TokenType.RightParen: {
        return (
          <span key={index} className="token t_paren">
            {token.value}
          </span>
        );
      }
      case TokenType.Call: {
        return (
          <span key={index} className="token t_call">
            {token.value}
          </span>
        );
      }
      case TokenType.Blank: {
        return token.value;
      }
      case TokenType.Unknown: {
        return (
          <span key={index} className="token t_unknown">
            {token.value}
          </span>
        );
      }
      default: {
        assertNever(token.type);
        return (
          <span key={index} className="token t_unknown">
            {token.value}
          </span>
        );
      }
    }
  });

  return <>{elements}</>;
};

export const ExpressionColorant = memo(ExpressionColorantBase);
