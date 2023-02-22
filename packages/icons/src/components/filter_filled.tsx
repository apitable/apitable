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

export const FilterFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M13.4544 3.44338C14.0082 2.61269 13.4127 1.5 12.4143 1.5H3.58563C2.58726 1.5 1.99177 2.61268 2.54556 3.44337L5.66599 8.12404C5.72074 8.20617 5.74996 8.30268 5.74996 8.40139V12.1386C5.74996 12.5244 5.92805 12.8885 6.23254 13.1253L8.63602 14.9947C9.29288 15.5056 10.25 15.0375 10.25 14.2054V8.40139C10.25 8.30268 10.2792 8.20617 10.3339 8.12404L13.4544 3.44338Z" fill={ colors[0] }/>

  </>,
  name: 'filter_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M13.4544 3.44338C14.0082 2.61269 13.4127 1.5 12.4143 1.5H3.58563C2.58726 1.5 1.99177 2.61268 2.54556 3.44337L5.66599 8.12404C5.72074 8.20617 5.74996 8.30268 5.74996 8.40139V12.1386C5.74996 12.5244 5.92805 12.8885 6.23254 13.1253L8.63602 14.9947C9.29288 15.5056 10.25 15.0375 10.25 14.2054V8.40139C10.25 8.30268 10.2792 8.20617 10.3339 8.12404L13.4544 3.44338Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
