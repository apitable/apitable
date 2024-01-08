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

export const ClassOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M9.8216 6.924C10.1349 6.72817 10.1349 6.27183 9.8216 6.076L7.265 4.47812C6.93198 4.26998 6.5 4.50941 6.5 4.90212V8.09788C6.5 8.49059 6.93198 8.73002 7.265 8.52188L9.8216 6.924Z" fill={ colors[0] }/>
    <path d="M1 2.25C1 1.55964 1.55964 1 2.25 1H13.75C14.4404 1 15 1.55964 15 2.25V10.75C15 11.4404 14.4404 12 13.75 12H9.31748L11.6769 13.6333C12.0175 13.8691 12.1025 14.3363 11.8667 14.6769C11.6309 15.0174 11.1637 15.1024 10.8232 14.8666L8 12.9123L5.17685 14.8666C4.83628 15.1024 4.36907 15.0174 4.13331 14.6769C3.89755 14.3363 3.98251 13.8691 4.32309 13.6333L6.68252 12H2.25C1.55964 12 1 11.4404 1 10.75V2.25ZM2.5 2.5V10.5H13.5V2.5H2.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'class_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M9.8216 6.924C10.1349 6.72817 10.1349 6.27183 9.8216 6.076L7.265 4.47812C6.93198 4.26998 6.5 4.50941 6.5 4.90212V8.09788C6.5 8.49059 6.93198 8.73002 7.265 8.52188L9.8216 6.924Z', 'M1 2.25C1 1.55964 1.55964 1 2.25 1H13.75C14.4404 1 15 1.55964 15 2.25V10.75C15 11.4404 14.4404 12 13.75 12H9.31748L11.6769 13.6333C12.0175 13.8691 12.1025 14.3363 11.8667 14.6769C11.6309 15.0174 11.1637 15.1024 10.8232 14.8666L8 12.9123L5.17685 14.8666C4.83628 15.1024 4.36907 15.0174 4.13331 14.6769C3.89755 14.3363 3.98251 13.8691 4.32309 13.6333L6.68252 12H2.25C1.55964 12 1 11.4404 1 10.75V2.25ZM2.5 2.5V10.5H13.5V2.5H2.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
