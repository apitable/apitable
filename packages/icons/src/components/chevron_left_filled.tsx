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

export const ChevronLeftFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M10.5303 2.46967C10.8232 2.76256 10.8232 3.23744 10.5303 3.53033L6.06066 8L10.5303 12.4697C10.8232 12.7626 10.8232 13.2374 10.5303 13.5303C10.2374 13.8232 9.76256 13.8232 9.46967 13.5303L4.46967 8.53033C4.17678 8.23744 4.17678 7.76256 4.46967 7.46967L9.46967 2.46967C9.76256 2.17678 10.2374 2.17678 10.5303 2.46967Z" fill={ colors[0] }/>

  </>,
  name: 'chevron_left_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M10.5303 2.46967C10.8232 2.76256 10.8232 3.23744 10.5303 3.53033L6.06066 8L10.5303 12.4697C10.8232 12.7626 10.8232 13.2374 10.5303 13.5303C10.2374 13.8232 9.76256 13.8232 9.46967 13.5303L4.46967 8.53033C4.17678 8.23744 4.17678 7.76256 4.46967 7.46967L9.46967 2.46967C9.76256 2.17678 10.2374 2.17678 10.5303 2.46967Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
