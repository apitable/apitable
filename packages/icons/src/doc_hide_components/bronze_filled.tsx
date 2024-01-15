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

export const BronzeFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M32 55C44.7025 55 55 44.7025 55 32C55 19.2975 44.7025 9 32 9C19.2975 9 9 19.2975 9 32C9 44.7025 19.2975 55 32 55Z" fill={ colors[1] } stroke={ colors[0] } strokeWidth="2"/>
    <path d="M32 22L30 20V28H32V22Z" fill={ colors[0] }/>
    <path d="M30 20H22V28V36V44L30 36L38 28L46 20H38L30 28V20Z" fill={ colors[2] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M46 22V20L22 44V46L46 22Z" fill={ colors[0] }/>

  </>,
  name: 'bronze_filled',
  defaultColors: ['#C18769', '#EFC8AC', 'white'],
  colorful: true,
  allPathData: ['M32 55C44.7025 55 55 44.7025 55 32C55 19.2975 44.7025 9 32 9C19.2975 9 9 19.2975 9 32C9 44.7025 19.2975 55 32 55Z', 'M32 22L30 20V28H32V22Z', 'M30 20H22V28V36V44L30 36L38 28L46 20H38L30 28V20Z', 'M46 22V20L22 44V46L46 22Z'],
  width: '64',
  height: '64',
  viewBox: '0 0 64 64',
});
