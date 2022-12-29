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

export const TriangleRight16Filled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M11.0325 7.1953C11.233 7.32063 11.233 7.61268 11.0325 7.73802L5.55628 11.1607C5.34315 11.2939 5.06668 11.1406 5.06668 10.8893V4.04401C5.06668 3.79268 5.34315 3.63945 5.55628 3.77266L11.0325 7.1953Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'triangle_right_16_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M11.0325 7.1953C11.233 7.32063 11.233 7.61268 11.0325 7.73802L5.55628 11.1607C5.34315 11.2939 5.06668 11.1406 5.06668 10.8893V4.04401C5.06668 3.79268 5.34315 3.63945 5.55628 3.77266L11.0325 7.1953Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
