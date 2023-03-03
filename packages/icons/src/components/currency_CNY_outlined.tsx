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

export const CurrencyCnyOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M9.26846 6.5L11.4072 2.61144C11.6068 2.2485 11.4744 1.79246 11.1114 1.59284C10.7485 1.39322 10.2925 1.52562 10.0928 1.88856L8 5.69373L5.90715 1.88856C5.70753 1.52562 5.25149 1.39322 4.88855 1.59284C4.52561 1.79246 4.39321 2.2485 4.59283 2.61144L6.73154 6.5H4C3.58579 6.5 3.25 6.83579 3.25 7.25C3.25 7.66422 3.58579 8 4 8H7.25V10H4C3.58579 10 3.25 10.3358 3.25 10.75C3.25 11.1642 3.58579 11.5 4 11.5H7.25V13.75C7.25 14.1642 7.58579 14.5 8 14.5C8.41421 14.5 8.75 14.1642 8.75 13.75V11.5H12C12.4142 11.5 12.75 11.1642 12.75 10.75C12.75 10.3358 12.4142 10 12 10H8.75V8H12C12.4142 8 12.75 7.66422 12.75 7.25C12.75 6.83579 12.4142 6.5 12 6.5H9.26846Z" fill={ colors[0] }/>

  </>,
  name: 'currency_CNY_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M9.26846 6.5L11.4072 2.61144C11.6068 2.2485 11.4744 1.79246 11.1114 1.59284C10.7485 1.39322 10.2925 1.52562 10.0928 1.88856L8 5.69373L5.90715 1.88856C5.70753 1.52562 5.25149 1.39322 4.88855 1.59284C4.52561 1.79246 4.39321 2.2485 4.59283 2.61144L6.73154 6.5H4C3.58579 6.5 3.25 6.83579 3.25 7.25C3.25 7.66422 3.58579 8 4 8H7.25V10H4C3.58579 10 3.25 10.3358 3.25 10.75C3.25 11.1642 3.58579 11.5 4 11.5H7.25V13.75C7.25 14.1642 7.58579 14.5 8 14.5C8.41421 14.5 8.75 14.1642 8.75 13.75V11.5H12C12.4142 11.5 12.75 11.1642 12.75 10.75C12.75 10.3358 12.4142 10 12 10H8.75V8H12C12.4142 8 12.75 7.66422 12.75 7.25C12.75 6.83579 12.4142 6.5 12 6.5H9.26846Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
