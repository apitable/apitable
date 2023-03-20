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

import { ParamsCountError } from 'formula_parser/errors/params_count.error';
import { mergeContext, evaluate } from './mock_state';

describe('Logical function test', () => {
  it('IF', () => {
    expect(evaluate(
      'IF(0, 1, 2)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(2);
    expect(evaluate(
      'IF(1, 1, 2)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(1);
    expect(evaluate(
      'IF(IF({a}, 1, 0), 2, 3)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(3);
    // requires at least 3 parameters
    expect(() => evaluate(
      'IF("x")',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toThrow(ParamsCountError);
  });

  it('BLANK', () => {
    expect(evaluate(
      'BLANK()',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(null);

    expect(evaluate(
      'BLANK() + BLANK()',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(0);

    expect(evaluate(
      '1 + BLANK()',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(1);

    expect(evaluate(
      'BLANK({b})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(null);
  });

  it('TRUE', () => {
    expect(evaluate(
      'TRUE()',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(true);

    expect(evaluate(
      'TRUE({b})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(true);
  });

  it('FALSE', () => {
    expect(evaluate(
      'FALSE()',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(false);

    expect(evaluate(
      'FALSE({b})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(false);
  });

  it('OR', () => {
    expect(evaluate(
      'OR({a})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(false);

    expect(evaluate(
      'OR({b})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(true);

    expect(evaluate(
      'OR({a}, {b}, {c})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(true);

    expect(() => evaluate(
      'OR()',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toThrow(ParamsCountError);
  });

  it('AND', () => {
    expect(evaluate(
      'AND({a})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(false);

    expect(evaluate(
      'AND({b})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(true);

    expect(evaluate(
      'AND({a}, {b}, {c})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(false);

    expect(() => evaluate(
      'AND()',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toThrow(ParamsCountError);
  });

  it('XOR', () => {
    expect(evaluate(
      'XOR({a})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(false);

    expect(evaluate(
      'XOR({a}, {b})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(true);

    expect(evaluate(
      'XOR({a}, {b}, {c})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(false);

    expect(() => evaluate(
      'XOR()',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toThrow(ParamsCountError);
  });

  it('NOT', () => {
    expect(evaluate(
      'NOT({a})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(true);

    expect(evaluate(
      'NOT({b})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(false);

    expect(() => evaluate(
      'NOT()',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toThrow(ParamsCountError);
  });

  it('SWITCH', () => {
    expect(evaluate(
      'SWITCH({b}, "one two three")',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual('one two three');

    expect(evaluate(
      'SWITCH({a}, "123", "one two three", "456", "four five six", "default value")',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual('default value');

    expect(evaluate(
      'SWITCH({b}, "123", "one two three", "456", "four five six", "default value")',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual('four five six');

    expect(evaluate(
      'SWITCH({a}, "123", "one two three", "456", "four five six")',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(null);

    expect(() => evaluate(
      'SWITCH({a})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toThrow(ParamsCountError);
  });

  // it('ERROR', () => {
  //   expect(evaluate(
  //     'ERROR()',
  //     mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
  //   )).toEqual('#Error!');

  //   expect(evaluate(
  //     'ERROR({a})',
  //     mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
  //   )).toEqual('#Error!');

  //   expect(evaluate(
  //     'ERROR("")',
  //     mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
  //   )).toEqual('#Error!');

  //   expect(evaluate(
  //     'ERROR({b})',
  //     mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
  //   )).toEqual('#Error: 456');
  // });

  it('ISERROR', () => {
    expect(evaluate(
      'ISERROR(-1/{a})',
      mergeContext({ a: 0, b: 'abc', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(true);

    expect(evaluate(
      'ISERROR({a}/{a})',
      mergeContext({ a: 0, b: 'abc', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(true);

    expect(evaluate(
      'ISERROR({b}/{a})',
      mergeContext({ a: 0, b: 'abc', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(true);

    expect(evaluate(
      'ISERROR({a}/{b})',
      mergeContext({ a: 0, b: 'abc', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(true);

    expect(evaluate(
      'ISERROR({b}/{b})',
      mergeContext({ a: 0, b: 'abc', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(true);

    expect(evaluate(
      'ISERROR({a}/1)',
      mergeContext({ a: 0, b: 'abc', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual(false);

    expect(() => evaluate(
      'ISERROR()',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toThrow(ParamsCountError);
  });
});
