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

export const TriangleDown10Filled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M4.7456 8.59296C4.8631 8.78096 5.1369 8.78096 5.2544 8.59296L9.71312 1.459C9.83801 1.25918 9.69435 1 9.45872 1H0.541271C0.30564 1 0.161988 1.25919 0.286872 1.459L4.7456 8.59296Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'triangle_down_10_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M4.7456 8.59296C4.8631 8.78096 5.1369 8.78096 5.2544 8.59296L9.71312 1.459C9.83801 1.25918 9.69435 1 9.45872 1H0.541271C0.30564 1 0.161988 1.25919 0.286872 1.459L4.7456 8.59296Z'],
  width: '10',
  height: '10',
  viewBox: '0 0 10 10',
});
