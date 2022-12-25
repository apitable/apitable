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

import { mergeContext, evaluate } from './mock_state';

describe('Array function test', () => {
  it('ARRAYJOIN', () => {
    expect(evaluate(
      'ARRAYJOIN({d})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt4', 'opt5'] }),
    )).toEqual('the first, the second');

    expect(evaluate(
      'ARRAYJOIN({d}, ";")',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt4', 'opt5'] }),
    )).toEqual('the first;the second');
  });

  it('ARRAYUNIQUE', () => {
    expect(evaluate(
      'ARRAYUNIQUE({d})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt4', 'opt5', 'opt4'] }),
    )).toEqual(['the first', 'the second']);

    expect(evaluate(
      'ARRAYUNIQUE({b}, {d})',
      mergeContext({ a: 0, b: 'the first', c: 1591414562369, d: ['opt4', 'opt5', 'opt4'] }),
    )).toEqual(['the first', 'the second']);
  });

  it('ARRAYFLATTEN', () => {
    expect(evaluate(
      'ARRAYFLATTEN({d}, {d})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt4', 'opt5'] }),
    )).toEqual(['the first', 'the second', 'the first', 'the second']);
  });
});
