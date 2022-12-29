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

export const ChevronLeftOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M10 13C9.7 13 9.5 12.9 9.3 12.7L5.3 8.7C4.9 8.3 4.9 7.7 5.3 7.3L9.3 3.3C9.7 2.9 10.3 2.9 10.7 3.3C11.1 3.7 11.1 4.3 10.7 4.7L7.4 8L10.7 11.3C11.1 11.7 11.1 12.3 10.7 12.7C10.5 12.9 10.3 13 10 13Z" fill={ colors[0] }/>

  </>,
  name: 'chevron_left_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M10 13C9.7 13 9.5 12.9 9.3 12.7L5.3 8.7C4.9 8.3 4.9 7.7 5.3 7.3L9.3 3.3C9.7 2.9 10.3 2.9 10.7 3.3C11.1 3.7 11.1 4.3 10.7 4.7L7.4 8L10.7 11.3C11.1 11.7 11.1 12.3 10.7 12.7C10.5 12.9 10.3 13 10 13Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
