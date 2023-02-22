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

export const NewtabOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5.25 7C4.83579 7 4.5 7.33579 4.5 7.75C4.5 8.16421 4.83579 8.5 5.25 8.5H6.43934L4.46967 10.4697C4.17678 10.7626 4.17678 11.2374 4.46967 11.5303C4.76256 11.8232 5.23744 11.8232 5.53033 11.5303L7.5 9.56066V10.75C7.5 11.1642 7.83579 11.5 8.25 11.5C8.66421 11.5 9 11.1642 9 10.75V7.75C9 7.33579 8.66421 7 8.25 7H5.25Z" fill={ colors[0] }/>
    <path d="M4 2.75C4 2.05964 4.55964 1.5 5.25 1.5H13.25C13.9404 1.5 14.5 2.05964 14.5 2.75V10.75C14.5 11.4404 13.9404 12 13.25 12H12V13.25C12 13.9404 11.4404 14.5 10.75 14.5H2.75C2.05964 14.5 1.5 13.9404 1.5 13.25V5.25C1.5 4.55964 2.05964 4 2.75 4H4V2.75ZM13 10.5H12V5.25C12 4.55964 11.4404 4 10.75 4H5.5V3H13V10.5ZM3 5.5V13H10.5V5.5H3Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'newtab_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M5.25 7C4.83579 7 4.5 7.33579 4.5 7.75C4.5 8.16421 4.83579 8.5 5.25 8.5H6.43934L4.46967 10.4697C4.17678 10.7626 4.17678 11.2374 4.46967 11.5303C4.76256 11.8232 5.23744 11.8232 5.53033 11.5303L7.5 9.56066V10.75C7.5 11.1642 7.83579 11.5 8.25 11.5C8.66421 11.5 9 11.1642 9 10.75V7.75C9 7.33579 8.66421 7 8.25 7H5.25Z', 'M4 2.75C4 2.05964 4.55964 1.5 5.25 1.5H13.25C13.9404 1.5 14.5 2.05964 14.5 2.75V10.75C14.5 11.4404 13.9404 12 13.25 12H12V13.25C12 13.9404 11.4404 14.5 10.75 14.5H2.75C2.05964 14.5 1.5 13.9404 1.5 13.25V5.25C1.5 4.55964 2.05964 4 2.75 4H4V2.75ZM13 10.5H12V5.25C12 4.55964 11.4404 4 10.75 4H5.5V3H13V10.5ZM3 5.5V13H10.5V5.5H3Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
