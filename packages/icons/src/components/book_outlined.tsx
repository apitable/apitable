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

export const BookOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2.49515 1.63418C1.72166 1.47948 1 2.07109 1 2.8599V12.3401C1 12.9359 1.42057 13.449 2.00485 13.5658L7.85291 14.7354C7.95001 14.7549 8.04999 14.7549 8.14709 14.7354L13.9951 13.5658C14.5794 13.449 15 12.9359 15 12.3401V2.8599C15 2.07109 14.2783 1.47948 13.5049 1.63418L8 2.73515L2.49515 1.63418ZM2.5 3.16485L7.25 4.11485V13.0851L2.5 12.1351V3.16485ZM13.5 12.1351L8.75 13.0851V4.11485L13.5 3.16485V12.1351Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'book_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M2.49515 1.63418C1.72166 1.47948 1 2.07109 1 2.8599V12.3401C1 12.9359 1.42057 13.449 2.00485 13.5658L7.85291 14.7354C7.95001 14.7549 8.04999 14.7549 8.14709 14.7354L13.9951 13.5658C14.5794 13.449 15 12.9359 15 12.3401V2.8599C15 2.07109 14.2783 1.47948 13.5049 1.63418L8 2.73515L2.49515 1.63418ZM2.5 3.16485L7.25 4.11485V13.0851L2.5 12.1351V3.16485ZM13.5 12.1351L8.75 13.0851V4.11485L13.5 3.16485V12.1351Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
