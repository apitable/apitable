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

export const ColumnCheckboxFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3.68 2H12.32C13.2478 2 14 2.75216 14 3.68V12.32C14 13.2478 13.2478 14 12.32 14H3.68C2.75216 14 2 13.2478 2 12.32V3.68C2 2.75216 2.75216 2 3.68 2ZM6.13477 7.14835C5.74225 6.83752 5.17041 6.86342 4.80778 7.22605C4.41725 7.61658 4.41725 8.24974 4.80778 8.64027L6.56329 10.3958L6.65029 10.4733C7.04181 10.7835 7.61205 10.7587 7.97505 10.3982L11.5228 6.87495L11.6008 6.78799C11.913 6.39656 11.8891 5.82463 11.5277 5.46074L11.4408 5.38273C11.0493 5.07055 10.4774 5.09447 10.1135 5.45584L7.27226 8.27705L6.22199 7.22605L6.13477 7.14835Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'column_checkbox_filled',
  defaultColors: ['#636363'],
  colorful: false,
  allPathData: ['M3.68 2H12.32C13.2478 2 14 2.75216 14 3.68V12.32C14 13.2478 13.2478 14 12.32 14H3.68C2.75216 14 2 13.2478 2 12.32V3.68C2 2.75216 2.75216 2 3.68 2ZM6.13477 7.14835C5.74225 6.83752 5.17041 6.86342 4.80778 7.22605C4.41725 7.61658 4.41725 8.24974 4.80778 8.64027L6.56329 10.3958L6.65029 10.4733C7.04181 10.7835 7.61205 10.7587 7.97505 10.3982L11.5228 6.87495L11.6008 6.78799C11.913 6.39656 11.8891 5.82463 11.5277 5.46074L11.4408 5.38273C11.0493 5.07055 10.4774 5.09447 10.1135 5.45584L7.27226 8.27705L6.22199 7.22605L6.13477 7.14835Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
