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

export const ListOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2 3C2 2.44772 2.44772 2 3 2H13C13.5523 2 14 2.44772 14 3C14 3.55228 13.5523 4 13 4H3C2.44772 4 2 3.55228 2 3ZM2 8C2 7.44772 2.44772 7 3 7H13C13.5523 7 14 7.44772 14 8C14 8.55228 13.5523 9 13 9H3C2.44772 9 2 8.55228 2 8ZM3 12C2.44772 12 2 12.4477 2 13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13C14 12.4477 13.5523 12 13 12H3Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'list_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M2 3C2 2.44772 2.44772 2 3 2H13C13.5523 2 14 2.44772 14 3C14 3.55228 13.5523 4 13 4H3C2.44772 4 2 3.55228 2 3ZM2 8C2 7.44772 2.44772 7 3 7H13C13.5523 7 14 7.44772 14 8C14 8.55228 13.5523 9 13 9H3C2.44772 9 2 8.55228 2 8ZM3 12C2.44772 12 2 12.4477 2 13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13C14 12.4477 13.5523 12 13 12H3Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
