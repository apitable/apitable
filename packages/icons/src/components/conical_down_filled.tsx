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

export const ConicalDownFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7.3683 13.4043C7.50615 13.6197 7.74426 13.75 8 13.75C8.25574 13.75 8.49385 13.6197 8.6317 13.4043L12.6317 7.15429C12.7794 6.92344 12.7895 6.63038 12.6579 6.38994C12.5263 6.14951 12.2741 6 12 6L4 6C3.72592 6 3.47366 6.14951 3.34208 6.38994C3.2105 6.63038 3.22055 6.92344 3.3683 7.15429L7.3683 13.4043Z" fill={ colors[0] }/>
    <path d="M3.25 3.75C3.25 3.33579 3.58579 3 4 3H12C12.4142 3 12.75 3.33579 12.75 3.75C12.75 4.16421 12.4142 4.5 12 4.5H4C3.58579 4.5 3.25 4.16421 3.25 3.75Z" fill={ colors[0] }/>

  </>,
  name: 'conical_down_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M7.3683 13.4043C7.50615 13.6197 7.74426 13.75 8 13.75C8.25574 13.75 8.49385 13.6197 8.6317 13.4043L12.6317 7.15429C12.7794 6.92344 12.7895 6.63038 12.6579 6.38994C12.5263 6.14951 12.2741 6 12 6L4 6C3.72592 6 3.47366 6.14951 3.34208 6.38994C3.2105 6.63038 3.22055 6.92344 3.3683 7.15429L7.3683 13.4043Z', 'M3.25 3.75C3.25 3.33579 3.58579 3 4 3H12C12.4142 3 12.75 3.33579 12.75 3.75C12.75 4.16421 12.4142 4.5 12 4.5H4C3.58579 4.5 3.25 4.16421 3.25 3.75Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
