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

export const ConicalRightOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M13.4043 8.6317C13.6197 8.49385 13.75 8.25574 13.75 8C13.75 7.74426 13.6197 7.50615 13.4043 7.3683L7.15429 3.3683C6.92344 3.22055 6.63038 3.2105 6.38994 3.34208C6.14951 3.47366 6 3.72592 6 4L6 12C6 12.2741 6.14951 12.5263 6.38994 12.6579C6.63038 12.7895 6.92344 12.7794 7.15429 12.6317L13.4043 8.6317ZM11.6087 8L7.5 10.6295L7.5 5.37045L11.6087 8Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M3.75 12.75C3.33579 12.75 3 12.4142 3 12L3 4C3 3.58579 3.33579 3.25 3.75 3.25C4.16421 3.25 4.5 3.58579 4.5 4L4.5 12C4.5 12.4142 4.16421 12.75 3.75 12.75Z" fill={ colors[0] }/>

  </>,
  name: 'conical_right_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M13.4043 8.6317C13.6197 8.49385 13.75 8.25574 13.75 8C13.75 7.74426 13.6197 7.50615 13.4043 7.3683L7.15429 3.3683C6.92344 3.22055 6.63038 3.2105 6.38994 3.34208C6.14951 3.47366 6 3.72592 6 4L6 12C6 12.2741 6.14951 12.5263 6.38994 12.6579C6.63038 12.7895 6.92344 12.7794 7.15429 12.6317L13.4043 8.6317ZM11.6087 8L7.5 10.6295L7.5 5.37045L11.6087 8Z', 'M3.75 12.75C3.33579 12.75 3 12.4142 3 12L3 4C3 3.58579 3.33579 3.25 3.75 3.25C4.16421 3.25 4.5 3.58579 4.5 4L4.5 12C4.5 12.4142 4.16421 12.75 3.75 12.75Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
