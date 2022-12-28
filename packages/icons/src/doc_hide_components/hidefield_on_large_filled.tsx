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

export const HidefieldOnLargeFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <rect width="54" height="28" rx="14" fill={ colors[0] }/>
    <path d="M40 26C46.6274 26 52 20.6274 52 14C52 7.37258 46.6274 2 40 2C33.3726 2 28 7.37258 28 14C28 20.6274 33.3726 26 40 26Z" fill={ colors[1] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'hidefield_on_large_filled',
  defaultColors: ['#7B67EE', 'white'],
  colorful: true,
  allPathData: ['M40 26C46.6274 26 52 20.6274 52 14C52 7.37258 46.6274 2 40 2C33.3726 2 28 7.37258 28 14C28 20.6274 33.3726 26 40 26Z'],
  width: '28',
  height: '28',
  viewBox: '0 0 28 28',
});
