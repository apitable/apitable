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

export const InviteSmallFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2 6H14V13C14 14.1046 13.1046 15 12 15H4C2.89543 15 2 14.1046 2 13V6Z" fill={ colors[3] }/>
    <path d="M9 8H7V15H9V8Z" fill={ colors[5] }/>
    <path d="M7 3V4C7 4.33333 6.6 5 5 5C3 5 3 3.5 3 3C3 2.5 3.5 1 4.5 1C5.3 1 6.5 2.33333 7 3Z" fill={ colors[6] }/>
    <path d="M2 6H14V8H2V6Z" fill={ colors[0] }/>
    <path d="M9 3V4C9 4.33333 9.4 5 11 5C13 5 13 3.5 13 3C13 2.5 12.5 1 11.5 1C10.7 1 9.5 2.33333 9 3Z" fill={ colors[6] }/>
    <path d="M11 5C12.6 5 13 4.5 13 3C13 2.66667 12.8 2 12 2C11.2 2 9.66667 3.33333 9 4C9 4.33333 9.4 5 11 5Z" fill={ colors[2] }/>
    <path d="M5 5C3.4 5 3 4.5 3 3C3 2.66667 3.2 2 4 2C4.8 2 6.33333 3.33333 7 4C7 4.33333 6.6 5 5 5Z" fill={ colors[2] }/>
    <path d="M13.5 4H2.5C1.67157 4 1 4.67157 1 5.5C1 6.32843 1.67157 7 2.5 7H13.5C14.3284 7 15 6.32843 15 5.5C15 4.67157 14.3284 4 13.5 4Z" fill={ colors[4] }/>
    <path d="M9 4H7V7H9V4Z" fill={ colors[6] }/>
    <path d="M9 8H7V7H9V8Z" fill={ colors[1] }/>
    <path d="M9 3H7V4H9V3Z" fill={ colors[5] }/>

  </>,
  name: 'invite_small_filled',
  defaultColors: ['#EB6982', '#EBBE1E', '#FBC508', '#FF708B', '#FF98AC', '#FFCD1E', '#FFDC62'],
  colorful: true,
  allPathData: ['M2 6H14V13C14 14.1046 13.1046 15 12 15H4C2.89543 15 2 14.1046 2 13V6Z', 'M9 8H7V15H9V8Z', 'M7 3V4C7 4.33333 6.6 5 5 5C3 5 3 3.5 3 3C3 2.5 3.5 1 4.5 1C5.3 1 6.5 2.33333 7 3Z', 'M2 6H14V8H2V6Z', 'M9 3V4C9 4.33333 9.4 5 11 5C13 5 13 3.5 13 3C13 2.5 12.5 1 11.5 1C10.7 1 9.5 2.33333 9 3Z', 'M11 5C12.6 5 13 4.5 13 3C13 2.66667 12.8 2 12 2C11.2 2 9.66667 3.33333 9 4C9 4.33333 9.4 5 11 5Z', 'M5 5C3.4 5 3 4.5 3 3C3 2.66667 3.2 2 4 2C4.8 2 6.33333 3.33333 7 4C7 4.33333 6.6 5 5 5Z', 'M13.5 4H2.5C1.67157 4 1 4.67157 1 5.5C1 6.32843 1.67157 7 2.5 7H13.5C14.3284 7 15 6.32843 15 5.5C15 4.67157 14.3284 4 13.5 4Z', 'M9 4H7V7H9V4Z', 'M9 8H7V7H9V8Z', 'M9 3H7V4H9V3Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
