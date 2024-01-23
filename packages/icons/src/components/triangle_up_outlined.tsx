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

export const TriangleUpOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M9.06002 3.5309C8.57044 2.74757 7.42961 2.74756 6.94002 3.5309L2.84215 10.0875C2.3218 10.9201 2.92035 12 3.90214 12H12.0979C13.0797 12 13.6782 10.9201 13.1579 10.0875L9.06002 3.5309ZM4.35321 10.5L8.00002 4.6651L11.6468 10.5H4.35321Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'triangle_up_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M9.06002 3.5309C8.57044 2.74757 7.42961 2.74756 6.94002 3.5309L2.84215 10.0875C2.3218 10.9201 2.92035 12 3.90214 12H12.0979C13.0797 12 13.6782 10.9201 13.1579 10.0875L9.06002 3.5309ZM4.35321 10.5L8.00002 4.6651L11.6468 10.5H4.35321Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
