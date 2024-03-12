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

import { expressionTransform } from '../evaluate';
import { FieldType, IField } from '../../types/field_types';
import { mergeContext, evaluate } from './mock_state';
import { Role } from 'config/constant';
import { SelfRefError } from 'formula_parser/errors/self_ref.error';

// tslint:disable: max-line-length

// For convenience, use fieldName directly as key here
const fieldMap: { [key: string]: IField } = {
  a: {
    id: 'a',
    name: 'a',
    type: FieldType.Number,
    property: {
      precision: 0,
    },
  },
  b: {
    id: 'b',
    name: 'b',
    type: FieldType.Text,
    property: null,
  },
  c: {
    id: 'c',
    name: 'c',
    type: FieldType.Number,
    property: {
      precision: 1,
    },
  },
  x: {
    id: 'x',
    name: 'x',
    type: FieldType.Formula,
    property: {
      datasheetId: 'dst123',
      expression: '',
    },
  },
};

const testEvaluate = (tests: any) => {
  tests.forEach((test: any) => {
    const [expression, context, expectedResult] = test;
    // Convert the text field
    for (const id in fieldMap) {
      if (fieldMap[id]!.type === FieldType.Text) {
        context[id] = [{ type: 1, text: context[id] }];
      }
    }
    for (const id in context) {
      if (!fieldMap[id]) {
        fieldMap[id] = {
          id,
          name: id,
          type: FieldType.Number,
          property: {
            precision: 0,
          },
        };
      }
    }
    const result = evaluate(expression, mergeContext(context, fieldMap), false);
    expect(result).toEqual(expectedResult);
  });
};

