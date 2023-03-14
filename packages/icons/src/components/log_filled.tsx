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

export const LogFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M13.25 2.25C13.25 1.55964 12.6904 1 12 1H3.25C2.55964 1 2 1.55964 2 2.25V13.75C2 14.4404 2.55964 15 3.25 15H8.9364C7.48922 14.2519 6.5 12.7415 6.5 11C6.5 8.51472 8.51472 6.5 11 6.5C11.8196 6.5 12.5881 6.71914 13.25 7.10202V2.25ZM10.75 4.25C10.75 3.83579 10.4142 3.5 10 3.5H5.25C4.83579 3.5 4.5 3.83579 4.5 4.25C4.5 4.66421 4.83579 5 5.25 5H10C10.4142 5 10.75 4.66421 10.75 4.25ZM6.75 6C7.16421 6 7.5 6.33579 7.5 6.75C7.5 7.16421 7.16421 7.5 6.75 7.5H5.25C4.83579 7.5 4.5 7.16421 4.5 6.75C4.5 6.33579 4.83579 6 5.25 6H6.75Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M7.5 11C7.5 9.067 9.067 7.5 11 7.5C12.933 7.5 14.5 9.067 14.5 11C14.5 12.933 12.933 14.5 11 14.5C9.067 14.5 7.5 12.933 7.5 11ZM11 9C11.4142 9 11.75 9.33579 11.75 9.75V10.6893L12.0303 10.9697C12.3232 11.2626 12.3232 11.7374 12.0303 12.0303C11.7374 12.3232 11.2626 12.3232 10.9697 12.0303L10.4697 11.5303C10.329 11.3897 10.25 11.1989 10.25 11V9.75C10.25 9.33579 10.5858 9 11 9Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'log_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M13.25 2.25C13.25 1.55964 12.6904 1 12 1H3.25C2.55964 1 2 1.55964 2 2.25V13.75C2 14.4404 2.55964 15 3.25 15H8.9364C7.48922 14.2519 6.5 12.7415 6.5 11C6.5 8.51472 8.51472 6.5 11 6.5C11.8196 6.5 12.5881 6.71914 13.25 7.10202V2.25ZM10.75 4.25C10.75 3.83579 10.4142 3.5 10 3.5H5.25C4.83579 3.5 4.5 3.83579 4.5 4.25C4.5 4.66421 4.83579 5 5.25 5H10C10.4142 5 10.75 4.66421 10.75 4.25ZM6.75 6C7.16421 6 7.5 6.33579 7.5 6.75C7.5 7.16421 7.16421 7.5 6.75 7.5H5.25C4.83579 7.5 4.5 7.16421 4.5 6.75C4.5 6.33579 4.83579 6 5.25 6H6.75Z', 'M7.5 11C7.5 9.067 9.067 7.5 11 7.5C12.933 7.5 14.5 9.067 14.5 11C14.5 12.933 12.933 14.5 11 14.5C9.067 14.5 7.5 12.933 7.5 11ZM11 9C11.4142 9 11.75 9.33579 11.75 9.75V10.6893L12.0303 10.9697C12.3232 11.2626 12.3232 11.7374 12.0303 12.0303C11.7374 12.3232 11.2626 12.3232 10.9697 12.0303L10.4697 11.5303C10.329 11.3897 10.25 11.1989 10.25 11V9.75C10.25 9.33579 10.5858 9 11 9Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
