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

export const FolderDownFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2.25 2C1.55964 2 1 2.55964 1 3.25V12.75C1 13.4404 1.55964 14 2.25 14H13.75C14.4404 14 15 13.4404 15 12.75V4.75C15 4.05964 14.4404 3.5 13.75 3.5H10.6667C10.3962 3.5 10.133 3.41228 9.91667 3.25L8.58333 2.25C8.36696 2.08772 8.1038 2 7.83333 2H2.25ZM7.48315 11.3116L5.71539 9.54381C5.42249 9.25092 5.42249 8.77605 5.71539 8.48315C6.00828 8.19026 6.48315 8.19026 6.77605 8.48315L7.22784 8.93495V6.25391C7.22784 5.83969 7.56363 5.50391 7.97784 5.50391C8.39205 5.50391 8.72784 5.83969 8.72784 6.25391V9.00623L9.25092 8.48315C9.54381 8.19026 10.0187 8.19026 10.3116 8.48315C10.6045 8.77605 10.6045 9.25092 10.3116 9.54381L8.54381 11.3116C8.25092 11.6045 7.77605 11.6045 7.48315 11.3116Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'folder_down_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M2.25 2C1.55964 2 1 2.55964 1 3.25V12.75C1 13.4404 1.55964 14 2.25 14H13.75C14.4404 14 15 13.4404 15 12.75V4.75C15 4.05964 14.4404 3.5 13.75 3.5H10.6667C10.3962 3.5 10.133 3.41228 9.91667 3.25L8.58333 2.25C8.36696 2.08772 8.1038 2 7.83333 2H2.25ZM7.48315 11.3116L5.71539 9.54381C5.42249 9.25092 5.42249 8.77605 5.71539 8.48315C6.00828 8.19026 6.48315 8.19026 6.77605 8.48315L7.22784 8.93495V6.25391C7.22784 5.83969 7.56363 5.50391 7.97784 5.50391C8.39205 5.50391 8.72784 5.83969 8.72784 6.25391V9.00623L9.25092 8.48315C9.54381 8.19026 10.0187 8.19026 10.3116 8.48315C10.6045 8.77605 10.6045 9.25092 10.3116 9.54381L8.54381 11.3116C8.25092 11.6045 7.77605 11.6045 7.48315 11.3116Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
