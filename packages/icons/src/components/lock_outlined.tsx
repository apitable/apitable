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

export const LockOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M9.5 6V4.5C9.5 3.67157 8.82843 3 8 3C7.17157 3 6.5 3.67157 6.5 4.5V6H9.5ZM4.5 4.5V6H3.5C2.67157 6 2 6.67157 2 7.5V13.5C2 14.3284 2.67157 15 3.5 15H12.5C13.3284 15 14 14.3284 14 13.5V7.5C14 6.67157 13.3284 6 12.5 6H11.5V4.5C11.5 2.567 9.933 1 8 1C6.067 1 4.5 2.567 4.5 4.5ZM9.5 8H11.5H12V13H4V8H4.5H6.5H9.5ZM9 10C9 9.44771 8.55228 9 8 9C7.44772 9 7 9.44771 7 10V11C7 11.5523 7.44772 12 8 12C8.55228 12 9 11.5523 9 11V10Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'lock_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M9.5 6V4.5C9.5 3.67157 8.82843 3 8 3C7.17157 3 6.5 3.67157 6.5 4.5V6H9.5ZM4.5 4.5V6H3.5C2.67157 6 2 6.67157 2 7.5V13.5C2 14.3284 2.67157 15 3.5 15H12.5C13.3284 15 14 14.3284 14 13.5V7.5C14 6.67157 13.3284 6 12.5 6H11.5V4.5C11.5 2.567 9.933 1 8 1C6.067 1 4.5 2.567 4.5 4.5ZM9.5 8H11.5H12V13H4V8H4.5H6.5H9.5ZM9 10C9 9.44771 8.55228 9 8 9C7.44772 9 7 9.44771 7 10V11C7 11.5523 7.44772 12 8 12C8.55228 12 9 11.5523 9 11V10Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
