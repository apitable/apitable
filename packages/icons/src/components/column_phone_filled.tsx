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

export const ColumnPhoneFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M11.644 14C9.27325 14 6.82234 12.3757 5.26133 10.8721C3.70032 9.36846 2.20898 7.00227 2.20898 4.63098C2.20898 4.03472 3.76567 2.3683 4.83144 2.08618C5.48181 2.20283 7.00409 3.41142 7.43388 4.44912C7.43388 5.09109 6.24673 6.52209 6.1183 6.76206C6.1183 7.24058 6.87731 8.29937 7.43388 8.82166C7.99045 9.34396 9.14532 10.1198 9.54214 10.1198C9.82945 9.94322 10.9679 8.99658 11.3242 8.82166C12.5813 8.99658 13.9995 10.4588 14.1756 11.3642C13.8704 12.5761 12.3933 13.8008 11.644 14Z" fill={ colors[0] }/>

  </>,
  name: 'column_phone_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M11.644 14C9.27325 14 6.82234 12.3757 5.26133 10.8721C3.70032 9.36846 2.20898 7.00227 2.20898 4.63098C2.20898 4.03472 3.76567 2.3683 4.83144 2.08618C5.48181 2.20283 7.00409 3.41142 7.43388 4.44912C7.43388 5.09109 6.24673 6.52209 6.1183 6.76206C6.1183 7.24058 6.87731 8.29937 7.43388 8.82166C7.99045 9.34396 9.14532 10.1198 9.54214 10.1198C9.82945 9.94322 10.9679 8.99658 11.3242 8.82166C12.5813 8.99658 13.9995 10.4588 14.1756 11.3642C13.8704 12.5761 12.3933 13.8008 11.644 14Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
