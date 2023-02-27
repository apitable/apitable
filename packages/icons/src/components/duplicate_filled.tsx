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

export const DuplicateFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M11.5 4.5V2.75C11.5 2.05964 10.9404 1.5 10.25 1.5H2.75004C2.05969 1.5 1.50004 2.05964 1.50004 2.74999L1.5 10.25C1.5 10.9404 2.05964 11.5 2.75 11.5H4.5V13.25C4.5 13.9404 5.05964 14.5 5.75 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V5.75C14.5 5.05964 13.9404 4.5 13.25 4.5H11.5ZM3.00004 3L3 10H4.5V5.75C4.5 5.05964 5.05964 4.5 5.75 4.5H10V3H3.00004ZM7.75 8.75C7.33579 8.75 7 9.08579 7 9.5C7 9.91421 7.33579 10.25 7.75 10.25H8.75V11.25C8.75 11.6642 9.08579 12 9.5 12C9.91421 12 10.25 11.6642 10.25 11.25V10.25H11.25C11.6642 10.25 12 9.91421 12 9.5C12 9.08579 11.6642 8.75 11.25 8.75H10.25V7.75C10.25 7.33579 9.91421 7 9.5 7C9.08579 7 8.75 7.33579 8.75 7.75V8.75H7.75Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'duplicate_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M11.5 4.5V2.75C11.5 2.05964 10.9404 1.5 10.25 1.5H2.75004C2.05969 1.5 1.50004 2.05964 1.50004 2.74999L1.5 10.25C1.5 10.9404 2.05964 11.5 2.75 11.5H4.5V13.25C4.5 13.9404 5.05964 14.5 5.75 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V5.75C14.5 5.05964 13.9404 4.5 13.25 4.5H11.5ZM3.00004 3L3 10H4.5V5.75C4.5 5.05964 5.05964 4.5 5.75 4.5H10V3H3.00004ZM7.75 8.75C7.33579 8.75 7 9.08579 7 9.5C7 9.91421 7.33579 10.25 7.75 10.25H8.75V11.25C8.75 11.6642 9.08579 12 9.5 12C9.91421 12 10.25 11.6642 10.25 11.25V10.25H11.25C11.6642 10.25 12 9.91421 12 9.5C12 9.08579 11.6642 8.75 11.25 8.75H10.25V7.75C10.25 7.33579 9.91421 7 9.5 7C9.08579 7 8.75 7.33579 8.75 7.75V8.75H7.75Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
