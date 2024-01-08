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

export const AdjustmentOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M10.25 2.5C9.13059 2.5 8.18302 3.23572 7.86445 4.25H1.75C1.33579 4.25 1 4.58579 1 5C1 5.41421 1.33579 5.75 1.75 5.75H7.86445C8.18302 6.76428 9.13059 7.5 10.25 7.5C11.3694 7.5 12.317 6.76428 12.6355 5.75H14.25C14.6642 5.75 15 5.41421 15 5C15 4.58579 14.6642 4.25 14.25 4.25H12.6355C12.317 3.23572 11.3694 2.5 10.25 2.5ZM9.25 5C9.25 4.44772 9.69772 4 10.25 4C10.8023 4 11.25 4.44772 11.25 5C11.25 5.55228 10.8023 6 10.25 6C9.69772 6 9.25 5.55228 9.25 5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M5.75 8.5C4.63059 8.5 3.68302 9.23572 3.36445 10.25H1.75C1.33579 10.25 1 10.5858 1 11C1 11.4142 1.33579 11.75 1.75 11.75H3.36445C3.68302 12.7643 4.63059 13.5 5.75 13.5C6.86941 13.5 7.81698 12.7643 8.13555 11.75H14.25C14.6642 11.75 15 11.4142 15 11C15 10.5858 14.6642 10.25 14.25 10.25H8.13555C7.81698 9.23572 6.86941 8.5 5.75 8.5ZM4.75 11C4.75 10.4477 5.19772 10 5.75 10C6.30228 10 6.75 10.4477 6.75 11C6.75 11.5523 6.30228 12 5.75 12C5.19772 12 4.75 11.5523 4.75 11Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'adjustment_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M10.25 2.5C9.13059 2.5 8.18302 3.23572 7.86445 4.25H1.75C1.33579 4.25 1 4.58579 1 5C1 5.41421 1.33579 5.75 1.75 5.75H7.86445C8.18302 6.76428 9.13059 7.5 10.25 7.5C11.3694 7.5 12.317 6.76428 12.6355 5.75H14.25C14.6642 5.75 15 5.41421 15 5C15 4.58579 14.6642 4.25 14.25 4.25H12.6355C12.317 3.23572 11.3694 2.5 10.25 2.5ZM9.25 5C9.25 4.44772 9.69772 4 10.25 4C10.8023 4 11.25 4.44772 11.25 5C11.25 5.55228 10.8023 6 10.25 6C9.69772 6 9.25 5.55228 9.25 5Z', 'M5.75 8.5C4.63059 8.5 3.68302 9.23572 3.36445 10.25H1.75C1.33579 10.25 1 10.5858 1 11C1 11.4142 1.33579 11.75 1.75 11.75H3.36445C3.68302 12.7643 4.63059 13.5 5.75 13.5C6.86941 13.5 7.81698 12.7643 8.13555 11.75H14.25C14.6642 11.75 15 11.4142 15 11C15 10.5858 14.6642 10.25 14.25 10.25H8.13555C7.81698 9.23572 6.86941 8.5 5.75 8.5ZM4.75 11C4.75 10.4477 5.19772 10 5.75 10C6.30228 10 6.75 10.4477 6.75 11C6.75 11.5523 6.30228 12 5.75 12C5.19772 12 4.75 11.5523 4.75 11Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
