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
    <path d="M5.25 1.5C4.55964 1.5 4 2.05964 4 2.75V4.5H2.69048C2.03299 4.5 1.5 5.03299 1.5 5.69048V13.3095C1.5 13.967 2.03299 14.5 2.69048 14.5H10.3095C10.967 14.5 11.5 13.967 11.5 13.3095V12H13.25C13.9404 12 14.5 11.4404 14.5 10.75V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H5.25ZM11.5 10.5H13V3H5.5V4.5H10.3095C10.967 4.5 11.5 5.03299 11.5 5.69048V10.5ZM4.5 7.75C4.5 7.33579 4.83579 7 5.25 7H8.25C8.66421 7 9 7.33579 9 7.75V10.75C9 11.1642 8.66421 11.5 8.25 11.5C7.83579 11.5 7.5 11.1642 7.5 10.75V9.56066L5.28033 11.7803C4.98744 12.0732 4.51256 12.0732 4.21967 11.7803C3.92678 11.4874 3.92678 11.0126 4.21967 10.7197L6.43934 8.5H5.25C4.83579 8.5 4.5 8.16421 4.5 7.75Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'newtab_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M5.25 1.5C4.55964 1.5 4 2.05964 4 2.75V4.5H2.69048C2.03299 4.5 1.5 5.03299 1.5 5.69048V13.3095C1.5 13.967 2.03299 14.5 2.69048 14.5H10.3095C10.967 14.5 11.5 13.967 11.5 13.3095V12H13.25C13.9404 12 14.5 11.4404 14.5 10.75V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H5.25ZM11.5 10.5H13V3H5.5V4.5H10.3095C10.967 4.5 11.5 5.03299 11.5 5.69048V10.5ZM4.5 7.75C4.5 7.33579 4.83579 7 5.25 7H8.25C8.66421 7 9 7.33579 9 7.75V10.75C9 11.1642 8.66421 11.5 8.25 11.5C7.83579 11.5 7.5 11.1642 7.5 10.75V9.56066L5.28033 11.7803C4.98744 12.0732 4.51256 12.0732 4.21967 11.7803C3.92678 11.4874 3.92678 11.0126 4.21967 10.7197L6.43934 8.5H5.25C4.83579 8.5 4.5 8.16421 4.5 7.75Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
