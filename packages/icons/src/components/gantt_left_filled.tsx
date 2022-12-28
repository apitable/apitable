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

export const GanttLeftFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7.02518 4.77988L3.58565 7.53151C3.28541 7.7717 3.28541 8.22836 3.58565 8.46855L7.02518 11.2202C7.41804 11.5345 8 11.2548 8 10.7517V9.00003L12 9.00003C12.5523 9.00003 13 8.55231 13 8.00003C13 7.44774 12.5523 7.00003 12 7.00003L8 7.00003V5.2484C8 4.7453 7.41804 4.4656 7.02518 4.77988Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'gantt_left_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M7.02518 4.77988L3.58565 7.53151C3.28541 7.7717 3.28541 8.22836 3.58565 8.46855L7.02518 11.2202C7.41804 11.5345 8 11.2548 8 10.7517V9.00003L12 9.00003C12.5523 9.00003 13 8.55231 13 8.00003C13 7.44774 12.5523 7.00003 12 7.00003L8 7.00003V5.2484C8 4.7453 7.41804 4.4656 7.02518 4.77988Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
