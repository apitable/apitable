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

import { hexToRGB } from '../color_utils';
describe('hex to rgba', () => {
  test('should right to convert', function () {
    expect(hexToRGB('#f7f6fa')).toBe('rgba(247,246,250,1)');
  });

  test('is right opacity', function () {
    expect(hexToRGB('#f7f6fa', 20)).toBe('rgba(247,246,250,1)');
  });

  test('is right opacity', function () {
    expect(hexToRGB('#f7f6fa', 0.33)).toBe('rgba(247,246,250,0.3)');
  });

  test('is right opacity', function () {
    expect(hexToRGB('#f7f6fa', 1)).toBe('rgba(247,246,250,1)');
  });
});
