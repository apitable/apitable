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

export const CommentBjEntireFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <g clipPath="url(#clip0_4062_1574)">

      <path d="M2 0.5C0.9 0.5 0 1.4 0 2.5V12.5C0 13.6 0.9 14.5 2 14.5H4V16C4 16.7 4.7 17.2 5.4 16.9L11.8 14.4H16C17.1 14.4 18 13.5 18 12.4V2.5C18 1.4 17.1 0.5 16 0.5H2Z" fill={ colors[0] }/>

    </g>
    <defs>

      <clipPath id="clip0_4062_1574">

        <rect width="18" height="17" fill={ colors[1] } transform="translate(0 0.5)"/>

      </clipPath>

    </defs>

  </>,
  name: 'comment_bj_entire_filled',
  defaultColors: ['#D9D9D9', 'white'],
  colorful: true,
  allPathData: ['M2 0.5C0.9 0.5 0 1.4 0 2.5V12.5C0 13.6 0.9 14.5 2 14.5H4V16C4 16.7 4.7 17.2 5.4 16.9L11.8 14.4H16C17.1 14.4 18 13.5 18 12.4V2.5C18 1.4 17.1 0.5 16 0.5H2Z'],
  width: '18',
  height: '18',
  viewBox: '0 0 18 18',
});
