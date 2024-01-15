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

export const PlayFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1.875 8.5C1.875 4.63401 5.00901 1.5 8.875 1.5C12.741 1.5 15.875 4.63401 15.875 8.5C15.875 12.366 12.741 15.5 8.875 15.5C5.00901 15.5 1.875 12.366 1.875 8.5ZM8.39 10.5219L10.9466 8.924C11.2599 8.72817 11.2599 8.27183 10.9466 8.076L8.39 6.47812C8.05698 6.26998 7.625 6.50941 7.625 6.90212V10.0979C7.625 10.4906 8.05697 10.73 8.39 10.5219Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'play_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M1.875 8.5C1.875 4.63401 5.00901 1.5 8.875 1.5C12.741 1.5 15.875 4.63401 15.875 8.5C15.875 12.366 12.741 15.5 8.875 15.5C5.00901 15.5 1.875 12.366 1.875 8.5ZM8.39 10.5219L10.9466 8.924C11.2599 8.72817 11.2599 8.27183 10.9466 8.076L8.39 6.47812C8.05698 6.26998 7.625 6.50941 7.625 6.90212V10.0979C7.625 10.4906 8.05697 10.73 8.39 10.5219Z'],
  width: '17',
  height: '17',
  viewBox: '0 0 17 17',
});
