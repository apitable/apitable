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

export const SelectSingleFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8ZM5.51018 6.9375L7.45873 10.3125C7.6993 10.7292 8.3007 10.7292 8.54127 10.3125L10.4898 6.9375C10.7304 6.52083 10.4297 6 9.94856 6L6.05144 6C5.57032 6 5.26961 6.52083 5.51018 6.9375Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'select_single_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8ZM5.51018 6.9375L7.45873 10.3125C7.6993 10.7292 8.3007 10.7292 8.54127 10.3125L10.4898 6.9375C10.7304 6.52083 10.4297 6 9.94856 6L6.05144 6C5.57032 6 5.26961 6.52083 5.51018 6.9375Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
