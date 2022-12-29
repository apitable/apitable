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

export const DescriptionFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <rect x="2" y="2" width="12" height="12" rx="1" fill={ colors[0] } stroke={ colors[0] } strokeWidth="2" strokeLinejoin="round"/>
    <rect x="4" y="5" width="5" height="2" rx="1" fill={ colors[1] }/>
    <rect x="4" y="9" width="8" height="2" rx="1" fill={ colors[1] }/>

  </>,
  name: 'description_filled',
  defaultColors: ['#30C28B', 'white'],
  colorful: true,
  allPathData: [],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
