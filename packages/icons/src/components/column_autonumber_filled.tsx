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

export const ColumnAutonumberFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3 2C2.4 2 2 2.4 2 3C2 3.6 2.4 4 3 4H7C7.6 4 8 3.6 8 3C8 2.4 7.6 2 7 2H3ZM7 7H3C2.4 7 2 7.4 2 8C2 8.6 2.4 9 3 9H7C7.6 9 8 8.6 8 8C8 7.4 7.6 7 7 7ZM2 13C2 12.4 2.4 12 3 12H5.3C5.9 12 6.3 12.4 6.3 13C6.3 13.6 5.9 14 5.3 14H3C2.4 14 2 13.6 2 13ZM12 3C12 2.4 11.6 2 11 2C10.4 2 10 2.4 10 3V13C10 13.4 10.2 13.8 10.6 13.9C11 14.1 11.4 14 11.7 13.7L15 10.4C15.4 10 15.4 9.4 15 9C14.6 8.6 14 8.6 13.6 9L12 10.6V3Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'column_autonumber_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M3 2C2.4 2 2 2.4 2 3C2 3.6 2.4 4 3 4H7C7.6 4 8 3.6 8 3C8 2.4 7.6 2 7 2H3ZM7 7H3C2.4 7 2 7.4 2 8C2 8.6 2.4 9 3 9H7C7.6 9 8 8.6 8 8C8 7.4 7.6 7 7 7ZM2 13C2 12.4 2.4 12 3 12H5.3C5.9 12 6.3 12.4 6.3 13C6.3 13.6 5.9 14 5.3 14H3C2.4 14 2 13.6 2 13ZM12 3C12 2.4 11.6 2 11 2C10.4 2 10 2.4 10 3V13C10 13.4 10.2 13.8 10.6 13.9C11 14.1 11.4 14 11.7 13.7L15 10.4C15.4 10 15.4 9.4 15 9C14.6 8.6 14 8.6 13.6 9L12 10.6V3Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
