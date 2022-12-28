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

export const MenuOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3 5H13C13.6 5 14 4.6 14 4C14 3.4 13.6 3 13 3H3C2.4 3 2 3.4 2 4C2 4.6 2.4 5 3 5ZM3 9H10C10.6 9 11 8.6 11 8C11 7.4 10.6 7 10 7H3C2.4 7 2 7.4 2 8C2 8.6 2.4 9 3 9ZM3 11H13C13.6 11 14 11.4 14 12C14 12.6 13.6 13 13 13H3C2.4 13 2 12.6 2 12C2 11.4 2.4 11 3 11Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'menu_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M3 5H13C13.6 5 14 4.6 14 4C14 3.4 13.6 3 13 3H3C2.4 3 2 3.4 2 4C2 4.6 2.4 5 3 5ZM3 9H10C10.6 9 11 8.6 11 8C11 7.4 10.6 7 10 7H3C2.4 7 2 7.4 2 8C2 8.6 2.4 9 3 9ZM3 11H13C13.6 11 14 11.4 14 12C14 12.6 13.6 13 13 13H3C2.4 13 2 12.6 2 12C2 11.4 2.4 11 3 11Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
