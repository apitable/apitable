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

export const VerifyFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8 2L3 4.5V8.41738C3 9.72263 3.63684 10.9458 4.70615 11.6943L7.42654 13.5986C7.77086 13.8396 8.22914 13.8396 8.57346 13.5986L11.2938 11.6943C12.3632 10.9458 13 9.72263 13 8.41738V4.5L8 2ZM6.53033 7.46967C6.23744 7.17678 5.76256 7.17678 5.46967 7.46967C5.17678 7.76256 5.17678 8.23744 5.46967 8.53033L6.88388 9.94454C7.17678 10.2374 7.65165 10.2374 7.94454 9.94454L10.773 7.11612C11.0659 6.82322 11.0659 6.34835 10.773 6.05546C10.4801 5.76256 10.0052 5.76256 9.71231 6.05546L7.41421 8.35355L6.53033 7.46967Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'verify_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M8 2L3 4.5V8.41738C3 9.72263 3.63684 10.9458 4.70615 11.6943L7.42654 13.5986C7.77086 13.8396 8.22914 13.8396 8.57346 13.5986L11.2938 11.6943C12.3632 10.9458 13 9.72263 13 8.41738V4.5L8 2ZM6.53033 7.46967C6.23744 7.17678 5.76256 7.17678 5.46967 7.46967C5.17678 7.76256 5.17678 8.23744 5.46967 8.53033L6.88388 9.94454C7.17678 10.2374 7.65165 10.2374 7.94454 9.94454L10.773 7.11612C11.0659 6.82322 11.0659 6.34835 10.773 6.05546C10.4801 5.76256 10.0052 5.76256 9.71231 6.05546L7.41421 8.35355L6.53033 7.46967Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
