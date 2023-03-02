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

export const DatasheetFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M10.75 2.25C10.75 1.83579 10.4142 1.5 10 1.5C9.58579 1.5 9.25 1.83579 9.25 2.25V5.25H6.75V2.25C6.75 1.83579 6.41421 1.5 6 1.5C5.58579 1.5 5.25 1.83579 5.25 2.25L5.25 5.25H2.25C1.83579 5.25 1.5 5.58579 1.5 6C1.5 6.41421 1.83579 6.75 2.25 6.75H5.25V9.25H2.25C1.83579 9.25 1.5 9.58579 1.5 10C1.5 10.4142 1.83579 10.75 2.25 10.75H5.25L5.25 13.75C5.25 14.1642 5.58579 14.5 6 14.5C6.41421 14.5 6.75 14.1642 6.75 13.75V10.75H9.25V13.75C9.25 14.1642 9.58579 14.5 10 14.5C10.4142 14.5 10.75 14.1642 10.75 13.75V10.75H13.75C14.1642 10.75 14.5 10.4142 14.5 10C14.5 9.58579 14.1642 9.25 13.75 9.25H10.75V6.75H13.75C14.1642 6.75 14.5 6.41421 14.5 6C14.5 5.58579 14.1642 5.25 13.75 5.25H10.75V2.25ZM6.75 9.25L6.75 6.75H9.25V9.25H6.75Z" fill={ colors[0] }/>

  </>,
  name: 'datasheet_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M10.75 2.25C10.75 1.83579 10.4142 1.5 10 1.5C9.58579 1.5 9.25 1.83579 9.25 2.25V5.25H6.75V2.25C6.75 1.83579 6.41421 1.5 6 1.5C5.58579 1.5 5.25 1.83579 5.25 2.25L5.25 5.25H2.25C1.83579 5.25 1.5 5.58579 1.5 6C1.5 6.41421 1.83579 6.75 2.25 6.75H5.25V9.25H2.25C1.83579 9.25 1.5 9.58579 1.5 10C1.5 10.4142 1.83579 10.75 2.25 10.75H5.25L5.25 13.75C5.25 14.1642 5.58579 14.5 6 14.5C6.41421 14.5 6.75 14.1642 6.75 13.75V10.75H9.25V13.75C9.25 14.1642 9.58579 14.5 10 14.5C10.4142 14.5 10.75 14.1642 10.75 13.75V10.75H13.75C14.1642 10.75 14.5 10.4142 14.5 10C14.5 9.58579 14.1642 9.25 13.75 9.25H10.75V6.75H13.75C14.1642 6.75 14.5 6.41421 14.5 6C14.5 5.58579 14.1642 5.25 13.75 5.25H10.75V2.25ZM6.75 9.25L6.75 6.75H9.25V9.25H6.75Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
