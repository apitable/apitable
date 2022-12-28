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

export const RedoFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M13.6564 8.3551C13.9493 8.0622 13.9493 7.58733 13.6564 7.29444L9.57634 3.21434C9.3615 2.9995 9.03827 2.9355 8.75778 3.05226C8.47728 3.16903 8.29494 3.44349 8.29602 3.74732L8.30372 5.9258C5.27542 5.83417 2.20329 8.6691 1.58861 11.7512C1.53941 12.0167 1.74206 12.1305 2.01043 11.8294C3.40286 10.1551 5.56786 9.33592 7.8087 9.75123L8.31757 9.84555L8.32476 11.8788C8.32583 12.1816 8.50895 12.4541 8.78896 12.5695C9.06898 12.685 9.39092 12.6206 9.60508 12.4065L13.6564 8.3551Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'redo_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M13.6564 8.3551C13.9493 8.0622 13.9493 7.58733 13.6564 7.29444L9.57634 3.21434C9.3615 2.9995 9.03827 2.9355 8.75778 3.05226C8.47728 3.16903 8.29494 3.44349 8.29602 3.74732L8.30372 5.9258C5.27542 5.83417 2.20329 8.6691 1.58861 11.7512C1.53941 12.0167 1.74206 12.1305 2.01043 11.8294C3.40286 10.1551 5.56786 9.33592 7.8087 9.75123L8.31757 9.84555L8.32476 11.8788C8.32583 12.1816 8.50895 12.4541 8.78896 12.5695C9.06898 12.685 9.39092 12.6206 9.60508 12.4065L13.6564 8.3551Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
