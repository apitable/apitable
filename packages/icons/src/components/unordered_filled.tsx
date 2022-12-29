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

/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const UnorderedFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3 3C2.44772 3 2 3.44772 2 4C2 4.55228 2.44772 5 3 5C3.55228 5 4 4.55228 4 4C4 3.44772 3.55228 3 3 3ZM6 3C5.44772 3 5 3.44772 5 4C5 4.55228 5.44772 5 6 5H13C13.5523 5 14 4.55228 14 4C14 3.44772 13.5523 3 13 3H6ZM2 8C2 7.44772 2.44772 7 3 7C3.55228 7 4 7.44772 4 8C4 8.55228 3.55228 9 3 9C2.44772 9 2 8.55228 2 8ZM3 11C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13C3.55228 13 4 12.5523 4 12C4 11.4477 3.55228 11 3 11ZM5 8C5 7.44772 5.44772 7 6 7H13C13.5523 7 14 7.44772 14 8C14 8.55228 13.5523 9 13 9H6C5.44772 9 5 8.55228 5 8ZM6 11C5.44772 11 5 11.4477 5 12C5 12.5523 5.44772 13 6 13H13C13.5523 13 14 12.5523 14 12C14 11.4477 13.5523 11 13 11H6Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'unordered_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M3 3C2.44772 3 2 3.44772 2 4C2 4.55228 2.44772 5 3 5C3.55228 5 4 4.55228 4 4C4 3.44772 3.55228 3 3 3ZM6 3C5.44772 3 5 3.44772 5 4C5 4.55228 5.44772 5 6 5H13C13.5523 5 14 4.55228 14 4C14 3.44772 13.5523 3 13 3H6ZM2 8C2 7.44772 2.44772 7 3 7C3.55228 7 4 7.44772 4 8C4 8.55228 3.55228 9 3 9C2.44772 9 2 8.55228 2 8ZM3 11C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13C3.55228 13 4 12.5523 4 12C4 11.4477 3.55228 11 3 11ZM5 8C5 7.44772 5.44772 7 6 7H13C13.5523 7 14 7.44772 14 8C14 8.55228 13.5523 9 13 9H6C5.44772 9 5 8.55228 5 8ZM6 11C5.44772 11 5 11.4477 5 12C5 12.5523 5.44772 13 6 13H13C13.5523 13 14 12.5523 14 12C14 11.4477 13.5523 11 13 11H6Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
