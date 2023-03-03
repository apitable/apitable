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

export const GridFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2.75 1.5C2.05964 1.5 1.5 2.05964 1.5 2.75V5.25L5.25 5.25V1.5H2.75Z" fill={ colors[0] }/>
    <path d="M1.5 9.25V6.75H5.25V9.25H1.5Z" fill={ colors[0] }/>
    <path d="M1.5 10.75V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H5.25V10.75H1.5Z" fill={ colors[0] }/>
    <path d="M6.75 10.75V14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V10.75L6.75 10.75Z" fill={ colors[0] }/>
    <path d="M14.5 9.25V6.75L6.75 6.75V9.25L14.5 9.25Z" fill={ colors[0] }/>
    <path d="M14.5 2.75V5.25L6.75 5.25V1.5H13.25C13.9404 1.5 14.5 2.05964 14.5 2.75Z" fill={ colors[0] }/>

  </>,
  name: 'grid_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M2.75 1.5C2.05964 1.5 1.5 2.05964 1.5 2.75V5.25L5.25 5.25V1.5H2.75Z', 'M1.5 9.25V6.75H5.25V9.25H1.5Z', 'M1.5 10.75V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H5.25V10.75H1.5Z', 'M6.75 10.75V14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V10.75L6.75 10.75Z', 'M14.5 9.25V6.75L6.75 6.75V9.25L14.5 9.25Z', 'M14.5 2.75V5.25L6.75 5.25V1.5H13.25C13.9404 1.5 14.5 2.05964 14.5 2.75Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
