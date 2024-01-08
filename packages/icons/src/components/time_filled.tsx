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

export const TimeFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1ZM8.75 5.25V7.75H10.5C10.9142 7.75 11.25 8.08579 11.25 8.5C11.25 8.91421 10.9142 9.25 10.5 9.25H8C7.58579 9.25 7.25 8.91421 7.25 8.5V5.25C7.25 4.83579 7.58579 4.5 8 4.5C8.41421 4.5 8.75 4.83579 8.75 5.25Z" fill={ colors[0] }/>

  </>,
  name: 'time_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1ZM8.75 5.25V7.75H10.5C10.9142 7.75 11.25 8.08579 11.25 8.5C11.25 8.91421 10.9142 9.25 10.5 9.25H8C7.58579 9.25 7.25 8.91421 7.25 8.5V5.25C7.25 4.83579 7.58579 4.5 8 4.5C8.41421 4.5 8.75 4.83579 8.75 5.25Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
