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
    <path d="M13.8 2.59999C13.4 2.19999 12.9 1.89999 12.3 1.89999H3.7C2.6 1.89999 1.7 2.79999 1.7 3.99999V4.19999C1.8 4.59999 2 5.09999 2.4 5.39999L5.2 7.99999V11.2C5.2 11.8 5.6 12.2 6.2 12.2C6.8 12.2 7.2 11.8 7.2 11.2V7.59999C7.2 7.29999 7.1 7.09999 6.9 6.89999L3.7 3.99999V3.89999H12.3L9.1 6.79999C8.9 6.99999 8.8 7.19999 8.8 7.49999V13.2C8.8 13.8 9.2 14.2 9.8 14.2C10.4 14.2 10.8 13.8 10.8 13.2V7.99999L13.6 5.39999C14.4 4.69999 14.5 3.39999 13.8 2.59999Z" fill={ colors[0] }/>

  </>,
  name: 'filter_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M13.8 2.59999C13.4 2.19999 12.9 1.89999 12.3 1.89999H3.7C2.6 1.89999 1.7 2.79999 1.7 3.99999V4.19999C1.8 4.59999 2 5.09999 2.4 5.39999L5.2 7.99999V11.2C5.2 11.8 5.6 12.2 6.2 12.2C6.8 12.2 7.2 11.8 7.2 11.2V7.59999C7.2 7.29999 7.1 7.09999 6.9 6.89999L3.7 3.99999V3.89999H12.3L9.1 6.79999C8.9 6.99999 8.8 7.19999 8.8 7.49999V13.2C8.8 13.8 9.2 14.2 9.8 14.2C10.4 14.2 10.8 13.8 10.8 13.2V7.99999L13.6 5.39999C14.4 4.69999 14.5 3.39999 13.8 2.59999Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
