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

export const ChevronDoubleDownFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3.28033 8.46967C2.98744 8.17678 2.51256 8.17678 2.21967 8.46967C1.92678 8.76256 1.92678 9.23744 2.21967 9.53033L7.46967 14.7803C7.76256 15.0732 8.23744 15.0732 8.53033 14.7803L13.7803 9.53033C14.0732 9.23744 14.0732 8.76256 13.7803 8.46967C13.4874 8.17678 13.0126 8.17678 12.7197 8.46967L8 13.1893L3.28033 8.46967Z" fill={ colors[0] }/>
    <path d="M3.28033 2.21967C2.98744 1.92678 2.51256 1.92678 2.21967 2.21967C1.92678 2.51256 1.92678 2.98744 2.21967 3.28033L7.46967 8.53033C7.76256 8.82322 8.23744 8.82322 8.53033 8.53033L13.7803 3.28033C14.0732 2.98744 14.0732 2.51256 13.7803 2.21967C13.4874 1.92678 13.0126 1.92678 12.7197 2.21967L8 6.93934L3.28033 2.21967Z" fill={ colors[0] }/>

  </>,
  name: 'chevron_double_down_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M3.28033 8.46967C2.98744 8.17678 2.51256 8.17678 2.21967 8.46967C1.92678 8.76256 1.92678 9.23744 2.21967 9.53033L7.46967 14.7803C7.76256 15.0732 8.23744 15.0732 8.53033 14.7803L13.7803 9.53033C14.0732 9.23744 14.0732 8.76256 13.7803 8.46967C13.4874 8.17678 13.0126 8.17678 12.7197 8.46967L8 13.1893L3.28033 8.46967Z', 'M3.28033 2.21967C2.98744 1.92678 2.51256 1.92678 2.21967 2.21967C1.92678 2.51256 1.92678 2.98744 2.21967 3.28033L7.46967 8.53033C7.76256 8.82322 8.23744 8.82322 8.53033 8.53033L13.7803 3.28033C14.0732 2.98744 14.0732 2.51256 13.7803 2.21967C13.4874 1.92678 13.0126 1.92678 12.7197 2.21967L8 6.93934L3.28033 2.21967Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
