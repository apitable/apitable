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

export const PasteFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5.75 1.5C5.05964 1.5 4.5 2.05964 4.5 2.75V4.5H2.75C2.05964 4.5 1.5 5.05964 1.5 5.75V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H10.25C10.9404 14.5 11.5 13.9404 11.5 13.25V11.5H13.25C13.9404 11.5 14.5 10.9404 14.5 10.25V9C14.5 8.58579 14.1642 8.25 13.75 8.25C13.3358 8.25 13 8.58579 13 9V10H11.5V5.75C11.5 5.05964 10.9404 4.5 10.25 4.5H6V3H7C7.41421 3 7.75 2.66421 7.75 2.25C7.75 1.83579 7.41421 1.5 7 1.5H5.75Z" fill={ colors[0] }/>
    <path d="M14.5 2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H12C11.5858 1.5 11.25 1.83579 11.25 2.25C11.25 2.66421 11.5858 3 12 3H13V4C13 4.41421 13.3358 4.75 13.75 4.75C14.1642 4.75 14.5 4.41421 14.5 4V2.75Z" fill={ colors[0] }/>
    <path d="M13 6.5C13 6.08579 13.3358 5.75 13.75 5.75C14.1642 5.75 14.5 6.08579 14.5 6.5C14.5 6.91421 14.1642 7.25 13.75 7.25C13.3358 7.25 13 6.91421 13 6.5Z" fill={ colors[0] }/>
    <path d="M9.5 1.5C9.08579 1.5 8.75 1.83579 8.75 2.25C8.75 2.66421 9.08579 3 9.5 3C9.91421 3 10.25 2.66421 10.25 2.25C10.25 1.83579 9.91421 1.5 9.5 1.5Z" fill={ colors[0] }/>

  </>,
  name: 'paste_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M5.75 1.5C5.05964 1.5 4.5 2.05964 4.5 2.75V4.5H2.75C2.05964 4.5 1.5 5.05964 1.5 5.75V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H10.25C10.9404 14.5 11.5 13.9404 11.5 13.25V11.5H13.25C13.9404 11.5 14.5 10.9404 14.5 10.25V9C14.5 8.58579 14.1642 8.25 13.75 8.25C13.3358 8.25 13 8.58579 13 9V10H11.5V5.75C11.5 5.05964 10.9404 4.5 10.25 4.5H6V3H7C7.41421 3 7.75 2.66421 7.75 2.25C7.75 1.83579 7.41421 1.5 7 1.5H5.75Z', 'M14.5 2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H12C11.5858 1.5 11.25 1.83579 11.25 2.25C11.25 2.66421 11.5858 3 12 3H13V4C13 4.41421 13.3358 4.75 13.75 4.75C14.1642 4.75 14.5 4.41421 14.5 4V2.75Z', 'M13 6.5C13 6.08579 13.3358 5.75 13.75 5.75C14.1642 5.75 14.5 6.08579 14.5 6.5C14.5 6.91421 14.1642 7.25 13.75 7.25C13.3358 7.25 13 6.91421 13 6.5Z', 'M9.5 1.5C9.08579 1.5 8.75 1.83579 8.75 2.25C8.75 2.66421 9.08579 3 9.5 3C9.91421 3 10.25 2.66421 10.25 2.25C10.25 1.83579 9.91421 1.5 9.5 1.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
