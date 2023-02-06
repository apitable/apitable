import { Strings, t } from 'exports/i18n';
import { FormulaExprLexer, ILexer, Token } from '../lexer';

describe('value', () => {
  it('should accept normal value', () => {
    const lexer = new FormulaExprLexer('{abc}    {🤯区间1  -a}  {   }');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });

  it('should accept whitespaces', () => {
    const lexer = new FormulaExprLexer('{ Foo}{-　 }');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });

  it('should accept escape sequence', () => {
    const lexer = new FormulaExprLexer('{}   {  x\\{_ _\\\\\\}}{}');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });

  it('should accept empty name', () => {
    const lexer = new FormulaExprLexer('   {}  ');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });
});

describe('string', () => {
  it('should accept empty strings', () => {
    const lexer = new FormulaExprLexer('""  "“  ”“ \'\'  \'’');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });

  it('should accept Unicode quotation marks', () => {
    const lexer = new FormulaExprLexer('"abc"  "ab c“  ”ab c“');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });

  it('should accept mismatched quotation marks', () => {
    const lexer = new FormulaExprLexer('"abc"  "ab c“  ”ab c"  ”ab c“');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });

  it('should accept single-quotes', () => {
    const lexer = new FormulaExprLexer("   'abc'  'ab c’  ‘ab c’  ‘ab c'  ");
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });

  it('should accept escape sequence', () => {
    const lexer = new FormulaExprLexer('   "ab \\"c"  ”a \\”c“  \' \\\'\' ');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });

  test('escaping single-quotes in double-quoted strings is not allowed', () => {
    const lexer = new FormulaExprLexer("   \"ab \\'c\"  ”a \\’c“  ' \\'' ");
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });

  test('escaping double-quotes in single-quoted strings is not allowed', () => {
    const lexer = new FormulaExprLexer("   'ab \\\"c'  ’a \\”c‘  ' \\\"' ");
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });

  // FIXME potential bug
  it('is converted into pure values if not closed', () => {
    const lexer = new FormulaExprLexer('   "ab c');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });

  // FIXME potential bug
  it('accepts backslash as the last character in a string', () => {
    const lexer = new FormulaExprLexer('"ab c\\"');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });
});

describe('call', () => {
  it('should be followed by left parenthesis', () => {
    const lexer = new FormulaExprLexer('ab ab(');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });

  it('should accept Unicode characters', () => {
    const lexer = new FormulaExprLexer('α👀()');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });

  it('should be converted into a pure value if not immediately followed by a left parenthesis', () => {
    const lexer = new FormulaExprLexer('ab , c');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });

  // TODO potential bug
  it('is converted into a pure value if the following left parenthesis is separated by spaces', () => {
    const lexer = new FormulaExprLexer('ab (');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });
});

describe('number', () => {
  it('should accept integers', () => {
    const lexer = new FormulaExprLexer('1244444444444444444444444444444444444444  78');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });

  it('should accept trailing decimal point', () => {
    const lexer = new FormulaExprLexer('123. 0.');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });

  it('should accept starting decimal point', () => {
    const lexer = new FormulaExprLexer('.123 .0');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });

  // FIXME potential bug
  it('accepts single period', () => {
    const lexer = new FormulaExprLexer('.');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });

  // FIXME potential bug
  it('accepts a sequence of periods', () => {
    const lexer = new FormulaExprLexer('123, ......');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });

  // FIXME potential bug
  it('accepts multiple decimal points', () => {
    const lexer = new FormulaExprLexer('123......456');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });
});

describe('punctuation', () => {
  it('should accept operators with multiple characters', () => {
    const lexer = new FormulaExprLexer('!=&&>=<<==||');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });

  it('should accpet full-width commas', () => {
    const lexer = new FormulaExprLexer('， ,，,,');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });

  it('should recognize single vertical bar as an unknown token', () => {
    const lexer = new FormulaExprLexer('| |');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });

  it('should accept full-width parentheses', () => {
    const lexer = new FormulaExprLexer('（(）)');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });
});

describe('blank', () => {
  it('should recognize contiguous spaces as a single blank token', () => {
    const lexer = new FormulaExprLexer('12 3     A    ');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });

  it('should accept full-width spaces', () => {
    const lexer = new FormulaExprLexer('123 　　  A');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });

  it('should produce a single blank token if given a string with only spaces', () => {
    const lexer = new FormulaExprLexer('  　　  　');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });
});

