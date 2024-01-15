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

export const CalendarFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5.25 1.5C5.66421 1.5 6 1.83579 6 2.25V4.25C6 4.66421 5.66421 5 5.25 5C4.83579 5 4.5 4.66421 4.5 4.25V2.25C4.5 1.83579 4.83579 1.5 5.25 1.5Z" fill={ colors[0] }/>
    <path d="M3.5 2.75H2.34615C1.60269 2.75 1 3.30964 1 4V6.75L14.75 6.75C14.8411 6.75 14.9265 6.77435 15 6.81689V4C15 3.30964 14.3973 2.75 13.6538 2.75L12.5 2.75V4.09375C12.5 5.12972 11.5869 5.75 10.75 5.75C9.91311 5.75 9 5.12972 9 4.09375V2.75H7V4.09375C7 5.12972 6.08689 5.75 5.25 5.75C4.41311 5.75 3.5 5.12972 3.5 4.09375L3.5 2.75Z" fill={ colors[0] }/>
    <path d="M1 7.75V12.75C1 13.4404 1.60269 14 2.34615 14L13.6538 14C14.3973 14 15 13.4404 15 12.75V7.68311C14.9265 7.72565 14.8411 7.75 14.75 7.75L1 7.75Z" fill={ colors[0] }/>
    <path d="M11.5 2.25C11.5 1.83579 11.1642 1.5 10.75 1.5C10.3358 1.5 10 1.83579 10 2.25V4.25C10 4.66421 10.3358 5 10.75 5C11.1642 5 11.5 4.66421 11.5 4.25V2.25Z" fill={ colors[0] }/>

  </>,
  name: 'calendar_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M5.25 1.5C5.66421 1.5 6 1.83579 6 2.25V4.25C6 4.66421 5.66421 5 5.25 5C4.83579 5 4.5 4.66421 4.5 4.25V2.25C4.5 1.83579 4.83579 1.5 5.25 1.5Z', 'M3.5 2.75H2.34615C1.60269 2.75 1 3.30964 1 4V6.75L14.75 6.75C14.8411 6.75 14.9265 6.77435 15 6.81689V4C15 3.30964 14.3973 2.75 13.6538 2.75L12.5 2.75V4.09375C12.5 5.12972 11.5869 5.75 10.75 5.75C9.91311 5.75 9 5.12972 9 4.09375V2.75H7V4.09375C7 5.12972 6.08689 5.75 5.25 5.75C4.41311 5.75 3.5 5.12972 3.5 4.09375L3.5 2.75Z', 'M1 7.75V12.75C1 13.4404 1.60269 14 2.34615 14L13.6538 14C14.3973 14 15 13.4404 15 12.75V7.68311C14.9265 7.72565 14.8411 7.75 14.75 7.75L1 7.75Z', 'M11.5 2.25C11.5 1.83579 11.1642 1.5 10.75 1.5C10.3358 1.5 10 1.83579 10 2.25V4.25C10 4.66421 10.3358 5 10.75 5C11.1642 5 11.5 4.66421 11.5 4.25V2.25Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
