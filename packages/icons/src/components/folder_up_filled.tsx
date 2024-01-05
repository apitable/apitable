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

export const FolderUpFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2.25 2C1.55964 2 1 2.55964 1 3.25V12.75C1 13.4404 1.55964 14 2.25 14H13.75C14.4404 14 15 13.4404 15 12.75V4.75C15 4.05964 14.4404 3.5 13.75 3.5H10.6667C10.3962 3.5 10.133 3.41228 9.91667 3.25L8.58333 2.25C8.36696 2.08772 8.1038 2 7.83333 2H2.25ZM7.48315 5.72358L5.71539 7.49134C5.42249 7.78424 5.42249 8.25911 5.71539 8.552C6.00828 8.8449 6.48315 8.8449 6.77605 8.552L7.22784 8.10021V10.7812C7.22784 11.1955 7.56363 11.5312 7.97784 11.5312C8.39205 11.5312 8.72784 11.1955 8.72784 10.7812V8.02892L9.25092 8.552C9.54381 8.8449 10.0187 8.8449 10.3116 8.552C10.6045 8.25911 10.6045 7.78424 10.3116 7.49134L8.54381 5.72358C8.25092 5.43068 7.77605 5.43068 7.48315 5.72358Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'folder_up_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M2.25 2C1.55964 2 1 2.55964 1 3.25V12.75C1 13.4404 1.55964 14 2.25 14H13.75C14.4404 14 15 13.4404 15 12.75V4.75C15 4.05964 14.4404 3.5 13.75 3.5H10.6667C10.3962 3.5 10.133 3.41228 9.91667 3.25L8.58333 2.25C8.36696 2.08772 8.1038 2 7.83333 2H2.25ZM7.48315 5.72358L5.71539 7.49134C5.42249 7.78424 5.42249 8.25911 5.71539 8.552C6.00828 8.8449 6.48315 8.8449 6.77605 8.552L7.22784 8.10021V10.7812C7.22784 11.1955 7.56363 11.5312 7.97784 11.5312C8.39205 11.5312 8.72784 11.1955 8.72784 10.7812V8.02892L9.25092 8.552C9.54381 8.8449 10.0187 8.8449 10.3116 8.552C10.6045 8.25911 10.6045 7.78424 10.3116 7.49134L8.54381 5.72358C8.25092 5.43068 7.77605 5.43068 7.48315 5.72358Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
