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

export const WarnCircleFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8ZM8 4.25C7.58579 4.25 7.25 4.58579 7.25 5V8C7.25 8.41421 7.58579 8.75 8 8.75C8.41421 8.75 8.75 8.41421 8.75 8V5C8.75 4.58579 8.41421 4.25 8 4.25ZM8 11.75C8.55228 11.75 9 11.3023 9 10.75C9 10.1977 8.55228 9.75 8 9.75C7.44772 9.75 7 10.1977 7 10.75C7 11.3023 7.44772 11.75 8 11.75Z" fill={ colors[0] }/>

  </>,
  name: 'warn_circle_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8ZM8 4.25C7.58579 4.25 7.25 4.58579 7.25 5V8C7.25 8.41421 7.58579 8.75 8 8.75C8.41421 8.75 8.75 8.41421 8.75 8V5C8.75 4.58579 8.41421 4.25 8 4.25ZM8 11.75C8.55228 11.75 9 11.3023 9 10.75C9 10.1977 8.55228 9.75 8 9.75C7.44772 9.75 7 10.1977 7 10.75C7 11.3023 7.44772 11.75 8 11.75Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
