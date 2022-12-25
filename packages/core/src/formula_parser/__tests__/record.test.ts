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

describe('Record function test', () => {
  it('RECORD_ID', () => {
    expect(evaluate(
      'RECORD_ID()',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual('xyz');

    expect(evaluate(
      'RECORD_ID({a})',
      mergeContext({ a: 0, b: '456', c: 1591414562369, d: ['opt1', 'opt2'] }),
    )).toEqual('xyz');
  });
});
