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

export const TriangleRightFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M12.47 7.08993C13.2534 7.57951 13.2534 8.72034 12.47 9.20992L5.91341 13.3078C5.08085 13.8281 4.00092 13.2296 4.00092 12.2478L4.00092 4.05205C4.00092 3.07025 5.08086 2.4717 5.91341 2.99205L12.47 7.08993Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'triangle_right_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M12.47 7.08993C13.2534 7.57951 13.2534 8.72034 12.47 9.20992L5.91341 13.3078C5.08085 13.8281 4.00092 13.2296 4.00092 12.2478L4.00092 4.05205C4.00092 3.07025 5.08086 2.4717 5.91341 2.99205L12.47 7.08993Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
