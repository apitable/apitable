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
    <path d="M5.25 3.75C5.25 3.33579 5.58579 3 6 3H14.25C14.6642 3 15 3.33579 15 3.75C15 4.16421 14.6642 4.5 14.25 4.5H6C5.58579 4.5 5.25 4.16421 5.25 3.75Z" fill={ colors[0] }/>
    <path d="M4.53033 5.21967C4.82322 5.51256 4.82322 5.98744 4.53033 6.28033L3.81066 7H14.25C14.6642 7 15 7.33579 15 7.75C15 8.16421 14.6642 8.5 14.25 8.5H3.81066L4.53033 9.21967C4.82322 9.51256 4.82322 9.98744 4.53033 10.2803C4.23744 10.5732 3.76256 10.5732 3.46967 10.2803L1.46967 8.28033C1.17678 7.98744 1.17678 7.51256 1.46967 7.21967L3.46967 5.21967C3.76256 4.92678 4.23744 4.92678 4.53033 5.21967Z" fill={ colors[0] }/>
    <path d="M6 11C5.58579 11 5.25 11.3358 5.25 11.75C5.25 12.1642 5.58579 12.5 6 12.5H14.25C14.6642 12.5 15 12.1642 15 11.75C15 11.3358 14.6642 11 14.25 11H6Z" fill={ colors[0] }/>

  </>,
  name: 'collapse_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M5.25 3.75C5.25 3.33579 5.58579 3 6 3H14.25C14.6642 3 15 3.33579 15 3.75C15 4.16421 14.6642 4.5 14.25 4.5H6C5.58579 4.5 5.25 4.16421 5.25 3.75Z', 'M4.53033 5.21967C4.82322 5.51256 4.82322 5.98744 4.53033 6.28033L3.81066 7H14.25C14.6642 7 15 7.33579 15 7.75C15 8.16421 14.6642 8.5 14.25 8.5H3.81066L4.53033 9.21967C4.82322 9.51256 4.82322 9.98744 4.53033 10.2803C4.23744 10.5732 3.76256 10.5732 3.46967 10.2803L1.46967 8.28033C1.17678 7.98744 1.17678 7.51256 1.46967 7.21967L3.46967 5.21967C3.76256 4.92678 4.23744 4.92678 4.53033 5.21967Z', 'M6 11C5.58579 11 5.25 11.3358 5.25 11.75C5.25 12.1642 5.58579 12.5 6 12.5H14.25C14.6642 12.5 15 12.1642 15 11.75C15 11.3358 14.6642 11 14.25 11H6Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
