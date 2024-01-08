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

export const LinktableOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3 8.5V3H9.25V8.5H8.5C8.08579 8.5 7.75 8.83579 7.75 9.25C7.75 9.66421 8.08579 10 8.5 10H9.5C10.1904 10 10.75 9.44036 10.75 8.75V2.75C10.75 2.05964 10.1904 1.5 9.5 1.5H2.75C2.05964 1.5 1.5 2.05964 1.5 2.75V8.75C1.5 9.44035 2.05964 10 2.75 10H3.70161C4.11583 10 4.45161 9.66421 4.45161 9.25C4.45161 8.83579 4.11583 8.5 3.70161 8.5H3Z" fill={ colors[0] }/>
    <path d="M13 7.5L13 13L6.75 13L6.75 7.5H7.5C7.91421 7.5 8.25 7.16421 8.25 6.75C8.25 6.33579 7.91421 6 7.5 6H6.5C5.80964 6 5.25 6.55964 5.25 7.25L5.25 13.25C5.25 13.9404 5.80964 14.5 6.5 14.5L13.25 14.5C13.9404 14.5 14.5 13.9404 14.5 13.25L14.5 7.25C14.5 6.55965 13.9404 6 13.25 6H12.2984C11.8842 6 11.5484 6.33579 11.5484 6.75C11.5484 7.16421 11.8842 7.5 12.2984 7.5H13Z" fill={ colors[0] }/>

  </>,
  name: 'linktable_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M3 8.5V3H9.25V8.5H8.5C8.08579 8.5 7.75 8.83579 7.75 9.25C7.75 9.66421 8.08579 10 8.5 10H9.5C10.1904 10 10.75 9.44036 10.75 8.75V2.75C10.75 2.05964 10.1904 1.5 9.5 1.5H2.75C2.05964 1.5 1.5 2.05964 1.5 2.75V8.75C1.5 9.44035 2.05964 10 2.75 10H3.70161C4.11583 10 4.45161 9.66421 4.45161 9.25C4.45161 8.83579 4.11583 8.5 3.70161 8.5H3Z', 'M13 7.5L13 13L6.75 13L6.75 7.5H7.5C7.91421 7.5 8.25 7.16421 8.25 6.75C8.25 6.33579 7.91421 6 7.5 6H6.5C5.80964 6 5.25 6.55964 5.25 7.25L5.25 13.25C5.25 13.9404 5.80964 14.5 6.5 14.5L13.25 14.5C13.9404 14.5 14.5 13.9404 14.5 13.25L14.5 7.25C14.5 6.55965 13.9404 6 13.25 6H12.2984C11.8842 6 11.5484 6.33579 11.5484 6.75C11.5484 7.16421 11.8842 7.5 12.2984 7.5H13Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
