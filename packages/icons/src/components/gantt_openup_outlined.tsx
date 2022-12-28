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

export const GanttOpenupOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M10 5C10 4.44772 10.4477 4 11 4C11.5523 4 12 4.44772 12 5V8V11C12 11.5523 11.5523 12 11 12C10.4477 12 10 11.5523 10 11V8V5ZM5.58579 8L3.29289 5.70711C2.90237 5.31658 2.90237 4.68342 3.29289 4.29289C3.68342 3.90237 4.31658 3.90237 4.70711 4.29289L7.70711 7.29289C8.09763 7.68342 8.09763 8.31658 7.70711 8.70711L4.70711 11.7071C4.31658 12.0976 3.68342 12.0976 3.29289 11.7071C2.90237 11.3166 2.90237 10.6834 3.29289 10.2929L5.58579 8Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'gantt_openup_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M10 5C10 4.44772 10.4477 4 11 4C11.5523 4 12 4.44772 12 5V8V11C12 11.5523 11.5523 12 11 12C10.4477 12 10 11.5523 10 11V8V5ZM5.58579 8L3.29289 5.70711C2.90237 5.31658 2.90237 4.68342 3.29289 4.29289C3.68342 3.90237 4.31658 3.90237 4.70711 4.29289L7.70711 7.29289C8.09763 7.68342 8.09763 8.31658 7.70711 8.70711L4.70711 11.7071C4.31658 12.0976 3.68342 12.0976 3.29289 11.7071C2.90237 11.3166 2.90237 10.6834 3.29289 10.2929L5.58579 8Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
