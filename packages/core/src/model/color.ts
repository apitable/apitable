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

import Color from 'color';
import { COLOR_MAP } from './_colors';

const COLOR_INDEX_NAME = ['deepPurple', 'indigo', 'blue', 'teal', 'green', 'yellow', 'orange', 'tangerine', 'pink', 'red'];

// five level alpha transparency
const COLOR_LEVEL_ALPHA = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1];

const rgba2hex = (foregroundColor: string, backgroundColor = '#FFFFFF') => {
  const getAdjustedChannel = (fValue: number, bValue: number, opacity: number) => opacity * fValue + (1 - opacity) * bValue;
  const fc = Color(foregroundColor);
  const bc = Color(backgroundColor);
  const opacity = fc.alpha();
  const adjustedColor = Color([
    getAdjustedChannel(fc.red(), bc.red(), opacity),
    getAdjustedChannel(fc.green(), bc.green(), opacity),
    getAdjustedChannel(fc.blue(), bc.blue(), opacity),
  ]);
  return adjustedColor.hex();
};

export const getColorValue = (color: string, alpha: number) => {
  return rgba2hex(Color(color).alpha(alpha).string());
};

/**
 * get single or multiple color object, transformed by color number
 *
 * 0 => deepPurple_1
 * 10 => deepPurple_2
 * 11 => indigo_2
 * @param index option.color
 */
export function getFieldOptionColor(index: number) {
  const hue = COLOR_INDEX_NAME[index % COLOR_INDEX_NAME.length]!;
  const level = Math.floor(index / COLOR_INDEX_NAME.length);
  const baseColorValue = COLOR_MAP[hue];
  const value = getColorValue(baseColorValue, COLOR_LEVEL_ALPHA[level]!);
  return {
    name: `${hue}_${level}`,
    value,
  };
}

/**
 * get all color name array, index is color number
 */
export const getColorNames = () => {
  const colorNames: string[] = [];
  const colorNumMax = COLOR_INDEX_NAME.length * COLOR_LEVEL_ALPHA.length;
  for(let i=0; i<colorNumMax; i++) {
    const hue = COLOR_INDEX_NAME[i % COLOR_INDEX_NAME.length];
    const level = Math.floor(i / COLOR_INDEX_NAME.length);
    colorNames.push(`${hue}_${level}`);
  }
  return colorNames;
};
