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

export const CollapseOpenOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M11 11.75C11 12.1642 10.6642 12.5 10.25 12.5L2 12.5C1.58579 12.5 1.25 12.1642 1.25 11.75C1.25 11.3358 1.58579 11 2 11L10.25 11C10.6642 11 11 11.3358 11 11.75Z" fill={ colors[0] }/>
    <path d="M11.7197 10.2803C11.4268 9.98744 11.4268 9.51256 11.7197 9.21967L12.4393 8.5L2 8.5C1.58579 8.5 1.25 8.16421 1.25 7.75C1.25 7.33579 1.58579 7 2 7L12.4393 7L11.7197 6.28033C11.4268 5.98744 11.4268 5.51256 11.7197 5.21967C12.0126 4.92678 12.4874 4.92678 12.7803 5.21967L14.7803 7.21967C15.0732 7.51256 15.0732 7.98744 14.7803 8.28033L12.7803 10.2803C12.4874 10.5732 12.0126 10.5732 11.7197 10.2803Z" fill={ colors[0] }/>
    <path d="M10.25 4.5C10.6642 4.5 11 4.16421 11 3.75C11 3.33579 10.6642 3 10.25 3L2 3C1.58579 3 1.25 3.33579 1.25 3.75C1.25 4.16421 1.58579 4.5 2 4.5L10.25 4.5Z" fill={ colors[0] }/>

  </>,
  name: 'collapse_open_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M11 11.75C11 12.1642 10.6642 12.5 10.25 12.5L2 12.5C1.58579 12.5 1.25 12.1642 1.25 11.75C1.25 11.3358 1.58579 11 2 11L10.25 11C10.6642 11 11 11.3358 11 11.75Z', 'M11.7197 10.2803C11.4268 9.98744 11.4268 9.51256 11.7197 9.21967L12.4393 8.5L2 8.5C1.58579 8.5 1.25 8.16421 1.25 7.75C1.25 7.33579 1.58579 7 2 7L12.4393 7L11.7197 6.28033C11.4268 5.98744 11.4268 5.51256 11.7197 5.21967C12.0126 4.92678 12.4874 4.92678 12.7803 5.21967L14.7803 7.21967C15.0732 7.51256 15.0732 7.98744 14.7803 8.28033L12.7803 10.2803C12.4874 10.5732 12.0126 10.5732 11.7197 10.2803Z', 'M10.25 4.5C10.6642 4.5 11 4.16421 11 3.75C11 3.33579 10.6642 3 10.25 3L2 3C1.58579 3 1.25 3.33579 1.25 3.75C1.25 4.16421 1.58579 4.5 2 4.5L10.25 4.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
