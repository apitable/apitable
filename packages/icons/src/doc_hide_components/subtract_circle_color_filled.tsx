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

export const SubtractCircleColorFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <circle cx="8" cy="8" r="7" fill={ colors[0] }/>
    <path d="M5.5 8H10.5" stroke={ colors[1] } strokeWidth="1.5" strokeLinecap="round"/>

  </>,
  name: 'subtract_circle_color_filled',
  defaultColors: ['#4D4D4D', 'white'],
  colorful: true,
  allPathData: ['M5.5 8H10.5'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
