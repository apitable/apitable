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

export const ColumnCurrencyFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M13 8.00003C13 8.55231 12.5523 9.00003 12 9.00003H9V10H12C12.5523 10 13 10.4477 13 11V11C13 11.5523 12.5523 12 12 12H8.99988V13.5264C8.99988 14.0787 8.55219 14.5264 7.99994 14.5264V14.5264C7.44769 14.5264 7 14.0787 7 13.5264V12H4C3.44772 12 3 11.5523 3 11V11C3 10.4477 3.44772 10 4 10H7V9.00003H4C3.44772 9.00003 3 8.55231 3 8.00003V8.00003C3 7.44774 3.44772 7.00003 4 7.00003H5.7959L3.88427 3.25754C3.47987 2.46582 4.05491 1.52637 4.94394 1.52637V1.52637C5.4029 1.52637 5.82095 1.79033 6.01827 2.20471L8 6.3665L10.0102 2.19075C10.2057 1.7846 10.6166 1.52637 11.0674 1.52637V1.52637C11.9478 1.52637 12.5145 2.45993 12.1083 3.24101L10.1535 7.00003H12C12.5523 7.00003 13 7.44774 13 8.00003V8.00003Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'column_currency_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M13 8.00003C13 8.55231 12.5523 9.00003 12 9.00003H9V10H12C12.5523 10 13 10.4477 13 11V11C13 11.5523 12.5523 12 12 12H8.99988V13.5264C8.99988 14.0787 8.55219 14.5264 7.99994 14.5264V14.5264C7.44769 14.5264 7 14.0787 7 13.5264V12H4C3.44772 12 3 11.5523 3 11V11C3 10.4477 3.44772 10 4 10H7V9.00003H4C3.44772 9.00003 3 8.55231 3 8.00003V8.00003C3 7.44774 3.44772 7.00003 4 7.00003H5.7959L3.88427 3.25754C3.47987 2.46582 4.05491 1.52637 4.94394 1.52637V1.52637C5.4029 1.52637 5.82095 1.79033 6.01827 2.20471L8 6.3665L10.0102 2.19075C10.2057 1.7846 10.6166 1.52637 11.0674 1.52637V1.52637C11.9478 1.52637 12.5145 2.45993 12.1083 3.24101L10.1535 7.00003H12C12.5523 7.00003 13 7.44774 13 8.00003V8.00003Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
