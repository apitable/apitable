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

export const NavDrawerOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M21 5H3C2.4 5 2 5.4 2 6C2 6.6 2.4 7 3 7H21C21.6 7 22 6.6 22 6C22 5.4 21.6 5 21 5ZM15 11H3C2.4 11 2 11.4 2 12C2 12.6 2.4 13 3 13H15C15.6 13 16 12.6 16 12C16 11.4 15.6 11 15 11ZM3 17H9C9.6 17 10 17.4 10 18C10 18.6 9.6 19 9 19H3C2.4 19 2 18.6 2 18C2 17.4 2.4 17 3 17Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'nav_drawer_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M21 5H3C2.4 5 2 5.4 2 6C2 6.6 2.4 7 3 7H21C21.6 7 22 6.6 22 6C22 5.4 21.6 5 21 5ZM15 11H3C2.4 11 2 11.4 2 12C2 12.6 2.4 13 3 13H15C15.6 13 16 12.6 16 12C16 11.4 15.6 11 15 11ZM3 17H9C9.6 17 10 17.4 10 18C10 18.6 9.6 19 9 19H3C2.4 19 2 18.6 2 18C2 17.4 2.4 17 3 17Z'],
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
});
