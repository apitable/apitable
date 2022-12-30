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

export const EmailSmallOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3 15H13C14.7 15 16 13.7 16 12V4C16 2.3 14.7 1 13 1H3C1.3 1 0 2.3 0 4V12C0 13.7 1.3 15 3 15ZM2 4C2 3.4 2.4 3 3 3H13C13.6 3 14 3.4 14 4V12C14 12.6 13.6 13 13 13H3C2.4 13 2 12.6 2 12V4ZM4.80005 7.60001C5.70005 8.40001 6.90005 8.80001 8.00005 8.80001C9.10005 8.80001 10.3 8.40001 11.2 7.60001L11.6 7.20001C12 6.90001 12.1 6.20001 11.7 5.80001C11.4 5.40001 10.7 5.30001 10.3 5.70001L9.90005 6.10001C8.80005 7.00001 7.20005 7.00001 6.10005 6.20001L5.70005 5.80001C5.30005 5.40001 4.70005 5.50001 4.30005 5.90001C3.90005 6.30001 4.00005 6.90001 4.40005 7.30001L4.80005 7.60001Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'email_small_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M3 15H13C14.7 15 16 13.7 16 12V4C16 2.3 14.7 1 13 1H3C1.3 1 0 2.3 0 4V12C0 13.7 1.3 15 3 15ZM2 4C2 3.4 2.4 3 3 3H13C13.6 3 14 3.4 14 4V12C14 12.6 13.6 13 13 13H3C2.4 13 2 12.6 2 12V4ZM4.80005 7.60001C5.70005 8.40001 6.90005 8.80001 8.00005 8.80001C9.10005 8.80001 10.3 8.40001 11.2 7.60001L11.6 7.20001C12 6.90001 12.1 6.20001 11.7 5.80001C11.4 5.40001 10.7 5.30001 10.3 5.70001L9.90005 6.10001C8.80005 7.00001 7.20005 7.00001 6.10005 6.20001L5.70005 5.80001C5.30005 5.40001 4.70005 5.50001 4.30005 5.90001C3.90005 6.30001 4.00005 6.90001 4.40005 7.30001L4.80005 7.60001Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
