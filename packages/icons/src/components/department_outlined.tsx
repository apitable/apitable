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

export const DepartmentOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5.25 2.75C5.25 2.05964 5.80964 1.5 6.5 1.5H9.5C10.1904 1.5 10.75 2.05964 10.75 2.75V4.75C10.75 5.44036 10.1904 6 9.5 6H8.75V7.25H11.25C11.9404 7.25 12.5 7.80964 12.5 8.5V10H13.25C13.9404 10 14.5 10.5596 14.5 11.25V13.25C14.5 13.9404 13.9404 14.5 13.25 14.5H10.25C9.55964 14.5 9 13.9404 9 13.25V11.25C9 10.5596 9.55964 10 10.25 10H11V8.75H5V10H5.75C6.44036 10 7 10.5596 7 11.25V13.25C7 13.9404 6.44036 14.5 5.75 14.5H2.75C2.05964 14.5 1.5 13.9404 1.5 13.25V11.25C1.5 10.5596 2.05964 10 2.75 10H3.5V8.5C3.5 7.80964 4.05964 7.25 4.75 7.25H7.25V6H6.5C5.80964 6 5.25 5.44036 5.25 4.75V2.75ZM9.25 4.5H6.75V3H9.25V4.5ZM10.5 13V11.5H13V13H10.5ZM3 11.5V13H5.5V11.5H3Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'department_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M5.25 2.75C5.25 2.05964 5.80964 1.5 6.5 1.5H9.5C10.1904 1.5 10.75 2.05964 10.75 2.75V4.75C10.75 5.44036 10.1904 6 9.5 6H8.75V7.25H11.25C11.9404 7.25 12.5 7.80964 12.5 8.5V10H13.25C13.9404 10 14.5 10.5596 14.5 11.25V13.25C14.5 13.9404 13.9404 14.5 13.25 14.5H10.25C9.55964 14.5 9 13.9404 9 13.25V11.25C9 10.5596 9.55964 10 10.25 10H11V8.75H5V10H5.75C6.44036 10 7 10.5596 7 11.25V13.25C7 13.9404 6.44036 14.5 5.75 14.5H2.75C2.05964 14.5 1.5 13.9404 1.5 13.25V11.25C1.5 10.5596 2.05964 10 2.75 10H3.5V8.5C3.5 7.80964 4.05964 7.25 4.75 7.25H7.25V6H6.5C5.80964 6 5.25 5.44036 5.25 4.75V2.75ZM9.25 4.5H6.75V3H9.25V4.5ZM10.5 13V11.5H13V13H10.5ZM3 11.5V13H5.5V11.5H3Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
