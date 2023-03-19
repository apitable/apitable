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

export const GotoOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3 3H7.25C7.66421 3 8 2.66421 8 2.25C8 1.83579 7.66421 1.5 7.25 1.5H2.75C2.05964 1.5 1.5 2.05964 1.5 2.75V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V8.75C14.5 8.33579 14.1642 8 13.75 8C13.3358 8 13 8.33579 13 8.75V13H3V3Z" fill={ colors[0] }/>
    <path d="M9.5 2.25C9.5 1.83579 9.83579 1.5 10.25 1.5H13.75C13.8517 1.5 13.9487 1.52024 14.0371 1.55691C14.1255 1.59351 14.2084 1.64776 14.2803 1.71967C14.3522 1.79158 14.4065 1.87445 14.4431 1.96291C14.4798 2.05134 14.5 2.14831 14.5 2.25V5.75C14.5 6.16421 14.1642 6.5 13.75 6.5C13.3358 6.5 13 6.16421 13 5.75V4.06066L8.53033 8.53033C8.23744 8.82322 7.76256 8.82322 7.46967 8.53033C7.17678 8.23744 7.17678 7.76256 7.46967 7.46967L11.9393 3H10.25C9.83579 3 9.5 2.66421 9.5 2.25Z" fill={ colors[0] }/>

  </>,
  name: 'goto_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M3 3H7.25C7.66421 3 8 2.66421 8 2.25C8 1.83579 7.66421 1.5 7.25 1.5H2.75C2.05964 1.5 1.5 2.05964 1.5 2.75V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V8.75C14.5 8.33579 14.1642 8 13.75 8C13.3358 8 13 8.33579 13 8.75V13H3V3Z', 'M9.5 2.25C9.5 1.83579 9.83579 1.5 10.25 1.5H13.75C13.8517 1.5 13.9487 1.52024 14.0371 1.55691C14.1255 1.59351 14.2084 1.64776 14.2803 1.71967C14.3522 1.79158 14.4065 1.87445 14.4431 1.96291C14.4798 2.05134 14.5 2.14831 14.5 2.25V5.75C14.5 6.16421 14.1642 6.5 13.75 6.5C13.3358 6.5 13 6.16421 13 5.75V4.06066L8.53033 8.53033C8.23744 8.82322 7.76256 8.82322 7.46967 8.53033C7.17678 8.23744 7.17678 7.76256 7.46967 7.46967L11.9393 3H10.25C9.83579 3 9.5 2.66421 9.5 2.25Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