describe('pure value', () => {
  it('should accept Unicode characters', () => {
    const lexer = new FormulaExprLexer('Foo a11 $T$ ᵣ☯');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });
});

describe('unknown token', () => {
  // FIXME potential bug
  it('is composed of only characters rejected by other tokens', () => {
    const lexer = new FormulaExprLexer('a~~~~~~~~~``~');
    expect(lexer.errors).toStrictEqual([new Error(t(Strings.function_err_unrecognized_operator, { token: '~~~~~~~~~``~' }))]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });

  // FIXME potential bug
  it('makes other tokens accept characters that should not be accepted', () => {
    const lexer = new FormulaExprLexer('abc ~~~ {}  ');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toMatchSnapshot();
  });
});

describe('fullMatches', () => {
  it('should produce an empty token list if given an empty string', () => {
    const lexer = new FormulaExprLexer('');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.fullMatches).toStrictEqual([]);
  });
});

describe('matches', () => {
  it('should not contain blank tokens', () => {
    const lexer = new FormulaExprLexer('  A 123 "  "');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.matches).toMatchSnapshot();
  });

  it('should produce an empty token list if given an empty string', () => {
    const lexer = new FormulaExprLexer('');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.matches).toStrictEqual([]);
  });

  it('should produce an empty token list if given a string with only spaces', () => {
    const lexer = new FormulaExprLexer('        ');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.matches).toStrictEqual([]);
  });

  it('should not contain unknown tokens', () => {
    const lexer = new FormulaExprLexer(' 123    ~~ ');
    expect(lexer.errors).toStrictEqual([]);
    expect(lexer.matches).toMatchSnapshot();
  });
});

describe('get token', () => {
  function collectTokens(lexer: ILexer) {
    const tokens: Token[] = [];
    let token: Token | null;
    while ((token = lexer.getNextToken())) {
      tokens.push(token);
    }
    return tokens;
  }

  describe('getNextToken', () => {
    it('should produce tokens in order', () => {
      const lexer = new FormulaExprLexer(' 123    ~~ ');
      expect(lexer.errors).toStrictEqual([]);
      const tokens = collectTokens(lexer);
      expect(tokens).toMatchSnapshot();
    });

    it('should produce null if no more token', () => {
      const lexer = new FormulaExprLexer('   ');
      expect(lexer.errors).toStrictEqual([]);
      expect(lexer.getNextToken()).toBeNull();
    });
  });

  describe('getPrevToken', () => {
    it('should produce previous token', () => {
      const lexer = new FormulaExprLexer(' 123 a  ');
      expect(lexer.errors).toStrictEqual([]);
      const token1 = lexer.getNextToken();
      const token2 = lexer.getNextToken();
      expect(lexer.getNextToken()).toBeNull();
      expect(lexer.getPrevToken()).toStrictEqual(token2);
      expect(lexer.getPrevToken()).toStrictEqual(token1);
    });

    it('should produce null if no previous token', () => {
      const lexer = new FormulaExprLexer(' 123  ');
      expect(lexer.errors).toStrictEqual([]);
      expect(lexer.getPrevToken()).toBeNull();
    });

    test('interleaving getNextToken and getPrevToken', () => {
      const lexer = new FormulaExprLexer(' 123 a=  ');
      expect(lexer.errors).toStrictEqual([]);
      const token1 = lexer.getNextToken();
      const token2 = lexer.getNextToken();
      expect(lexer.getPrevToken()).toStrictEqual(token1);
      expect(lexer.getPrevToken()).toBeNull();
      expect(lexer.getNextToken()).toStrictEqual(token1);
      expect(lexer.getNextToken()).toStrictEqual(token2);
      expect(lexer.getPrevToken()).toStrictEqual(token1);
      expect(lexer.getNextToken()).toStrictEqual(token2);
      const token3 = lexer.getNextToken();
      expect(lexer.getNextToken()).toBeNull();
      expect(lexer.getPrevToken()).toStrictEqual(token3);
    });
  });

  describe('reset', () => {
    it('should reset to the first token', () => {
      const lexer = new FormulaExprLexer(' 123 a=  ');
      expect(lexer.errors).toStrictEqual([]);
      const token1 = lexer.getNextToken();
      lexer.getNextToken();
      lexer.getNextToken();
      lexer.reset();
      expect(lexer.getNextToken()).toStrictEqual(token1);
    });
  });
});
