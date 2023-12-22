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

import { str2text } from '..';
import assert from 'assert';
import * as cases from './other2text.test.json';

describe('test convert text to number', () => {
  it('should convert string to number correctly', () => {
    const { validCases, invalidCases } = cases;
    for (let i = 0; i < invalidCases.length; i++) {
      const { args, expected } = invalidCases[i]!;
      const result = str2text.apply(null, args as [string]);
      assert.deepEqual(result, expected, `bad case: str2text(${args.join(',')})`);
    }

    for (let i = 0; i < validCases.length; i++) {
      const { args, expected } = validCases[i]!;
      const result = str2text.apply(null, args as [string]);
      assert.deepEqual(result, expected, `bad case: str2text(${args.join(',')})`);
    }
  });
});
