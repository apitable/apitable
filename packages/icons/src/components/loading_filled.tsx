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

export const LoadingFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8 1C7.58579 1 7.25 1.33579 7.25 1.75C7.25 2.16421 7.58579 2.5 8 2.5C11.0376 2.5 13.5 4.96243 13.5 8C13.5 8.41421 13.8358 8.75 14.25 8.75C14.6642 8.75 15 8.41421 15 8C15 4.13401 11.866 1 8 1Z" fill={ colors[0] }/>

  </>,
  name: 'loading_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8 1C7.58579 1 7.25 1.33579 7.25 1.75C7.25 2.16421 7.58579 2.5 8 2.5C11.0376 2.5 13.5 4.96243 13.5 8C13.5 8.41421 13.8358 8.75 14.25 8.75C14.6642 8.75 15 8.41421 15 8C15 4.13401 11.866 1 8 1Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
