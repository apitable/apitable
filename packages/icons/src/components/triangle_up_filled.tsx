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

export const TriangleUpFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M6.94002 3.53092C7.42961 2.74759 8.57044 2.74759 9.06002 3.53092L13.1579 10.0875C13.6782 10.9201 13.0797 12 12.0979 12H3.90214C2.92035 12 2.3218 10.9201 2.84215 10.0875L6.94002 3.53092Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'triangle_up_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M6.94002 3.53092C7.42961 2.74759 8.57044 2.74759 9.06002 3.53092L13.1579 10.0875C13.6782 10.9201 13.0797 12 12.0979 12H3.90214C2.92035 12 2.3218 10.9201 2.84215 10.0875L6.94002 3.53092Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
