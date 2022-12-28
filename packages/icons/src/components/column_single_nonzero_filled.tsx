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

export const ColumnSingleNonzeroFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8ZM7.6 9.96667C7.8 10.2333 8.2 10.2333 8.4 9.96667L10.4 7.3C10.6472 6.97038 10.412 6.5 9.99998 6.5H6C5.588 6.5 5.3528 6.97038 5.6 7.3L7.6 9.96667Z" fill={ colors[0] }/>

  </>,
  name: 'column_single_nonzero_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8ZM7.6 9.96667C7.8 10.2333 8.2 10.2333 8.4 9.96667L10.4 7.3C10.6472 6.97038 10.412 6.5 9.99998 6.5H6C5.588 6.5 5.3528 6.97038 5.6 7.3L7.6 9.96667Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
