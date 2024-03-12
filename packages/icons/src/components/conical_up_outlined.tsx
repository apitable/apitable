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

export const ConicalUpOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7.36828 2.59571C7.50614 2.38031 7.74425 2.25 7.99999 2.25C8.25572 2.25 8.49384 2.38031 8.63169 2.59571L12.6317 8.84571C12.7794 9.07656 12.7895 9.36963 12.6579 9.61006C12.5263 9.85049 12.2741 10 12 10L3.99999 10C3.7259 10 3.47365 9.85049 3.34207 9.61006C3.21049 9.36963 3.22054 9.07656 3.36828 8.84571L7.36828 2.59571ZM7.99999 4.39133L5.37044 8.5L10.6295 8.5L7.99999 4.39133Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M3.24999 12.25C3.24999 12.6642 3.58578 13 3.99999 13H12C12.4142 13 12.75 12.6642 12.75 12.25C12.75 11.8358 12.4142 11.5 12 11.5H3.99999C3.58577 11.5 3.24999 11.8358 3.24999 12.25Z" fill={ colors[0] }/>

  </>,
  name: 'conical_up_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M7.36828 2.59571C7.50614 2.38031 7.74425 2.25 7.99999 2.25C8.25572 2.25 8.49384 2.38031 8.63169 2.59571L12.6317 8.84571C12.7794 9.07656 12.7895 9.36963 12.6579 9.61006C12.5263 9.85049 12.2741 10 12 10L3.99999 10C3.7259 10 3.47365 9.85049 3.34207 9.61006C3.21049 9.36963 3.22054 9.07656 3.36828 8.84571L7.36828 2.59571ZM7.99999 4.39133L5.37044 8.5L10.6295 8.5L7.99999 4.39133Z', 'M3.24999 12.25C3.24999 12.6642 3.58578 13 3.99999 13H12C12.4142 13 12.75 12.6642 12.75 12.25C12.75 11.8358 12.4142 11.5 12 11.5H3.99999C3.58577 11.5 3.24999 11.8358 3.24999 12.25Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
