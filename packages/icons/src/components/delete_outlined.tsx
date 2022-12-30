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

export const DeleteOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5 4C5 2.34315 6.34315 1 8 1C9.65685 1 11 2.34315 11 4H12H14C14.5523 4 15 4.44772 15 5C15 5.55228 14.5523 6 14 6H13V14C13 14.5523 12.5523 15 12 15H8H4C3.44772 15 3 14.5523 3 14V6H2C1.44772 6 1 5.55228 1 5C1 4.44772 1.44772 4 2 4H4H5ZM6 6H5V13H8H11V6H10H6ZM9 4H7C7 3.44772 7.44772 3 8 3C8.55228 3 9 3.44772 9 4Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'delete_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M5 4C5 2.34315 6.34315 1 8 1C9.65685 1 11 2.34315 11 4H12H14C14.5523 4 15 4.44772 15 5C15 5.55228 14.5523 6 14 6H13V14C13 14.5523 12.5523 15 12 15H8H4C3.44772 15 3 14.5523 3 14V6H2C1.44772 6 1 5.55228 1 5C1 4.44772 1.44772 4 2 4H4H5ZM6 6H5V13H8H11V6H10H6ZM9 4H7C7 3.44772 7.44772 3 8 3C8.55228 3 9 3.44772 9 4Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
