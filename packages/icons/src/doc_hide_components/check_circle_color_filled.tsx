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

export const CheckCircleColorFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M5.40533 7.09467C5.11244 6.80177 4.63757 6.80177 4.34467 7.09467C4.05178 7.38756 4.05178 7.86243 4.34467 8.15533L6.84465 10.6553C6.98968 10.8004 7.18778 10.8797 7.39282 10.8748C7.59787 10.8699 7.79197 10.7813 7.92994 10.6295L11.68 6.50451C11.9586 6.19802 11.936 5.72368 11.6295 5.44505C11.323 5.16642 10.8487 5.18901 10.5701 5.4955L7.34913 9.03848L5.40533 7.09467Z" fill={ colors[1] }/>

  </>,
  name: 'check_circle_color_filled',
  defaultColors: ['#3CD6A3', 'white'],
  colorful: true,
  allPathData: ['M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z', 'M5.40533 7.09467C5.11244 6.80177 4.63757 6.80177 4.34467 7.09467C4.05178 7.38756 4.05178 7.86243 4.34467 8.15533L6.84465 10.6553C6.98968 10.8004 7.18778 10.8797 7.39282 10.8748C7.59787 10.8699 7.79197 10.7813 7.92994 10.6295L11.68 6.50451C11.9586 6.19802 11.936 5.72368 11.6295 5.44505C11.323 5.16642 10.8487 5.18901 10.5701 5.4955L7.34913 9.03848L5.40533 7.09467Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
