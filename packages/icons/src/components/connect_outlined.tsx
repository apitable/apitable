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

export const ConnectOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1 3.25C1 2.55964 1.55964 2 2.25 2H7.75C8.44036 2 9 2.55964 9 3.25V3.75013L11.75 3.75C11.9489 3.74999 12.1397 3.829 12.2803 3.96966C12.421 4.11031 12.5 4.30108 12.5 4.5V6.44108C12.7945 6.17722 13.2474 6.18681 13.5304 6.46982C13.8232 6.76273 13.8232 7.2376 13.5303 7.53048L12.2803 8.78036C12.1359 8.92471 11.9474 8.99791 11.7582 8.99996H13.75C14.4404 8.99996 15 9.5596 15 10.25V12.75C15 13.4404 14.4404 14 13.75 14H8.25C7.55964 14 7 13.4404 7 12.75V10.25C7 9.5596 7.55964 8.99996 8.25 8.99996H11.7418C11.5526 8.99791 11.3641 8.92471 11.2197 8.78036L9.9697 7.53048C9.67679 7.2376 9.67677 6.76273 9.96964 6.46982C10.2526 6.18681 10.7055 6.17722 11 6.44108V5.25004L9 5.25013V5.75C9 6.44036 8.44036 7 7.75 7H2.25C1.55964 7 1 6.44036 1 5.75V3.25ZM7.5 4.5002C7.5 4.50023 7.5 4.50018 7.5 4.5002V3.5H2.5V5.5H7.5V4.5002ZM8.5 10.5V12.5H13.5V10.5H8.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'connect_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M1 3.25C1 2.55964 1.55964 2 2.25 2H7.75C8.44036 2 9 2.55964 9 3.25V3.75013L11.75 3.75C11.9489 3.74999 12.1397 3.829 12.2803 3.96966C12.421 4.11031 12.5 4.30108 12.5 4.5V6.44108C12.7945 6.17722 13.2474 6.18681 13.5304 6.46982C13.8232 6.76273 13.8232 7.2376 13.5303 7.53048L12.2803 8.78036C12.1359 8.92471 11.9474 8.99791 11.7582 8.99996H13.75C14.4404 8.99996 15 9.5596 15 10.25V12.75C15 13.4404 14.4404 14 13.75 14H8.25C7.55964 14 7 13.4404 7 12.75V10.25C7 9.5596 7.55964 8.99996 8.25 8.99996H11.7418C11.5526 8.99791 11.3641 8.92471 11.2197 8.78036L9.9697 7.53048C9.67679 7.2376 9.67677 6.76273 9.96964 6.46982C10.2526 6.18681 10.7055 6.17722 11 6.44108V5.25004L9 5.25013V5.75C9 6.44036 8.44036 7 7.75 7H2.25C1.55964 7 1 6.44036 1 5.75V3.25ZM7.5 4.5002C7.5 4.50023 7.5 4.50018 7.5 4.5002V3.5H2.5V5.5H7.5V4.5002ZM8.5 10.5V12.5H13.5V10.5H8.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
