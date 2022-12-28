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

export const ZanOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7.4 1C7.00481 1 6.64669 1.23273 6.48619 1.59386L4.5279 6H3C1.89543 6 1 6.89543 1 8V13C1 14.1046 1.89543 15 3 15L5 15L6 15L11.9672 15C13.0611 15.0092 13.996 14.2129 14.1606 13.1308L14.1607 13.13L14.9884 7.73156L14.9887 7.73006C15.0855 7.09186 14.8972 6.44341 14.4737 5.95634C14.0516 5.47091 13.4382 5.1946 12.7952 5.2H10.2V3.8C10.2 2.2536 8.94638 1 7.4 1ZM6 13H11.972H11.9833L11.9833 13.0001C12.083 13.0012 12.1683 12.9287 12.1833 12.83L12.1836 12.8284L13.0113 7.42994L13.0114 7.42962C13.0201 7.37172 13.003 7.31291 12.9645 7.26866L12.9645 7.26865C12.926 7.2244 12.87 7.19927 12.8114 7.19994L12.8 7.20006V7.2H9.2C8.64772 7.2 8.2 6.75228 8.2 6.2V3.8C8.2 3.57209 8.1047 3.36645 7.95177 3.22073L6 7.61221V13ZM4 13V8H3V13H4Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'zan_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M7.4 1C7.00481 1 6.64669 1.23273 6.48619 1.59386L4.5279 6H3C1.89543 6 1 6.89543 1 8V13C1 14.1046 1.89543 15 3 15L5 15L6 15L11.9672 15C13.0611 15.0092 13.996 14.2129 14.1606 13.1308L14.1607 13.13L14.9884 7.73156L14.9887 7.73006C15.0855 7.09186 14.8972 6.44341 14.4737 5.95634C14.0516 5.47091 13.4382 5.1946 12.7952 5.2H10.2V3.8C10.2 2.2536 8.94638 1 7.4 1ZM6 13H11.972H11.9833L11.9833 13.0001C12.083 13.0012 12.1683 12.9287 12.1833 12.83L12.1836 12.8284L13.0113 7.42994L13.0114 7.42962C13.0201 7.37172 13.003 7.31291 12.9645 7.26866L12.9645 7.26865C12.926 7.2244 12.87 7.19927 12.8114 7.19994L12.8 7.20006V7.2H9.2C8.64772 7.2 8.2 6.75228 8.2 6.2V3.8C8.2 3.57209 8.1047 3.36645 7.95177 3.22073L6 7.61221V13ZM4 13V8H3V13H4Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
