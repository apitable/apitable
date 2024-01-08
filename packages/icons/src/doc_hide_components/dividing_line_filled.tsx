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

export const DividingLineFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1 8C1 7.58579 1.33579 7.25 1.75 7.25H3.25C3.66421 7.25 4 7.58579 4 8C4 8.41421 3.66421 8.75 3.25 8.75H1.75C1.33579 8.75 1 8.41421 1 8Z" fill={ colors[0] }/>
    <path d="M12 8C12 7.58579 12.3358 7.25 12.75 7.25H14.25C14.6642 7.25 15 7.58579 15 8C15 8.41421 14.6642 8.75 14.25 8.75H12.75C12.3358 8.75 12 8.41421 12 8Z" fill={ colors[0] }/>
    <path d="M6.5 7.25C6.08579 7.25 5.75 7.58579 5.75 8C5.75 8.41421 6.08579 8.75 6.5 8.75H9.5C9.91421 8.75 10.25 8.41421 10.25 8C10.25 7.58579 9.91421 7.25 9.5 7.25H6.5Z" fill={ colors[0] }/>

  </>,
  name: 'dividing_line_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M1 8C1 7.58579 1.33579 7.25 1.75 7.25H3.25C3.66421 7.25 4 7.58579 4 8C4 8.41421 3.66421 8.75 3.25 8.75H1.75C1.33579 8.75 1 8.41421 1 8Z', 'M12 8C12 7.58579 12.3358 7.25 12.75 7.25H14.25C14.6642 7.25 15 7.58579 15 8C15 8.41421 14.6642 8.75 14.25 8.75H12.75C12.3358 8.75 12 8.41421 12 8Z', 'M6.5 7.25C6.08579 7.25 5.75 7.58579 5.75 8C5.75 8.41421 6.08579 8.75 6.5 8.75H9.5C9.91421 8.75 10.25 8.41421 10.25 8C10.25 7.58579 9.91421 7.25 9.5 7.25H6.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
