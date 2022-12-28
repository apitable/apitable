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

export const ColumnCalendarNonzeroFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M4.5 8C4.5 7.44772 4.94772 7 5.5 7H7.5C8.05228 7 8.5 7.44772 8.5 8C8.5 8.55228 8.05228 9 7.5 9H5.5C4.94772 9 4.5 8.55228 4.5 8Z" fill={ colors[0] }/>
    <path d="M5.5 10C4.94772 10 4.5 10.4477 4.5 11C4.5 11.5523 4.94772 12 5.5 12H10.5C11.0523 12 11.5 11.5523 11.5 11C11.5 10.4477 11.0523 10 10.5 10H5.5Z" fill={ colors[0] }/>
    <path d="M9 2C9 1.44772 9.44772 1 10 1C10.5523 1 11 1.44772 11 2V3H12C13.1046 3 14 3.89543 14 5V12C14 13.1046 13.1046 14 12 14H4C2.89543 14 2 13.1046 2 12V5C2 3.89543 2.89543 3 4 3H5V2C5 1.44772 5.44772 1 6 1C6.55228 1 7 1.44772 7 2V3H9V2ZM4 6C3.44772 6 3 6.44771 3 7V12C3 12.5523 3.44772 13 4 13H12C12.5523 13 13 12.5523 13 12V7C13 6.44771 12.5523 6 12 6H4Z" fill={ colors[0] }/>

  </>,
  name: 'column_calendar_nonzero_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M4.5 8C4.5 7.44772 4.94772 7 5.5 7H7.5C8.05228 7 8.5 7.44772 8.5 8C8.5 8.55228 8.05228 9 7.5 9H5.5C4.94772 9 4.5 8.55228 4.5 8Z', 'M5.5 10C4.94772 10 4.5 10.4477 4.5 11C4.5 11.5523 4.94772 12 5.5 12H10.5C11.0523 12 11.5 11.5523 11.5 11C11.5 10.4477 11.0523 10 10.5 10H5.5Z', 'M9 2C9 1.44772 9.44772 1 10 1C10.5523 1 11 1.44772 11 2V3H12C13.1046 3 14 3.89543 14 5V12C14 13.1046 13.1046 14 12 14H4C2.89543 14 2 13.1046 2 12V5C2 3.89543 2.89543 3 4 3H5V2C5 1.44772 5.44772 1 6 1C6.55228 1 7 1.44772 7 2V3H9V2ZM4 6C3.44772 6 3 6.44771 3 7V12C3 12.5523 3.44772 13 4 13H12C12.5523 13 13 12.5523 13 12V7C13 6.44771 12.5523 6 12 6H4Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
