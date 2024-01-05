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

export const BulbFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2.5 6.475C2.5 3.44751 4.96617 1 8 1C11.0338 1 13.5 3.44751 13.5 6.475C13.5 8.00783 12.9663 8.89446 12.3489 9.65601C12.2229 9.81132 12.1 9.9557 11.9807 10.0957C11.5362 10.6175 11.1436 11.0784 10.845 11.817C10.6917 12.3676 10.1882 12.75 9.61401 12.75H8.75V9.06066L9.78033 8.03033C10.0732 7.73744 10.0732 7.26256 9.78033 6.96967C9.48744 6.67678 9.01256 6.67678 8.71967 6.96967L8 7.68934L7.28033 6.96967C6.98744 6.67678 6.51256 6.67678 6.21967 6.96967C5.92678 7.26256 5.92678 7.73744 6.21967 8.03033L7.25 9.06066V12.75H6.49865C5.94059 12.75 5.4475 12.3885 5.28023 11.8592C4.94832 11.1283 4.54484 10.6759 4.09681 10.1735C3.95966 10.0197 3.81833 9.86121 3.6736 9.68863C3.36911 9.32555 3.06676 8.91051 2.84622 8.37955C2.62423 7.84511 2.5 7.22989 2.5 6.475Z" fill={ colors[0] }/>
    <path d="M6.5 13.5C6.08579 13.5 5.75 13.8358 5.75 14.25C5.75 14.6642 6.08579 15 6.5 15H9.5C9.91421 15 10.25 14.6642 10.25 14.25C10.25 13.8358 9.91421 13.5 9.5 13.5H6.5Z" fill={ colors[0] }/>

  </>,
  name: 'bulb_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M2.5 6.475C2.5 3.44751 4.96617 1 8 1C11.0338 1 13.5 3.44751 13.5 6.475C13.5 8.00783 12.9663 8.89446 12.3489 9.65601C12.2229 9.81132 12.1 9.9557 11.9807 10.0957C11.5362 10.6175 11.1436 11.0784 10.845 11.817C10.6917 12.3676 10.1882 12.75 9.61401 12.75H8.75V9.06066L9.78033 8.03033C10.0732 7.73744 10.0732 7.26256 9.78033 6.96967C9.48744 6.67678 9.01256 6.67678 8.71967 6.96967L8 7.68934L7.28033 6.96967C6.98744 6.67678 6.51256 6.67678 6.21967 6.96967C5.92678 7.26256 5.92678 7.73744 6.21967 8.03033L7.25 9.06066V12.75H6.49865C5.94059 12.75 5.4475 12.3885 5.28023 11.8592C4.94832 11.1283 4.54484 10.6759 4.09681 10.1735C3.95966 10.0197 3.81833 9.86121 3.6736 9.68863C3.36911 9.32555 3.06676 8.91051 2.84622 8.37955C2.62423 7.84511 2.5 7.22989 2.5 6.475Z', 'M6.5 13.5C6.08579 13.5 5.75 13.8358 5.75 14.25C5.75 14.6642 6.08579 15 6.5 15H9.5C9.91421 15 10.25 14.6642 10.25 14.25C10.25 13.8358 9.91421 13.5 9.5 13.5H6.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
