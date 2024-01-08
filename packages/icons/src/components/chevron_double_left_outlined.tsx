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

export const ChevronDoubleLeftOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7.78033 12.9697C8.07322 13.2626 8.07322 13.7374 7.78033 14.0303C7.48744 14.3232 7.01256 14.3232 6.71967 14.0303L1.46967 8.78033C1.17678 8.48744 1.17678 8.01256 1.46967 7.71967L6.71967 2.46967C7.01256 2.17678 7.48744 2.17678 7.78033 2.46967C8.07322 2.76256 8.07322 3.23744 7.78033 3.53033L3.06066 8.25L7.78033 12.9697Z" fill={ colors[0] }/>
    <path d="M14.0303 12.9697C14.3232 13.2626 14.3232 13.7374 14.0303 14.0303C13.7374 14.3232 13.2626 14.3232 12.9697 14.0303L7.71967 8.78033C7.42678 8.48744 7.42678 8.01256 7.71967 7.71967L12.9697 2.46967C13.2626 2.17678 13.7374 2.17678 14.0303 2.46967C14.3232 2.76256 14.3232 3.23744 14.0303 3.53033L9.31066 8.25L14.0303 12.9697Z" fill={ colors[0] }/>

  </>,
  name: 'chevron_double_left_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M7.78033 12.9697C8.07322 13.2626 8.07322 13.7374 7.78033 14.0303C7.48744 14.3232 7.01256 14.3232 6.71967 14.0303L1.46967 8.78033C1.17678 8.48744 1.17678 8.01256 1.46967 7.71967L6.71967 2.46967C7.01256 2.17678 7.48744 2.17678 7.78033 2.46967C8.07322 2.76256 8.07322 3.23744 7.78033 3.53033L3.06066 8.25L7.78033 12.9697Z', 'M14.0303 12.9697C14.3232 13.2626 14.3232 13.7374 14.0303 14.0303C13.7374 14.3232 13.2626 14.3232 12.9697 14.0303L7.71967 8.78033C7.42678 8.48744 7.42678 8.01256 7.71967 7.71967L12.9697 2.46967C13.2626 2.17678 13.7374 2.17678 14.0303 2.46967C14.3232 2.76256 14.3232 3.23744 14.0303 3.53033L9.31066 8.25L14.0303 12.9697Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
