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

export const ArchiveFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1 2.75C1 2.05964 1.55964 1.5 2.25 1.5H13.75C14.4404 1.5 15 2.05964 15 2.75V4.25C15 4.94036 14.4404 5.5 13.75 5.5H2.25C1.55964 5.5 1 4.94036 1 4.25V2.75Z" fill={ colors[0] }/>
    <path d="M2.25 7C2.25 6.72386 2.47386 6.5 2.75 6.5H13.25C13.5261 6.5 13.75 6.72386 13.75 7V13.25C13.75 13.9404 13.1904 14.5 12.5 14.5H3.5C2.80964 14.5 2.25 13.9404 2.25 13.25V7ZM6.5 8C6.08579 8 5.75 8.33579 5.75 8.75C5.75 9.16421 6.08579 9.5 6.5 9.5H9.5C9.91421 9.5 10.25 9.16421 10.25 8.75C10.25 8.33579 9.91421 8 9.5 8H6.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'Archive_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M1 2.75C1 2.05964 1.55964 1.5 2.25 1.5H13.75C14.4404 1.5 15 2.05964 15 2.75V4.25C15 4.94036 14.4404 5.5 13.75 5.5H2.25C1.55964 5.5 1 4.94036 1 4.25V2.75Z', 'M2.25 7C2.25 6.72386 2.47386 6.5 2.75 6.5H13.25C13.5261 6.5 13.75 6.72386 13.75 7V13.25C13.75 13.9404 13.1904 14.5 12.5 14.5H3.5C2.80964 14.5 2.25 13.9404 2.25 13.25V7ZM6.5 8C6.08579 8 5.75 8.33579 5.75 8.75C5.75 9.16421 6.08579 9.5 6.5 9.5H9.5C9.91421 9.5 10.25 9.16421 10.25 8.75C10.25 8.33579 9.91421 8 9.5 8H6.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
