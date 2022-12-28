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

export const GanttRightFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <rect width="16" height="16" fill={ colors[1] }/>
    <path d="M8.97482 4.77988L12.4143 7.53151C12.7146 7.7717 12.7146 8.22836 12.4143 8.46855L8.97482 11.2202C8.58196 11.5345 8 11.2548 8 10.7517V9.00003L4 9.00003C3.44772 9.00003 3 8.55231 3 8.00003C3 7.44774 3.44772 7.00003 4 7.00003L8 7.00003V5.2484C8 4.7453 8.58196 4.4656 8.97482 4.77988Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'gantt_right_filled',
  defaultColors: ['#C4C4C4', 'white'],
  colorful: true,
  allPathData: ['M8.97482 4.77988L12.4143 7.53151C12.7146 7.7717 12.7146 8.22836 12.4143 8.46855L8.97482 11.2202C8.58196 11.5345 8 11.2548 8 10.7517V9.00003L4 9.00003C3.44772 9.00003 3 8.55231 3 8.00003C3 7.44774 3.44772 7.00003 4 7.00003L8 7.00003V5.2484C8 4.7453 8.58196 4.4656 8.97482 4.77988Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
