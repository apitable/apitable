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

export const AddFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <circle cx="7.5" cy="8.5" r="6.5" fill={ colors[0] }/>
    <rect x="4" y="8" width="7" height="1" rx="0.5" fill={ colors[1] }/>
    <rect width="7" height="1" rx="0.5" transform="matrix(-4.37114e-08 1 1 4.37114e-08 7 5)" fill={ colors[1] }/>

  </>,
  name: 'add_filled',
  defaultColors: ['#636363', 'white'],
  colorful: true,
  allPathData: [],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
