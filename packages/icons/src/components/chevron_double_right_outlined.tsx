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

export const ChevronDoubleRightOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.21967 12.9697C7.92678 13.2626 7.92678 13.7374 8.21967 14.0303C8.51256 14.3232 8.98744 14.3232 9.28033 14.0303L14.5303 8.78033C14.8232 8.48744 14.8232 8.01256 14.5303 7.71967L9.28033 2.46967C8.98744 2.17678 8.51256 2.17678 8.21967 2.46967C7.92678 2.76256 7.92678 3.23744 8.21967 3.53033L12.9393 8.25L8.21967 12.9697Z" fill={ colors[0] }/>
    <path d="M1.96967 12.9697C1.67678 13.2626 1.67678 13.7374 1.96967 14.0303C2.26256 14.3232 2.73744 14.3232 3.03033 14.0303L8.28033 8.78033C8.57322 8.48744 8.57322 8.01256 8.28033 7.71967L3.03033 2.46967C2.73744 2.17678 2.26256 2.17678 1.96967 2.46967C1.67678 2.76256 1.67678 3.23744 1.96967 3.53033L6.68934 8.25L1.96967 12.9697Z" fill={ colors[0] }/>

  </>,
  name: 'chevron_double_right_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8.21967 12.9697C7.92678 13.2626 7.92678 13.7374 8.21967 14.0303C8.51256 14.3232 8.98744 14.3232 9.28033 14.0303L14.5303 8.78033C14.8232 8.48744 14.8232 8.01256 14.5303 7.71967L9.28033 2.46967C8.98744 2.17678 8.51256 2.17678 8.21967 2.46967C7.92678 2.76256 7.92678 3.23744 8.21967 3.53033L12.9393 8.25L8.21967 12.9697Z', 'M1.96967 12.9697C1.67678 13.2626 1.67678 13.7374 1.96967 14.0303C2.26256 14.3232 2.73744 14.3232 3.03033 14.0303L8.28033 8.78033C8.57322 8.48744 8.57322 8.01256 8.28033 7.71967L3.03033 2.46967C2.73744 2.17678 2.26256 2.17678 1.96967 2.46967C1.67678 2.76256 1.67678 3.23744 1.96967 3.53033L6.68934 8.25L1.96967 12.9697Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
