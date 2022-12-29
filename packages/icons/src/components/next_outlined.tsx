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

export const NextOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2.58579 6.58579C1.80474 7.36684 1.80474 8.63316 2.58579 9.41421L32.9914 39.8198L2.58579 70.2254C1.80474 71.0064 1.80474 72.2728 2.58579 73.0538C3.36683 73.8349 4.63317 73.8349 5.41421 73.0538L37.234 41.234C38.0151 40.453 38.0151 39.1866 37.234 38.4056L5.41421 6.58579C4.63316 5.80474 3.36684 5.80474 2.58579 6.58579Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'next_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M2.58579 6.58579C1.80474 7.36684 1.80474 8.63316 2.58579 9.41421L32.9914 39.8198L2.58579 70.2254C1.80474 71.0064 1.80474 72.2728 2.58579 73.0538C3.36683 73.8349 4.63317 73.8349 5.41421 73.0538L37.234 41.234C38.0151 40.453 38.0151 39.1866 37.234 38.4056L5.41421 6.58579C4.63316 5.80474 3.36684 5.80474 2.58579 6.58579Z'],
  width: '80',
  height: '80',
  viewBox: '0 0 80 80',
});
