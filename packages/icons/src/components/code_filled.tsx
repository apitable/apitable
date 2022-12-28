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

export const CodeFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.58699 1.94563C8.72993 1.41216 9.27827 1.09558 9.81173 1.23852C10.3452 1.38146 10.6618 1.9298 10.5188 2.46326L7.41301 14.0544C7.27007 14.5878 6.72173 14.9044 6.18827 14.7615C5.6548 14.6185 5.33822 14.0702 5.48116 13.5367L8.58699 1.94563ZM4.6967 4.30602C5.1011 4.71405 5.1011 5.37559 4.6967 5.78361L2.5 8L4.6967 10.2164C5.1011 10.6244 5.1011 11.286 4.6967 11.694C4.2923 12.102 3.63663 12.102 3.23223 11.694L0.303301 8.7388C-0.1011 8.33077 -0.1011 7.66923 0.303301 7.2612L3.23223 4.30602C3.63663 3.89799 4.2923 3.89799 4.6967 4.30602ZM11.3033 5.78361C10.8989 5.37559 10.8989 4.71405 11.3033 4.30602C11.7077 3.89799 12.3634 3.89799 12.7678 4.30602L15.6967 7.2612C16.1011 7.66923 16.1011 8.33077 15.6967 8.7388L12.7678 11.694C12.3634 12.102 11.7077 12.102 11.3033 11.694C10.8989 11.286 10.8989 10.6244 11.3033 10.2164L13.5 8L11.3033 5.78361Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'code_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M8.58699 1.94563C8.72993 1.41216 9.27827 1.09558 9.81173 1.23852C10.3452 1.38146 10.6618 1.9298 10.5188 2.46326L7.41301 14.0544C7.27007 14.5878 6.72173 14.9044 6.18827 14.7615C5.6548 14.6185 5.33822 14.0702 5.48116 13.5367L8.58699 1.94563ZM4.6967 4.30602C5.1011 4.71405 5.1011 5.37559 4.6967 5.78361L2.5 8L4.6967 10.2164C5.1011 10.6244 5.1011 11.286 4.6967 11.694C4.2923 12.102 3.63663 12.102 3.23223 11.694L0.303301 8.7388C-0.1011 8.33077 -0.1011 7.66923 0.303301 7.2612L3.23223 4.30602C3.63663 3.89799 4.2923 3.89799 4.6967 4.30602ZM11.3033 5.78361C10.8989 5.37559 10.8989 4.71405 11.3033 4.30602C11.7077 3.89799 12.3634 3.89799 12.7678 4.30602L15.6967 7.2612C16.1011 7.66923 16.1011 8.33077 15.6967 8.7388L12.7678 11.694C12.3634 12.102 11.7077 12.102 11.3033 11.694C10.8989 11.286 10.8989 10.6244 11.3033 10.2164L13.5 8L11.3033 5.78361Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
