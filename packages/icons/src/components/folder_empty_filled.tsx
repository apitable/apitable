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

export const FolderEmptyFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5 3H2.3C1.6 3 1 3.6 1 4.3V12.7C1 14 2 15 3.2 15H12.8C14 15 15 14 15 12.7V6C15 4.9 14.1 4 13 4H6C6 3.5 5.6 3 5 3Z" fill={ colors[0] }/>

  </>,
  name: 'folder_empty_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M5 3H2.3C1.6 3 1 3.6 1 4.3V12.7C1 14 2 15 3.2 15H12.8C14 15 15 14 15 12.7V6C15 4.9 14.1 4 13 4H6C6 3.5 5.6 3 5 3Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
