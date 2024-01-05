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

export const EyeOpenFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M14.8938 8.57631C14.019 9.89123 11.5729 13 8 13C4.42705 13 1.98102 9.89123 1.10623 8.57631C0.871471 8.22344 0.871472 7.77656 1.10623 7.42369C1.98103 6.10877 4.42705 3 8 3C11.5729 3 14.019 6.10877 14.8938 7.42369C15.1285 7.77656 15.1285 8.22344 14.8938 8.57631ZM9.75 8C9.75 8.9665 8.9665 9.75 8 9.75C7.0335 9.75 6.25 8.9665 6.25 8C6.25 7.0335 7.0335 6.25 8 6.25C8.9665 6.25 9.75 7.0335 9.75 8Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'eye_open_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M14.8938 8.57631C14.019 9.89123 11.5729 13 8 13C4.42705 13 1.98102 9.89123 1.10623 8.57631C0.871471 8.22344 0.871472 7.77656 1.10623 7.42369C1.98103 6.10877 4.42705 3 8 3C11.5729 3 14.019 6.10877 14.8938 7.42369C15.1285 7.77656 15.1285 8.22344 14.8938 8.57631ZM9.75 8C9.75 8.9665 8.9665 9.75 8 9.75C7.0335 9.75 6.25 8.9665 6.25 8C6.25 7.0335 7.0335 6.25 8 6.25C8.9665 6.25 9.75 7.0335 9.75 8Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
