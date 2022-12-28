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

export const WarningTriangleNonzeroFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.85329 2.90276C8.46365 2.26288 7.5347 2.26288 7.14507 2.90276L1.9248 11.4757C1.51901 12.1421 1.99869 12.9958 2.77891 12.9958H13.2194C13.9997 12.9958 14.4793 12.1421 14.0736 11.4757L8.85329 2.90276ZM8.00122 5.14305C8.38092 5.14305 8.69471 5.4252 8.74438 5.79128L8.75122 5.89305V8.29238C8.75122 8.70659 8.41544 9.04238 8.00122 9.04238C7.62153 9.04238 7.30773 8.76022 7.25807 8.39415L7.25122 8.29238V5.89305C7.25122 5.47883 7.58701 5.14305 8.00122 5.14305ZM7.99918 11.5149C7.52974 11.5149 7.14918 11.1343 7.14918 10.6649C7.14918 10.1954 7.52974 9.81489 7.99918 9.81489C8.46862 9.81489 8.84918 10.1954 8.84918 10.6649C8.84918 11.1343 8.46862 11.5149 7.99918 11.5149Z" fill={ colors[0] }/>

  </>,
  name: 'warning_triangle_nonzero_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M8.85329 2.90276C8.46365 2.26288 7.5347 2.26288 7.14507 2.90276L1.9248 11.4757C1.51901 12.1421 1.99869 12.9958 2.77891 12.9958H13.2194C13.9997 12.9958 14.4793 12.1421 14.0736 11.4757L8.85329 2.90276ZM8.00122 5.14305C8.38092 5.14305 8.69471 5.4252 8.74438 5.79128L8.75122 5.89305V8.29238C8.75122 8.70659 8.41544 9.04238 8.00122 9.04238C7.62153 9.04238 7.30773 8.76022 7.25807 8.39415L7.25122 8.29238V5.89305C7.25122 5.47883 7.58701 5.14305 8.00122 5.14305ZM7.99918 11.5149C7.52974 11.5149 7.14918 11.1343 7.14918 10.6649C7.14918 10.1954 7.52974 9.81489 7.99918 9.81489C8.46862 9.81489 8.84918 10.1954 8.84918 10.6649C8.84918 11.1343 8.46862 11.5149 7.99918 11.5149Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
