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

export const ColumnLookupFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3 1C1.89543 1 1 1.89543 1 3V11C1 12.1046 1.89543 13 3 13H7.75777C7.27914 12.285 7 11.4251 7 10.5C7 8.01472 9.01472 6 11.5 6C12.9136 6 14.175 6.65183 15 7.67133V3C15 1.89543 14.1046 1 13 1H3ZM12 3C12.5523 3 13 3.44772 13 4C13 4.51284 12.614 4.93551 12.1166 4.99327L12 5H4C3.44772 5 3 4.55228 3 4C3 3.48716 3.38604 3.06449 3.88338 3.00673L4 3H12ZM6.3 8C6.3 7.44772 5.85228 7 5.3 7H4L3.88338 7.00673C3.38604 7.06449 3 7.48716 3 8C3 8.55228 3.44772 9 4 9H5.3L5.41662 8.99327C5.91396 8.93551 6.3 8.51284 6.3 8ZM8.25 10.5C8.25 8.70507 9.70507 7.25 11.5 7.25C13.2949 7.25 14.75 8.70507 14.75 10.5C14.75 11.033 14.6217 11.5361 14.3942 11.98L15.1213 12.7071C15.5118 13.0976 15.5118 13.7308 15.1213 14.1213C14.7608 14.4818 14.1936 14.5095 13.8013 14.2045L13.7071 14.1213L12.98 13.3942C12.5361 13.6217 12.033 13.75 11.5 13.75C9.70507 13.75 8.25 12.2949 8.25 10.5ZM12.75 10.5C12.75 9.80964 12.1904 9.25 11.5 9.25C10.8096 9.25 10.25 9.80964 10.25 10.5C10.25 11.1904 10.8096 11.75 11.5 11.75C12.1904 11.75 12.75 11.1904 12.75 10.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'column_lookup_filled',
  defaultColors: ['#636363'],
  colorful: false,
  allPathData: ['M3 1C1.89543 1 1 1.89543 1 3V11C1 12.1046 1.89543 13 3 13H7.75777C7.27914 12.285 7 11.4251 7 10.5C7 8.01472 9.01472 6 11.5 6C12.9136 6 14.175 6.65183 15 7.67133V3C15 1.89543 14.1046 1 13 1H3ZM12 3C12.5523 3 13 3.44772 13 4C13 4.51284 12.614 4.93551 12.1166 4.99327L12 5H4C3.44772 5 3 4.55228 3 4C3 3.48716 3.38604 3.06449 3.88338 3.00673L4 3H12ZM6.3 8C6.3 7.44772 5.85228 7 5.3 7H4L3.88338 7.00673C3.38604 7.06449 3 7.48716 3 8C3 8.55228 3.44772 9 4 9H5.3L5.41662 8.99327C5.91396 8.93551 6.3 8.51284 6.3 8ZM8.25 10.5C8.25 8.70507 9.70507 7.25 11.5 7.25C13.2949 7.25 14.75 8.70507 14.75 10.5C14.75 11.033 14.6217 11.5361 14.3942 11.98L15.1213 12.7071C15.5118 13.0976 15.5118 13.7308 15.1213 14.1213C14.7608 14.4818 14.1936 14.5095 13.8013 14.2045L13.7071 14.1213L12.98 13.3942C12.5361 13.6217 12.033 13.75 11.5 13.75C9.70507 13.75 8.25 12.2949 8.25 10.5ZM12.75 10.5C12.75 9.80964 12.1904 9.25 11.5 9.25C10.8096 9.25 10.25 9.80964 10.25 10.5C10.25 11.1904 10.8096 11.75 11.5 11.75C12.1904 11.75 12.75 11.1904 12.75 10.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
