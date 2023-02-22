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

export const EmailFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2.25 2C1.55964 2 1 2.55964 1 3.25V12.75C1 13.4404 1.55964 14 2.25 14H13.75C14.4404 14 15 13.4404 15 12.75V3.25C15 2.55964 14.4404 2 13.75 2H2.25ZM11.6653 6.50545C11.9821 6.2385 12.0224 5.76534 11.7555 5.44862C11.4885 5.1319 11.0153 5.09156 10.6986 5.35851L8.00001 7.63308L5.30138 5.35851C4.98466 5.09156 4.51151 5.1319 4.24456 5.44862C3.97761 5.76534 4.01795 6.2385 4.33467 6.50545L7.19441 8.91582C7.65984 9.30812 8.34017 9.30812 8.8056 8.91582L11.6653 6.50545Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'email_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M2.25 2C1.55964 2 1 2.55964 1 3.25V12.75C1 13.4404 1.55964 14 2.25 14H13.75C14.4404 14 15 13.4404 15 12.75V3.25C15 2.55964 14.4404 2 13.75 2H2.25ZM11.6653 6.50545C11.9821 6.2385 12.0224 5.76534 11.7555 5.44862C11.4885 5.1319 11.0153 5.09156 10.6986 5.35851L8.00001 7.63308L5.30138 5.35851C4.98466 5.09156 4.51151 5.1319 4.24456 5.44862C3.97761 5.76534 4.01795 6.2385 4.33467 6.50545L7.19441 8.91582C7.65984 9.30812 8.34017 9.30812 8.8056 8.91582L11.6653 6.50545Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
