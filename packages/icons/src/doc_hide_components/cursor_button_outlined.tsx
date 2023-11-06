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

export const CursorButtonOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1 3.25C1 2.55964 1.55964 2 2.25 2H13.75C14.4404 2 15 2.55964 15 3.25V8C15 8.41421 14.6642 8.75 14.25 8.75C13.8358 8.75 13.5 8.41421 13.5 8V3.5H2.5V11.25H5.25C5.66421 11.25 6 11.5858 6 12C6 12.4142 5.66421 12.75 5.25 12.75H2.25C1.55964 12.75 1 12.1904 1 11.5V3.25Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M7.76015 7.65241C7.70907 7.21674 8.20372 6.93116 8.55548 7.19323L13.2299 10.6759C13.5875 10.9423 13.4439 11.5081 13.0025 11.5717L10.9393 11.8691C10.8122 11.8874 10.6971 11.9539 10.6177 12.0548L9.32852 13.6929C9.05275 14.0433 8.49094 13.8848 8.43901 13.4419L7.76015 7.65241Z" fill={ colors[0] }/>

  </>,
  name: 'cursor_button_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M1 3.25C1 2.55964 1.55964 2 2.25 2H13.75C14.4404 2 15 2.55964 15 3.25V8C15 8.41421 14.6642 8.75 14.25 8.75C13.8358 8.75 13.5 8.41421 13.5 8V3.5H2.5V11.25H5.25C5.66421 11.25 6 11.5858 6 12C6 12.4142 5.66421 12.75 5.25 12.75H2.25C1.55964 12.75 1 12.1904 1 11.5V3.25Z', 'M7.76015 7.65241C7.70907 7.21674 8.20372 6.93116 8.55548 7.19323L13.2299 10.6759C13.5875 10.9423 13.4439 11.5081 13.0025 11.5717L10.9393 11.8691C10.8122 11.8874 10.6971 11.9539 10.6177 12.0548L9.32852 13.6929C9.05275 14.0433 8.49094 13.8848 8.43901 13.4419L7.76015 7.65241Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
