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

export const LockFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8 1.5C6.34315 1.5 5 2.84315 5 4.5V6H4.5C3.67157 6 3 6.67157 3 7.5V12.5C3 13.3284 3.67157 14 4.5 14H11.5C12.3284 14 13 13.3284 13 12.5V7.5C13 6.67157 12.3284 6 11.5 6H11V4.5C11 2.84315 9.65685 1.5 8 1.5ZM9 6V4.5C9 3.94772 8.55228 3.5 8 3.5C7.44772 3.5 7 3.94772 7 4.5V6H9Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'lock_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M8 1.5C6.34315 1.5 5 2.84315 5 4.5V6H4.5C3.67157 6 3 6.67157 3 7.5V12.5C3 13.3284 3.67157 14 4.5 14H11.5C12.3284 14 13 13.3284 13 12.5V7.5C13 6.67157 12.3284 6 11.5 6H11V4.5C11 2.84315 9.65685 1.5 8 1.5ZM9 6V4.5C9 3.94772 8.55228 3.5 8 3.5C7.44772 3.5 7 3.94772 7 4.5V6H9Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
