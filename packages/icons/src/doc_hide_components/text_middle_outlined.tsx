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

export const TextMiddleOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5.75 1.25C5.33579 1.25 5 1.58579 5 2C5 2.41421 5.33579 2.75 5.75 2.75H10.25C10.6642 2.75 11 2.41421 11 2C11 1.58579 10.6642 1.25 10.25 1.25H5.75Z" fill={ colors[0] }/>
    <path d="M3 9.25C2.58579 9.25 2.25 9.58579 2.25 10C2.25 10.4142 2.58579 10.75 3 10.75H13C13.4142 10.75 13.75 10.4142 13.75 10C13.75 9.58579 13.4142 9.25 13 9.25H3Z" fill={ colors[0] }/>
    <path d="M2.25 6C2.25 5.58579 2.58579 5.25 3 5.25H13C13.4142 5.25 13.75 5.58579 13.75 6C13.75 6.41421 13.4142 6.75 13 6.75H3C2.58579 6.75 2.25 6.41421 2.25 6Z" fill={ colors[0] }/>
    <path d="M5.75 13.25C5.33579 13.25 5 13.5858 5 14C5 14.4142 5.33579 14.75 5.75 14.75H10.25C10.6642 14.75 11 14.4142 11 14C11 13.5858 10.6642 13.25 10.25 13.25H5.75Z" fill={ colors[0] }/>

  </>,
  name: 'text_middle_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M5.75 1.25C5.33579 1.25 5 1.58579 5 2C5 2.41421 5.33579 2.75 5.75 2.75H10.25C10.6642 2.75 11 2.41421 11 2C11 1.58579 10.6642 1.25 10.25 1.25H5.75Z', 'M3 9.25C2.58579 9.25 2.25 9.58579 2.25 10C2.25 10.4142 2.58579 10.75 3 10.75H13C13.4142 10.75 13.75 10.4142 13.75 10C13.75 9.58579 13.4142 9.25 13 9.25H3Z', 'M2.25 6C2.25 5.58579 2.58579 5.25 3 5.25H13C13.4142 5.25 13.75 5.58579 13.75 6C13.75 6.41421 13.4142 6.75 13 6.75H3C2.58579 6.75 2.25 6.41421 2.25 6Z', 'M5.75 13.25C5.33579 13.25 5 13.5858 5 14C5 14.4142 5.33579 14.75 5.75 14.75H10.25C10.6642 14.75 11 14.4142 11 14C11 13.5858 10.6642 13.25 10.25 13.25H5.75Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
