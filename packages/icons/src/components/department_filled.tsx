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

export const DepartmentFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M6 1.5C5.58579 1.5 5.25 1.83579 5.25 2.25V5.25C5.25 5.66421 5.58579 6 6 6H7.25V7.25H4.75C4.05964 7.25 3.5 7.80964 3.5 8.5V10H2.75C2.05964 10 1.5 10.5596 1.5 11.25V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H5.75C6.44036 14.5 7 13.9404 7 13.25V11.25C7 10.5596 6.44036 10 5.75 10H5V8.75H11V10H10.25C9.55964 10 9 10.5596 9 11.25V13.25C9 13.9404 9.55964 14.5 10.25 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V11.25C14.5 10.5596 13.9404 10 13.25 10H12.5V8.5C12.5 7.80964 11.9404 7.25 11.25 7.25H8.75V6H10C10.4142 6 10.75 5.66421 10.75 5.25V2.25C10.75 1.83579 10.4142 1.5 10 1.5H6ZM10.5 13V11.5H13V13H10.5ZM3 11.5V13H5.5V11.5H3Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'department_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M6 1.5C5.58579 1.5 5.25 1.83579 5.25 2.25V5.25C5.25 5.66421 5.58579 6 6 6H7.25V7.25H4.75C4.05964 7.25 3.5 7.80964 3.5 8.5V10H2.75C2.05964 10 1.5 10.5596 1.5 11.25V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H5.75C6.44036 14.5 7 13.9404 7 13.25V11.25C7 10.5596 6.44036 10 5.75 10H5V8.75H11V10H10.25C9.55964 10 9 10.5596 9 11.25V13.25C9 13.9404 9.55964 14.5 10.25 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V11.25C14.5 10.5596 13.9404 10 13.25 10H12.5V8.5C12.5 7.80964 11.9404 7.25 11.25 7.25H8.75V6H10C10.4142 6 10.75 5.66421 10.75 5.25V2.25C10.75 1.83579 10.4142 1.5 10 1.5H6ZM10.5 13V11.5H13V13H10.5ZM3 11.5V13H5.5V11.5H3Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
