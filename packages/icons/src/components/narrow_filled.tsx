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

export const NarrowFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.25 7C8.25 7.41421 8.58579 7.75 9 7.75H13C13.4142 7.75 13.75 7.41421 13.75 7C13.75 6.58579 13.4142 6.25 13 6.25H10.8107L14.0303 3.03033C14.3232 2.73744 14.3232 2.26256 14.0303 1.96967C13.7374 1.67678 13.2626 1.67678 12.9697 1.96967L9.75 5.18934V3C9.75 2.58579 9.41421 2.25 9 2.25C8.58579 2.25 8.25 2.58579 8.25 3V7Z" fill={ colors[0] }/>
    <path d="M7.75 9C7.75 8.58579 7.41421 8.25 7 8.25H3C2.58579 8.25 2.25 8.58579 2.25 9C2.25 9.41421 2.58579 9.75 3 9.75H5.18934L1.96967 12.9697C1.67678 13.2626 1.67678 13.7374 1.96967 14.0303C2.26256 14.3232 2.73744 14.3232 3.03033 14.0303L6.25 10.8107V13C6.25 13.4142 6.58579 13.75 7 13.75C7.41421 13.75 7.75 13.4142 7.75 13V9Z" fill={ colors[0] }/>

  </>,
  name: 'narrow_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8.25 7C8.25 7.41421 8.58579 7.75 9 7.75H13C13.4142 7.75 13.75 7.41421 13.75 7C13.75 6.58579 13.4142 6.25 13 6.25H10.8107L14.0303 3.03033C14.3232 2.73744 14.3232 2.26256 14.0303 1.96967C13.7374 1.67678 13.2626 1.67678 12.9697 1.96967L9.75 5.18934V3C9.75 2.58579 9.41421 2.25 9 2.25C8.58579 2.25 8.25 2.58579 8.25 3V7Z', 'M7.75 9C7.75 8.58579 7.41421 8.25 7 8.25H3C2.58579 8.25 2.25 8.58579 2.25 9C2.25 9.41421 2.58579 9.75 3 9.75H5.18934L1.96967 12.9697C1.67678 13.2626 1.67678 13.7374 1.96967 14.0303C2.26256 14.3232 2.73744 14.3232 3.03033 14.0303L6.25 10.8107V13C6.25 13.4142 6.58579 13.75 7 13.75C7.41421 13.75 7.75 13.4142 7.75 13V9Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
