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

export const TriangleLeftOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3.53092 6.94C2.74759 7.42959 2.74759 8.57041 3.53092 9.06L10.0875 13.1579C10.9201 13.6782 12 13.0797 12 12.0979L12 3.90212C12 2.92033 10.9201 2.32177 10.0875 2.84212L3.53092 6.94ZM10.5 11.6468L4.66512 8L10.5 4.35319V11.6468Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'triangle_left_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M3.53092 6.94C2.74759 7.42959 2.74759 8.57041 3.53092 9.06L10.0875 13.1579C10.9201 13.6782 12 13.0797 12 12.0979L12 3.90212C12 2.92033 10.9201 2.32177 10.0875 2.84212L3.53092 6.94ZM10.5 11.6468L4.66512 8L10.5 4.35319V11.6468Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
