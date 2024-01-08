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

export const ArchiveOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M6.5 7.5C6.08579 7.5 5.75 7.83579 5.75 8.25C5.75 8.66421 6.08579 9 6.5 9H9.5C9.91421 9 10.25 8.66421 10.25 8.25C10.25 7.83579 9.91421 7.5 9.5 7.5H6.5Z" fill={ colors[0] }/>
    <path d="M1 2.75C1 2.05964 1.55964 1.5 2.25 1.5H13.75C14.4404 1.5 15 2.05964 15 2.75V5.25C15 5.94036 14.4404 6.5 13.75 6.5V13.25C13.75 13.9404 13.1904 14.5 12.5 14.5H3.5C2.80964 14.5 2.25 13.9404 2.25 13.25L2.25 6.5C1.55964 6.5 1 5.94036 1 5.25V2.75ZM3.75 6.5H12.25V13H3.75V6.5ZM13.5 3V5H2.5V3H13.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'Archive_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M6.5 7.5C6.08579 7.5 5.75 7.83579 5.75 8.25C5.75 8.66421 6.08579 9 6.5 9H9.5C9.91421 9 10.25 8.66421 10.25 8.25C10.25 7.83579 9.91421 7.5 9.5 7.5H6.5Z', 'M1 2.75C1 2.05964 1.55964 1.5 2.25 1.5H13.75C14.4404 1.5 15 2.05964 15 2.75V5.25C15 5.94036 14.4404 6.5 13.75 6.5V13.25C13.75 13.9404 13.1904 14.5 12.5 14.5H3.5C2.80964 14.5 2.25 13.9404 2.25 13.25L2.25 6.5C1.55964 6.5 1 5.94036 1 5.25V2.75ZM3.75 6.5H12.25V13H3.75V6.5ZM13.5 3V5H2.5V3H13.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
