import { Token, TokenType } from './token';
import { t, Strings } from 'i18n';
import { isNumber } from 'lodash';

export const EXPR_GRAMMAR: { key: TokenType, exp: RegExp }[] = [
  { key: TokenType.Value, exp: /(\{\})|(\{(\\[{}])*[\s\S]*?[^\\]\})/ }, // 通过字段名常量获取的记录中的值
  { key: TokenType.String, exp: /(["”“](([^\\"“”])*?\\["”“])*.*?["”“])|(['‘’](([^\\'‘’])*?\\['‘’])*.*?['‘’])/ }, // 字符串字面量
  // 函数名称或者字段名常量
  { key: TokenType.Call, exp: /[^0-9.+\-|=*/><()（）!&%'"“”‘’^`~,，\s][^+\-|=*/><()（）!&%'"“”‘’^`~,，\s]*/ },
  { key: TokenType.Number, exp: /[0-9.]+/ }, // 数字字面量
  { key: TokenType.NotEqual, exp: /!=/ }, // 不等于
  { key: TokenType.And, exp: /&&/ }, // 与
  { key: TokenType.GreaterEqual, exp: />=/ }, // 大于等于
  { key: TokenType.LessEqual, exp: /<=/ }, // 小于等于
  { key: TokenType.Or, exp: /\|\|/ }, // 或
  { key: TokenType.Comma, exp: /[,，]/ }, // 逗号，参数分隔符
  { key: TokenType.Not, exp: /!/ }, // 非
  { key: TokenType.Add, exp: /\+/ }, // 加 +
  { key: TokenType.Minus, exp: /-/ }, // 减 -
  { key: TokenType.Times, exp: /\*/ }, // 乘 *
  { key: TokenType.Div, exp: /\// }, // 除 /
  { key: TokenType.Mod, exp: /%/ }, // 取余 %
  { key: TokenType.Concat, exp: /&/ }, // 字符串拼接
  { key: TokenType.Greater, exp: />/ }, // 大于
  { key: TokenType.Less, exp: /</ }, // 小于
  { key: TokenType.Equal, exp: /=/ }, // 等于
  { key: TokenType.LeftParen, exp: /[(（]/ }, // 左括号
  { key: TokenType.RightParen, exp: /[)）]/ }, // 右括号
  { key: TokenType.Blank, exp: /\s+/ }, //  空白字符
  { key: TokenType.Unknown, exp: /.+/ }, //  所有其他
];
// {} - {期中考试成绩}
export interface ILexer {
  expression: string;
  currentTokenIndex: number;

  getNextToken(): Token | null;
  getPrevToken(): Token | null;
  reset(): void;
}

// 公式的词法分析器，根据传入的表达式， exper -> token
export class FormulaExprLexer implements ILexer {
  readonly expression: string;

  readonly fullMatches: Token[];
  readonly matches: Token[];
  readonly errors: Error[] = []; // lexer 不直接抛错误，而是将错误暂存起来交给调用方处理
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

    const token = this.matches[this.currentIndex];
    return token;
  }

  getPrevToken(): Token | null {
    this.currentIndex--;

    if (this.currentIndex < 0) {
      return null;
    }

    const token = this.matches[this.currentIndex];
    return token;
  }

  reset(): void {
    this.currentIndex = -1;
  }

  // private checkValidExpr() {
  //   // 将所有可能都匹配完成之后，还有剩下的，说明有错误的输入。
  //   const invalidMatch = this.expression.replace(this.pattern(), '');

  //   if (invalidMatch) {
  //     throw new Error(`未能识别字符：${invalidMatch}`);
  //   }
  // }

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
        this.errors.push(new Error(t(Strings.function_err_unrecognized_operator, {
          token: token.value,
        })));
      }
      return token.type !== TokenType.Blank && token.type !== TokenType.Unknown;
    });
  }

  private tokenizer(index: number, str: string, nextStr?: string): Token {
    for (let i = 0; i < EXPR_GRAMMAR.length; i++) {
      const key = EXPR_GRAMMAR[i].key;
      const regex = EXPR_GRAMMAR[i].exp;
      const type = key;

      if (regex.test(str)) {
        // 当 tokenType 匹配为 Call 的时候，要判断是否有左括号的存在，如果没有，则说明是一个不带大括号的 pureValue
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
    const pattern: string = EXPR_GRAMMAR
      .map(g => `(${g.exp.source})`)
      .join('|');

    return new RegExp(pattern, 'g');
  }
}
