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

export const NewtabFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M4 2.75C4 2.05964 4.55964 1.5 5.25 1.5H13.25C13.9404 1.5 14.5 2.05964 14.5 2.75V10.75C14.5 11.4404 13.9404 12 13.25 12H12V13.25C12 13.9404 11.4404 14.5 10.75 14.5H2.75C2.05964 14.5 1.5 13.9404 1.5 13.25V5.25C1.5 4.55964 2.05964 4 2.75 4H4V2.75ZM5.5 4H10.75C11.4404 4 12 4.55964 12 5.25V10.5H13V3H5.5V4ZM4.5 7.75C4.5 7.33579 4.83579 7 5.25 7H8.25C8.66421 7 9 7.33579 9 7.75V10.75C9 11.1642 8.66421 11.5 8.25 11.5C7.83579 11.5 7.5 11.1642 7.5 10.75V9.56066L5.53033 11.5303C5.23744 11.8232 4.76256 11.8232 4.46967 11.5303C4.17678 11.2374 4.17678 10.7626 4.46967 10.4697L6.43934 8.5H5.25C4.83579 8.5 4.5 8.16421 4.5 7.75Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'newtab_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M4 2.75C4 2.05964 4.55964 1.5 5.25 1.5H13.25C13.9404 1.5 14.5 2.05964 14.5 2.75V10.75C14.5 11.4404 13.9404 12 13.25 12H12V13.25C12 13.9404 11.4404 14.5 10.75 14.5H2.75C2.05964 14.5 1.5 13.9404 1.5 13.25V5.25C1.5 4.55964 2.05964 4 2.75 4H4V2.75ZM5.5 4H10.75C11.4404 4 12 4.55964 12 5.25V10.5H13V3H5.5V4ZM4.5 7.75C4.5 7.33579 4.83579 7 5.25 7H8.25C8.66421 7 9 7.33579 9 7.75V10.75C9 11.1642 8.66421 11.5 8.25 11.5C7.83579 11.5 7.5 11.1642 7.5 10.75V9.56066L5.53033 11.5303C5.23744 11.8232 4.76256 11.8232 4.46967 11.5303C4.17678 11.2374 4.17678 10.7626 4.46967 10.4697L6.43934 8.5H5.25C4.83579 8.5 4.5 8.16421 4.5 7.75Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
