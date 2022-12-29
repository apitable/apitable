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

export const TriangleRight10Filled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.59296 4.7456C8.78096 4.86311 8.78096 5.1369 8.59296 5.2544L1.459 9.71313C1.25918 9.83801 1 9.69436 1 9.45873V0.541278C1 0.305648 1.25919 0.161995 1.459 0.286879L8.59296 4.7456Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'triangle_right_10_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M8.59296 4.7456C8.78096 4.86311 8.78096 5.1369 8.59296 5.2544L1.459 9.71313C1.25918 9.83801 1 9.69436 1 9.45873V0.541278C1 0.305648 1.25919 0.161995 1.459 0.286879L8.59296 4.7456Z'],
  width: '10',
  height: '10',
  viewBox: '0 0 10 10',
});
