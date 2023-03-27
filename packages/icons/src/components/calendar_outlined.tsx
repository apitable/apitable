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

export const CalendarOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M10.75 1.5C11.1642 1.5 11.5 1.83579 11.5 2.25V2.75L13.75 2.75C14.4404 2.75 15 3.30964 15 4V12.75C15 13.4404 14.4404 14 13.75 14L2.25 14C1.55964 14 1 13.4404 1 12.75V4C1 3.30964 1.55964 2.75 2.25 2.75L4.5 2.75V2.25C4.5 1.83579 4.83579 1.5 5.25 1.5C5.66421 1.5 6 1.83579 6 2.25V2.75L10 2.75V2.25C10 1.83579 10.3358 1.5 10.75 1.5ZM4.5 4.25H2.5L2.5 6.25L13.5 6.25V4.25H11.5V4.75C11.5 5.16421 11.1642 5.5 10.75 5.5C10.3358 5.5 10 5.16421 10 4.75V4.25L6 4.25V4.75C6 5.16421 5.66421 5.5 5.25 5.5C4.83579 5.5 4.5 5.16421 4.5 4.75L4.5 4.25ZM13.5 7.75L2.5 7.75L2.5 12.5L13.5 12.5V7.75Z" fill={ colors[0] }/>

  </>,
  name: 'calendar_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M10.75 1.5C11.1642 1.5 11.5 1.83579 11.5 2.25V2.75L13.75 2.75C14.4404 2.75 15 3.30964 15 4V12.75C15 13.4404 14.4404 14 13.75 14L2.25 14C1.55964 14 1 13.4404 1 12.75V4C1 3.30964 1.55964 2.75 2.25 2.75L4.5 2.75V2.25C4.5 1.83579 4.83579 1.5 5.25 1.5C5.66421 1.5 6 1.83579 6 2.25V2.75L10 2.75V2.25C10 1.83579 10.3358 1.5 10.75 1.5ZM4.5 4.25H2.5L2.5 6.25L13.5 6.25V4.25H11.5V4.75C11.5 5.16421 11.1642 5.5 10.75 5.5C10.3358 5.5 10 5.16421 10 4.75V4.25L6 4.25V4.75C6 5.16421 5.66421 5.5 5.25 5.5C4.83579 5.5 4.5 5.16421 4.5 4.75L4.5 4.25ZM13.5 7.75L2.5 7.75L2.5 12.5L13.5 12.5V7.75Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
