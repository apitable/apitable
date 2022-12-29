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

export const UndoFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2.34356 8.3551C2.05067 8.0622 2.05067 7.58733 2.34356 7.29444L6.42367 3.21434C6.63851 2.9995 6.96174 2.9355 7.24223 3.05226C7.52273 3.16903 7.70506 3.44349 7.70399 3.74732L7.69629 5.9258C10.7246 5.83418 13.7967 8.6691 14.4114 11.7512C14.4606 12.0167 14.2579 12.1305 13.9896 11.8294C12.5971 10.1551 10.4321 9.33592 8.1913 9.75123L7.68244 9.84554L7.67525 11.8788C7.67418 12.1816 7.49106 12.4541 7.21104 12.5695C6.93103 12.685 6.60908 12.6206 6.39493 12.4065L2.34356 8.3551Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'undo_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M2.34356 8.3551C2.05067 8.0622 2.05067 7.58733 2.34356 7.29444L6.42367 3.21434C6.63851 2.9995 6.96174 2.9355 7.24223 3.05226C7.52273 3.16903 7.70506 3.44349 7.70399 3.74732L7.69629 5.9258C10.7246 5.83418 13.7967 8.6691 14.4114 11.7512C14.4606 12.0167 14.2579 12.1305 13.9896 11.8294C12.5971 10.1551 10.4321 9.33592 8.1913 9.75123L7.68244 9.84554L7.67525 11.8788C7.67418 12.1816 7.49106 12.4541 7.21104 12.5695C6.93103 12.685 6.60908 12.6206 6.39493 12.4065L2.34356 8.3551Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
