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

export const TriangleDown16Filled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7.72864 11.2992C7.85398 11.4997 8.14603 11.4997 8.27136 11.2992L11.694 5.82296C11.8272 5.60982 11.674 5.33336 11.4226 5.33336H4.57736C4.32602 5.33336 4.17279 5.60982 4.306 5.82296L7.72864 11.2992Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'triangle_down_16_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M7.72864 11.2992C7.85398 11.4997 8.14603 11.4997 8.27136 11.2992L11.694 5.82296C11.8272 5.60982 11.674 5.33336 11.4226 5.33336H4.57736C4.32602 5.33336 4.17279 5.60982 4.306 5.82296L7.72864 11.2992Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
