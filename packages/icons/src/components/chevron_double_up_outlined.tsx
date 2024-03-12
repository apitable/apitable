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

export const ChevronDoubleUpOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3.28033 8.03033C2.98744 8.32322 2.51256 8.32322 2.21967 8.03033C1.92678 7.73744 1.92678 7.26256 2.21967 6.96967L7.46967 1.71967C7.76256 1.42678 8.23744 1.42678 8.53033 1.71967L13.7803 6.96967C14.0732 7.26256 14.0732 7.73744 13.7803 8.03033C13.4874 8.32322 13.0126 8.32322 12.7197 8.03033L8 3.31066L3.28033 8.03033Z" fill={ colors[0] }/>
    <path d="M3.28033 14.2803C2.98744 14.5732 2.51256 14.5732 2.21967 14.2803C1.92678 13.9874 1.92678 13.5126 2.21967 13.2197L7.46967 7.96967C7.76256 7.67678 8.23744 7.67678 8.53033 7.96967L13.7803 13.2197C14.0732 13.5126 14.0732 13.9874 13.7803 14.2803C13.4874 14.5732 13.0126 14.5732 12.7197 14.2803L8 9.56066L3.28033 14.2803Z" fill={ colors[0] }/>

  </>,
  name: 'chevron_double_up_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M3.28033 8.03033C2.98744 8.32322 2.51256 8.32322 2.21967 8.03033C1.92678 7.73744 1.92678 7.26256 2.21967 6.96967L7.46967 1.71967C7.76256 1.42678 8.23744 1.42678 8.53033 1.71967L13.7803 6.96967C14.0732 7.26256 14.0732 7.73744 13.7803 8.03033C13.4874 8.32322 13.0126 8.32322 12.7197 8.03033L8 3.31066L3.28033 8.03033Z', 'M3.28033 14.2803C2.98744 14.5732 2.51256 14.5732 2.21967 14.2803C1.92678 13.9874 1.92678 13.5126 2.21967 13.2197L7.46967 7.96967C7.76256 7.67678 8.23744 7.67678 8.53033 7.96967L13.7803 13.2197C14.0732 13.5126 14.0732 13.9874 13.7803 14.2803C13.4874 14.5732 13.0126 14.5732 12.7197 14.2803L8 9.56066L3.28033 14.2803Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
