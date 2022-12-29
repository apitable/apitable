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

export const TilingFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3 2C2.44772 2 2 2.44772 2 3V6C2 6.55228 2.44772 7 3 7H6C6.55228 7 7 6.55228 7 6V3C7 2.44772 6.55228 2 6 2H3ZM3 9C2.44772 9 2 9.44772 2 10V13C2 13.5523 2.44772 14 3 14H6C6.55228 14 7 13.5523 7 13V10C7 9.44772 6.55228 9 6 9H3ZM9 3C9 2.44772 9.44772 2 10 2H13C13.5523 2 14 2.44772 14 3V6C14 6.55228 13.5523 7 13 7H10C9.44772 7 9 6.55228 9 6V3ZM10 9C9.44772 9 9 9.44772 9 10V13C9 13.5523 9.44772 14 10 14H13C13.5523 14 14 13.5523 14 13V10C14 9.44772 13.5523 9 13 9H10Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'tiling_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M3 2C2.44772 2 2 2.44772 2 3V6C2 6.55228 2.44772 7 3 7H6C6.55228 7 7 6.55228 7 6V3C7 2.44772 6.55228 2 6 2H3ZM3 9C2.44772 9 2 9.44772 2 10V13C2 13.5523 2.44772 14 3 14H6C6.55228 14 7 13.5523 7 13V10C7 9.44772 6.55228 9 6 9H3ZM9 3C9 2.44772 9.44772 2 10 2H13C13.5523 2 14 2.44772 14 3V6C14 6.55228 13.5523 7 13 7H10C9.44772 7 9 6.55228 9 6V3ZM10 9C9.44772 9 9 9.44772 9 10V13C9 13.5523 9.44772 14 10 14H13C13.5523 14 14 13.5523 14 13V10C14 9.44772 13.5523 9 13 9H10Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
