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

export const ClearOutlined: React.FC<IIconProps> = makeIcon({
    Path: ({ colors }) => <>
    <path d="M5.75 2.75C5.75 2.05964 6.30964 1.5 7 1.5H9C9.69036 1.5 10.25 2.05964 10.25 2.75V3.75001H13.25C13.9404 3.75001 14.5 4.30965 14.5 5.00001V7.25C14.5 7.66421 14.1642 8 13.75 8H13V13.75C13 14.1642 12.6642 14.5 12.25 14.5H3.75C3.33579 14.5 3 14.1642 3 13.75V8H2.25C1.83579 8 1.5 7.66421 1.5 7.25V5.00001C1.5 4.30965 2.05964 3.75001 2.75 3.75001H5.75V2.75ZM4.5 8H11.5V13H10.25V11.5547C10.25 11.1405 9.91421 10.8047 9.5 10.8047C9.08579 10.8047 8.75 11.1405 8.75 11.5547V13H7.25V11.5493C7.25 11.135 6.91421 10.7993 6.5 10.7993C6.08579 10.7993 5.75 11.135 5.75 11.5493V13H4.5V8ZM13 6.5H3V5.25001H6.5C6.91421 5.25001 7.25 4.91422 7.25 4.50001V3H8.75V4.50001C8.75 4.91422 9.08579 5.25001 9.5 5.25001H13V6.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'clear_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M5.75 2.75C5.75 2.05964 6.30964 1.5 7 1.5H9C9.69036 1.5 10.25 2.05964 10.25 2.75V3.75001H13.25C13.9404 3.75001 14.5 4.30965 14.5 5.00001V7.25C14.5 7.66421 14.1642 8 13.75 8H13V13.75C13 14.1642 12.6642 14.5 12.25 14.5H3.75C3.33579 14.5 3 14.1642 3 13.75V8H2.25C1.83579 8 1.5 7.66421 1.5 7.25V5.00001C1.5 4.30965 2.05964 3.75001 2.75 3.75001H5.75V2.75ZM4.5 8H11.5V13H10.25V11.5547C10.25 11.1405 9.91421 10.8047 9.5 10.8047C9.08579 10.8047 8.75 11.1405 8.75 11.5547V13H7.25V11.5493C7.25 11.135 6.91421 10.7993 6.5 10.7993C6.08579 10.7993 5.75 11.135 5.75 11.5493V13H4.5V8ZM13 6.5H3V5.25001H6.5C6.91421 5.25001 7.25 4.91422 7.25 4.50001V3H8.75V4.50001C8.75 4.91422 9.08579 5.25001 9.5 5.25001H13V6.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
