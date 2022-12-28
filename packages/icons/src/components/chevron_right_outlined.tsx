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

export const ChevronRightOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M6 13C5.7 13 5.5 12.9 5.3 12.7C4.9 12.3 4.9 11.7 5.3 11.3L8.6 8L5.3 4.7C4.9 4.3 4.9 3.7 5.3 3.3C5.7 2.9 6.3 2.9 6.7 3.3L10.7 7.3C11.1 7.7 11.1 8.3 10.7 8.7L6.7 12.7C6.5 12.9 6.3 13 6 13Z" fill={ colors[0] }/>

  </>,
  name: 'chevron_right_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M6 13C5.7 13 5.5 12.9 5.3 12.7C4.9 12.3 4.9 11.7 5.3 11.3L8.6 8L5.3 4.7C4.9 4.3 4.9 3.7 5.3 3.3C5.7 2.9 6.3 2.9 6.7 3.3L10.7 7.3C11.1 7.7 11.1 8.3 10.7 8.7L6.7 12.7C6.5 12.9 6.3 13 6 13Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
