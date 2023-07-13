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

export const EmailOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M11.6653 6.50545C11.9821 6.2385 12.0224 5.76534 11.7554 5.44862C11.4885 5.13191 11.0153 5.09156 10.6986 5.35851L8 7.63309L5.30138 5.35851C4.98466 5.09156 4.5115 5.13191 4.24455 5.44862C3.9776 5.76534 4.01794 6.2385 4.33466 6.50545L7.19441 8.91583C7.65983 9.30812 8.34017 9.30812 8.80559 8.91583L11.6653 6.50545Z" fill={ colors[0] }/>
    <path d="M2.25 2C1.55964 2 1 2.55964 1 3.25V12.75C1 13.4404 1.55964 14 2.25 14H13.75C14.4404 14 15 13.4404 15 12.75V3.25C15 2.55964 14.4404 2 13.75 2H2.25ZM2.5 12.5V3.5H13.5V12.5H2.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'email_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M11.6653 6.50545C11.9821 6.2385 12.0224 5.76534 11.7554 5.44862C11.4885 5.13191 11.0153 5.09156 10.6986 5.35851L8 7.63309L5.30138 5.35851C4.98466 5.09156 4.5115 5.13191 4.24455 5.44862C3.9776 5.76534 4.01794 6.2385 4.33466 6.50545L7.19441 8.91583C7.65983 9.30812 8.34017 9.30812 8.80559 8.91583L11.6653 6.50545Z', 'M2.25 2C1.55964 2 1 2.55964 1 3.25V12.75C1 13.4404 1.55964 14 2.25 14H13.75C14.4404 14 15 13.4404 15 12.75V3.25C15 2.55964 14.4404 2 13.75 2H2.25ZM2.5 12.5V3.5H13.5V12.5H2.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
