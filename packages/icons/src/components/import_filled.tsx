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

export const ImportFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1.75 2.75C1.75 2.05964 2.30964 1.5 3 1.5H13.5C14.1904 1.5 14.75 2.05964 14.75 2.75V13.25C14.75 13.9404 14.1904 14.5 13.5 14.5H3C2.30964 14.5 1.75 13.9404 1.75 13.25V2.75ZM5.24482 8.49457C4.95192 8.78747 4.95192 9.26234 5.24482 9.55523L7.70837 12.0188C7.84489 12.1613 8.03708 12.25 8.25 12.25C8.4624 12.25 8.65419 12.1617 8.79064 12.0198L11.2552 9.55523C11.5481 9.26234 11.5481 8.78747 11.2552 8.49457C10.9623 8.20168 10.4875 8.20168 10.1946 8.49457L9 9.68914V4.5C9 4.08579 8.66421 3.75 8.25 3.75C7.83579 3.75 7.5 4.08579 7.5 4.5V9.6891L6.30548 8.49457C6.01258 8.20168 5.53771 8.20168 5.24482 8.49457Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'import_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M1.75 2.75C1.75 2.05964 2.30964 1.5 3 1.5H13.5C14.1904 1.5 14.75 2.05964 14.75 2.75V13.25C14.75 13.9404 14.1904 14.5 13.5 14.5H3C2.30964 14.5 1.75 13.9404 1.75 13.25V2.75ZM5.24482 8.49457C4.95192 8.78747 4.95192 9.26234 5.24482 9.55523L7.70837 12.0188C7.84489 12.1613 8.03708 12.25 8.25 12.25C8.4624 12.25 8.65419 12.1617 8.79064 12.0198L11.2552 9.55523C11.5481 9.26234 11.5481 8.78747 11.2552 8.49457C10.9623 8.20168 10.4875 8.20168 10.1946 8.49457L9 9.68914V4.5C9 4.08579 8.66421 3.75 8.25 3.75C7.83579 3.75 7.5 4.08579 7.5 4.5V9.6891L6.30548 8.49457C6.01258 8.20168 5.53771 8.20168 5.24482 8.49457Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
