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

export const ChartColumnStackFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <rect x="12" y="41" width="12" height="27" rx="1" fill={ colors[2] }/>
    <path d="M12 60H24V67C24 67.5523 23.5523 68 23 68H13C12.4477 68 12 67.5523 12 67V60Z" fill={ colors[0] }/>
    <rect x="12" y="48" width="12" height="12" fill={ colors[1] }/>
    <rect x="34" y="12" width="12" height="56" rx="1" fill={ colors[2] }/>
    <path d="M34 35H46V67C46 67.5523 45.5523 68 45 68H35C34.4477 68 34 67.5523 34 67V35Z" fill={ colors[0] }/>
    <rect x="34" y="24" width="12" height="11" fill={ colors[1] }/>
    <rect x="56" y="29" width="12" height="39" rx="1" fill={ colors[2] }/>
    <path d="M56 48H68V67C68 67.5523 67.5523 68 67 68H57C56.4477 68 56 67.5523 56 67V48Z" fill={ colors[0] }/>
    <rect x="56" y="40" width="12" height="8" fill={ colors[1] }/>

  </>,
  name: 'chart_column_stack_filled',
  defaultColors: ['#7B67EE', '#9CB9FF', '#FFBA2E'],
  colorful: true,
  allPathData: ['M12 60H24V67C24 67.5523 23.5523 68 23 68H13C12.4477 68 12 67.5523 12 67V60Z', 'M34 35H46V67C46 67.5523 45.5523 68 45 68H35C34.4477 68 34 67.5523 34 67V35Z', 'M56 48H68V67C68 67.5523 67.5523 68 67 68H57C56.4477 68 56 67.5523 56 67V48Z'],
  width: '80',
  height: '80',
  viewBox: '0 0 80 80',
});
