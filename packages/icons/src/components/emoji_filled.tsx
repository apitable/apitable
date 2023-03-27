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

export const EmojiFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1ZM6.5 6C6.5 5.58579 6.16421 5.25 5.75 5.25C5.33579 5.25 5 5.58579 5 6V6.75C5 7.16421 5.33579 7.5 5.75 7.5C6.16421 7.5 6.5 7.16421 6.5 6.75V6ZM11 6C11 5.58579 10.6642 5.25 10.25 5.25C9.83579 5.25 9.5 5.58579 9.5 6V6.75C9.5 7.16421 9.83579 7.5 10.25 7.5C10.6642 7.5 11 7.16421 11 6.75V6ZM5.34669 10.0204C5.61154 9.70197 6.08442 9.6585 6.4029 9.92335C6.83636 10.2838 7.39201 10.5 8.00013 10.5C8.60824 10.5 9.16389 10.2838 9.59735 9.92335C9.91583 9.6585 10.3887 9.70197 10.6536 10.0204C10.9184 10.3389 10.8749 10.8118 10.5565 11.0766C9.86362 11.6529 8.97142 12 8.00013 12C7.02883 12 6.13664 11.6529 5.44378 11.0766C5.12531 10.8118 5.08184 10.3389 5.34669 10.0204Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'emoji_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1ZM6.5 6C6.5 5.58579 6.16421 5.25 5.75 5.25C5.33579 5.25 5 5.58579 5 6V6.75C5 7.16421 5.33579 7.5 5.75 7.5C6.16421 7.5 6.5 7.16421 6.5 6.75V6ZM11 6C11 5.58579 10.6642 5.25 10.25 5.25C9.83579 5.25 9.5 5.58579 9.5 6V6.75C9.5 7.16421 9.83579 7.5 10.25 7.5C10.6642 7.5 11 7.16421 11 6.75V6ZM5.34669 10.0204C5.61154 9.70197 6.08442 9.6585 6.4029 9.92335C6.83636 10.2838 7.39201 10.5 8.00013 10.5C8.60824 10.5 9.16389 10.2838 9.59735 9.92335C9.91583 9.6585 10.3887 9.70197 10.6536 10.0204C10.9184 10.3389 10.8749 10.8118 10.5565 11.0766C9.86362 11.6529 8.97142 12 8.00013 12C7.02883 12 6.13664 11.6529 5.44378 11.0766C5.12531 10.8118 5.08184 10.3389 5.34669 10.0204Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
