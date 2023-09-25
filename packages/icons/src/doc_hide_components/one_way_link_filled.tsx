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

export const OneWayLinkFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7.5 2.75C7.5 2.05964 6.94036 1.5 6.25 1.5H2.75C2.05964 1.5 1.5 2.05964 1.5 2.75V6.25C1.5 6.94036 2.05964 7.5 2.75 7.5H6.25C6.94036 7.5 7.5 6.94036 7.5 6.25V2.75Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M14.5 9.75C14.5 9.05964 13.9404 8.5 13.25 8.5H9.75C9.05964 8.5 8.5 9.05964 8.5 9.75V13.25C8.5 13.9404 9.05964 14.5 9.75 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V9.75Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M2 10.25C2 12.3211 3.67893 14 5.75 14H6.25C6.49108 14 6.71747 13.8841 6.85843 13.6885C6.99939 13.493 7.03775 13.2415 6.96151 13.0128L6.46151 11.5128C6.33053 11.1199 5.90579 10.9075 5.51283 11.0385C5.11987 11.1695 4.9075 11.5942 5.03849 11.9872L5.18564 12.4286C4.21614 12.1782 3.5 11.2977 3.5 10.25V9.75C3.5 9.33579 3.16421 9 2.75 9C2.33579 9 2 9.33579 2 9.75V10.25Z" fill={ colors[0] }/>

  </>,
  name: 'one_way_link_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M7.5 2.75C7.5 2.05964 6.94036 1.5 6.25 1.5H2.75C2.05964 1.5 1.5 2.05964 1.5 2.75V6.25C1.5 6.94036 2.05964 7.5 2.75 7.5H6.25C6.94036 7.5 7.5 6.94036 7.5 6.25V2.75Z', 'M14.5 9.75C14.5 9.05964 13.9404 8.5 13.25 8.5H9.75C9.05964 8.5 8.5 9.05964 8.5 9.75V13.25C8.5 13.9404 9.05964 14.5 9.75 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V9.75Z', 'M2 10.25C2 12.3211 3.67893 14 5.75 14H6.25C6.49108 14 6.71747 13.8841 6.85843 13.6885C6.99939 13.493 7.03775 13.2415 6.96151 13.0128L6.46151 11.5128C6.33053 11.1199 5.90579 10.9075 5.51283 11.0385C5.11987 11.1695 4.9075 11.5942 5.03849 11.9872L5.18564 12.4286C4.21614 12.1782 3.5 11.2977 3.5 10.25V9.75C3.5 9.33579 3.16421 9 2.75 9C2.33579 9 2 9.33579 2 9.75V10.25Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
