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

export const ChevronRightFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5.46967 2.46967C5.17678 2.76256 5.17678 3.23744 5.46967 3.53033L9.93934 8L5.46967 12.4697C5.17678 12.7626 5.17678 13.2374 5.46967 13.5303C5.76256 13.8232 6.23744 13.8232 6.53033 13.5303L11.5303 8.53033C11.8232 8.23744 11.8232 7.76256 11.5303 7.46967L6.53033 2.46967C6.23744 2.17678 5.76256 2.17678 5.46967 2.46967Z" fill={ colors[0] }/>

  </>,
  name: 'chevron_right_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M5.46967 2.46967C5.17678 2.76256 5.17678 3.23744 5.46967 3.53033L9.93934 8L5.46967 12.4697C5.17678 12.7626 5.17678 13.2374 5.46967 13.5303C5.76256 13.8232 6.23744 13.8232 6.53033 13.5303L11.5303 8.53033C11.8232 8.23744 11.8232 7.76256 11.5303 7.46967L6.53033 2.46967C6.23744 2.17678 5.76256 2.17678 5.46967 2.46967Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