describe('FormulaEvaluate', () => {
  it('mix 1 or 2 operator', () => {
    const tests = [
      ['-1-1', { a: 0, b: '456', c: 1 }, -2],
      ['{a}-1 - 2', { a: 0, b: '456', c: 1 }, -3],
      ['-2 - 2 - -2', { a: 0, b: '456', c: 1 }, -2],
      ['+2 + 2 + +2', { a: 0, b: '456', c: 1 }, 6],
    ];
    testEvaluate(tests);
  });

  it('expression escape', () => {
    const tests = [
      ['“\\”” & {b} & “\\””', { a: 0, b: '456', c: 1 }, '”456”'],
      ['“\\”” & {b\\{} & “\\””', { a: 0, 'b{': 456, c: 1 }, '”456”'],
    ];
    testEvaluate(tests);
  });

  it('expression priority', () => {
    const tests = [
      ['1 + 2 * 3', { a: 1, b: '456', c: 2, d: 3 }, 7],
      ['1 + (1 + 3) * 2', { a: 1, b: '456', c: 2, d: 3 }, 9],
      ['2 * (2 + 3) - 10', { a: 1, b: '456', c: 2, d: 3 }, 0],
      ["'Courses平均成绩' & '=' & ({a}+{c}+{d}) / 3", { a: 1, b: '456', c: 2, d: 3 }, 'Courses平均成绩=2'],
      ['1 + 2 + 3 + 5 - 1 * 2 * 3 / 4 % 5 * 323 % 1', { a: 0, b: '456', c: 1 }, 10.5],
      ['1 * 2 * 3 + 4 + 5', { a: 0, b: '456', c: 1 }, 15],
      ['IF(1 > 2, 3, 5)', { a: 0, b: '456', c: 1 }, 5],
      ['IF（1 > 2， 3， 5）', { a: 0, b: '456', c: 1 }, 5],
      ['1 + 2 * 3 * 4', { a: 0, b: '456', c: 1 }, 25],
      ['1 + 2 * 3 - 4 * 5 % 6', { a: 0, b: '456', c: 1 }, 5],
      ['1 + {c} * 3 - 4 * {a} % 6', { a: 5, b: '456', c: 2 }, 5],
      ['(1 + 2 * 3 - 4 * 5 % 6) & "123"', { a: 0, b: '456', c: 1 }, '5123'],
      ['1 + 2 * 3 - 4', { a: 0, b: '456', c: 1 }, 3],
      ['1 + 2 * 3 * 4 + "x"', { a: 0, b: '456', c: 1 }, '25x'],
      ['1 + 2 * 3 * 4 + “x”', { a: 0, b: '456', c: 1 }, '25x'],
      ['5 + 1 % 10 + "123"', { a: 0, b: '456', c: 1 }, '6123'],
      ['1 + 2 * 3 - 4 * 5 % 6 & "123"', { a: 0, b: '456', c: 1 }, '5123'],
    ];
    testEvaluate(tests);
  });

  it('transform expression', () => {
    const fieldMap: { [key: string]: IField } = {
      fld11111: {
        id: 'fld11111',
        name: 'a',
        type: FieldType.Number,
        property: {
          precision: 0,
        },
      },
      fld22222: {
        id: 'fld22222',
        name: 'b',
        type: FieldType.Text,
        property: null,
      },
      fld33333: {
        id: 'fld33333',
        name: 'c',
        type: FieldType.Number,
        property: {
          precision: 1,
        },
      },
      fld44444: {
        id: 'fld44444',
        name: 'd{',
        type: FieldType.Number,
        property: {
          precision: 1,
        },
      },
      fld55555: {
        id: 'fld55555',
        name: '{e',
        type: FieldType.Number,
        property: {
          precision: 1,
        },
      },
      fld66666: {
        id: 'fld66666',
        name: 'f" {}',
        type: FieldType.Number,
        property: {
          precision: 1,
        },
      },
    };

    const fieldPermissionMap = {
      fld66666: {
        role: Role.None,
        setting: {
          formSheetAccessible: false,
        },
        permission: {
          editable: false,
          readable: false,
        },
        manageable: false,
      },
    };
    expect(expressionTransform('“\\”” & {c} & “\\””', { fieldMap }, 'id')).toEqual('“\\”” & {fld33333} & “\\””');
    expect(expressionTransform('{c} + 1', { fieldMap }, 'id')).toEqual('{fld33333} + 1');

    expect(expressionTransform('{d\\{} + 1', { fieldMap }, 'id')).toEqual('{fld44444} + 1');
    expect(expressionTransform('{fld44444} + 1', { fieldMap }, 'name')).toEqual('{d\\{} + 1');

    expect(expressionTransform('d\\{ + 1', { fieldMap }, 'id')).toEqual('fld44444 + 1');
    expect(expressionTransform('fld44444 + 1', { fieldMap }, 'name')).toEqual('d\\{ + 1');

    expect(expressionTransform('\\{e + 1', { fieldMap }, 'id')).toEqual('fld55555 + 1');
    expect(expressionTransform('fld55555 + 1', { fieldMap }, 'name')).toEqual('\\{e + 1');

    expect(expressionTransform('{f" \\{\\}} + 1', { fieldMap }, 'id')).toEqual('{fld66666} + 1');
    expect(expressionTransform('{fld66666} + 1', { fieldMap }, 'name')).toEqual('{f" \\{\\}} + 1');
    expect(expressionTransform('fld66666 + 1', { fieldMap }, 'name')).toEqual('{f" \\{\\}} + 1');

    expect(expressionTransform('c + 1', { fieldMap }, 'id')).toEqual('fld33333 + 1');
    expect(expressionTransform('{fld33333} + 1', { fieldMap }, 'name')).toEqual('{c} + 1');
    expect(expressionTransform('fld33333 + 1', { fieldMap }, 'name')).toEqual('c + 1');

    expect(expressionTransform('IF({c}, SUM(1,2,3), 3)', { fieldMap }, 'id')).toEqual('IF({fld33333}, SUM(1,2,3), 3)');
    expect(expressionTransform('IF(c, SUM(1,2,3), 3)', { fieldMap }, 'id')).toEqual('IF(fld33333, SUM(1,2,3), 3)');
    expect(expressionTransform('IF({fld33333}, SUM(1,2,3), 3)', { fieldMap }, 'name')).toEqual('IF({c}, SUM(1,2,3), 3)');
    expect(expressionTransform('IF(fld33333, SUM(1,2,3), 3)', { fieldMap }, 'name')).toEqual('IF(c, SUM(1,2,3), 3)');
    expect(expressionTransform('{fld66666}', { fieldMap, fieldPermissionMap }, 'name')).toEqual('{该列无权访问}');
  });

  it('eval function call', () => {
    const tests = [
      ['LEN({a}) * 0.2 - LEN({a}) * 0.1', { a: 666666, b: '456', c: 1 }, 0.6],
      ['SUM({a}, {c}) * SUM({a}, {c}) = 4', { a: 1, b: '456', c: 1 }, true],
      ['SUM(1, 2, 3)', { a: 0, b: '456', c: 1 }, 6],
      ['SUM(1,2,3) + 3', { a: 0, b: '456', c: 1 }, 9],
      [
        '{title} & "\'s exam score improved ：" & {中文期末考试成绩} - {midterm_exam_score} & "分"',
        { title: 'Mary Lee', 中文期末考试成绩: 40, midterm_exam_score: 20 },
        "Mary Lee's exam score improved ：20分",
      ],
      [
        '中文变量 & "进步了：" & 中文期末考试成绩 - midterm_exam_score & "分"',
        { 中文变量: 'Tom', 中文期末考试成绩: 40, midterm_exam_score: 20 },
        'Tom进步了：20分',
      ],
      ['SUM(1, -2, SUM(1,2,3)) + 3', { a: 0, b: '456', c: 1 }, 8],
      ['SUM(1, {c}, SUM(1,2,3)) + 3', { a: 0, b: '456', c: 1 }, 11],
      ['SUM(1, c, SUM(1,2,3)) + 3', { a: 0, b: '456', c: 1 }, 11],
      ['IF(c, SUM(1,2,3), 3)', { a: 0, b: '456', c: 1 }, 6],
      ['IF({c}, SUM(1,2,3), 3)', { a: 0, b: '456', c: 1 }, 6],
      ["IF({c}, SUM(1,2,3), '3')", { a: 0, b: '456', c: 1 }, 6],
      ["IF(!{c}, SUM(1,2,3), '3')", { a: 0, b: '456', c: 1 }, '3'],
      ["FIND('s', 'sxsyz', 1)", { a: 0, b: '456', c: 1 }, 1],
      ["FIND('s', 'sxsyz', 0)", { a: 0, b: '456', c: 1 }, 1],
      ["FIND('s', 'sxsyz', 2)", { a: 0, b: '456', c: 1 }, 3],
      ['DAY({c})', { a: 0, b: '456', c: 1590565608830 }, 27],
      ['RECORD_ID()', { a: 0, b: '456' }, 'xyz'],
      ['record_id()', { a: 0, b: '456' }, 'xyz'], // lowercase
      ['record_Id()', { a: 0, b: '456' }, 'xyz'], // mix case
    ];
    testEvaluate(tests);
  });

  it('should evaluate mix', () => {
    const tests = [
      ['{b}', { a: 0, b: '456', c: 1 }, '456'],
      ['b', { a: 0, b: '456', c: 1 }, '456'],
      ['{a} + {b} - {c}', { a: 0, b: '456', c: 1 }, 455],
      ['a + b - c', { a: 0, b: '456', c: 1 }, 455],
      ['{a} + {b} * {c}', { a: 2, b: '3', c: 5 }, 17],
      ['{a} + {b}', { a: 'xyz', b: 'abc' }, 'xyzabc'],
      ['{a} + {b}', { a: 50, b: '1' }, '501'],
      ['{a} + {b} + {c}', { a: 'xyz', b: 'abc', c: '中文来一个' }, 'xyzabc中文来一个'],
      ['{a} + {b} + {c}', { a: 0, b: '2', c: -3 }, '02-3'],
      ['{a} > {c}', { a: 2, c: 3 }, false],
      ['{a} < {c}', { a: 2, c: 3 }, true],
      ['{a} = {c}', { a: 2, c: 3 }, false],
      ['{a} = {c}', { a: 2, c: 2 }, true],
      ['{a} >= {c}', { a: 2, c: 3 }, false],
      ['{a} >= {c}', { a: 2, c: 2 }, true],
      ['{a} <= {c}', { a: 2, c: 3 }, true],
      ['{a} <= {c}', { a: 3, c: 2 }, false],
      ['{a} <= {c}', { a: 2, c: 2 }, true],
      ['{a} & {c}', { a: 2, c: 2 }, '22'],
      ['{a} != {c}', { a: 2, c: 2 }, false],
      ['{a} != {c}', { a: 3, c: 2 }, true],
    ];

    testEvaluate(tests);
  });

  it('should evaluate +', () => {
    const tests = [
      ['1+1', {}, 2],
      ['"abc" + "xyz"', {}, 'abcxyz'],
      ['"我们是：" + "向往自由民主技术人"', {}, '我们是：向往自由民主技术人'],
      ['{a} + {b}', { a: 0, b: '456' }, '0456'],
      ['{a} + {b}', { a: 'xyz', b: 'abc' }, 'xyzabc'],
      ['{a} + {c}', { a: 50, c: 1 }, 51],
      ['{a} + {c}', { a: 50 }, 50],
      ['{b} + {c}', { b: 'xyz' }, 'xyz0'],
    ];

    testEvaluate(tests);
  });

  it('should evaluate -', () => {
    const tests = [
      ['1 - -10', { a: 0, b: '456' }, 11],
      ['{a} - {b}', { a: 0, b: '456' }, -456],
      ['{a} - {c}', { a: -1, c: 66 }, -67],
      ['{a} - {c} - {c}', { a: 0, c: 3 }, -6],
    ];
    testEvaluate(tests);
  });

  it('should evaluate single negation', () => {
    const tests = [['-{a}', { a: 13 }, -13]];
    testEvaluate(tests);
  });

  it('should evaluate *', () => {
    const tests = [
      ['{a} * {b}', { a: 0, b: '456' }, 0],
      ['{a} * {c}', { a: 50, c: 5 }, 250],
      ['{a} * {c}', { a: 50, c: 5 }, 250],
      ['{a} * {b} * {c}', { a: -2, b: 3, c: 5.6 }, -33.6],
    ];

    testEvaluate(tests);
  });

  it('should evaluate /', () => {
    const tests = [
      ['{a} / {b}', { a: 0, b: '456' }, 0],
      ['{a} / {c}', { a: 50, c: 5 }, 10],
      ['{a} / {b} / {c}', { a: -2, b: 3, c: 5.6 }, -0.11904761904761904],
    ];

    testEvaluate(tests);
  });

  it('should evaluate %', () => {
    const tests = [
      ['{a} % {b}', { a: 0, b: '456' }, 0],
      ['{a} % {c}', { a: 55, c: 10 }, 5],
      ['{a} % {b} % {c}', { a: -2, b: '3', c: 5.6 }, -2],
    ];

    testEvaluate(tests);
  });

  it('should evaluate using standard JavaScript truthy and falsy rules', () => {
    const tests = [
      ['{a}', { a: null }, null],
      ['{a}', { a: undefined }, null],
      ['{a}', { a: false }, false],
      ['{a}', { a: true }, true],
      ['{a}', { a: 0 }, 0],
      ['{a}', { a: 1 }, 1],
      ['{a}', { a: '' }, ''],
      ['{a}', { a: ' ' }, ' '],
    ];

    testEvaluate(tests);
  });

  it('should evaluate "and" expressions', () => {
    const tests = [
      ['{a} && {c}', { a: true, c: false }, false],
      ['{a} && {c}', { a: false, c: false }, false],
      ['{a} && {c}', { a: true, c: true }, true],
    ];

    testEvaluate(tests);
  });

  it('should evaluate "and-or" expressions', () => {
    fieldMap.b!.type = FieldType.Number;
    const tests = [
      ['{a} && {b} || {c}', { a: false, b: false, c: true }, true],
      ['({a} && {b}) || {c}', { a: false, b: false, c: true }, true],
      ['{a} || {b} && {c}', { a: false, b: false, c: true }, false],
      ['{a} || {b} && {c}', { a: false, b: false, c: true }, false],
      ['({a} || {b}) && {c}', { a: false, b: false, c: true }, false],
    ];

    testEvaluate(tests);
    fieldMap.b!.type = FieldType.Text;
  });

  it('should evaluate "not" expressions', () => {
    const tests = [
      ['!{a}', { a: false }, true],
      ['!{a} && !{c}', { a: false, c: false }, true],
      ['!{a} && {c}', { a: false, c: false }, false],
      ['{a} && !{c}', { a: false, c: false }, false],
      ['!({a} && {c})', { a: false, c: false }, true],
      ['{a} || !{c}', { a: false, c: false }, true],
      ['!{a} || !{c}', { a: true, c: true }, false],
      ['!({a} || {c})', { a: false, c: false }, true],
    ];

    testEvaluate(tests);
  });

  it('should treat question marks as a valid part of a value token', () => {
    const tests = [
      ['{a?}', { 'a?': true }, true],
      ['a?', { 'a?': true }, true],
      ['!{a?}', { 'a?': true }, false],
      ['!a?', { 'a?': true }, false],
      ['{a?} && {c?}', { 'a?': true, 'c?': true }, true],
      ['{a} && {c?}', { a: true, 'c?': true }, true],
    ];

    testEvaluate(tests);
  });

  it('should throw error', () => {
    expect(() => evaluate('{a} | {c}', mergeContext({}))).toThrowError();
    expect(() => evaluate('{a} ^ {c}', mergeContext({}))).toThrowError();
    expect(() => evaluate('{a}', mergeContext({ a: NaN }))).toThrow('NaN');
    expect(() => evaluate('{a} % {b}', mergeContext({ a: 'xyz', b: 3 }))).toThrow('NaN');
    expect(() => evaluate('{a} / {b}', mergeContext({ a: 'xyz', b: 'abc' }))).toThrow('NaN');
    expect(() => evaluate('{a} * {b}', mergeContext({ a: 'xyz', b: 'abc' }))).toThrow('NaN');
    expect(() => evaluate('{x}', mergeContext({}))).toThrow(SelfRefError);
  });

  it('should evaluate " and \'', () => {
    const tests = [
      ['AND({a}="1", {b}="2")', { a: '1', b: '2' }, true],
      ['"test" & "-" & "123"', { a: '1', b: '2' }, 'test-123'],
      ['"abc\\""', { a: '1', b: '2' }, 'abc"'],
      ['"quotes test+=*/\\"123"', { a: '1', b: '2' }, 'quotes test+=*/"123'],
      ["AND({a}='1', {b}='2')", { a: '1', b: '2' }, true],
      ["'test' & '-' & '123'", { a: '1', b: '2' }, 'test-123'],
      ["'abc\\''", { a: '1', b: '2' }, "abc'"],
      ["'quote test+=*/\\'123'", { a: '1', b: '2' }, "quote test+=*/'123"],
      ['AND({a}=\'1\', {b}="2")', { a: '1', b: '2' }, true],
      ["'test' & '-' & \"123\"", { a: '1', b: '2' }, 'test-123'],
      ['"abc\'"', { a: '1', b: '2' }, "abc'"],
      ['"quotes test+=*/\'123"', { a: '1', b: '2' }, "quotes test+=*/'123"],
    ];

    testEvaluate(tests);
  });
});
