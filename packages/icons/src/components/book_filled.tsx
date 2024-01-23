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

export const BookFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7.25 14.6149V2.75C7.25 2.69462 7.256 2.64064 7.26739 2.58868L2.49515 1.63423C1.72166 1.47953 1 2.07115 1 2.85995V12.3401C1 12.936 1.42058 13.449 2.00486 13.5659L7.25 14.6149Z" fill={ colors[0] }/>
    <path d="M13.9951 13.5659L8.75 14.6149V2.75C8.75 2.69462 8.744 2.64064 8.73261 2.58868L13.5049 1.63423C14.2783 1.47953 15 2.07115 15 2.85995V12.3401C15 12.936 14.5794 13.449 13.9951 13.5659Z" fill={ colors[0] }/>

  </>,
  name: 'book_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M7.25 14.6149V2.75C7.25 2.69462 7.256 2.64064 7.26739 2.58868L2.49515 1.63423C1.72166 1.47953 1 2.07115 1 2.85995V12.3401C1 12.936 1.42058 13.449 2.00486 13.5659L7.25 14.6149Z', 'M13.9951 13.5659L8.75 14.6149V2.75C8.75 2.69462 8.744 2.64064 8.73261 2.58868L13.5049 1.63423C14.2783 1.47953 15 2.07115 15 2.85995V12.3401C15 12.936 14.5794 13.449 13.9951 13.5659Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
