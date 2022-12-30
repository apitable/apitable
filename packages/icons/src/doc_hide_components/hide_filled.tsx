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

export const HideFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8 3C3.54545 3 1 8 1 8C1 8 3.54545 13 8 13C12.4545 13 15 8 15 8C15 8 12.4545 3 8 3ZM11 8C11 9.65685 9.65685 11 8 11C6.34315 11 5 9.65685 5 8C5 6.34315 6.34315 5 8 5C9.65685 5 11 6.34315 11 8Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <circle cx="8" cy="8" r="2" fill={ colors[0] }/>

  </>,
  name: 'hide_filled',
  defaultColors: ['#636363'],
  colorful: false,
  allPathData: ['M8 3C3.54545 3 1 8 1 8C1 8 3.54545 13 8 13C12.4545 13 15 8 15 8C15 8 12.4545 3 8 3ZM11 8C11 9.65685 9.65685 11 8 11C6.34315 11 5 9.65685 5 8C5 6.34315 6.34315 5 8 5C9.65685 5 11 6.34315 11 8Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
