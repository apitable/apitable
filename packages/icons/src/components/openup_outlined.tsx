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

export const OpenupOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2 2H6C6.6 2 7 2.4 7 3V13C7 13.6 6.6 14 6 14H2C1.4 14 1 13.6 1 13V3C1 2.4 1.4 2 2 2ZM3 12H5V4H3V12ZM10.7 3.3L14.7 7.3C15.1 7.7 15.1 8.3 14.7 8.7L10.7 12.7C10.5 12.9 10.3 13 10 13C9.7 13 9.5 12.9 9.3 12.7C8.9 12.3 8.9 11.7 9.3 11.3L11.6 9H9C8.4 9 8 8.6 8 8C8 7.4 8.4 7 9 7H11.6L9.3 4.7C8.9 4.3 8.9 3.7 9.3 3.3C9.7 2.9 10.3 2.9 10.7 3.3Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'openup_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M2 2H6C6.6 2 7 2.4 7 3V13C7 13.6 6.6 14 6 14H2C1.4 14 1 13.6 1 13V3C1 2.4 1.4 2 2 2ZM3 12H5V4H3V12ZM10.7 3.3L14.7 7.3C15.1 7.7 15.1 8.3 14.7 8.7L10.7 12.7C10.5 12.9 10.3 13 10 13C9.7 13 9.5 12.9 9.3 12.7C8.9 12.3 8.9 11.7 9.3 11.3L11.6 9H9C8.4 9 8 8.6 8 8C8 7.4 8.4 7 9 7H11.6L9.3 4.7C8.9 4.3 8.9 3.7 9.3 3.3C9.7 2.9 10.3 2.9 10.7 3.3Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
