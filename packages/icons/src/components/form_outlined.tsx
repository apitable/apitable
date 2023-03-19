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

export const FormOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5.25 6C5.25 5.58579 5.58579 5.25 6 5.25H10C10.4142 5.25 10.75 5.58579 10.75 6C10.75 6.41421 10.4142 6.75 10 6.75H6C5.58579 6.75 5.25 6.41421 5.25 6Z" fill={ colors[0] }/>
    <path d="M5.25 9C5.25 8.58579 5.58579 8.25 6 8.25H10C10.4142 8.25 10.75 8.58579 10.75 9C10.75 9.41421 10.4142 9.75 10 9.75H6C5.58579 9.75 5.25 9.41421 5.25 9Z" fill={ colors[0] }/>
    <path d="M3.75 15C3.05964 15 2.5 14.4404 2.5 13.75V3.5C2.5 2.80965 3.05964 2.25 3.75 2.25H5.06056C5.2757 1.52713 5.94534 1 6.73809 1H9.03571C9.82847 1 10.4981 1.52713 10.7132 2.25H12.25C12.9404 2.25 13.5 2.80964 13.5 3.5V13.75C13.5 14.4404 12.9404 15 12.25 15H3.75ZM4 3.75V13.5H12V3.75H10.0357C9.6215 3.75 9.28571 3.41421 9.28571 3V2.75C9.28571 2.61193 9.17379 2.5 9.03571 2.5H6.73809C6.60002 2.5 6.4881 2.61193 6.4881 2.75V3C6.4881 3.41421 6.15231 3.75 5.7381 3.75H4Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'form_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M5.25 6C5.25 5.58579 5.58579 5.25 6 5.25H10C10.4142 5.25 10.75 5.58579 10.75 6C10.75 6.41421 10.4142 6.75 10 6.75H6C5.58579 6.75 5.25 6.41421 5.25 6Z', 'M5.25 9C5.25 8.58579 5.58579 8.25 6 8.25H10C10.4142 8.25 10.75 8.58579 10.75 9C10.75 9.41421 10.4142 9.75 10 9.75H6C5.58579 9.75 5.25 9.41421 5.25 9Z', 'M3.75 15C3.05964 15 2.5 14.4404 2.5 13.75V3.5C2.5 2.80965 3.05964 2.25 3.75 2.25H5.06056C5.2757 1.52713 5.94534 1 6.73809 1H9.03571C9.82847 1 10.4981 1.52713 10.7132 2.25H12.25C12.9404 2.25 13.5 2.80964 13.5 3.5V13.75C13.5 14.4404 12.9404 15 12.25 15H3.75ZM4 3.75V13.5H12V3.75H10.0357C9.6215 3.75 9.28571 3.41421 9.28571 3V2.75C9.28571 2.61193 9.17379 2.5 9.03571 2.5H6.73809C6.60002 2.5 6.4881 2.61193 6.4881 2.75V3C6.4881 3.41421 6.15231 3.75 5.7381 3.75H4Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
