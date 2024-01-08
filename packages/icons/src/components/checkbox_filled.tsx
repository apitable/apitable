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

export const CheckboxFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2.75 1.5C2.05964 1.5 1.5 2.05964 1.5 2.75V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H2.75ZM11.4373 6.90165C11.7302 6.60876 11.7302 6.13388 11.4373 5.84099C11.1444 5.5481 10.6695 5.5481 10.3766 5.84099L7.37143 8.84619L5.78044 7.2552C5.48755 6.96231 5.01267 6.96231 4.71978 7.2552C4.42689 7.5481 4.42689 8.02297 4.71978 8.31586L6.8411 10.4372C7.13399 10.7301 7.60887 10.7301 7.90176 10.4372L11.4373 6.90165Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'checkbox_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M2.75 1.5C2.05964 1.5 1.5 2.05964 1.5 2.75V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H2.75ZM11.4373 6.90165C11.7302 6.60876 11.7302 6.13388 11.4373 5.84099C11.1444 5.5481 10.6695 5.5481 10.3766 5.84099L7.37143 8.84619L5.78044 7.2552C5.48755 6.96231 5.01267 6.96231 4.71978 7.2552C4.42689 7.5481 4.42689 8.02297 4.71978 8.31586L6.8411 10.4372C7.13399 10.7301 7.60887 10.7301 7.90176 10.4372L11.4373 6.90165Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
