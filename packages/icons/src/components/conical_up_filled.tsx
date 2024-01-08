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

export const ConicalUpFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7.3683 2.59571C7.50615 2.38031 7.74426 2.25 8 2.25C8.25574 2.25 8.49385 2.38031 8.6317 2.59571L12.6317 8.84571C12.7794 9.07656 12.7895 9.36962 12.6579 9.61006C12.5263 9.85049 12.2741 10 12 10L4 10C3.72592 10 3.47366 9.85049 3.34208 9.61006C3.2105 9.36962 3.22055 9.07656 3.3683 8.84571L7.3683 2.59571Z" fill={ colors[0] }/>
    <path d="M3.25 12.25C3.25 12.6642 3.58579 13 4 13H12C12.4142 13 12.75 12.6642 12.75 12.25C12.75 11.8358 12.4142 11.5 12 11.5H4C3.58579 11.5 3.25 11.8358 3.25 12.25Z" fill={ colors[0] }/>

  </>,
  name: 'conical_up_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M7.3683 2.59571C7.50615 2.38031 7.74426 2.25 8 2.25C8.25574 2.25 8.49385 2.38031 8.6317 2.59571L12.6317 8.84571C12.7794 9.07656 12.7895 9.36962 12.6579 9.61006C12.5263 9.85049 12.2741 10 12 10L4 10C3.72592 10 3.47366 9.85049 3.34208 9.61006C3.2105 9.36962 3.22055 9.07656 3.3683 8.84571L7.3683 2.59571Z', 'M3.25 12.25C3.25 12.6642 3.58579 13 4 13H12C12.4142 13 12.75 12.6642 12.75 12.25C12.75 11.8358 12.4142 11.5 12 11.5H4C3.58579 11.5 3.25 11.8358 3.25 12.25Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
