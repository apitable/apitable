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

export const TriangleDownFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M9.21011 12.47C8.72052 13.2533 7.57969 13.2533 7.09011 12.47L2.99223 5.91339C2.47188 5.08083 3.07044 4.00089 4.05223 4.00089L12.248 4.00089C13.2298 4.00089 13.8283 5.08083 13.308 5.91339L9.21011 12.47Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'triangle_down_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M9.21011 12.47C8.72052 13.2533 7.57969 13.2533 7.09011 12.47L2.99223 5.91339C2.47188 5.08083 3.07044 4.00089 4.05223 4.00089L12.248 4.00089C13.2298 4.00089 13.8283 5.08083 13.308 5.91339L9.21011 12.47Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
