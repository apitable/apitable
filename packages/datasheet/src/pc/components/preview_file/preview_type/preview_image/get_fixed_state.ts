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

function fixPoint(key: 'x' | 'y', offset: number, width: number, containerWidth: number) {
  const maxOffset = (width - containerWidth) / 2;

  const negative = offset > 0 ? 1 : -1;

  if (width <= containerWidth) {
    return {
      [key]: 0,
    };
  }

  if (Math.abs(offset) > maxOffset) {
    return {
      [key]: Math.floor(negative * maxOffset),
    };
  }

  return { [key]: Math.floor(offset) };
}

export default function getFixedState(
  width: number,
  height: number,
  x: number,
  y: number,
  containerWidth: number,
  containerHeight: number,
): { [x: string]: number } {
  if (width <= containerWidth && height <= containerHeight) {
    return {
      x: 0,
      y: 0,
    };
  }

  return {
    ...fixPoint('x', x, width, containerWidth),
    ...fixPoint('y', y, height, containerHeight),
  };
}
