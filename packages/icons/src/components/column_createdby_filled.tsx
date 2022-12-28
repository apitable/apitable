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

export const ColumnCreatedbyFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M9.8 8.2C10.4 8.4 10.9 8.6 11.4 8.9C9.8 9.4 8.7 10.9 8.6 12.7C8.6 13.0314 8.66863 13.2941 8.74903 13.6019C8.76569 13.6657 8.78284 13.7314 8.8 13.8H4.9C3.6 13.8 2.5 12.8 2.5 11.4C2.5 10.9 2.6 10.5 3 10.1C3.6 9.5 4.7 8.6 6.2 8.2C5.2 7.6 4.5 6.6 4.5 5.3C4.5 3.4 6.1 1.8 8 1.8C9.9 1.8 11.5 3.4 11.5 5.3C11.5 6.5 10.8 7.6 9.8 8.2ZM12.7 11.2H13.2C13.7 11.2 14 11.5 14 12C14 12.5 13.6 12.8 13.2 12.8H12.7V13.3C12.7 13.8 12.4 14.1 11.9 14.1C11.4 14.1 11.1 13.7 11.1 13.3V12.8H10.6C10.1 12.8 9.8 12.5 9.8 12C9.8 11.5 10.2 11.2 10.6 11.2H11.1V10.7C11.1 10.2 11.4 9.9 11.9 9.9C12.4 9.9 12.7 10.3 12.7 10.7V11.2Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'column_createdby_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M9.8 8.2C10.4 8.4 10.9 8.6 11.4 8.9C9.8 9.4 8.7 10.9 8.6 12.7C8.6 13.0314 8.66863 13.2941 8.74903 13.6019C8.76569 13.6657 8.78284 13.7314 8.8 13.8H4.9C3.6 13.8 2.5 12.8 2.5 11.4C2.5 10.9 2.6 10.5 3 10.1C3.6 9.5 4.7 8.6 6.2 8.2C5.2 7.6 4.5 6.6 4.5 5.3C4.5 3.4 6.1 1.8 8 1.8C9.9 1.8 11.5 3.4 11.5 5.3C11.5 6.5 10.8 7.6 9.8 8.2ZM12.7 11.2H13.2C13.7 11.2 14 11.5 14 12C14 12.5 13.6 12.8 13.2 12.8H12.7V13.3C12.7 13.8 12.4 14.1 11.9 14.1C11.4 14.1 11.1 13.7 11.1 13.3V12.8H10.6C10.1 12.8 9.8 12.5 9.8 12C9.8 11.5 10.2 11.2 10.6 11.2H11.1V10.7C11.1 10.2 11.4 9.9 11.9 9.9C12.4 9.9 12.7 10.3 12.7 10.7V11.2Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
