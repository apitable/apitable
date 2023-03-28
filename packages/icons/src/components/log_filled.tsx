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

export const LogFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2 2.25C2 1.55964 2.55964 1 3.25 1H12.75C13.4404 1 14 1.55964 14 2.25V13.75C14 14.4404 13.4404 15 12.75 15H3.25C2.55964 15 2 14.4404 2 13.75V2.25ZM11.5 4.25C11.5 3.83579 11.1642 3.5 10.75 3.5H5.25C4.83579 3.5 4.5 3.83579 4.5 4.25C4.5 4.66421 4.83579 5 5.25 5H10.75C11.1642 5 11.5 4.66421 11.5 4.25ZM8 6C8.41421 6 8.75 6.33579 8.75 6.75C8.75 7.16421 8.41421 7.5 8 7.5H5.25C4.83579 7.5 4.5 7.16421 4.5 6.75C4.5 6.33579 4.83579 6 5.25 6H8Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'log_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M2 2.25C2 1.55964 2.55964 1 3.25 1H12.75C13.4404 1 14 1.55964 14 2.25V13.75C14 14.4404 13.4404 15 12.75 15H3.25C2.55964 15 2 14.4404 2 13.75V2.25ZM11.5 4.25C11.5 3.83579 11.1642 3.5 10.75 3.5H5.25C4.83579 3.5 4.5 3.83579 4.5 4.25C4.5 4.66421 4.83579 5 5.25 5H10.75C11.1642 5 11.5 4.66421 11.5 4.25ZM8 6C8.41421 6 8.75 6.33579 8.75 6.75C8.75 7.16421 8.41421 7.5 8 7.5H5.25C4.83579 7.5 4.5 7.16421 4.5 6.75C4.5 6.33579 4.83579 6 5.25 6H8Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
