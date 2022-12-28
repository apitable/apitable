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

export const ColumnCalendarFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M9 2C9 1.44772 9.44772 1 10 1C10.5523 1 11 1.44772 11 2V3V3.00005H12C13.1046 3.00005 14 3.89548 14 5.00005V12C14 13.1046 13.1046 14 12 14H4C2.89543 14 2 13.1046 2 12V5.00005C2 3.89548 2.89543 3.00005 4 3.00005H5C5 3.00003 5 3.00002 5 3V2C5 1.44772 5.44772 1 6 1C6.55228 1 7 1.44772 7 2V3C7 3.00002 7 3.00003 7 3.00005H9V3V2ZM4 6.00005C3.44772 6.00005 3 6.44776 3 7.00005V12C3 12.5523 3.44772 13 4 13H12C12.5523 13 13 12.5523 13 12V7.00005C13 6.44776 12.5523 6.00005 12 6.00005H4Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <rect x="4.5" y="7" width="4" height="2" rx="1" fill={ colors[0] }/>
    <rect x="4.5" y="10" width="7" height="2" rx="1" fill={ colors[0] }/>

  </>,
  name: 'column_calendar_filled',
  defaultColors: ['#636363'],
  colorful: false,
  allPathData: ['M9 2C9 1.44772 9.44772 1 10 1C10.5523 1 11 1.44772 11 2V3V3.00005H12C13.1046 3.00005 14 3.89548 14 5.00005V12C14 13.1046 13.1046 14 12 14H4C2.89543 14 2 13.1046 2 12V5.00005C2 3.89548 2.89543 3.00005 4 3.00005H5C5 3.00003 5 3.00002 5 3V2C5 1.44772 5.44772 1 6 1C6.55228 1 7 1.44772 7 2V3C7 3.00002 7 3.00003 7 3.00005H9V3V2ZM4 6.00005C3.44772 6.00005 3 6.44776 3 7.00005V12C3 12.5523 3.44772 13 4 13H12C12.5523 13 13 12.5523 13 12V7.00005C13 6.44776 12.5523 6.00005 12 6.00005H4Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
