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

export const DatasheetOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M13 9H11V7H13C13.6 7 14 6.6 14 6C14 5.4 13.6 5 13 5H11V3C11 2.4 10.6 2 10 2C9.4 2 9 2.4 9 3V5H7V3C7 2.4 6.6 2 6 2C5.4 2 5 2.4 5 3V5H3C2.4 5 2 5.4 2 6C2 6.6 2.4 7 3 7H5V9H3C2.4 9 2 9.4 2 10C2 10.6 2.4 11 3 11H5V13C5 13.6 5.4 14 6 14C6.6 14 7 13.6 7 13V11H9V13C9 13.6 9.4 14 10 14C10.6 14 11 13.6 11 13V11H13C13.6 11 14 10.6 14 10C14 9.4 13.6 9 13 9ZM7 9V7H9V9H7Z" fill={ colors[0] }/>

  </>,
  name: 'datasheet_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M13 9H11V7H13C13.6 7 14 6.6 14 6C14 5.4 13.6 5 13 5H11V3C11 2.4 10.6 2 10 2C9.4 2 9 2.4 9 3V5H7V3C7 2.4 6.6 2 6 2C5.4 2 5 2.4 5 3V5H3C2.4 5 2 5.4 2 6C2 6.6 2.4 7 3 7H5V9H3C2.4 9 2 9.4 2 10C2 10.6 2.4 11 3 11H5V13C5 13.6 5.4 14 6 14C6.6 14 7 13.6 7 13V11H9V13C9 13.6 9.4 14 10 14C10.6 14 11 13.6 11 13V11H13C13.6 11 14 10.6 14 10C14 9.4 13.6 9 13 9ZM7 9V7H9V9H7Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
