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

export const DuplicateOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M9.5 7.25C9.91421 7.25 10.25 7.58579 10.25 8V8.75H11C11.4142 8.75 11.75 9.08579 11.75 9.5C11.75 9.91421 11.4142 10.25 11 10.25H10.25V11C10.25 11.4142 9.91421 11.75 9.5 11.75C9.08579 11.75 8.75 11.4142 8.75 11V10.25H8C7.58579 10.25 7.25 9.91421 7.25 9.5C7.25 9.08579 7.58579 8.75 8 8.75H8.75V8C8.75 7.58579 9.08579 7.25 9.5 7.25Z" fill={ colors[0] }/>
    <path d="M3.25 11H4.99999V13.75C4.99999 14.4404 5.55963 15 6.24999 15H12.75C13.4403 15 14 14.4404 14 13.75V5.25C14 4.55964 13.4403 4 12.75 4H10.5V2.25C10.5 1.55964 9.94035 1 9.25 1H3.25004C2.55968 1 2.00004 1.55964 2.00004 2.24999L2 9.74999C2 10.4404 2.55964 11 3.25 11ZM3.50003 2.5L3.5 9.5H4.99999V5.25C4.99999 4.55964 5.55963 4 6.24999 4H9V2.5H3.50003ZM6.5 10.25L6.49999 10.2534V13.5H12.5V5.5H6.49999V10.2466L6.5 10.25Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'duplicate_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M9.5 7.25C9.91421 7.25 10.25 7.58579 10.25 8V8.75H11C11.4142 8.75 11.75 9.08579 11.75 9.5C11.75 9.91421 11.4142 10.25 11 10.25H10.25V11C10.25 11.4142 9.91421 11.75 9.5 11.75C9.08579 11.75 8.75 11.4142 8.75 11V10.25H8C7.58579 10.25 7.25 9.91421 7.25 9.5C7.25 9.08579 7.58579 8.75 8 8.75H8.75V8C8.75 7.58579 9.08579 7.25 9.5 7.25Z', 'M3.25 11H4.99999V13.75C4.99999 14.4404 5.55963 15 6.24999 15H12.75C13.4403 15 14 14.4404 14 13.75V5.25C14 4.55964 13.4403 4 12.75 4H10.5V2.25C10.5 1.55964 9.94035 1 9.25 1H3.25004C2.55968 1 2.00004 1.55964 2.00004 2.24999L2 9.74999C2 10.4404 2.55964 11 3.25 11ZM3.50003 2.5L3.5 9.5H4.99999V5.25C4.99999 4.55964 5.55963 4 6.24999 4H9V2.5H3.50003ZM6.5 10.25L6.49999 10.2534V13.5H12.5V5.5H6.49999V10.2466L6.5 10.25Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
