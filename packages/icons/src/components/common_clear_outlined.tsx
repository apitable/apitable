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

export const CommonClearOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M10.1317 1.64643C9.54593 1.06065 8.59619 1.06065 8.0104 1.64643L4.12131 5.53552L1.64644 8.01039C1.06065 8.59618 1.06065 9.54593 1.64644 10.1317L3.53553 12.0208H2.00009C1.44781 12.0208 1.00009 12.4685 1.00009 13.0208C1.00009 13.5731 1.44781 14.0208 2.00009 14.0208H6.94982H13C13.5523 14.0208 14 13.5731 14 13.0208C14 12.4685 13.5523 12.0208 13 12.0208H10.364L10.4853 11.8995L14.3744 8.01039C14.9601 7.42461 14.9601 6.47486 14.3744 5.88907L10.1317 1.64643ZM6.24263 6.24263L9.07106 3.4142L12.6066 6.94973L9.77817 9.77816L6.24263 6.24263ZM4.82842 7.65684L8.36395 11.1924C7.5829 11.9734 6.31658 11.9734 5.53553 11.1924L3.41421 9.07105L4.82842 7.65684Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'common_clear_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M10.1317 1.64643C9.54593 1.06065 8.59619 1.06065 8.0104 1.64643L4.12131 5.53552L1.64644 8.01039C1.06065 8.59618 1.06065 9.54593 1.64644 10.1317L3.53553 12.0208H2.00009C1.44781 12.0208 1.00009 12.4685 1.00009 13.0208C1.00009 13.5731 1.44781 14.0208 2.00009 14.0208H6.94982H13C13.5523 14.0208 14 13.5731 14 13.0208C14 12.4685 13.5523 12.0208 13 12.0208H10.364L10.4853 11.8995L14.3744 8.01039C14.9601 7.42461 14.9601 6.47486 14.3744 5.88907L10.1317 1.64643ZM6.24263 6.24263L9.07106 3.4142L12.6066 6.94973L9.77817 9.77816L6.24263 6.24263ZM4.82842 7.65684L8.36395 11.1924C7.5829 11.9734 6.31658 11.9734 5.53553 11.1924L3.41421 9.07105L4.82842 7.65684Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
