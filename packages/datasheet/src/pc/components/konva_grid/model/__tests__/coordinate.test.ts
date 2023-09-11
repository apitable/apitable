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

import { Coordinate } from '../coordinate';

const initState = {
  rowHeight: 32,
  columnWidth: 100,
  rowCount: 10000,
  columnCount: 10000,
  containerWidth: 1000,
  containerHeight: 800,
  rowInitSize: 40,
  columnInitSize: 32,
  rowIndicesMap: {
    0: 16,
    1: 64,
  },
  columnIndicesMap: {
    0: 200,
    1: 400,
  },
};

const coordinate = new Coordinate(initState);

describe('test coordinate', () => {
  // Get column offset
  it('get column offset', () => {
    expect(coordinate.getColumnOffset(0)).toBe(32);

    expect(coordinate.getColumnOffset(5000)).toBe(500432);

    expect(coordinate.getColumnOffset(10000)).toBe(1000432);
  });

  // Get row offset
  it('get row offset', () => {
    expect(coordinate.getRowOffset(0)).toBe(40);

    expect(coordinate.getRowOffset(5000)).toBe(160056);

    expect(coordinate.getRowOffset(10000)).toBe(320056);
  });

  // Get the index of the first column in the visible range based on the horizontal scroll position
  it('get column start index', () => {
    expect(coordinate.getColumnStartIndex(0)).toBe(0);

    expect(coordinate.getColumnStartIndex(10000)).toBe(95);

    expect(coordinate.getColumnStartIndex(20000)).toBe(195);
  });

  // Get the index of the last column in the visible range based on the horizontal scroll position
  it('get column stop index', () => {
    expect(coordinate.getColumnStopIndex(0, 0)).toBe(5);

    expect(coordinate.getColumnStopIndex(95, 10000)).toBe(105);

    expect(coordinate.getColumnStopIndex(195, 20000)).toBe(205);
  });

  // Get the index of the first row in the visible range based on the vertical scroll position
  it('get row start index', () => {
    expect(coordinate.getRowStartIndex(0)).toBe(0);

    expect(coordinate.getRowStartIndex(10000)).toBe(310);

    expect(coordinate.getRowStartIndex(20000)).toBe(623);
  });

  // Get the index of the last row in the visible range based on the vertical scroll position
  it('get row stop index', () => {
    expect(coordinate.getRowStopIndex(0, 0)).toBe(23);

    expect(coordinate.getRowStopIndex(310, 10000)).toBe(335);

    expect(coordinate.getRowStopIndex(623, 20000)).toBe(648);
  });
});
