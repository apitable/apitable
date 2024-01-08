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

export const UserEditFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M11.5 5C11.5 5.97846 11.0985 6.86314 10.4513 7.49827C10.8018 7.64649 11.1396 7.82637 11.4607 8.03605C9.5066 8.29941 8 9.97376 8 12C8 12.9459 8.32836 13.8152 8.87731 14.5L2.75005 14.5C2.07715 14.5 1.46224 13.9422 1.52239 13.1907C1.64851 11.6146 2.30512 10.1233 3.39269 8.98843C4.01291 8.34124 4.74763 7.83705 5.54878 7.4983C4.90152 6.86317 4.5 5.97847 4.5 5C4.5 3.067 6.067 1.5 8 1.5C9.933 1.5 11.5 3.067 11.5 5Z" fill={ colors[0] }/>
    <path d="M9.94808 11.6427C9.95883 11.528 10.0088 11.4206 10.0897 11.3385L12.3472 9.04622C12.542 8.84841 12.8607 8.84719 13.057 9.04351L14.4416 10.4281C14.6369 10.6234 14.6369 10.94 14.4416 11.1352L12.1656 13.4112C12.0833 13.4936 11.9747 13.5446 11.8588 13.5555L10.0506 13.7251C9.89461 13.7397 9.76374 13.6089 9.77837 13.4528L9.94808 11.6427Z" fill={ colors[0] }/>

  </>,
  name: 'user_edit_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M11.5 5C11.5 5.97846 11.0985 6.86314 10.4513 7.49827C10.8018 7.64649 11.1396 7.82637 11.4607 8.03605C9.5066 8.29941 8 9.97376 8 12C8 12.9459 8.32836 13.8152 8.87731 14.5L2.75005 14.5C2.07715 14.5 1.46224 13.9422 1.52239 13.1907C1.64851 11.6146 2.30512 10.1233 3.39269 8.98843C4.01291 8.34124 4.74763 7.83705 5.54878 7.4983C4.90152 6.86317 4.5 5.97847 4.5 5C4.5 3.067 6.067 1.5 8 1.5C9.933 1.5 11.5 3.067 11.5 5Z', 'M9.94808 11.6427C9.95883 11.528 10.0088 11.4206 10.0897 11.3385L12.3472 9.04622C12.542 8.84841 12.8607 8.84719 13.057 9.04351L14.4416 10.4281C14.6369 10.6234 14.6369 10.94 14.4416 11.1352L12.1656 13.4112C12.0833 13.4936 11.9747 13.5446 11.8588 13.5555L10.0506 13.7251C9.89461 13.7397 9.76374 13.6089 9.77837 13.4528L9.94808 11.6427Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
