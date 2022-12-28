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

export const ChartBarStackFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <rect x="39" y="12" width="12" height="27" rx="1" transform="rotate(90 39 12)" fill={ colors[2] }/>
    <path d="M20 12L20 24L13 24C12.4477 24 12 23.5523 12 23L12 13C12 12.4477 12.4477 12 13 12L20 12Z" fill={ colors[0] }/>
    <rect x="32" y="12" width="12" height="12" transform="rotate(90 32 12)" fill={ colors[1] }/>
    <rect x="68" y="34" width="12" height="56" rx="1" transform="rotate(90 68 34)" fill={ colors[2] }/>
    <path d="M45 34L45 46L13 46C12.4477 46 12 45.5523 12 45L12 35C12 34.4477 12.4477 34 13 34L45 34Z" fill={ colors[0] }/>
    <rect x="56" y="34" width="12" height="11" transform="rotate(90 56 34)" fill={ colors[1] }/>
    <rect x="51" y="56" width="12" height="39" rx="1" transform="rotate(90 51 56)" fill={ colors[2] }/>
    <path d="M32 56L32 68L13 68C12.4477 68 12 67.5523 12 67L12 57C12 56.4477 12.4477 56 13 56L32 56Z" fill={ colors[0] }/>
    <rect x="40" y="56" width="12" height="8" transform="rotate(90 40 56)" fill={ colors[1] }/>

  </>,
  name: 'chart_bar_stack_filled',
  defaultColors: ['#7B67EE', '#9CB9FF', '#FFBA2E'],
  colorful: true,
  allPathData: ['M20 12L20 24L13 24C12.4477 24 12 23.5523 12 23L12 13C12 12.4477 12.4477 12 13 12L20 12Z', 'M45 34L45 46L13 46C12.4477 46 12 45.5523 12 45L12 35C12 34.4477 12.4477 34 13 34L45 34Z', 'M32 56L32 68L13 68C12.4477 68 12 67.5523 12 67L12 57C12 56.4477 12.4477 56 13 56L32 56Z'],
  width: '80',
  height: '80',
  viewBox: '0 0 80 80',
});
