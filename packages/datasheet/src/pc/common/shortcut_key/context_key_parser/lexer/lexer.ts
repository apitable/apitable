import { Token, TokenType } from './token';
import { BOOLEAN_EXPR_GRAMMAR } from './grammar';

export interface ILexer {
  expression: string;

  getNextToken(): Token | null;
  reset(): void;
}

export class BooleanExprLexer implements ILexer {
  readonly expression: string;

  private readonly grammar = BOOLEAN_EXPR_GRAMMAR;
  private matches: Token[];
  private currentIndex: number;

  constructor(expression: string) {
    this.expression = expression;

    if (this.isValidExpr()) {
      this.matches = this.getMatches();
      this.currentIndex = -1;
    } else {
      throw new Error('Invalid Boolean Expression');
    }
  }

  getNextToken(): Token | null {
    this.currentIndex++;

    if (this.currentIndex > this.matches.length - 1) {
      return null;
    }

    const token = this.matches[this.currentIndex];
    return token;
  }

  reset(): void {
    this.currentIndex = -1;
  }

  private isValidExpr(): boolean {
    const invalidMatch = this.expression.replace(this.invalidPattern(), '');
    return !invalidMatch;
  }

  private getMatches(): Token[] {
    const matched: string[] = this.expression.match(this.pattern()) || [];
    const matches = matched.map(m => {
      const token = this.tokenize(m);
      return token;
    });
    return matches;
  }

  private tokenize(str: string): Token {
    const keys = Object.keys(this.grammar);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const regex = this.grammar[key];
      const type = key;

      if (regex.test(str)) {
        return new Token(TokenType[type], str);
      }
    }

    throw new Error(`Unexpected token: ${str}`);
  }

  private pattern(): RegExp {
    const pattern: string = Object.keys(this.grammar)
      .map(key => `(${this.grammar[key].source})`)
      .join('|');

    return new RegExp(pattern, 'g');
  }

  private invalidPattern(): RegExp {
    const pattern: RegExp = this.pattern();
    const invalidPattern = `${pattern.source}|(\\s*)`;

    return new RegExp(invalidPattern, 'g');
  }
}
