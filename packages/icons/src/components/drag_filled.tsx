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

export const DragFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7 4C7 4.55228 6.55228 5 6 5C5.44772 5 5 4.55228 5 4C5 3.44772 5.44772 3 6 3C6.55228 3 7 3.44772 7 4Z" fill={ colors[0] }/>
    <path d="M7 8C7 8.55228 6.55228 9 6 9C5.44772 9 5 8.55228 5 8C5 7.44772 5.44772 7 6 7C6.55228 7 7 7.44772 7 8Z" fill={ colors[0] }/>
    <path d="M6 13C6.55228 13 7 12.5523 7 12C7 11.4477 6.55228 11 6 11C5.44772 11 5 11.4477 5 12C5 12.5523 5.44772 13 6 13Z" fill={ colors[0] }/>
    <path d="M11 4C11 4.55228 10.5523 5 10 5C9.44772 5 9 4.55228 9 4C9 3.44772 9.44772 3 10 3C10.5523 3 11 3.44772 11 4Z" fill={ colors[0] }/>
    <path d="M10 9C10.5523 9 11 8.55228 11 8C11 7.44772 10.5523 7 10 7C9.44772 7 9 7.44772 9 8C9 8.55228 9.44772 9 10 9Z" fill={ colors[0] }/>
    <path d="M11 12C11 12.5523 10.5523 13 10 13C9.44772 13 9 12.5523 9 12C9 11.4477 9.44772 11 10 11C10.5523 11 11 11.4477 11 12Z" fill={ colors[0] }/>

  </>,
  name: 'drag_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M7 4C7 4.55228 6.55228 5 6 5C5.44772 5 5 4.55228 5 4C5 3.44772 5.44772 3 6 3C6.55228 3 7 3.44772 7 4Z', 'M7 8C7 8.55228 6.55228 9 6 9C5.44772 9 5 8.55228 5 8C5 7.44772 5.44772 7 6 7C6.55228 7 7 7.44772 7 8Z', 'M6 13C6.55228 13 7 12.5523 7 12C7 11.4477 6.55228 11 6 11C5.44772 11 5 11.4477 5 12C5 12.5523 5.44772 13 6 13Z', 'M11 4C11 4.55228 10.5523 5 10 5C9.44772 5 9 4.55228 9 4C9 3.44772 9.44772 3 10 3C10.5523 3 11 3.44772 11 4Z', 'M10 9C10.5523 9 11 8.55228 11 8C11 7.44772 10.5523 7 10 7C9.44772 7 9 7.44772 9 8C9 8.55228 9.44772 9 10 9Z', 'M11 12C11 12.5523 10.5523 13 10 13C9.44772 13 9 12.5523 9 12C9 11.4477 9.44772 11 10 11C10.5523 11 11 11.4477 11 12Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
