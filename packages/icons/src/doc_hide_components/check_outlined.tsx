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

export const CheckOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M12.0752 5.47213C12.3668 5.76637 12.3646 6.24124 12.0703 6.53278L7.52395 11.0373C7.23066 11.3279 6.75768 11.3268 6.46574 11.0349L3.46967 8.03882C3.17678 7.74593 3.17678 7.27106 3.46967 6.97816C3.76256 6.68527 4.23744 6.68527 4.53033 6.97816L6.99852 9.44635L11.0146 5.46722C11.3088 5.17569 11.7837 5.17788 12.0752 5.47213Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'check_outlined',
  defaultColors: ['#7B67EE'],
  colorful: false,
  allPathData: ['M12.0752 5.47213C12.3668 5.76637 12.3646 6.24124 12.0703 6.53278L7.52395 11.0373C7.23066 11.3279 6.75768 11.3268 6.46574 11.0349L3.46967 8.03882C3.17678 7.74593 3.17678 7.27106 3.46967 6.97816C3.76256 6.68527 4.23744 6.68527 4.53033 6.97816L6.99852 9.44635L11.0146 5.46722C11.3088 5.17569 11.7837 5.17788 12.0752 5.47213Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
