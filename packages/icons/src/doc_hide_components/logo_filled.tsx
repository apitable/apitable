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

export const LogoFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7 3H3V7H7V3Z" fill={ colors[0] }/>
    <path d="M7 7H3V11H7V7Z" fill={ colors[1] }/>
    <path d="M3 11H7L3 15V11Z" fill={ colors[2] }/>
    <path d="M7 7H11L7 11V7Z" fill={ colors[2] }/>
    <path d="M11 3H15L11 7V3Z" fill={ colors[0] }/>
    <path d="M11 7H7L11 3V7Z" fill={ colors[1] }/>

  </>,
  name: 'logo_filled',
  defaultColors: ['#1274FE', '#539AFF', '#7EB3FF'],
  colorful: true,
  allPathData: ['M7 3H3V7H7V3Z', 'M7 7H3V11H7V7Z', 'M3 11H7L3 15V11Z', 'M7 7H11L7 11V7Z', 'M11 3H15L11 7V3Z', 'M11 7H7L11 3V7Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
