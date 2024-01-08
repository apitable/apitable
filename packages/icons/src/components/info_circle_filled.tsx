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

export const InfoCircleFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8ZM8 11.75C8.41421 11.75 8.75 11.4142 8.75 11V8C8.75 7.58579 8.41421 7.25 8 7.25C7.58579 7.25 7.25 7.58579 7.25 8V11C7.25 11.4142 7.58579 11.75 8 11.75ZM8 4.25C7.44772 4.25 7 4.69772 7 5.25C7 5.80228 7.44772 6.25 8 6.25C8.55228 6.25 9 5.80228 9 5.25C9 4.69772 8.55228 4.25 8 4.25Z" fill={ colors[0] }/>

  </>,
  name: 'info_circle_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8ZM8 11.75C8.41421 11.75 8.75 11.4142 8.75 11V8C8.75 7.58579 8.41421 7.25 8 7.25C7.58579 7.25 7.25 7.58579 7.25 8V11C7.25 11.4142 7.58579 11.75 8 11.75ZM8 4.25C7.44772 4.25 7 4.69772 7 5.25C7 5.80228 7.44772 6.25 8 6.25C8.55228 6.25 9 5.80228 9 5.25C9 4.69772 8.55228 4.25 8 4.25Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
