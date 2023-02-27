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

export const FormFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5 2.25C5 1.69772 5.44772 1.25 6 1.25H9C9.55228 1.25 10 1.69772 10 2.25C10 2.80228 9.55228 3.25 9 3.25H6C5.44772 3.25 5 2.80228 5 2.25Z" fill={ colors[0] }/>
    <path d="M4 2.25H3.25C2.55964 2.25 2 2.80964 2 3.5V13.75C2 14.4404 2.55964 15 3.25 15H11.75C12.4404 15 13 14.4404 13 13.75V3.5C13 2.80964 12.4404 2.25 11.75 2.25H11C11 3.2165 10.2165 4 9.25 4H5.75C4.7835 4 4 3.2165 4 2.25ZM4.25 6.75C4.25 6.33579 4.58579 6 5 6H10C10.4142 6 10.75 6.33579 10.75 6.75C10.75 7.16421 10.4142 7.5 10 7.5H5C4.58579 7.5 4.25 7.16421 4.25 6.75ZM4.25 9.75C4.25 9.33579 4.58579 9 5 9H10C10.4142 9 10.75 9.33579 10.75 9.75C10.75 10.1642 10.4142 10.5 10 10.5H5C4.58579 10.5 4.25 10.1642 4.25 9.75Z" fill={ colors[0] }/>

  </>,
  name: 'form_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M5 2.25C5 1.69772 5.44772 1.25 6 1.25H9C9.55228 1.25 10 1.69772 10 2.25C10 2.80228 9.55228 3.25 9 3.25H6C5.44772 3.25 5 2.80228 5 2.25Z', 'M4 2.25H3.25C2.55964 2.25 2 2.80964 2 3.5V13.75C2 14.4404 2.55964 15 3.25 15H11.75C12.4404 15 13 14.4404 13 13.75V3.5C13 2.80964 12.4404 2.25 11.75 2.25H11C11 3.2165 10.2165 4 9.25 4H5.75C4.7835 4 4 3.2165 4 2.25ZM4.25 6.75C4.25 6.33579 4.58579 6 5 6H10C10.4142 6 10.75 6.33579 10.75 6.75C10.75 7.16421 10.4142 7.5 10 7.5H5C4.58579 7.5 4.25 7.16421 4.25 6.75ZM4.25 9.75C4.25 9.33579 4.58579 9 5 9H10C10.4142 9 10.75 9.33579 10.75 9.75C10.75 10.1642 10.4142 10.5 10 10.5H5C4.58579 10.5 4.25 10.1642 4.25 9.75Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
