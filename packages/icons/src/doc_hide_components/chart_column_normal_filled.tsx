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

export const ChartColumnNormalFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <rect x="12" y="39" width="12" height="29" rx="1" fill={ colors[0] }/>
    <rect x="34" y="12" width="12" height="56" rx="1" fill={ colors[0] }/>
    <rect x="56" y="29" width="12" height="39" rx="1" fill={ colors[0] }/>

  </>,
  name: 'chart_column_normal_filled',
  defaultColors: ['#7B67EE'],
  colorful: false,
  allPathData: [],
  width: '80',
  height: '80',
  viewBox: '0 0 80 80',
});
