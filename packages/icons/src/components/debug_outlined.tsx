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

export const DebugOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5 5C5 5.55228 4.55228 6 4 6C3.44772 6 3 5.55228 3 5C3 4.44772 3.44772 4 4 4C4.55228 4 5 4.44772 5 5ZM7 5C7 6.65685 5.65685 8 4 8C2.34315 8 1 6.65685 1 5C1 3.34315 2.34315 2 4 2C5.65685 2 7 3.34315 7 5ZM9 4C8.44772 4 8 4.44772 8 5C8 5.55228 8.44772 6 9 6H14C14.5523 6 15 5.55228 15 5C15 4.44772 14.5523 4 14 4H9ZM12 12C11.4477 12 11 11.5523 11 11C11 10.4477 11.4477 10 12 10C12.5523 10 13 10.4477 13 11C13 11.5523 12.5523 12 12 12ZM12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11C15 12.6569 13.6569 14 12 14ZM7 10C7.55228 10 8 10.4477 8 11C8 11.5523 7.55228 12 7 12H2C1.44772 12 1 11.5523 1 11C1 10.4477 1.44772 10 2 10H7Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'debug_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M5 5C5 5.55228 4.55228 6 4 6C3.44772 6 3 5.55228 3 5C3 4.44772 3.44772 4 4 4C4.55228 4 5 4.44772 5 5ZM7 5C7 6.65685 5.65685 8 4 8C2.34315 8 1 6.65685 1 5C1 3.34315 2.34315 2 4 2C5.65685 2 7 3.34315 7 5ZM9 4C8.44772 4 8 4.44772 8 5C8 5.55228 8.44772 6 9 6H14C14.5523 6 15 5.55228 15 5C15 4.44772 14.5523 4 14 4H9ZM12 12C11.4477 12 11 11.5523 11 11C11 10.4477 11.4477 10 12 10C12.5523 10 13 10.4477 13 11C13 11.5523 12.5523 12 12 12ZM12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11C15 12.6569 13.6569 14 12 14ZM7 10C7.55228 10 8 10.4477 8 11C8 11.5523 7.55228 12 7 12H2C1.44772 12 1 11.5523 1 11C1 10.4477 1.44772 10 2 10H7Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
