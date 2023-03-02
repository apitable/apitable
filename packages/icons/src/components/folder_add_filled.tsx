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

export const FolderAddFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1 3.25C1 2.55964 1.55964 2 2.25 2H7.83568C8.10252 2 8.36236 2.08539 8.57718 2.24368L10.2822 3.5H13.75C14.4404 3.5 15 4.05964 15 4.75V12.75C15 13.4404 14.4404 14 13.75 14H2.25C1.55964 14 1 13.4404 1 12.75V3.25ZM5 8.25C5 7.83579 5.33579 7.5 5.75 7.5H7.25V6C7.25 5.58579 7.58579 5.25 8 5.25C8.41421 5.25 8.75 5.58579 8.75 6V7.5H10.25C10.6642 7.5 11 7.83579 11 8.25C11 8.66421 10.6642 9 10.25 9H8.75V10.5C8.75 10.9142 8.41421 11.25 8 11.25C7.58579 11.25 7.25 10.9142 7.25 10.5V9H5.75C5.33579 9 5 8.66421 5 8.25Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'folder_add_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M1 3.25C1 2.55964 1.55964 2 2.25 2H7.83568C8.10252 2 8.36236 2.08539 8.57718 2.24368L10.2822 3.5H13.75C14.4404 3.5 15 4.05964 15 4.75V12.75C15 13.4404 14.4404 14 13.75 14H2.25C1.55964 14 1 13.4404 1 12.75V3.25ZM5 8.25C5 7.83579 5.33579 7.5 5.75 7.5H7.25V6C7.25 5.58579 7.58579 5.25 8 5.25C8.41421 5.25 8.75 5.58579 8.75 6V7.5H10.25C10.6642 7.5 11 7.83579 11 8.25C11 8.66421 10.6642 9 10.25 9H8.75V10.5C8.75 10.9142 8.41421 11.25 8 11.25C7.58579 11.25 7.25 10.9142 7.25 10.5V9H5.75C5.33579 9 5 8.66421 5 8.25Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
