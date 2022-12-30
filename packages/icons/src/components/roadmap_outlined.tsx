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

export const RoadmapOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2.5 1C1.94772 1 1.5 1.44772 1.5 2V11C1.5 11.5523 1.94772 12 2.5 12H7.5V13H5.5C4.94772 13 4.5 13.4477 4.5 14C4.5 14.5523 4.94772 15 5.5 15H8.5H11.5C12.0523 15 12.5 14.5523 12.5 14C12.5 13.4477 12.0523 13 11.5 13H9.5V12H14.5C15.0523 12 15.5 11.5523 15.5 11V2C15.5 1.44772 15.0523 1 14.5 1H2.5ZM3.5 10V3H13.5V10H3.5ZM6.79289 4.79289C7.18342 4.40237 7.81658 4.40237 8.20711 4.79289L9.5 6.08579L10.7929 4.79289C11.1834 4.40237 11.8166 4.40237 12.2071 4.79289C12.5976 5.18342 12.5976 5.81658 12.2071 6.20711L10.2071 8.20711C9.81658 8.59763 9.18342 8.59763 8.79289 8.20711L7.5 6.91421L6.20711 8.20711C5.81658 8.59763 5.18342 8.59763 4.79289 8.20711C4.40237 7.81658 4.40237 7.18342 4.79289 6.79289L6.79289 4.79289Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'roadmap_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M2.5 1C1.94772 1 1.5 1.44772 1.5 2V11C1.5 11.5523 1.94772 12 2.5 12H7.5V13H5.5C4.94772 13 4.5 13.4477 4.5 14C4.5 14.5523 4.94772 15 5.5 15H8.5H11.5C12.0523 15 12.5 14.5523 12.5 14C12.5 13.4477 12.0523 13 11.5 13H9.5V12H14.5C15.0523 12 15.5 11.5523 15.5 11V2C15.5 1.44772 15.0523 1 14.5 1H2.5ZM3.5 10V3H13.5V10H3.5ZM6.79289 4.79289C7.18342 4.40237 7.81658 4.40237 8.20711 4.79289L9.5 6.08579L10.7929 4.79289C11.1834 4.40237 11.8166 4.40237 12.2071 4.79289C12.5976 5.18342 12.5976 5.81658 12.2071 6.20711L10.2071 8.20711C9.81658 8.59763 9.18342 8.59763 8.79289 8.20711L7.5 6.91421L6.20711 8.20711C5.81658 8.59763 5.18342 8.59763 4.79289 8.20711C4.40237 7.81658 4.40237 7.18342 4.79289 6.79289L6.79289 4.79289Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
