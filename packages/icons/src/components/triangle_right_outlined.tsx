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

export const TriangleRightOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M12.4691 9.06C13.2524 8.57041 13.2524 7.42959 12.4691 6.94L5.9125 2.84212C5.07994 2.32177 4 2.92033 4 3.90212V12.0979C4 13.0797 5.07993 13.6782 5.9125 13.1579L12.4691 9.06ZM5.5 4.35318L11.3349 8L5.5 11.6468L5.5 4.35318Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'triangle_right_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M12.4691 9.06C13.2524 8.57041 13.2524 7.42959 12.4691 6.94L5.9125 2.84212C5.07994 2.32177 4 2.92033 4 3.90212V12.0979C4 13.0797 5.07993 13.6782 5.9125 13.1579L12.4691 9.06ZM5.5 4.35318L11.3349 8L5.5 11.6468L5.5 4.35318Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
