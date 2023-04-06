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

export const DuplicateOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M9 10.75V10H8.25C7.83579 10 7.5 9.66421 7.5 9.25C7.5 8.83579 7.83579 8.5 8.25 8.5H9L9 7.75C9 7.33579 9.33579 7 9.75 7C10.1642 7 10.5 7.33579 10.5 7.75V8.5H11.25C11.6642 8.5 12 8.83579 12 9.25C12 9.66421 11.6642 10 11.25 10H10.5V10.75C10.5 11.1642 10.1642 11.5 9.75 11.5C9.33579 11.5 9 11.1642 9 10.75Z" fill={ colors[0] }/>
    <path d="M2.75 11.25H5V13.25C5 13.9404 5.55964 14.5 6.25 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V5.25C14.5 4.55964 13.9404 4 13.25 4H10V2.75C10 2.05964 9.44036 1.5 8.75 1.5H2.75004C2.05968 1.5 1.50004 2.05964 1.50004 2.74999L1.5 9.99999C1.5 10.6904 2.05964 11.25 2.75 11.25ZM3.00004 3L3 9.75H5V5.25C5 4.55964 5.55964 4 6.25 4H8.5V3H3.00004ZM6.5 5.5V13H13V5.5H6.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'duplicate_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M9 10.75V10H8.25C7.83579 10 7.5 9.66421 7.5 9.25C7.5 8.83579 7.83579 8.5 8.25 8.5H9L9 7.75C9 7.33579 9.33579 7 9.75 7C10.1642 7 10.5 7.33579 10.5 7.75V8.5H11.25C11.6642 8.5 12 8.83579 12 9.25C12 9.66421 11.6642 10 11.25 10H10.5V10.75C10.5 11.1642 10.1642 11.5 9.75 11.5C9.33579 11.5 9 11.1642 9 10.75Z', 'M2.75 11.25H5V13.25C5 13.9404 5.55964 14.5 6.25 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V5.25C14.5 4.55964 13.9404 4 13.25 4H10V2.75C10 2.05964 9.44036 1.5 8.75 1.5H2.75004C2.05968 1.5 1.50004 2.05964 1.50004 2.74999L1.5 9.99999C1.5 10.6904 2.05964 11.25 2.75 11.25ZM3.00004 3L3 9.75H5V5.25C5 4.55964 5.55964 4 6.25 4H8.5V3H3.00004ZM6.5 5.5V13H13V5.5H6.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
