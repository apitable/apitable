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

export const FavoriteFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7.39978 1.38435C7.63704 0.871882 8.36296 0.871882 8.60022 1.38435L10.2215 4.88633C10.3153 5.08894 10.5043 5.23066 10.7245 5.26348L14.4346 5.81646C14.97 5.89625 15.1888 6.55207 14.8093 6.93932L12.0742 9.73052C11.9256 9.88214 11.8583 10.096 11.8932 10.3057L12.5454 14.2247C12.6368 14.7741 12.0546 15.1857 11.57 14.9142L8.32257 13.095C8.12208 12.9827 7.87792 12.9827 7.67743 13.095L4.42997 14.9142C3.94541 15.1857 3.36316 14.7741 3.45458 14.2247L4.10678 10.3057C4.14168 10.096 4.07442 9.88214 3.92584 9.73052L1.1907 6.93932C0.811215 6.55207 1.03004 5.89625 1.56535 5.81646L5.27547 5.26348C5.49566 5.23066 5.68466 5.08894 5.77847 4.88633L7.39978 1.38435Z" fill={ colors[0] }/>

  </>,
  name: 'favorite_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M7.39978 1.38435C7.63704 0.871882 8.36296 0.871882 8.60022 1.38435L10.2215 4.88633C10.3153 5.08894 10.5043 5.23066 10.7245 5.26348L14.4346 5.81646C14.97 5.89625 15.1888 6.55207 14.8093 6.93932L12.0742 9.73052C11.9256 9.88214 11.8583 10.096 11.8932 10.3057L12.5454 14.2247C12.6368 14.7741 12.0546 15.1857 11.57 14.9142L8.32257 13.095C8.12208 12.9827 7.87792 12.9827 7.67743 13.095L4.42997 14.9142C3.94541 15.1857 3.36316 14.7741 3.45458 14.2247L4.10678 10.3057C4.14168 10.096 4.07442 9.88214 3.92584 9.73052L1.1907 6.93932C0.811215 6.55207 1.03004 5.89625 1.56535 5.81646L5.27547 5.26348C5.49566 5.23066 5.68466 5.08894 5.77847 4.88633L7.39978 1.38435Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
