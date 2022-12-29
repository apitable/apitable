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

export const DuplicateOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M9 1C10.1046 1 11 1.89543 11 3V4H13C14.1046 4 15 4.89543 15 6V13C15 14.1046 14.1046 15 13 15H6C4.89543 15 4 14.1046 4 13V11H3C1.89543 11 1 10.1046 1 9V3C1 1.89543 1.89543 1 3 1H9ZM6 10V13H13V6H10H6V10ZM9 4H6C4.89543 4 4 4.89543 4 6V9H3V3H9V4ZM9.5 7C10.0523 7 10.5 7.44772 10.5 8V8.5H11C11.5523 8.5 12 8.94772 12 9.5C12 10.0523 11.5523 10.5 11 10.5H10.5V11C10.5 11.5523 10.0523 12 9.5 12C8.94772 12 8.5 11.5523 8.5 11V10.5H8C7.44772 10.5 7 10.0523 7 9.5C7 8.94772 7.44772 8.5 8 8.5H8.5V8C8.5 7.44772 8.94772 7 9.5 7Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'duplicate_outlined',
  defaultColors: ['#636363'],
  colorful: false,
  allPathData: ['M9 1C10.1046 1 11 1.89543 11 3V4H13C14.1046 4 15 4.89543 15 6V13C15 14.1046 14.1046 15 13 15H6C4.89543 15 4 14.1046 4 13V11H3C1.89543 11 1 10.1046 1 9V3C1 1.89543 1.89543 1 3 1H9ZM6 10V13H13V6H10H6V10ZM9 4H6C4.89543 4 4 4.89543 4 6V9H3V3H9V4ZM9.5 7C10.0523 7 10.5 7.44772 10.5 8V8.5H11C11.5523 8.5 12 8.94772 12 9.5C12 10.0523 11.5523 10.5 11 10.5H10.5V11C10.5 11.5523 10.0523 12 9.5 12C8.94772 12 8.5 11.5523 8.5 11V10.5H8C7.44772 10.5 7 10.0523 7 9.5C7 8.94772 7.44772 8.5 8 8.5H8.5V8C8.5 7.44772 8.94772 7 9.5 7Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
