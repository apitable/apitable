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

export const CopyOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M4.5 11.5H2.75C2.05964 11.5 1.5 10.9404 1.5 10.25L1.50004 2.74999C1.50004 2.05964 2.05969 1.5 2.75004 1.5H10.25C10.9404 1.5 11.5 2.05964 11.5 2.75V4.5H13.25C13.9404 4.5 14.5 5.05964 14.5 5.75V13.25C14.5 13.9404 13.9404 14.5 13.25 14.5H5.75C5.05964 14.5 4.5 13.9404 4.5 13.25V11.5ZM3 10L3.00004 3H10V4.5H5.75C5.05964 4.5 4.5 5.05964 4.5 5.75V10H3ZM6 13V6H13V13H6Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'copy_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M4.5 11.5H2.75C2.05964 11.5 1.5 10.9404 1.5 10.25L1.50004 2.74999C1.50004 2.05964 2.05969 1.5 2.75004 1.5H10.25C10.9404 1.5 11.5 2.05964 11.5 2.75V4.5H13.25C13.9404 4.5 14.5 5.05964 14.5 5.75V13.25C14.5 13.9404 13.9404 14.5 13.25 14.5H5.75C5.05964 14.5 4.5 13.9404 4.5 13.25V11.5ZM3 10L3.00004 3H10V4.5H5.75C5.05964 4.5 4.5 5.05964 4.5 5.75V10H3ZM6 13V6H13V13H6Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
