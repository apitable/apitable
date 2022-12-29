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

export const GotoLargeOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2 4C2 2.89543 2.89543 2 4 2H5C5.55228 2 6 2.44772 6 3C6 3.55228 5.55228 4 5 4L4 4V12H12V11C12 10.4477 12.4477 10 13 10C13.5523 10 14 10.4477 14 11V12C14 13.1046 13.1046 14 12 14H4C2.89543 14 2 13.1046 2 12V4ZM12 5.41421L8.70711 8.70711C8.31658 9.09763 7.68342 9.09763 7.29289 8.70711C6.90237 8.31658 6.90237 7.68342 7.29289 7.29289L10.5858 4H9C8.44772 4 8 3.55228 8 3C8 2.44772 8.44772 2 9 2H12.9998H13C13.1356 2 13.2649 2.02699 13.3828 2.07588C13.5007 2.12468 13.6112 2.19702 13.7071 2.29289C13.9016 2.48739 13.9992 2.74208 14 2.997C14 2.998 14 2.999 14 3V3.00069V7C14 7.55228 13.5523 8 13 8C12.4477 8 12 7.55228 12 7V5.41421Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'goto_large_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M2 4C2 2.89543 2.89543 2 4 2H5C5.55228 2 6 2.44772 6 3C6 3.55228 5.55228 4 5 4L4 4V12H12V11C12 10.4477 12.4477 10 13 10C13.5523 10 14 10.4477 14 11V12C14 13.1046 13.1046 14 12 14H4C2.89543 14 2 13.1046 2 12V4ZM12 5.41421L8.70711 8.70711C8.31658 9.09763 7.68342 9.09763 7.29289 8.70711C6.90237 8.31658 6.90237 7.68342 7.29289 7.29289L10.5858 4H9C8.44772 4 8 3.55228 8 3C8 2.44772 8.44772 2 9 2H12.9998H13C13.1356 2 13.2649 2.02699 13.3828 2.07588C13.5007 2.12468 13.6112 2.19702 13.7071 2.29289C13.9016 2.48739 13.9992 2.74208 14 2.997C14 2.998 14 2.999 14 3V3.00069V7C14 7.55228 13.5523 8 13 8C12.4477 8 12 7.55228 12 7V5.41421Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
