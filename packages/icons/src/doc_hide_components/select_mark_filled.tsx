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

export const SelectMarkFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <g clipPath="url(#clip0_4049_1574)">

      <path fill-rule="evenodd" clip-rule="evenodd" d="M63.9989 63.9989V-0.00105794L-0.00106049 63.9989H63.9989ZM54.3024 37.3309C55.3437 38.3723 55.3437 40.0608 54.3024 41.1021L42.9888 52.4157C41.9472 53.4573 40.2589 53.4573 39.2176 52.4157L33.5605 46.7589C32.5192 45.7176 32.5192 44.0291 33.5605 42.9877C34.6021 41.9464 36.2904 41.9464 37.3317 42.9877L41.1032 46.7589L50.5312 37.3309C51.5725 36.2893 53.2611 36.2893 54.3024 37.3309Z" fill="#D9D9D9"/>

    </g>
    <defs>

      <clipPath id="clip0_4049_1574">

        <rect width="64" height="64" fill="white" transform="translate(0.000244141 0.000244141)"/>

      </clipPath>

    </defs>

  </>,
  name: 'select_mark_filled',
  defaultColors: ['#D9D9D9', 'white'],
  colorful: true,
  allPathData: [],
  width: '64',
  height: '64',
  viewBox: '0 0 64 64',
});
