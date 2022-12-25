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

// rc(series colors)
const FC_COLORS = [
  '#30C28B',
  '#6E382D',
  '#B35FF5',
  '#FFEB3A',
  '#5586FF',
  '#52C41B',
  '#FF7A00',
  '#FF708B',
  '#E33E38',
  '#55CDFF',
  '#7B67EE',
  '#FFAB00',
];

// Generate color rules: pass in a string.
export const getAvatarRandomColor = (str: string) => {
  const index = str.charCodeAt(Math.floor(str.length / 2)); // Used to generate colors, taking the unicode value of the middle byte of the string.
  return FC_COLORS[index % FC_COLORS.length];
};

export const getFirstWordFromString = (str: string) => {
  if (!str.length) return '';
  const codePoint = str.codePointAt(0);
  if (!codePoint) return '';
  return String.fromCodePoint(codePoint);
};