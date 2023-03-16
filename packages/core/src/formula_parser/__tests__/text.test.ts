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

import { ParamsCountError } from '../errors/params_count.error';
import { mergeContext, evaluate } from './mock_state';

const englishString = 'Welcome to join APITable Team';
const chineseString = '欢迎加入APITable科技';
const chineseString2 = '欢迎加入APITable科技，维格科技真棒';

describe('Text function test', () => {
  it('FIND', () => {
    expect(evaluate(
      'FIND("APITable", {b})',
      mergeContext({ a: 0, b: englishString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual(17);

    expect(evaluate(
      'FIND({d}, {b})',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt3'] }),
    )).toEqual(5);

    expect(evaluate(
      'FIND({d}, {b}, {a})',
      mergeContext({ a: 3, b: chineseString, c: 1591414562369, d: ['opt3'] }),
    )).toEqual(5);

    expect(evaluate(
      'FIND({d}, {b}, {a})',
      mergeContext({ a: 7, b: chineseString, c: 1591414562369, d: ['opt2'] }),
    )).toEqual(0);

    expect(evaluate(
      'FIND({b}, {d})',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual(0);

    expect(() => evaluate(
      'FIND({b})',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toThrow(ParamsCountError);

    expect(evaluate(
      'FIND("维", {b}, {a})',
      mergeContext({ a: -1, b: chineseString2, c: 1591414562369, d: ['opt1'] }),
    )).toEqual(16);

    expect(evaluate(
      'FIND("APITable", {b}, {a})',
      mergeContext({ a: -19, b: 'I am APITable and the APITable.', c: 1591414562369, d: ['opt1'] }),
    )).toEqual(6);

    expect(evaluate(
      'FIND("维", {b}, {a})',
      mergeContext({ a: -100, b: chineseString2, c: 1591414562369, d: ['opt1'] }),
    )).toEqual(0);
  });

  it('SEARCH', () => {
    expect(evaluate(
      'SEARCH({d}, {b})',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual(13);

    expect(evaluate(
      'SEARCH({d}, {b})',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt3'] }),
    )).toEqual(5);

    expect(evaluate(
      'SEARCH({d}, {b}, {a})',
      mergeContext({ a: 3, b: chineseString, c: 1591414562369, d: ['opt3'] }),
    )).toEqual(5);

    expect(evaluate(
      'SEARCH({d}, {b}, {a})',
      mergeContext({ a: 7, b: chineseString, c: 1591414562369, d: ['opt2'] }),
    )).toEqual(null);

    expect(evaluate(
      'SEARCH({b}, {d})',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual(null);

    expect(() => evaluate(
      'SEARCH({b})',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toThrow(ParamsCountError);
  });

  it('CONCATENATE', () => {
    expect(evaluate(
      'CONCATENATE({b}, {d})',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual('欢迎加入APITable科技科');

    expect(evaluate(
      'CONCATENATE({a}, {b}, {c}, {d})',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual('0欢迎加入APITable科技2020/06/06科');

    expect(() => evaluate(
      'CONCATENATE()',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toThrow(ParamsCountError);
  });

  it('ENCODE_URL_COMPONENT', () => {
    expect(evaluate(
      '"https://www.google.com/s?wd=" & ENCODE_URL_COMPONENT({b})',
      mergeContext({ a: 0, b: '美少女战士', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('https://www.google.com/s?wd=%E7%BE%8E%E5%B0%91%E5%A5%B3%E6%88%98%E5%A3%AB');

    expect(() => evaluate(
      'ENCODE_URL_COMPONENT()',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toThrow(ParamsCountError);
  });

  it('LEFT', () => {
    expect(evaluate(
      'LEFT({b}, {a})',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual('');

    expect(evaluate(
      'LEFT({b})',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual('欢');

    expect(evaluate(
      'LEFT({b}, 3)',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual('欢迎加');

    expect(evaluate(
      'LEFT({b}, 3)',
      mergeContext({ a: 0, c: 1591414562369, d: ['opt1'] }),
    )).toEqual(null);

    expect(evaluate(
      'LEFT({b}, 33)',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual(chineseString);

    expect(evaluate(
      'LEFT({a})',
      mergeContext({ a: 2021, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual('2');

    expect(evaluate(
      'LEFT({a}, 2)',
      mergeContext({ a: 2021, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual('20');

    expect(() => evaluate(
      'LEFT()',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toThrow(ParamsCountError);
  });

  it('RIGHT', () => {
    expect(evaluate(
      'RIGHT({b}, {a})',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual('');

    expect(evaluate(
      'RIGHT({b})',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual('技');

    expect(evaluate(
      'RIGHT({b}, 3)',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual('e科技');

    expect(evaluate(
      'RIGHT({b}, 33)',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual(chineseString);

    expect(evaluate(
      'RIGHT({a})',
      mergeContext({ a: 2021, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual('1');

    expect(evaluate(
      'RIGHT({a}, 2)',
      mergeContext({ a: 2021, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual('21');

    expect(() => evaluate(
      'RIGHT()',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toThrow(ParamsCountError);
  });

  it('LEN', () => {
    expect(evaluate(
      'LEN({b}, {a})',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual(14);

    expect(evaluate(
      'LEN(a)',
      mergeContext({ a: 100, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual(3);

    expect(() => evaluate(
      'LEN()',
      mergeContext({ a: 100, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toThrow(ParamsCountError);
  });

  it('LOWER', () => {
    expect(evaluate(
      'LOWER({b}, {a})',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual('欢迎加入apitable科技');

    expect(evaluate(
      'LOWER({b}, {a})',
      mergeContext({ a: 0, b: 'Welcome APITABLE', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('welcome apitable');

    expect(evaluate(
      'LOWER(a)',
      mergeContext({ a: 100, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual('100');
  });

  it('UPPER', () => {
    expect(evaluate(
      'UPPER({b}, {a})',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual('欢迎加入APITABLE科技');

    expect(evaluate(
      'UPPER({b}, {a})',
      mergeContext({ a: 0, b: 'Welcome APItABLE', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('WELCOME APITABLE');

    expect(evaluate(
      'UPPER(a)',
      mergeContext({ a: 100, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual('100');
  });

  it('MID', () => {
    expect(evaluate(
      'MID({b}, 5, 3)',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual('API');

    expect(evaluate(
      'MID({b}, 5, 6)',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual('APITab');

    expect(evaluate(
      'MID({b}, 55, 6)',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual('');

    expect(evaluate(
      'MID({a}, 5, 3)',
      mergeContext({ b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual(null);

    expect(() => evaluate(
      'MID({b}, 5)',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toThrow(ParamsCountError);
  });

  it('REPLACE', () => {
    expect(evaluate(
      'REPLACE({b}, 5, 3, "go")',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual('欢迎加入goTable科技');

    expect(evaluate(
      'REPLACE({b}, 5, 3, a)',
      mergeContext({ b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual('欢迎加入Table科技');

    expect(evaluate(
      'REPLACE({b}, 35, 3, "go")',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual('欢迎加入APITable科技go');

    expect(evaluate(
      'REPLACE(3, 4, "This is an error argument", "已被Replaced")',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual('3已被Replaced');

    expect(evaluate(
      'REPLACE({b}, 5, 33, "go")',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual('欢迎加入go');

    expect(evaluate(
      'REPLACE({b}, 5, 33, "go")',
      mergeContext({ c: 1591414562369, d: ['opt1'] }),
    )).toEqual(null);

    expect(() => evaluate(
      'REPLACE({b}, 5)',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toThrow(ParamsCountError);
  });

  it('T', () => {
    expect(evaluate(
      'T({a})',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual(null);

    expect(evaluate(
      'T({b})',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual(chineseString);

    expect(evaluate(
      'T({d})',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual('科');

    expect(() => evaluate(
      'T()',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toThrow(ParamsCountError);
  });

  it('TRIM', () => {
    expect(evaluate(
      'TRIM({a})',
      mergeContext({ a: 0, b: '  欢迎加入APITable科技  ', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('0');

    expect(evaluate(
      'TRIM({b})',
      mergeContext({ a: 0, b: '  欢迎加入APITable科技  ', c: 1591414562369, d: ['opt1'] }),
    )).toEqual(chineseString);

    expect(evaluate(
      'TRIM({d})',
      mergeContext({ a: 0, b: '  欢迎加入APITable科技  ', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('科');

    expect(() => evaluate(
      'TRIM()',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toThrow(ParamsCountError);
  });

  it('REPT', () => {
    expect(evaluate(
      'REPT({a}, 3)',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual('000');

    expect(evaluate(
      'REPT({b}, 3)',
      mergeContext({ a: 0, b: englishString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual('Welcome to join APITable TeamWelcome to join APITable TeamWelcome to join APITable Team');

    expect(evaluate(
      'REPT({d}, 3)',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toEqual('科科科');

    expect(() => evaluate(
      'REPT({a})',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toThrow(ParamsCountError);
  });

  it('SUBSTITUTE', () => {
    expect(evaluate(
      'SUBSTITUTE({b}, "小", "老")',
      mergeContext({ a: 0, b: '小胡，小张，小王', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('老胡，老张，老王');

    expect(evaluate(
      'SUBSTITUTE({b}, "little", "big", 2)',
      mergeContext({ a: 0, b: 'little tom，little mary，little lucy', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('little tom，big mary，little lucy');

    expect(evaluate(
      'SUBSTITUTE({b}, "little", "big", 4)',
      mergeContext({ a: 0, b: 'little tom，little mary，little lucy', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('little tom，little mary，little lucy');

    expect(evaluate(
      'SUBSTITUTE({b}, "little", "big", -1)',
      mergeContext({ a: 0, b: 'little tom，little mary，little lucy', c: 1591414562369, d: ['opt1'] }),
    )).toEqual('little tom，little mary，little lucy');

    expect(() => evaluate(
      'SUBSTITUTE({b}, "APITable")',
      mergeContext({ a: 0, b: chineseString, c: 1591414562369, d: ['opt1'] }),
    )).toThrow(ParamsCountError);
  });

});
