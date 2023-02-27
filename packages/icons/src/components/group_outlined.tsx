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

export const GroupOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5.25 7C5.66421 7 6 6.66421 6 6.25C6 5.83579 5.66421 5.5 5.25 5.5C4.83579 5.5 4.5 5.83579 4.5 6.25C4.5 6.66421 4.83579 7 5.25 7Z" fill={ colors[0] }/>
    <path d="M7.75 5.5C7.33579 5.5 7 5.83579 7 6.25C7 6.66421 7.33579 7 7.75 7L10.75 7C11.1642 7 11.5 6.66421 11.5 6.25C11.5 5.83579 11.1642 5.5 10.75 5.5H7.75Z" fill={ colors[0] }/>
    <path d="M5.25 10.5C5.66421 10.5 6 10.1642 6 9.75C6 9.33579 5.66421 9 5.25 9C4.83579 9 4.5 9.33579 4.5 9.75C4.5 10.1642 4.83579 10.5 5.25 10.5Z" fill={ colors[0] }/>
    <path d="M7.75 9C7.33579 9 7 9.33579 7 9.75C7 10.1642 7.33579 10.5 7.75 10.5H10.75C11.1642 10.5 11.5 10.1642 11.5 9.75C11.5 9.33579 11.1642 9 10.75 9H7.75Z" fill={ colors[0] }/>
    <path d="M2.75 1.5C2.05964 1.5 1.5 2.05964 1.5 2.75V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H2.75ZM3 13V3H13V13H3Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'group_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M5.25 7C5.66421 7 6 6.66421 6 6.25C6 5.83579 5.66421 5.5 5.25 5.5C4.83579 5.5 4.5 5.83579 4.5 6.25C4.5 6.66421 4.83579 7 5.25 7Z', 'M7.75 5.5C7.33579 5.5 7 5.83579 7 6.25C7 6.66421 7.33579 7 7.75 7L10.75 7C11.1642 7 11.5 6.66421 11.5 6.25C11.5 5.83579 11.1642 5.5 10.75 5.5H7.75Z', 'M5.25 10.5C5.66421 10.5 6 10.1642 6 9.75C6 9.33579 5.66421 9 5.25 9C4.83579 9 4.5 9.33579 4.5 9.75C4.5 10.1642 4.83579 10.5 5.25 10.5Z', 'M7.75 9C7.33579 9 7 9.33579 7 9.75C7 10.1642 7.33579 10.5 7.75 10.5H10.75C11.1642 10.5 11.5 10.1642 11.5 9.75C11.5 9.33579 11.1642 9 10.75 9H7.75Z', 'M2.75 1.5C2.05964 1.5 1.5 2.05964 1.5 2.75V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H2.75ZM3 13V3H13V13H3Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
