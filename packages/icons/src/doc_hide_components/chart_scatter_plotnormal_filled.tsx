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

export const ChartScatterPlotnormalFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M54 32C58.9706 32 63 27.9706 63 23C63 18.0294 58.9706 14 54 14C49.0294 14 45 18.0294 45 23C45 27.9706 49.0294 32 54 32Z" fill={ colors[1] }/>
    <path d="M54 58C58.9706 58 63 53.9706 63 49C63 44.0294 58.9706 40 54 40C49.0294 40 45 44.0294 45 49C45 53.9706 49.0294 58 54 58Z" fill={ colors[0] }/>
    <path d="M26 40C30.9706 40 35 35.9706 35 31C35 26.0294 30.9706 22 26 22C21.0294 22 17 26.0294 17 31C17 35.9706 21.0294 40 26 40Z" fill={ colors[0] }/>
    <path d="M26 66C30.9706 66 35 61.9706 35 57C35 52.0294 30.9706 48 26 48C21.0294 48 17 52.0294 17 57C17 61.9706 21.0294 66 26 66Z" fill={ colors[2] }/>

  </>,
  name: 'chart_scatter_plotnormal_filled',
  defaultColors: ['#7B67EE', '#9CB9FF', '#FFBA2E'],
  colorful: true,
  allPathData: ['M54 32C58.9706 32 63 27.9706 63 23C63 18.0294 58.9706 14 54 14C49.0294 14 45 18.0294 45 23C45 27.9706 49.0294 32 54 32Z', 'M54 58C58.9706 58 63 53.9706 63 49C63 44.0294 58.9706 40 54 40C49.0294 40 45 44.0294 45 49C45 53.9706 49.0294 58 54 58Z', 'M26 40C30.9706 40 35 35.9706 35 31C35 26.0294 30.9706 22 26 22C21.0294 22 17 26.0294 17 31C17 35.9706 21.0294 40 26 40Z', 'M26 66C30.9706 66 35 61.9706 35 57C35 52.0294 30.9706 48 26 48C21.0294 48 17 52.0294 17 57C17 61.9706 21.0294 66 26 66Z'],
  width: '80',
  height: '80',
  viewBox: '0 0 80 80',
});
