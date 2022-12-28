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

export const CollapseOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5.75 3C5.33579 3 5 3.33579 5 3.75C5 4.16421 5.33579 4.5 5.75 4.5H14.25C14.6642 4.5 15 4.16421 15 3.75C15 3.33579 14.6642 3 14.25 3H5.75ZM3.53908 8.5L4.45138 9.41229C4.74427 9.70519 4.74427 10.1801 4.45138 10.473C4.15848 10.7658 3.68361 10.7658 3.39071 10.473L1.26939 8.35163C0.976501 8.05874 0.976501 7.58387 1.26939 7.29097L3.39071 5.16965C3.68361 4.87676 4.15848 4.87676 4.45138 5.16965C4.74427 5.46254 4.74427 5.93742 4.45138 6.23031L3.68169 7H14.25C14.6642 7 15 7.33579 15 7.75C15 8.16421 14.6642 8.5 14.25 8.5H3.53908ZM5 11.75C5 11.3358 5.33579 11 5.75 11H14.25C14.6642 11 15 11.3358 15 11.75C15 12.1642 14.6642 12.5 14.25 12.5H5.75C5.33579 12.5 5 12.1642 5 11.75Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'collapse_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M5.75 3C5.33579 3 5 3.33579 5 3.75C5 4.16421 5.33579 4.5 5.75 4.5H14.25C14.6642 4.5 15 4.16421 15 3.75C15 3.33579 14.6642 3 14.25 3H5.75ZM3.53908 8.5L4.45138 9.41229C4.74427 9.70519 4.74427 10.1801 4.45138 10.473C4.15848 10.7658 3.68361 10.7658 3.39071 10.473L1.26939 8.35163C0.976501 8.05874 0.976501 7.58387 1.26939 7.29097L3.39071 5.16965C3.68361 4.87676 4.15848 4.87676 4.45138 5.16965C4.74427 5.46254 4.74427 5.93742 4.45138 6.23031L3.68169 7H14.25C14.6642 7 15 7.33579 15 7.75C15 8.16421 14.6642 8.5 14.25 8.5H3.53908ZM5 11.75C5 11.3358 5.33579 11 5.75 11H14.25C14.6642 11 15 11.3358 15 11.75C15 12.1642 14.6642 12.5 14.25 12.5H5.75C5.33579 12.5 5 12.1642 5 11.75Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
