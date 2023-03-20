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

export const FolderNormalFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M6.17592 3.02746C5.95358 2.84792 5.67642 2.75 5.39064 2.75H2.75C2.05964 2.75 1.5 3.30964 1.5 4V13.5C1.5 14.1904 2.05964 14.75 2.75 14.75H14.25C14.9404 14.75 15.5 14.1904 15.5 13.5L15.5 5.25C15.5 4.55964 14.9404 4 14.25 4H7.82204C7.53626 4 7.2591 3.90208 7.03676 3.72254L6.17592 3.02746ZM3.5 6.75009C3.5 6.33592 3.83583 6.00017 4.24999 6.00017L12.7498 6C13.164 6 13.5 6.33579 13.5 6.75C13.5 7.16421 13.1642 7.5 12.75 7.5H4.24991C3.83575 7.5 3.5 7.16425 3.5 6.75009Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'folder_normal_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M6.17592 3.02746C5.95358 2.84792 5.67642 2.75 5.39064 2.75H2.75C2.05964 2.75 1.5 3.30964 1.5 4V13.5C1.5 14.1904 2.05964 14.75 2.75 14.75H14.25C14.9404 14.75 15.5 14.1904 15.5 13.5L15.5 5.25C15.5 4.55964 14.9404 4 14.25 4H7.82204C7.53626 4 7.2591 3.90208 7.03676 3.72254L6.17592 3.02746ZM3.5 6.75009C3.5 6.33592 3.83583 6.00017 4.24999 6.00017L12.7498 6C13.164 6 13.5 6.33579 13.5 6.75C13.5 7.16421 13.1642 7.5 12.75 7.5H4.24991C3.83575 7.5 3.5 7.16425 3.5 6.75009Z'],
  width: '17',
  height: '17',
  viewBox: '0 0 17 17',
});
