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

export const HidefieldOnFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <rect width="32" height="18" rx="9" fill={ colors[0] }/>
    <path d="M23 16C26.866 16 30 12.866 30 9C30 5.13401 26.866 2 23 2C19.134 2 16 5.13401 16 9C16 12.866 19.134 16 23 16Z" fill={ colors[1] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'hidefield_on_filled',
  defaultColors: ['#7B67EE', 'white'],
  colorful: true,
  allPathData: ['M23 16C26.866 16 30 12.866 30 9C30 5.13401 26.866 2 23 2C19.134 2 16 5.13401 16 9C16 12.866 19.134 16 23 16Z'],
  width: '18',
  height: '18',
  viewBox: '0 0 18 18',
});
