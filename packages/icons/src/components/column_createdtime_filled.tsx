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

export const ColumnCreatedtimeFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8 15C11.9 15 15 11.9 15 8C15 4.1 11.9 1 8 1C4.1 1 1 4.1 1 8C1 11.9 4.1 15 8 15ZM7 4.5C7 3.9 7.4 3.5 8 3.5C8.6 3.5 9 3.9 9 4.5V7.7H10.5C11.1 7.7 11.5 8.1 11.5 8.7C11.5 9.3 11.1 9.7 10.5 9.7H8C7.6 9.7 7.2 9.4 7.1 9C7 8.9 7 8.8 7 8.7V4.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'column_createdtime_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M8 15C11.9 15 15 11.9 15 8C15 4.1 11.9 1 8 1C4.1 1 1 4.1 1 8C1 11.9 4.1 15 8 15ZM7 4.5C7 3.9 7.4 3.5 8 3.5C8.6 3.5 9 3.9 9 4.5V7.7H10.5C11.1 7.7 11.5 8.1 11.5 8.7C11.5 9.3 11.1 9.7 10.5 9.7H8C7.6 9.7 7.2 9.4 7.1 9C7 8.9 7 8.8 7 8.7V4.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
