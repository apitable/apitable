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

export const PositionFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <g clipPath="url(#clip0_3655_65218)">

      <path d="M8.75003 1C8.75003 0.585786 8.41424 0.25 8.00003 0.25C7.58582 0.25 7.25003 0.585786 7.25003 1V2.29847C4.67422 2.63398 2.634 4.6742 2.29847 7.25H1C0.585786 7.25 0.25 7.58579 0.25 8C0.25 8.41421 0.585786 8.75 1 8.75H2.29847C2.634 11.3258 4.67421 13.366 7.25 13.7015V15C7.25 15.4142 7.58579 15.75 8 15.75C8.41421 15.75 8.75 15.4142 8.75 15V13.7015C11.3258 13.366 13.366 11.3258 13.7015 8.75H15C15.4142 8.75 15.75 8.41421 15.75 8C15.75 7.58579 15.4142 7.25 15 7.25H13.7015C13.366 4.67422 11.3258 2.63402 8.75003 2.29847V1ZM8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

    </g>
    <defs>

      <clipPath id="clip0_3655_65218">

        <rect width="16" height="16" fill={ colors[1] }/>

      </clipPath>

    </defs>

  </>,
  name: 'position_filled',
  defaultColors: ['#D9D9D9', 'white'],
  colorful: true,
  allPathData: ['M8.75003 1C8.75003 0.585786 8.41424 0.25 8.00003 0.25C7.58582 0.25 7.25003 0.585786 7.25003 1V2.29847C4.67422 2.63398 2.634 4.6742 2.29847 7.25H1C0.585786 7.25 0.25 7.58579 0.25 8C0.25 8.41421 0.585786 8.75 1 8.75H2.29847C2.634 11.3258 4.67421 13.366 7.25 13.7015V15C7.25 15.4142 7.58579 15.75 8 15.75C8.41421 15.75 8.75 15.4142 8.75 15V13.7015C11.3258 13.366 13.366 11.3258 13.7015 8.75H15C15.4142 8.75 15.75 8.41421 15.75 8C15.75 7.58579 15.4142 7.25 15 7.25H13.7015C13.366 4.67422 11.3258 2.63402 8.75003 2.29847V1ZM8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
