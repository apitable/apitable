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

export const PasteOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M6 1C5.44772 1 5 1.44772 5 2C5 2.55228 5.44772 3 6 3H11.7143C12.4244 3 13 3.57563 13 4.28571V10C13 10.5523 13.4477 11 14 11C14.5523 11 15 10.5523 15 10V4.28571C15 2.47106 13.5289 1 11.7143 1H6ZM3 4C1.89543 4 1 4.89543 1 6V13C1 14.1046 1.89543 15 3 15H10C11.1046 15 12 14.1046 12 13V6C12 4.89543 11.1046 4 10 4H3ZM3 6H10V13H3V6Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'paste_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M6 1C5.44772 1 5 1.44772 5 2C5 2.55228 5.44772 3 6 3H11.7143C12.4244 3 13 3.57563 13 4.28571V10C13 10.5523 13.4477 11 14 11C14.5523 11 15 10.5523 15 10V4.28571C15 2.47106 13.5289 1 11.7143 1H6ZM3 4C1.89543 4 1 4.89543 1 6V13C1 14.1046 1.89543 15 3 15H10C11.1046 15 12 14.1046 12 13V6C12 4.89543 11.1046 4 10 4H3ZM3 6H10V13H3V6Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
