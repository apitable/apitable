import { memo } from 'react';
import * as React from 'react';
import { TokenType, assertNever, FormulaExprLexer } from '@apitable/core';

interface IExpressionColorant {
  expression: string;
}

export const ExpressionColorantBase: React.FC<IExpressionColorant> = props => {
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
        return <span key={index} className="token t_operator">{token.value}</span>;
      }

      case TokenType.Value:
      case TokenType.PureValue: {
        return <span key={index} className="token t_value">{token.value}</span>;
      }

      case TokenType.String: {
        return <span key={index} className="token t_string">{token.value}</span>;
      }
      case TokenType.Number: {
        return <span key={index} className="token t_number">{token.value}</span>;
      }
      case TokenType.LeftParen:
      case TokenType.RightParen: {
        return <span key={index} className="token t_paren">{token.value}</span>;
      }
      case TokenType.Call: {
        return <span key={index} className="token t_call">{token.value}</span>;
      }
      case TokenType.Blank: {
        return token.value;
      }
      case TokenType.Unknown: {
        return <span key={index} className="token t_unknown">{token.value}</span>;
      }
      default: {
        assertNever(token.type);
        return <span key={index} className="token t_unknown">{token.value}</span>;
      }
    }
  });

  return <>{elements}</>;
};

export const ExpressionColorant = memo(ExpressionColorantBase);
