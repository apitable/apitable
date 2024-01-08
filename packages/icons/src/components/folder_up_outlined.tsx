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

export const FolderUpOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7.48315 5.72382L5.71539 7.49159C5.42249 7.78448 5.42249 8.25935 5.71539 8.55225C6.00828 8.84514 6.48315 8.84514 6.77605 8.55225L7.22784 8.10045V10.7815C7.22784 11.1957 7.56363 11.5315 7.97784 11.5315C8.39205 11.5315 8.72784 11.1957 8.72784 10.7815V8.02917L9.25092 8.55225C9.54381 8.84514 10.0187 8.84514 10.3116 8.55225C10.6045 8.25935 10.6045 7.78448 10.3116 7.49159L8.54381 5.72382C8.25092 5.43093 7.77605 5.43093 7.48315 5.72382Z" fill={ colors[0] }/>
    <path d="M2.25 2C1.55964 2 1 2.55964 1 3.25V12.75C1 13.4404 1.55964 14 2.25 14H13.75C14.4404 14 15 13.4404 15 12.75V4.75C15 4.05964 14.4404 3.5 13.75 3.5H10.2822L8.57718 2.24368C8.36236 2.08539 8.10252 2 7.83568 2H2.25ZM2.5 12.5V3.5H7.75353L9.45853 4.75632C9.67335 4.91461 9.93319 5 10.2 5H13.5V12.5H2.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'folder_up_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M7.48315 5.72382L5.71539 7.49159C5.42249 7.78448 5.42249 8.25935 5.71539 8.55225C6.00828 8.84514 6.48315 8.84514 6.77605 8.55225L7.22784 8.10045V10.7815C7.22784 11.1957 7.56363 11.5315 7.97784 11.5315C8.39205 11.5315 8.72784 11.1957 8.72784 10.7815V8.02917L9.25092 8.55225C9.54381 8.84514 10.0187 8.84514 10.3116 8.55225C10.6045 8.25935 10.6045 7.78448 10.3116 7.49159L8.54381 5.72382C8.25092 5.43093 7.77605 5.43093 7.48315 5.72382Z', 'M2.25 2C1.55964 2 1 2.55964 1 3.25V12.75C1 13.4404 1.55964 14 2.25 14H13.75C14.4404 14 15 13.4404 15 12.75V4.75C15 4.05964 14.4404 3.5 13.75 3.5H10.2822L8.57718 2.24368C8.36236 2.08539 8.10252 2 7.83568 2H2.25ZM2.5 12.5V3.5H7.75353L9.45853 4.75632C9.67335 4.91461 9.93319 5 10.2 5H13.5V12.5H2.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
