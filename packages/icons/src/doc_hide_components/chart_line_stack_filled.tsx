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

export const ChartLineStackFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M15.5 57L31.5 42.5L53 51.5L68.5 38" stroke={ colors[1] } strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 40L28 25.5L49.5 34.5L65 21" stroke={ colors[0] } strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>

  </>,
  name: 'chart_line_stack_filled',
  defaultColors: ['#7B67EE', '#FFBA2E'],
  colorful: true,
  allPathData: ['M15.5 57L31.5 42.5L53 51.5L68.5 38', 'M12 40L28 25.5L49.5 34.5L65 21'],
  width: '80',
  height: '80',
  viewBox: '0 0 80 80',
});
