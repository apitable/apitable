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

export const HomeOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2.75 14.5C2.05964 14.5 1.5 13.9403 1.5 13.25V6.27084C1.5 5.84842 1.71334 5.45458 2.06717 5.22382L7.31717 1.79991C7.73216 1.52926 8.26784 1.52926 8.68283 1.79991L13.9328 5.22382C14.2867 5.45458 14.5 5.84842 14.5 6.27084V13.25C14.5 13.9403 13.9404 14.5 13.25 14.5H2.75ZM3 6.40626L8 3.14539L13 6.40626V13H10.25V10.75C10.25 10.0596 9.69036 9.49999 9 9.49999H7C6.30964 9.49999 5.75 10.0596 5.75 10.75V13H3V6.40626ZM7.25 13H8.75V11H7.25V13Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'home_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M2.75 14.5C2.05964 14.5 1.5 13.9403 1.5 13.25V6.27084C1.5 5.84842 1.71334 5.45458 2.06717 5.22382L7.31717 1.79991C7.73216 1.52926 8.26784 1.52926 8.68283 1.79991L13.9328 5.22382C14.2867 5.45458 14.5 5.84842 14.5 6.27084V13.25C14.5 13.9403 13.9404 14.5 13.25 14.5H2.75ZM3 6.40626L8 3.14539L13 6.40626V13H10.25V10.75C10.25 10.0596 9.69036 9.49999 9 9.49999H7C6.30964 9.49999 5.75 10.0596 5.75 10.75V13H3V6.40626ZM7.25 13H8.75V11H7.25V13Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
