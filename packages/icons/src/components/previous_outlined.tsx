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

export const PreviousOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M37.4142 6.76596C38.1953 7.54701 38.1953 8.81334 37.4142 9.59439L7.00863 40L37.4142 70.4056C38.1953 71.1866 38.1953 72.453 37.4142 73.234C36.6332 74.015 35.3668 74.015 34.5858 73.234L2.76599 41.4142C1.98494 40.6331 1.98494 39.3668 2.76599 38.5858L34.5858 6.76596C35.3668 5.98491 36.6332 5.98491 37.4142 6.76596Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'previous_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M37.4142 6.76596C38.1953 7.54701 38.1953 8.81334 37.4142 9.59439L7.00863 40L37.4142 70.4056C38.1953 71.1866 38.1953 72.453 37.4142 73.234C36.6332 74.015 35.3668 74.015 34.5858 73.234L2.76599 41.4142C1.98494 40.6331 1.98494 39.3668 2.76599 38.5858L34.5858 6.76596C35.3668 5.98491 36.6332 5.98491 37.4142 6.76596Z'],
  width: '80',
  height: '80',
  viewBox: '0 0 80 80',
});
