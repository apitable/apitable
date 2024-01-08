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

export const ConicalLeftFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2.59571 8.6317C2.38031 8.49384 2.25 8.25573 2.25 8C2.25 7.74426 2.38031 7.50615 2.59571 7.36829L8.84571 3.36829C9.07656 3.22055 9.36962 3.2105 9.61006 3.34208C9.85049 3.47366 10 3.72591 10 4L10 12C10 12.2741 9.85049 12.5263 9.61006 12.6579C9.36962 12.7895 9.07656 12.7794 8.84571 12.6317L2.59571 8.6317Z" fill={ colors[0] }/>
    <path d="M12.25 12.75C12.6642 12.75 13 12.4142 13 12V4C13 3.58578 12.6642 3.25 12.25 3.25C11.8358 3.25 11.5 3.58578 11.5 4V12C11.5 12.4142 11.8358 12.75 12.25 12.75Z" fill={ colors[0] }/>

  </>,
  name: 'conical_left_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M2.59571 8.6317C2.38031 8.49384 2.25 8.25573 2.25 8C2.25 7.74426 2.38031 7.50615 2.59571 7.36829L8.84571 3.36829C9.07656 3.22055 9.36962 3.2105 9.61006 3.34208C9.85049 3.47366 10 3.72591 10 4L10 12C10 12.2741 9.85049 12.5263 9.61006 12.6579C9.36962 12.7895 9.07656 12.7794 8.84571 12.6317L2.59571 8.6317Z', 'M12.25 12.75C12.6642 12.75 13 12.4142 13 12V4C13 3.58578 12.6642 3.25 12.25 3.25C11.8358 3.25 11.5 3.58578 11.5 4V12C11.5 12.4142 11.8358 12.75 12.25 12.75Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
