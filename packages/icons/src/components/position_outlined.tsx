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

export const PositionOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <g clipPath="url(#clip0_3655_65128)">

      <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" fill={ colors[0] }/>

      <path d="M8 0.25C8.41421 0.25 8.75 0.585786 8.75 1V2.29847C11.3258 2.634 13.366 4.67421 13.7015 7.25H15C15.4142 7.25 15.75 7.58579 15.75 8C15.75 8.41421 15.4142 8.75 15 8.75H13.7015C13.366 11.3258 11.3258 13.366 8.75 13.7015V15C8.75 15.4142 8.41421 15.75 8 15.75C7.58579 15.75 7.25 15.4142 7.25 15V13.7015C4.67421 13.366 2.634 11.3258 2.29847 8.75H1C0.585786 8.75 0.25 8.41421 0.25 8C0.25 7.58579 0.585786 7.25 1 7.25H2.29847C2.634 4.67421 4.67421 2.634 7.25 2.29847V1C7.25 0.585786 7.58579 0.25 8 0.25ZM3.75 8C3.75 5.65279 5.65279 3.75 8 3.75C10.3472 3.75 12.25 5.65279 12.25 8C12.25 10.3472 10.3472 12.25 8 12.25C5.65279 12.25 3.75 10.3472 3.75 8Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

    </g>
    <defs>

      <clipPath id="clip0_3655_65128">

        <rect width="16" height="16" fill={ colors[1] }/>

      </clipPath>

    </defs>

  </>,
  name: 'position_outlined',
  defaultColors: ['#D9D9D9', 'white'],
  colorful: true,
  allPathData: ['M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z', 'M8 0.25C8.41421 0.25 8.75 0.585786 8.75 1V2.29847C11.3258 2.634 13.366 4.67421 13.7015 7.25H15C15.4142 7.25 15.75 7.58579 15.75 8C15.75 8.41421 15.4142 8.75 15 8.75H13.7015C13.366 11.3258 11.3258 13.366 8.75 13.7015V15C8.75 15.4142 8.41421 15.75 8 15.75C7.58579 15.75 7.25 15.4142 7.25 15V13.7015C4.67421 13.366 2.634 11.3258 2.29847 8.75H1C0.585786 8.75 0.25 8.41421 0.25 8C0.25 7.58579 0.585786 7.25 1 7.25H2.29847C2.634 4.67421 4.67421 2.634 7.25 2.29847V1C7.25 0.585786 7.58579 0.25 8 0.25ZM3.75 8C3.75 5.65279 5.65279 3.75 8 3.75C10.3472 3.75 12.25 5.65279 12.25 8C12.25 10.3472 10.3472 12.25 8 12.25C5.65279 12.25 3.75 10.3472 3.75 8Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
