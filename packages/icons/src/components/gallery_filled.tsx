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

export const GalleryFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M9.75 1.5C9.05964 1.5 8.5 2.05964 8.5 2.75V6.25C8.5 6.94036 9.05964 7.5 9.75 7.5H13.25C13.9404 7.5 14.5 6.94036 14.5 6.25V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H9.75Z" fill={ colors[0] }/>
    <path d="M2.75 8.5C2.05964 8.5 1.5 9.05964 1.5 9.75V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H6.25C6.94036 14.5 7.5 13.9404 7.5 13.25V9.75C7.5 9.05964 6.94036 8.5 6.25 8.5H2.75Z" fill={ colors[0] }/>
    <path d="M8.5 9.75C8.5 9.05964 9.05964 8.5 9.75 8.5H13.25C13.9404 8.5 14.5 9.05964 14.5 9.75V13.25C14.5 13.9404 13.9404 14.5 13.25 14.5H9.75C9.05964 14.5 8.5 13.9404 8.5 13.25V9.75Z" fill={ colors[0] }/>
    <path d="M2.75 1.5C2.05964 1.5 1.5 2.05964 1.5 2.75V6.25C1.5 6.94036 2.05964 7.5 2.75 7.5H6.25C6.94036 7.5 7.5 6.94036 7.5 6.25V2.75C7.5 2.05964 6.94036 1.5 6.25 1.5H2.75Z" fill={ colors[0] }/>

  </>,
  name: 'gallery_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M9.75 1.5C9.05964 1.5 8.5 2.05964 8.5 2.75V6.25C8.5 6.94036 9.05964 7.5 9.75 7.5H13.25C13.9404 7.5 14.5 6.94036 14.5 6.25V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H9.75Z', 'M2.75 8.5C2.05964 8.5 1.5 9.05964 1.5 9.75V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H6.25C6.94036 14.5 7.5 13.9404 7.5 13.25V9.75C7.5 9.05964 6.94036 8.5 6.25 8.5H2.75Z', 'M8.5 9.75C8.5 9.05964 9.05964 8.5 9.75 8.5H13.25C13.9404 8.5 14.5 9.05964 14.5 9.75V13.25C14.5 13.9404 13.9404 14.5 13.25 14.5H9.75C9.05964 14.5 8.5 13.9404 8.5 13.25V9.75Z', 'M2.75 1.5C2.05964 1.5 1.5 2.05964 1.5 2.75V6.25C1.5 6.94036 2.05964 7.5 2.75 7.5H6.25C6.94036 7.5 7.5 6.94036 7.5 6.25V2.75C7.5 2.05964 6.94036 1.5 6.25 1.5H2.75Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
