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

export const ImportOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M9 2.25C9 1.83579 8.66421 1.5 8.25 1.5C7.83579 1.5 7.5 1.83579 7.5 2.25V8.43923L6.30547 7.24469C6.01257 6.9518 5.5377 6.9518 5.24481 7.24469C4.95191 7.53759 4.95191 8.01246 5.24481 8.30535L7.712 10.7726C7.84829 10.9128 8.03897 11 8.25 11C8.46067 11 8.65104 10.9131 8.78728 10.7733L11.2552 8.30535C11.5481 8.01246 11.5481 7.53759 11.2552 7.24469C10.9623 6.9518 10.4874 6.9518 10.1946 7.24469L9 8.43925V2.25Z" fill={ colors[0] }/>
    <path d="M3.25 6H4.5C4.91421 6 5.25 5.66421 5.25 5.25C5.25 4.83579 4.91421 4.5 4.5 4.5H3C2.30964 4.5 1.75 5.05964 1.75 5.75V13.25C1.75 13.9404 2.30964 14.5 3 14.5H13.5C14.1904 14.5 14.75 13.9404 14.75 13.25V5.75C14.75 5.05964 14.1904 4.5 13.5 4.5H12C11.5858 4.5 11.25 4.83579 11.25 5.25C11.25 5.66421 11.5858 6 12 6H13.25V13H3.25V6Z" fill={ colors[0] }/>

  </>,
  name: 'import_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M9 2.25C9 1.83579 8.66421 1.5 8.25 1.5C7.83579 1.5 7.5 1.83579 7.5 2.25V8.43923L6.30547 7.24469C6.01257 6.9518 5.5377 6.9518 5.24481 7.24469C4.95191 7.53759 4.95191 8.01246 5.24481 8.30535L7.712 10.7726C7.84829 10.9128 8.03897 11 8.25 11C8.46067 11 8.65104 10.9131 8.78728 10.7733L11.2552 8.30535C11.5481 8.01246 11.5481 7.53759 11.2552 7.24469C10.9623 6.9518 10.4874 6.9518 10.1946 7.24469L9 8.43925V2.25Z', 'M3.25 6H4.5C4.91421 6 5.25 5.66421 5.25 5.25C5.25 4.83579 4.91421 4.5 4.5 4.5H3C2.30964 4.5 1.75 5.05964 1.75 5.75V13.25C1.75 13.9404 2.30964 14.5 3 14.5H13.5C14.1904 14.5 14.75 13.9404 14.75 13.25V5.75C14.75 5.05964 14.1904 4.5 13.5 4.5H12C11.5858 4.5 11.25 4.83579 11.25 5.25C11.25 5.66421 11.5858 6 12 6H13.25V13H3.25V6Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
