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

export const FilterOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3.35696 1.5C2.39979 1.5 1.79777 2.53179 2.26876 3.36507L5.00001 8.19729V11.9787C5.00001 12.4148 5.22735 12.8195 5.59986 13.0463L9.09986 15.1777C9.93285 15.685 11 15.0854 11 14.1101V8.19729L13.7313 3.36507C14.2022 2.53179 13.6002 1.5 12.6431 1.5H3.35696ZM6.33821 7.51645L3.78544 3H12.2146L9.66181 7.51646C9.55575 7.7041 9.50001 7.91598 9.50001 8.13153V13.6651L6.50001 11.8382V8.13153C6.50001 7.91598 6.44428 7.7041 6.33821 7.51645Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'filter_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M3.35696 1.5C2.39979 1.5 1.79777 2.53179 2.26876 3.36507L5.00001 8.19729V11.9787C5.00001 12.4148 5.22735 12.8195 5.59986 13.0463L9.09986 15.1777C9.93285 15.685 11 15.0854 11 14.1101V8.19729L13.7313 3.36507C14.2022 2.53179 13.6002 1.5 12.6431 1.5H3.35696ZM6.33821 7.51645L3.78544 3H12.2146L9.66181 7.51646C9.55575 7.7041 9.50001 7.91598 9.50001 8.13153V13.6651L6.50001 11.8382V8.13153C6.50001 7.91598 6.44428 7.7041 6.33821 7.51645Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
