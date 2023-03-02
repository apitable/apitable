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

export const QrcodeOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1.5 2.75C1.5 2.05964 2.05964 1.5 2.75 1.5H6.25C6.94036 1.5 7.5 2.05964 7.5 2.75V6.25C7.5 6.94036 6.94036 7.5 6.25 7.5H2.75C2.05964 7.5 1.5 6.94036 1.5 6.25V2.75ZM3 3V6H6V3H3Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M1.5 9.75C1.5 9.05964 2.05964 8.5 2.75 8.5H6.25C6.94036 8.5 7.5 9.05964 7.5 9.75V13.25C7.5 13.9404 6.94036 14.5 6.25 14.5H2.75C2.05964 14.5 1.5 13.9404 1.5 13.25V9.75ZM3 10V13H6V10H3Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M9.75 1.5C9.05964 1.5 8.5 2.05964 8.5 2.75V6.25C8.5 6.94036 9.05964 7.5 9.75 7.5H13.25C13.9404 7.5 14.5 6.94036 14.5 6.25V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H9.75ZM10 6V3H13V6H10Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M10 10.5C10.4142 10.5 10.75 10.8358 10.75 11.25V13.75C10.75 14.1642 10.4142 14.5 10 14.5C9.58579 14.5 9.25 14.1642 9.25 13.75V11.25C9.25 10.8358 9.58579 10.5 10 10.5Z" fill={ colors[0] }/>
    <path d="M13.75 9.25C13.75 8.83579 13.4142 8.5 13 8.5C12.5858 8.5 12.25 8.83579 12.25 9.25V13.75C12.25 14.1642 12.5858 14.5 13 14.5C13.4142 14.5 13.75 14.1642 13.75 13.75V9.25Z" fill={ colors[0] }/>

  </>,
  name: 'qrcode_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M1.5 2.75C1.5 2.05964 2.05964 1.5 2.75 1.5H6.25C6.94036 1.5 7.5 2.05964 7.5 2.75V6.25C7.5 6.94036 6.94036 7.5 6.25 7.5H2.75C2.05964 7.5 1.5 6.94036 1.5 6.25V2.75ZM3 3V6H6V3H3Z', 'M1.5 9.75C1.5 9.05964 2.05964 8.5 2.75 8.5H6.25C6.94036 8.5 7.5 9.05964 7.5 9.75V13.25C7.5 13.9404 6.94036 14.5 6.25 14.5H2.75C2.05964 14.5 1.5 13.9404 1.5 13.25V9.75ZM3 10V13H6V10H3Z', 'M9.75 1.5C9.05964 1.5 8.5 2.05964 8.5 2.75V6.25C8.5 6.94036 9.05964 7.5 9.75 7.5H13.25C13.9404 7.5 14.5 6.94036 14.5 6.25V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H9.75ZM10 6V3H13V6H10Z', 'M10 10.5C10.4142 10.5 10.75 10.8358 10.75 11.25V13.75C10.75 14.1642 10.4142 14.5 10 14.5C9.58579 14.5 9.25 14.1642 9.25 13.75V11.25C9.25 10.8358 9.58579 10.5 10 10.5Z', 'M13.75 9.25C13.75 8.83579 13.4142 8.5 13 8.5C12.5858 8.5 12.25 8.83579 12.25 9.25V13.75C12.25 14.1642 12.5858 14.5 13 14.5C13.4142 14.5 13.75 14.1642 13.75 13.75V9.25Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
