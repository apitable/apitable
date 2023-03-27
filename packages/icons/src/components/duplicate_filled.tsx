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
    <path d="M5 11H3.25C2.55964 11 2 10.4404 2 9.74999L2.00004 2.24999C2.00004 1.55964 2.55968 1 3.25004 1H9.25C9.94035 1 10.5 1.55964 10.5 2.25V4H12.75C13.4404 4 14 4.55964 14 5.25V13.75C14 14.4404 13.4404 15 12.75 15H6.25C5.55964 15 5 14.4404 5 13.75V11ZM3.5 9.5L3.50003 2.5H9V4H6.25C5.55964 4 5 4.55964 5 5.25V9.5H3.5ZM10.25 8C10.25 7.58579 9.91421 7.25 9.5 7.25C9.08578 7.25 8.75 7.58579 8.75 8V8.75H8C7.58578 8.75 7.25 9.08579 7.25 9.5C7.25 9.91421 7.58578 10.25 8 10.25H8.75V11C8.75 11.4142 9.08578 11.75 9.5 11.75C9.91421 11.75 10.25 11.4142 10.25 11V10.25H11C11.4142 10.25 11.75 9.91421 11.75 9.5C11.75 9.08579 11.4142 8.75 11 8.75H10.25V8Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'duplicate_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M5 11H3.25C2.55964 11 2 10.4404 2 9.74999L2.00004 2.24999C2.00004 1.55964 2.55968 1 3.25004 1H9.25C9.94035 1 10.5 1.55964 10.5 2.25V4H12.75C13.4404 4 14 4.55964 14 5.25V13.75C14 14.4404 13.4404 15 12.75 15H6.25C5.55964 15 5 14.4404 5 13.75V11ZM3.5 9.5L3.50003 2.5H9V4H6.25C5.55964 4 5 4.55964 5 5.25V9.5H3.5ZM10.25 8C10.25 7.58579 9.91421 7.25 9.5 7.25C9.08578 7.25 8.75 7.58579 8.75 8V8.75H8C7.58578 8.75 7.25 9.08579 7.25 9.5C7.25 9.91421 7.58578 10.25 8 10.25H8.75V11C8.75 11.4142 9.08578 11.75 9.5 11.75C9.91421 11.75 10.25 11.4142 10.25 11V10.25H11C11.4142 10.25 11.75 9.91421 11.75 9.5C11.75 9.08579 11.4142 8.75 11 8.75H10.25V8Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
