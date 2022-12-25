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

export const NextFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <circle r="20" transform="matrix(-1 0 0 1 24 24)" fill={ colors[0] }/>
    <path d="M23 20L27 24L23 28" stroke={ colors[1] } strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

  </>,
  name: 'next_filled',
  defaultColors: ['#636363', 'white'],
  colorful: true,
  allPathData: ['M23 20L27 24L23 28'],
  width: '48',
  height: '48',
  viewBox: '0 0 48 48',
});
