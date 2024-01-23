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

export const UserAddFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M10.4513 7.49827C11.0985 6.86314 11.5 5.97846 11.5 5C11.5 3.067 9.933 1.5 8 1.5C6.067 1.5 4.5 3.067 4.5 5C4.5 5.97847 4.90152 6.86317 5.54878 7.4983C4.74763 7.83705 4.01291 8.34124 3.39269 8.98843C2.30512 10.1233 1.64851 11.6146 1.52239 13.1907C1.46224 13.9422 2.07715 14.5 2.75005 14.5L8.87731 14.5C8.32836 13.8152 8 12.9459 8 12C8 9.97376 9.5066 8.29941 11.4607 8.03605C11.1396 7.82637 10.8018 7.64649 10.4513 7.49827Z" fill={ colors[0] }/>
    <path d="M12 9.25C12.4142 9.25 12.75 9.58579 12.75 10V11.25H14C14.4142 11.25 14.75 11.5858 14.75 12C14.75 12.4142 14.4142 12.75 14 12.75H12.75V14C12.75 14.4142 12.4142 14.75 12 14.75C11.5858 14.75 11.25 14.4142 11.25 14V12.75H10C9.58579 12.75 9.25 12.4142 9.25 12C9.25 11.5858 9.58579 11.25 10 11.25H11.25V10C11.25 9.58579 11.5858 9.25 12 9.25Z" fill={ colors[0] }/>

  </>,
  name: 'user_add_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M10.4513 7.49827C11.0985 6.86314 11.5 5.97846 11.5 5C11.5 3.067 9.933 1.5 8 1.5C6.067 1.5 4.5 3.067 4.5 5C4.5 5.97847 4.90152 6.86317 5.54878 7.4983C4.74763 7.83705 4.01291 8.34124 3.39269 8.98843C2.30512 10.1233 1.64851 11.6146 1.52239 13.1907C1.46224 13.9422 2.07715 14.5 2.75005 14.5L8.87731 14.5C8.32836 13.8152 8 12.9459 8 12C8 9.97376 9.5066 8.29941 11.4607 8.03605C11.1396 7.82637 10.8018 7.64649 10.4513 7.49827Z', 'M12 9.25C12.4142 9.25 12.75 9.58579 12.75 10V11.25H14C14.4142 11.25 14.75 11.5858 14.75 12C14.75 12.4142 14.4142 12.75 14 12.75H12.75V14C12.75 14.4142 12.4142 14.75 12 14.75C11.5858 14.75 11.25 14.4142 11.25 14V12.75H10C9.58579 12.75 9.25 12.4142 9.25 12C9.25 11.5858 9.58579 11.25 10 11.25H11.25V10C11.25 9.58579 11.5858 9.25 12 9.25Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
