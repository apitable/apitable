import { Strings, t } from 'exports/i18n';
import { IReduxState } from 'exports/store/interfaces';
import { FormulaExprLexer } from 'formula_parser/lexer';
import { AstNode, FormulaExprParser } from 'formula_parser/parser';
import { DateFormat, FieldType, TimeFormat } from 'types';

const mockContext = (expr: string): ConstructorParameters<typeof FormulaExprParser>[1] => ({
  state: {} as IReduxState,
  field: {
    id: 'fld4',
    name: 'Field 4',
    type: FieldType.Formula,
    property: {
      datasheetId: 'dst1',
      expression: expr,
    },
  },
  fieldMap: {
    fld1: {
      id: 'fld1',
      name: 'Field 1',
      type: FieldType.SingleText,
      property: {},
    },
    fld2: {
      id: 'fld2',
      name: 'Field 2',
      type: FieldType.Number,
      property: {
        precision: 0,
      },
    },
    fld3: {
      id: 'fld3',
      name: 'Field 3',
      type: FieldType.DateTime,
      property: {
        dateFormat: DateFormat['YYYY-MM'],
        timeFormat: TimeFormat['HH:mm'],
        includeTime: false,
        autoFill: false,
      },
    },
    fld4: {
      id: 'fld4',
      name: 'Field 4',
      type: FieldType.Formula,
      property: {
        datasheetId: 'dst1',
        expression: expr,
      },
    },
  },
});

const parse = (input: string): AstNode => {
  const lexer = new FormulaExprLexer(input);
  const parser = new FormulaExprParser(lexer, mockContext(input));
  return parser.parse();
};

describe('function call', () => {
  test('nullary function', () => {
    const ast = parse('record_id()');
    expect(ast).toMatchSnapshot();
  });

  test('unary function', () => {
    const ast = parse("inT('babe')");
    expect(ast).toMatchSnapshot();
  });

  test('3-arity function', () => {
    const ast = parse('Max(31, -77, {fld3})');
    expect(ast).toMatchSnapshot();
  });

  test('nested function', () => {
    const ast = parse("Max(rOuNd(31+true()), value('')&'b', --0)");
    expect(ast).toMatchSnapshot();
  });

  test('missing right parenthesis', () => {
    expect.assertions(1);
    try {
      parse('max(1,7');
    } catch (e) {
      expect(e).toStrictEqual(new Error(t(Strings.function_err_end_of_right_bracket)));
    }
  });

  test('redundant comma', () => {
    expect.assertions(1);
    try {
      parse('max(1,7,)');
    } catch (e) {
      expect(e).toStrictEqual(new Error(t(Strings.function_err_unknown_operator, { type: ',' })));
    }
  });
});

describe('field', () => {
  test('with curly braces', () => {
    const ast = parse('  {fld2}');
    expect(ast).toMatchSnapshot();
  });

  test('without curly braces', () => {
    const ast = parse('fld2  ');
    expect(ast).toMatchSnapshot();
  });

  test('two consecutive fields', () => {
    expect.assertions(1);
    try {
      parse('fld2  {fld4} ');
    } catch (e) {
      expect(e).toStrictEqual(new Error(t(Strings.function_err_unrecognized_char, { value: '{fld4}' })));
    }
  });
});

describe('unary operator', () => {
  test('not', () => {
    const ast = parse('  ! "foo"');
    expect(ast).toMatchSnapshot();
  });

  test('minus', () => {
    const ast = parse('  - "foo"');
    expect(ast).toMatchSnapshot();
  });

  test('plus', () => {
    const ast = parse('  + "foo"');
    expect(ast).toMatchSnapshot();
  });

  test('nested', () => {
    const ast = parse('  +-!( +--"foo")');
    expect(ast).toMatchSnapshot();
  });
});