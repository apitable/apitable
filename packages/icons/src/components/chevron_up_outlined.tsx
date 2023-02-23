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

export const ChevronUpOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M13.5303 10.5303C13.2374 10.8232 12.7626 10.8232 12.4697 10.5303L8 6.06066L3.53033 10.5303C3.23744 10.8232 2.76256 10.8232 2.46967 10.5303C2.17678 10.2374 2.17678 9.76256 2.46967 9.46967L7.46967 4.46967C7.76256 4.17678 8.23744 4.17678 8.53033 4.46967L13.5303 9.46967C13.8232 9.76256 13.8232 10.2374 13.5303 10.5303Z" fill={ colors[0] }/>

  </>,
  name: 'chevron_up_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M13.5303 10.5303C13.2374 10.8232 12.7626 10.8232 12.4697 10.5303L8 6.06066L3.53033 10.5303C3.23744 10.8232 2.76256 10.8232 2.46967 10.5303C2.17678 10.2374 2.17678 9.76256 2.46967 9.46967L7.46967 4.46967C7.76256 4.17678 8.23744 4.17678 8.53033 4.46967L13.5303 9.46967C13.8232 9.76256 13.8232 10.2374 13.5303 10.5303Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
