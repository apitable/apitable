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

export const DividingLineFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M10 7H1V9H10V7ZM15 7H11V9H15V7Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'dividing_line_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M10 7H1V9H10V7ZM15 7H11V9H15V7Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
