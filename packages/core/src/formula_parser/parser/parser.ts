import { ILexer } from '../lexer/lexer';
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
import { IFieldMap, IReduxState } from 'store';
import { Functions } from 'formula_parser/functions';
import { IField } from 'types';
import { t, Strings } from 'i18n';

/**
 * 运算符优先级
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
 * 下方数组中，优先级从高到低排序。同一行的优先级相同。
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
      // 字段变量: {value}
      case TokenType.Value: {
        this.next(TokenType.Value);
        const tokenValue = token.value.slice(1, -1);
        if (tokenValue === this.context.field.id) {
          throw new Error(t(Strings.function_err_no_ref_self_column));
        }
        return new ValueOperandNode(token, this.context);
      }

      // 字段变量: value （不带大括号）
      case TokenType.PureValue: {
        this.next(TokenType.PureValue);
        const tokenValue = token.value;
        if (tokenValue === this.context.field.id) {
          throw new Error(t(Strings.function_err_no_ref_self_column));
        }
        return new PureValueOperandNode(token, this.context, this.context.field);
      }

      // 预置函数: Sum/Average ...
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
          // 排除多个参数间不加逗号的情况
          if (this.currentToken.type !== TokenType.Comma) {
            break;
          }
        }

        const valueType = FuncClass.func.getReturnType(node.params);
        node.valueType = valueType;

        this.next(TokenType.RightParen);
        return node;
      }

      // 数字: 123.333
      case TokenType.Number: {
        this.next(TokenType.Number);
        return new NumberOperandNode(token);
      }

      // 字符串: 'xyz'
      case TokenType.String: {
        this.next(TokenType.String);
        return new StringOperandNode(token);
      }

      // 左括号: '('
      case TokenType.LeftParen: {
        this.next(TokenType.LeftParen);
        const node: AstNode = this.expr();
        this.next(TokenType.RightParen);
        return node;
      }

      // 取反符号(一元计算符号): '!'
      case TokenType.Not: {
        this.next(TokenType.Not);
        const node: AstNode = this.factor();
        return new UnaryOperatorNode(node, token);
      }

      // +符号(一元计算符号): '+'
      case TokenType.Add: {
        this.next(TokenType.Add);
        const node: AstNode = this.factor();
        return new UnaryOperatorNode(node, token);
      }

      // -符号(一元计算符号): '-'
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
       * 往前试探一步，拿到 token 再回退
       * 1. 如果遇到函数或左括号，则往前试探整个函数或括号内容，得到之后的运算符再回退
       * 2. 如果不是函数，则只往前试探一个 token，得到运算符后再回退
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
        // 在循环中碰见优先级不同的运算符，要退出递归；
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
