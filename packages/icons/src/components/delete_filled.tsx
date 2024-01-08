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

export const DeleteFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8 1C6.48122 1 5.25 2.23122 5.25 3.75V4H2C1.58579 4 1.25 4.33579 1.25 4.75C1.25 5.16421 1.58579 5.5 2 5.5H14C14.4142 5.5 14.75 5.16421 14.75 4.75C14.75 4.33579 14.4142 4 14 4H10.75V3.75C10.75 2.23122 9.51878 1 8 1ZM9.25 4V3.75C9.25 3.05964 8.69036 2.5 8 2.5C7.30964 2.5 6.75 3.05964 6.75 3.75V4H9.25Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M3.25 7C3.25 6.72386 3.47386 6.5 3.75 6.5H12.25C12.5261 6.5 12.75 6.72386 12.75 7V13.75C12.75 14.4404 12.1904 15 11.5 15H4.5C3.80964 15 3.25 14.4404 3.25 13.75V7Z" fill={ colors[0] }/>

  </>,
  name: 'delete_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8 1C6.48122 1 5.25 2.23122 5.25 3.75V4H2C1.58579 4 1.25 4.33579 1.25 4.75C1.25 5.16421 1.58579 5.5 2 5.5H14C14.4142 5.5 14.75 5.16421 14.75 4.75C14.75 4.33579 14.4142 4 14 4H10.75V3.75C10.75 2.23122 9.51878 1 8 1ZM9.25 4V3.75C9.25 3.05964 8.69036 2.5 8 2.5C7.30964 2.5 6.75 3.05964 6.75 3.75V4H9.25Z', 'M3.25 7C3.25 6.72386 3.47386 6.5 3.75 6.5H12.25C12.5261 6.5 12.75 6.72386 12.75 7V13.75C12.75 14.4404 12.1904 15 11.5 15H4.5C3.80964 15 3.25 14.4404 3.25 13.75V7Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
