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
    <path d="M23 39H13C12.4477 39 12 39.4477 12 40V67C12 67.5523 12.4477 68 13 68H23C23.5523 68 24 67.5523 24 67V40C24 39.4477 23.5523 39 23 39Z" fill={ colors[1] }/>
    <path d="M45 12H35C34.4477 12 34 12.4477 34 13V67C34 67.5523 34.4477 68 35 68H45C45.5523 68 46 67.5523 46 67V13C46 12.4477 45.5523 12 45 12Z" fill={ colors[0] }/>
    <path d="M67 29H57C56.4477 29 56 29.4477 56 30V67C56 67.5523 56.4477 68 57 68H67C67.5523 68 68 67.5523 68 67V30C68 29.4477 67.5523 29 67 29Z" fill={ colors[1] }/>

  </>,
  name: 'chart_column_normal_filled',
  defaultColors: ['#7966EB', '#7B67EE'],
  colorful: true,
  allPathData: ['M23 39H13C12.4477 39 12 39.4477 12 40V67C12 67.5523 12.4477 68 13 68H23C23.5523 68 24 67.5523 24 67V40C24 39.4477 23.5523 39 23 39Z', 'M45 12H35C34.4477 12 34 12.4477 34 13V67C34 67.5523 34.4477 68 35 68H45C45.5523 68 46 67.5523 46 67V13C46 12.4477 45.5523 12 45 12Z', 'M67 29H57C56.4477 29 56 29.4477 56 30V67C56 67.5523 56.4477 68 57 68H67C67.5523 68 68 67.5523 68 67V30C68 29.4477 67.5523 29 67 29Z'],
  width: '80',
  height: '80',
  viewBox: '0 0 80 80',
});
