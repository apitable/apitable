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

export const UserOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.00001 1.5C6.06701 1.5 4.50001 3.067 4.50001 5C4.50001 5.97846 4.90152 6.86315 5.54877 7.49829C4.7476 7.83703 4.01287 8.34123 3.39264 8.98843C2.30507 10.1233 1.64846 11.6146 1.52234 13.1907C1.46219 13.9422 2.0771 14.5 2.75 14.5L13.25 14.5C13.9229 14.5 14.5378 13.9422 14.4777 13.1907C14.3515 11.6146 13.6949 10.1233 12.6074 8.98843C11.9871 8.34124 11.2524 7.83704 10.4512 7.49829C11.0985 6.86316 11.5 5.97847 11.5 5C11.5 3.067 9.93301 1.5 8.00001 1.5ZM6.00001 5C6.00001 3.89543 6.89544 3 8.00001 3C9.10458 3 10 3.89543 10 5C10 6.10457 9.10458 7 8.00001 7C6.89544 7 6.00001 6.10457 6.00001 5ZM4.47563 10.0263C5.41601 9.04502 6.68447 8.5 8 8.5C9.31553 8.5 10.584 9.04502 11.5244 10.0263C12.296 10.8315 12.7943 11.8764 12.9487 13L3.05127 13C3.20574 11.8764 3.70396 10.8315 4.47563 10.0263Z" fill={ colors[0] }/>

  </>,
  name: 'user_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8.00001 1.5C6.06701 1.5 4.50001 3.067 4.50001 5C4.50001 5.97846 4.90152 6.86315 5.54877 7.49829C4.7476 7.83703 4.01287 8.34123 3.39264 8.98843C2.30507 10.1233 1.64846 11.6146 1.52234 13.1907C1.46219 13.9422 2.0771 14.5 2.75 14.5L13.25 14.5C13.9229 14.5 14.5378 13.9422 14.4777 13.1907C14.3515 11.6146 13.6949 10.1233 12.6074 8.98843C11.9871 8.34124 11.2524 7.83704 10.4512 7.49829C11.0985 6.86316 11.5 5.97847 11.5 5C11.5 3.067 9.93301 1.5 8.00001 1.5ZM6.00001 5C6.00001 3.89543 6.89544 3 8.00001 3C9.10458 3 10 3.89543 10 5C10 6.10457 9.10458 7 8.00001 7C6.89544 7 6.00001 6.10457 6.00001 5ZM4.47563 10.0263C5.41601 9.04502 6.68447 8.5 8 8.5C9.31553 8.5 10.584 9.04502 11.5244 10.0263C12.296 10.8315 12.7943 11.8764 12.9487 13L3.05127 13C3.20574 11.8764 3.70396 10.8315 4.47563 10.0263Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
