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

export const SelectFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <rect x="1" y="1" width="14" height="14" rx="7" stroke={ colors[0] } strokeWidth="1.5"/>
    <rect x="4" y="4" width="8" height="8" rx="4" fill={ colors[0] }/>

  </>,
  name: 'select_filled',
  defaultColors: ['#7B67EE'],
  colorful: false,
  allPathData: [],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
