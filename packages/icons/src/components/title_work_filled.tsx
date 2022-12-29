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

export const TitleWorkFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M11.3874 10.805C13.4739 10.2037 15 8.28005 15 6C15 3.23858 12.7614 1 10 1C7.9865 1 6.25097 2.19017 5.45856 3.90539L1.70711 7.65685C1.31658 8.04737 1.31658 8.68054 1.70711 9.07106C2.09763 9.46158 2.7308 9.46158 3.12132 9.07106L5.11612 7.07626C5.23798 7.63176 5.4522 8.15267 5.74187 8.62208L1.70711 12.6568C1.31658 13.0474 1.31658 13.6805 1.70711 14.0711C2.09763 14.4616 2.7308 14.4616 3.12132 14.0711L7.111 10.0814C7.55047 10.393 8.04247 10.6355 8.57111 10.7928L6.70711 12.6568C6.31658 13.0474 6.31658 13.6805 6.70711 14.0711C7.09763 14.4616 7.7308 14.4616 8.12132 14.0711L11.3874 10.805Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'title_work_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M11.3874 10.805C13.4739 10.2037 15 8.28005 15 6C15 3.23858 12.7614 1 10 1C7.9865 1 6.25097 2.19017 5.45856 3.90539L1.70711 7.65685C1.31658 8.04737 1.31658 8.68054 1.70711 9.07106C2.09763 9.46158 2.7308 9.46158 3.12132 9.07106L5.11612 7.07626C5.23798 7.63176 5.4522 8.15267 5.74187 8.62208L1.70711 12.6568C1.31658 13.0474 1.31658 13.6805 1.70711 14.0711C2.09763 14.4616 2.7308 14.4616 3.12132 14.0711L7.111 10.0814C7.55047 10.393 8.04247 10.6355 8.57111 10.7928L6.70711 12.6568C6.31658 13.0474 6.31658 13.6805 6.70711 14.0711C7.09763 14.4616 7.7308 14.4616 8.12132 14.0711L11.3874 10.805Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
