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

export const DesktopOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3 3V10H8H13V3H3ZM9 12H14C14.5523 12 15 11.5523 15 11V2C15 1.44772 14.5523 1 14 1H2C1.44772 1 1 1.44771 1 2V11C1 11.5523 1.44772 12 2 12H7V13H5C4.44772 13 4 13.4477 4 14C4 14.5523 4.44772 15 5 15H8H11C11.5523 15 12 14.5523 12 14C12 13.4477 11.5523 13 11 13H9V12ZM4.69957 6.14371C4.31321 6.53835 4.31992 7.17148 4.71457 7.55784C5.10921 7.94421 5.74234 7.93749 6.1287 7.54285L7.52784 6.11372C7.9142 5.71907 7.90748 5.08594 7.51284 4.69958C7.11819 4.31322 6.48506 4.31993 6.0987 4.71458L4.69957 6.14371ZM8.9421 7.55784C8.54746 7.17148 8.54075 6.53835 8.92711 6.14371L10.3262 4.71458C10.7126 4.31993 11.3457 4.31322 11.7404 4.69958C12.135 5.08594 12.1417 5.71907 11.7554 6.11372L10.3562 7.54285C9.96988 7.93749 9.33675 7.94421 8.9421 7.55784Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'desktop_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M3 3V10H8H13V3H3ZM9 12H14C14.5523 12 15 11.5523 15 11V2C15 1.44772 14.5523 1 14 1H2C1.44772 1 1 1.44771 1 2V11C1 11.5523 1.44772 12 2 12H7V13H5C4.44772 13 4 13.4477 4 14C4 14.5523 4.44772 15 5 15H8H11C11.5523 15 12 14.5523 12 14C12 13.4477 11.5523 13 11 13H9V12ZM4.69957 6.14371C4.31321 6.53835 4.31992 7.17148 4.71457 7.55784C5.10921 7.94421 5.74234 7.93749 6.1287 7.54285L7.52784 6.11372C7.9142 5.71907 7.90748 5.08594 7.51284 4.69958C7.11819 4.31322 6.48506 4.31993 6.0987 4.71458L4.69957 6.14371ZM8.9421 7.55784C8.54746 7.17148 8.54075 6.53835 8.92711 6.14371L10.3262 4.71458C10.7126 4.31993 11.3457 4.31322 11.7404 4.69958C12.135 5.08594 12.1417 5.71907 11.7554 6.11372L10.3562 7.54285C9.96988 7.93749 9.33675 7.94421 8.9421 7.55784Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
