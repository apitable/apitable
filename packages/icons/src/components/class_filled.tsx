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

export const ClassFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2.75 1.5C2.05964 1.5 1.5 2.05964 1.5 2.75V10.25C1.5 10.9404 2.05964 11.5 2.75 11.5H6.00452L4.25585 13.0304C3.94415 13.3032 3.91261 13.777 4.18541 14.0887C4.4582 14.4004 4.93202 14.432 5.24372 14.1592L7.9999 11.747L10.7558 14.1592C11.0675 14.432 11.5413 14.4005 11.8141 14.0888C12.0869 13.7771 12.0554 13.3033 11.7437 13.0304L9.99517 11.5H13.25C13.9404 11.5 14.5 10.9404 14.5 10.25V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H2.75ZM9.8216 6.076C10.1349 6.27183 10.1349 6.72817 9.8216 6.924L7.265 8.52188C6.93198 8.73002 6.5 8.49059 6.5 8.09788V4.90212C6.5 4.50941 6.93198 4.26998 7.265 4.47812L9.8216 6.076Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'class_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M2.75 1.5C2.05964 1.5 1.5 2.05964 1.5 2.75V10.25C1.5 10.9404 2.05964 11.5 2.75 11.5H6.00452L4.25585 13.0304C3.94415 13.3032 3.91261 13.777 4.18541 14.0887C4.4582 14.4004 4.93202 14.432 5.24372 14.1592L7.9999 11.747L10.7558 14.1592C11.0675 14.432 11.5413 14.4005 11.8141 14.0888C12.0869 13.7771 12.0554 13.3033 11.7437 13.0304L9.99517 11.5H13.25C13.9404 11.5 14.5 10.9404 14.5 10.25V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H2.75ZM9.8216 6.076C10.1349 6.27183 10.1349 6.72817 9.8216 6.924L7.265 8.52188C6.93198 8.73002 6.5 8.49059 6.5 8.09788V4.90212C6.5 4.50941 6.93198 4.26998 7.265 4.47812L9.8216 6.076Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
