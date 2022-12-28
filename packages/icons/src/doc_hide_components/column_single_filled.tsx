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

export const ColumnSingleFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8ZM8.4 9.96667C8.2 10.2333 7.8 10.2333 7.6 9.96667L5.60002 7.3C5.35281 6.97038 5.588 6.5 6.00002 6.5H10C10.412 6.5 10.6472 6.97038 10.4 7.3L8.4 9.96667Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'column_single_filled',
  defaultColors: ['#636363'],
  colorful: false,
  allPathData: ['M2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8ZM8.4 9.96667C8.2 10.2333 7.8 10.2333 7.6 9.96667L5.60002 7.3C5.35281 6.97038 5.588 6.5 6.00002 6.5H10C10.412 6.5 10.6472 6.97038 10.4 7.3L8.4 9.96667Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
