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

export const TriangleLeftFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3.53001 9.21012C2.74667 8.72054 2.74667 7.57971 3.53001 7.09012L10.0866 2.99225C10.9192 2.4719 11.9991 3.07046 11.9991 4.05225L11.9991 12.248C11.9991 13.2298 10.9192 13.8283 10.0866 13.308L3.53001 9.21012Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'triangle_left_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M3.53001 9.21012C2.74667 8.72054 2.74667 7.57971 3.53001 7.09012L10.0866 2.99225C10.9192 2.4719 11.9991 3.07046 11.9991 4.05225L11.9991 12.248C11.9991 13.2298 10.9192 13.8283 10.0866 13.308L3.53001 9.21012Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
