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

export const HistoryOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1ZM3 8C3 5.23858 5.23858 3 8 3C10.7614 3 13 5.23858 13 8C13 10.7614 10.7614 13 8 13C5.23858 13 3 10.7614 3 8ZM8.5 5.5C8.5 4.94772 8.05228 4.5 7.5 4.5C6.94772 4.5 6.5 4.94772 6.5 5.5V9C6.5 9.55228 6.94772 10 7.5 10H10C10.5523 10 11 9.55228 11 9C11 8.44772 10.5523 8 10 8H8.5V5.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'history_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1ZM3 8C3 5.23858 5.23858 3 8 3C10.7614 3 13 5.23858 13 8C13 10.7614 10.7614 13 8 13C5.23858 13 3 10.7614 3 8ZM8.5 5.5C8.5 4.94772 8.05228 4.5 7.5 4.5C6.94772 4.5 6.5 4.94772 6.5 5.5V9C6.5 9.55228 6.94772 10 7.5 10H10C10.5523 10 11 9.55228 11 9C11 8.44772 10.5523 8 10 8H8.5V5.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
