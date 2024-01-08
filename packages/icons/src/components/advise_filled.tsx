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

export const AdviseFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7 4.25C6.58579 4.25 6.25 4.58579 6.25 5C6.25 5.41421 6.58579 5.75 7 5.75H9C9.41421 5.75 9.75 5.41421 9.75 5C9.75 4.58579 9.41421 4.25 9 4.25H7Z" fill={ colors[0] }/>
    <path d="M3.25 2.75C3.25 2.05964 3.80964 1.5 4.5 1.5H11.5C12.1904 1.5 12.75 2.05964 12.75 2.75V6.82006L12.8167 6.79541C13.633 6.49375 14.5 7.09768 14.5 7.96791V13.2501C14.5 13.9404 13.9404 14.5001 13.25 14.5001H2.75C2.05964 14.5001 1.5 13.9404 1.5 13.2501V7.96791C1.5 7.09768 2.36705 6.49375 3.18331 6.79541L3.25 6.82006V2.75ZM11.25 3V7.37441L8 8.57549L4.75 7.37441V3H11.25Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'advise_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M7 4.25C6.58579 4.25 6.25 4.58579 6.25 5C6.25 5.41421 6.58579 5.75 7 5.75H9C9.41421 5.75 9.75 5.41421 9.75 5C9.75 4.58579 9.41421 4.25 9 4.25H7Z', 'M3.25 2.75C3.25 2.05964 3.80964 1.5 4.5 1.5H11.5C12.1904 1.5 12.75 2.05964 12.75 2.75V6.82006L12.8167 6.79541C13.633 6.49375 14.5 7.09768 14.5 7.96791V13.2501C14.5 13.9404 13.9404 14.5001 13.25 14.5001H2.75C2.05964 14.5001 1.5 13.9404 1.5 13.2501V7.96791C1.5 7.09768 2.36705 6.49375 3.18331 6.79541L3.25 6.82006V2.75ZM11.25 3V7.37441L8 8.57549L4.75 7.37441V3H11.25Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
