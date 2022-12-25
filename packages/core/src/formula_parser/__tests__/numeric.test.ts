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

import { evaluate as _evaluate } from '../evaluate';
import { IFormulaContext } from '../functions/basic';
import { FieldType } from '../../types/field_types';
import { mergeContext } from './mock_state';
import { ParamsCountError } from '../errors/params_count.error';

const evaluate = (expression: string, ctx: Omit<IFormulaContext, 'field'>) => {
  const fieldMap = ctx.state.datasheetMap['dst123']!.datasheet!.snapshot.meta.fieldMap;
  // Convert each field
  for (const id in fieldMap) {
    if (fieldMap[id]!.type === FieldType.Text) {
      ctx.record.data[id] = [{ type: 1, text: ctx.record.data[id] }] as any;
    }

    if (ctx.record.data[id] && fieldMap[id]!.type === FieldType.MultiSelect) {
      fieldMap[id]!.property.options = (ctx.record.data[id] as any[]).map(v => {
        return { id: String(v), name: String(v), color: 0 };
      });
      ctx.record.data[id] = (ctx.record.data[id] as any[]).map(String);
    }
  }
  return _evaluate(expression, { ...ctx, field: fieldMap.x! }, true, true);
};

describe('Numeric function test', () => {
  it('SUM', () => {
    expect(evaluate(
      'SUM(1, 2, 3)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(6);

    expect(evaluate(
      'SUM(1.01, 1.02)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(2.03);

    // sum of array types
    expect(evaluate(
      'SUM({d})',
      mergeContext({ d: [0, 2, 3], b: '456', c: 1591414562369 }),
    )).toEqual(5);

    expect(evaluate(
      'SUM()',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(0);

    expect(evaluate(
      'SUM({d}, {b})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(456);
  });

  it('ABS', () => {
    expect(evaluate(
      'ABS(1, 2, 3)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(1);

    expect(evaluate(
      'ABS({a})',
      mergeContext({ a: -1, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(1);

    expect(() => evaluate(
      'ABS()',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toThrow('NaN');

    expect(() => evaluate(
      'ABS({d}, {d})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toThrow('NaN');
  });

  it('AVERAGE', () => {
    expect(evaluate(
      'AVERAGE(1, 2, 3)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(2);

    expect(evaluate(
      'AVERAGE(1.01, 1.02)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(1.015);

    expect(evaluate(
      'AVERAGE(1, {d}, 2)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(1.5);

    // sum of array types
    expect(evaluate(
      'AVERAGE({d})',
      mergeContext({ d: [1, 2, 3], b: '456', c: 1591414562369 }),
    )).toEqual(2);

    expect(evaluate(
      'AVERAGE()',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(0);

    expect(evaluate(
      'AVERAGE(a, b)',
      mergeContext({ a: 0, b: '8', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(4);

    expect(evaluate(
      'AVERAGE(c)',
      mergeContext({ a: 0, b: '8', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(0);
  });

  it('CEILING', () => {
    expect(evaluate(
      'CEILING(1.01)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(2);

    expect(evaluate(
      'CEILING(1.01, 0.1)',
      mergeContext({ a: [1, 2, 3], b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(1.1);

    expect(evaluate(
      'CEILING(1.01, 0.2)',
      mergeContext({ a: [1, 2, 3], b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(1.2);

    expect(evaluate(
      'CEILING(1.01, 0.00001)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(1.01);

    expect(evaluate(
      'CEILING(111.01, 10)',
      mergeContext({ a: 0, b: '8', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(120);

    expect(() => evaluate(
      'CEILING()',
      mergeContext({ a: 0, b: '8', c: 1591414562369, d: ['x', 'y'] }),
    )).toThrow(ParamsCountError);
  });

  it('FLOOR', () => {
    expect(evaluate(
      'FLOOR(1.01)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(1);

    expect(evaluate(
      'FLOOR(1.11, 0.1)',
      mergeContext({ a: [1, 2, 3], b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(1.1);

    expect(evaluate(
      'FLOOR(1.111111, 0.22345)',
      mergeContext({ a: [1, 2, 3], b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(0.8938);

    expect(evaluate(
      'FLOOR(1.01, 0.00001)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(1.01);

    expect(evaluate(
      'FLOOR(111.01, 10)',
      mergeContext({ a: 0, b: '8', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(110);

    expect(() => evaluate(
      'FLOOR()',
      mergeContext({ a: 0, b: '8', c: 1591414562369, d: ['x', 'y'] }),
    )).toThrow(ParamsCountError);
  });

  it('ROUND', () => {
    expect(evaluate(
      'ROUND(a)',
      mergeContext({ a: 1.49, b: 0, c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(1);

    expect(evaluate(
      'ROUND(a, b)',
      mergeContext({ a: 1.49, b: 0, c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(1);

    expect(evaluate(
      'ROUND(a, b)',
      mergeContext({ a: 1.99, b: 0, c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(2);

    expect(evaluate(
      'ROUND(a, b)',
      mergeContext({ a: -1.55, b: 1, c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(-1.5);

    expect(evaluate(
      'ROUND(a, b)',
      mergeContext({ a: -1.49, b: 1, c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(-1.5);

    expect(evaluate(
      'ROUND(a, b)',
      mergeContext({ a: 1.49, b: 1.2, c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(1.5);

    expect(evaluate(
      'ROUND(a, b)',
      mergeContext({ a: 1.49, b: 1.9, c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(1.5);

    expect(evaluate(
      'ROUND(a, b)',
      mergeContext({ a: 65.115, b: 2, c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(65.12);

    expect(() => evaluate(
      'ROUND()',
      mergeContext({ a: 0, b: '8', c: 1591414562369, d: ['x', 'y'] }),
    )).toThrow(ParamsCountError);
  });

  it('MAX', () => {
    expect(evaluate(
      'MAX(1, 2, 3)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(3);

    // array type
    expect(evaluate(
      'MAX({d})',
      mergeContext({ d: [1, 2, 3], b: '456', c: 1591414562369 }),
    )).toEqual(3);

    expect(evaluate(
      'MAX()',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(0);

    expect(evaluate(
      'MAX({a}, {b}, -1)',
      mergeContext({ a: 0, b: 'xx', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(0);

    expect(evaluate(
      'MAX({c})',
      mergeContext({ a: 0, b: '8', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(1591414562369);

    // Multiple datetimes can participate in the calculation
    expect(evaluate(
      'MAX({c}, {e})',
      mergeContext({ a: 0, b: '8', c: 1591414562369, e: 1691414562369 }),
    )).toEqual(1691414562369);

    // datetime + number, then filter out datetime
    expect(evaluate(
      'MAX({c}, {e}, {a})',
      mergeContext({ a: 0, b: '8', c: 1591414562369, e: 1691414562369 }),
    )).toEqual(0);

    expect(evaluate(
      'MAX({c}, {e}, {b})',
      mergeContext({ a: 0, b: '8', c: 1591414562369, e: 1691414562369 }),
    )).toEqual(8);
  });

  it('MIN', () => {
    expect(evaluate(
      'MIN(1, 2, 3)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(1);

    // array type
    expect(evaluate(
      'MIN({d})',
      mergeContext({ d: [1, 2, 3], b: '456', c: 1591414562369 }),
    )).toEqual(1);

    expect(evaluate(
      'MIN()',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(0);

    expect(evaluate(
      'MIN(a, b, -1)',
      mergeContext({ a: 0, b: 'xx', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(-1);

    expect(evaluate(
      'MIN(c)',
      mergeContext({ a: 0, b: '8', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(1591414562369);

    // Multiple datetimes can participate in the calculation
    expect(evaluate(
      'MIN(c, e)',
      mergeContext({ a: 0, b: '8', c: 1591414562369, e: 1691414562369 }),
    )).toEqual(1591414562369);

    // datetime + number, then filter out datetime
    expect(evaluate(
      'MIN(c, e, a)',
      mergeContext({ a: 0, b: '8', c: 1591414562369, e: 1691414562369 }),
    )).toEqual(0);

    expect(evaluate(
      'MIN(c, e, b)',
      mergeContext({ a: 0, b: '8', c: 1591414562369, e: 1691414562369 }),
    )).toEqual(8);
  });

  it('LOG', () => {
    expect(evaluate(
      'LOG(1024, 2)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(10);

    // array type
    expect(evaluate(
      'LOG(10000)',
      mergeContext({ a: [1, 2, 3], b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(4);

    expect(() => evaluate(
      'LOG()',
      mergeContext({ a: 0, b: '8', c: 1591414562369, d: ['x', 'y'] }),
    )).toThrow(ParamsCountError);
  });

  it('INT', () => {
    expect(evaluate(
      'INT(1.01)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(1);

    expect(evaluate(
      'INT(-1.11)',
      mergeContext({ a: [1, 2, 3], b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(-2);

    expect(() => evaluate(
      'INT()',
      mergeContext({ a: 0, b: '8', c: 1591414562369, d: ['x', 'y'] }),
    )).toThrow(ParamsCountError);
  });

  it('EXP', () => {
    expect(evaluate(
      'EXP(1)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(Math.E);

    expect(evaluate(
      'EXP(0)',
      mergeContext({ a: [1, 2, 3], b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(1);

    expect(() => evaluate(
      'EXP()',
      mergeContext({ a: 0, b: '8', c: 1591414562369, d: ['x', 'y'] }),
    )).toThrow(ParamsCountError);
  });

  it('EVEN', () => {
    expect(evaluate(
      'EVEN(3.1)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(4);

    expect(evaluate(
      'EVEN(0.1)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(2);

    expect(evaluate(
      'EVEN(-2.9)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(-4);

    expect(evaluate(
      'EVEN(-3.1)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(-4);

    expect(evaluate(
      'EVEN(0)',
      mergeContext({ a: [1, 2, 3], b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(0);

    expect(() => evaluate(
      'EVEN()',
      mergeContext({ a: 0, b: '8', c: 1591414562369, d: ['x', 'y'] }),
    )).toThrow(ParamsCountError);
  });

  it('ODD', () => {
    expect(evaluate(
      'ODD(1.9)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(3);

    expect(evaluate(
      'ODD(2.1)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(3);

    expect(evaluate(
      'ODD(-1.9)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(-3);

    expect(evaluate(
      'ODD(-2.1)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(-3);

    expect(evaluate(
      'ODD(0)',
      mergeContext({ a: [1, 2, 3], b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(1);

    expect(() => evaluate(
      'ODD()',
      mergeContext({ a: 0, b: '8', c: 1591414562369, d: ['x', 'y'] }),
    )).toThrow(ParamsCountError);
  });

  it('COUNT', () => {
    expect(evaluate(
      'COUNT(1, 2, 3)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(3);

    expect(evaluate(
      'COUNT(1, "2", 3)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(2);

    expect(evaluate(
      'COUNT(1, c, 3)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(2);

    expect(evaluate(
      'COUNT(1, 2, 3, "")',
      // tslint:disable-next-line: max-line-length
      mergeContext({ d: [1, 2, 3, null], b: '456', c: 1591414562369 }),
    )).toEqual(3);

    expect(evaluate(
      'COUNT(a, 1)',
      // tslint:disable-next-line: max-line-length
      mergeContext({ a: [1, 2, 3, null], b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(1);

    expect(evaluate(
      'COUNT()',
      mergeContext({ a: 0, b: '8', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(0);
  });

  it('COUNTA', () => {
    expect(evaluate(
      'COUNTA(1, 2, 3)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(3);

    expect(evaluate(
      'COUNTA(1, "", "2", 3)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(3);

    expect(evaluate(
      'COUNTA(1, "", "2", 3, {f})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'], f: false }),
    )).toEqual(3);

    expect(evaluate(
      'COUNTA(1, "", "2", 3, {f})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'], f: true }),
    )).toEqual(4);

    expect(evaluate(
      'COUNTA(d)',
      mergeContext({ d: [1, 2, 3, ''], b: '456', c: 1591414562369 }),
    )).toEqual(3);

    expect(evaluate(
      'COUNTA(d, 1)',
      mergeContext({ d: [1, 2, 3, ''], b: '456', c: 1591414562369 }),
    )).toEqual(2);

    expect(evaluate(
      'COUNTA()',
      mergeContext({ a: 0, b: '8', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(0);
  });

  it('COUNTALL', () => {
    expect(evaluate(
      'COUNTALL(1, 2, 3)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(3);

    expect(evaluate(
      'COUNTALL(1, "", "2", 3)',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(4);

    expect(evaluate(
      'COUNTALL(d)',
      mergeContext({ d: [1, 2, 3, null], b: '456', c: 1591414562369 }),
    )).toEqual(4);

    expect(evaluate(
      'COUNTALL(a, 1, 0)',
      mergeContext({ a: [1, 2, 3, null], b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(3);

    expect(evaluate(
      'COUNTALL(d)',
      mergeContext({ b: '456', c: 1591414562369, d: [] }),
    )).toEqual(0);

    expect(evaluate(
      'COUNTALL(a)',
      mergeContext({ b: '456', c: 1591414562369, d: [] }),
    )).toEqual(1);

    expect(evaluate(
      'COUNTALL()',
      mergeContext({ a: 0, b: '8', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(0);
  });

  it('ROUNDUP', () => {
    expect(evaluate(
      'ROUNDUP({a})',
      mergeContext({ a: 1.11, b: 0, c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(2);

    expect(evaluate(
      'ROUNDUP({a}, {b})',
      mergeContext({ a: 1.11, b: 0, c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(2);

    expect(evaluate(
      'ROUNDUP({a}, {b})',
      mergeContext({ a: 1.11, b: 1, c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(1.2);

    expect(evaluate(
      'ROUNDUP({a}, {b})',
      mergeContext({ a: -1.11, b: 0, c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(-2);

    expect(() => evaluate(
      'ROUNDUP()',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toThrow(ParamsCountError);
  });

  it('ROUNDDOWN', () => {
    expect(evaluate(
      'ROUNDDOWN({a})',
      mergeContext({ a: 1.11, b: 0, c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(1);

    expect(evaluate(
      'ROUNDDOWN({a}, {b})',
      mergeContext({ a: 1.11, b: 0, c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(1);

    expect(evaluate(
      'ROUNDDOWN({a}, {b})',
      mergeContext({ a: 1.11, b: 1, c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(1.1);

    expect(evaluate(
      'ROUNDDOWN({a}, {b})',
      mergeContext({ a: -1.11, b: 0, c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(-1);

    expect(() => evaluate(
      'ROUNDDOWN()',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toThrow(ParamsCountError);
  });

  it('POWER', () => {
    expect(evaluate(
      'POWER({a}, {b})',
      mergeContext({ a: 10, b: 2, c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(100);

    expect(evaluate(
      'POWER({a}, {b})',
      mergeContext({ a: 10, b: -2, c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(0.01);

    expect(evaluate(
      'POWER({a}, {b})',
      mergeContext({ a: -10, b: 3, c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(-1000);

    expect(() => evaluate(
      'POWER({a})',
      mergeContext({ a: 1, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toThrow(ParamsCountError);
  });

  it('SQRT', () => {
    expect(evaluate(
      'SQRT({a})',
      mergeContext({ a: 10000, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(100);

    expect(() => evaluate(
      'SQRT({a})',
      mergeContext({ a: -10000, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toThrow('NaN');

    expect(() => evaluate(
      'SQRT()',
      mergeContext({ a: 1, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toThrow(ParamsCountError);
  });

  it('MOD', () => {
    expect(evaluate(
      'MOD({a}, {b})',
      mergeContext({ a: 5, b: 2, c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(1);

    expect(evaluate(
      'MOD({a}, {b})',
      mergeContext({ a: 5, b: 5, c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(0);

    expect(evaluate(
      'MOD({a}, {b})',
      mergeContext({ a: -5, b: 2, c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(1);

    expect(() => evaluate(
      'MOD({a})',
      mergeContext({ a: 1, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toThrow(ParamsCountError);
  });

  it('VALUE', () => {
    expect(evaluate(
      'VALUE({b})',
      mergeContext({ a: 5, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(456);

    expect(evaluate(
      'VALUE({b})',
      mergeContext({ a: -5, b: '-456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(-456);

    expect(evaluate(
      'VALUE({b})',
      mergeContext({ a: -5, b: 'ss456', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(456);

    expect(evaluate(
      'VALUE({b})',
      mergeContext({ a: -5, b: 'ss456.123', c: 1591414562369, d: ['x', 'y'] }),
    )).toEqual(456.123);

    expect(() => evaluate(
      'VALUE()',
      mergeContext({ a: 1, b: '456', c: 1591414562369, d: ['x', 'y'] }),
    )).toThrow(ParamsCountError);
  });
});
