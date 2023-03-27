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

export const GridOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2.75 1.5C2.05964 1.5 1.5 2.05964 1.5 2.75V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5L6 14.5L13.25 14.5C13.9404 14.5 14.5 13.9404 14.5 13.25V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H2.75ZM13 9.25V6.75H6.75V9.25H13ZM6.75 10.75H13V13H6.75V10.75ZM5.25 9.25V6.75H3V9.25H5.25ZM3 10.75H5.25V13H3V10.75ZM3 5.25H5.25V3H3V5.25ZM6.75 5.25H13V3H6.75V5.25Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'grid_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M2.75 1.5C2.05964 1.5 1.5 2.05964 1.5 2.75V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5L6 14.5L13.25 14.5C13.9404 14.5 14.5 13.9404 14.5 13.25V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H2.75ZM13 9.25V6.75H6.75V9.25H13ZM6.75 10.75H13V13H6.75V10.75ZM5.25 9.25V6.75H3V9.25H5.25ZM3 10.75H5.25V13H3V10.75ZM3 5.25H5.25V3H3V5.25ZM6.75 5.25H13V3H6.75V5.25Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
