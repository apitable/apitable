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

export const CurrencyCnyFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M9.26846 6.49999L11.4072 2.61143C11.6068 2.24849 11.4744 1.79244 11.1114 1.59283C10.7485 1.39321 10.2925 1.52561 10.0928 1.88855L8 5.69371L5.90715 1.88855C5.70753 1.52561 5.25149 1.39321 4.88855 1.59283C4.52561 1.79244 4.39321 2.24849 4.59283 2.61143L6.73154 6.49999H4C3.58579 6.49999 3.25 6.83577 3.25 7.24999C3.25 7.6642 3.58579 7.99999 4 7.99999H7.25V9.99999H4C3.58579 9.99999 3.25 10.3358 3.25 10.75C3.25 11.1642 3.58579 11.5 4 11.5H7.25V13.75C7.25 14.1642 7.58579 14.5 8 14.5C8.41421 14.5 8.75 14.1642 8.75 13.75V11.5H12C12.4142 11.5 12.75 11.1642 12.75 10.75C12.75 10.3358 12.4142 9.99999 12 9.99999H8.75V7.99999H12C12.4142 7.99999 12.75 7.6642 12.75 7.24999C12.75 6.83577 12.4142 6.49999 12 6.49999H9.26846Z" fill={ colors[0] }/>

  </>,
  name: 'currency_CNY_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M9.26846 6.49999L11.4072 2.61143C11.6068 2.24849 11.4744 1.79244 11.1114 1.59283C10.7485 1.39321 10.2925 1.52561 10.0928 1.88855L8 5.69371L5.90715 1.88855C5.70753 1.52561 5.25149 1.39321 4.88855 1.59283C4.52561 1.79244 4.39321 2.24849 4.59283 2.61143L6.73154 6.49999H4C3.58579 6.49999 3.25 6.83577 3.25 7.24999C3.25 7.6642 3.58579 7.99999 4 7.99999H7.25V9.99999H4C3.58579 9.99999 3.25 10.3358 3.25 10.75C3.25 11.1642 3.58579 11.5 4 11.5H7.25V13.75C7.25 14.1642 7.58579 14.5 8 14.5C8.41421 14.5 8.75 14.1642 8.75 13.75V11.5H12C12.4142 11.5 12.75 11.1642 12.75 10.75C12.75 10.3358 12.4142 9.99999 12 9.99999H8.75V7.99999H12C12.4142 7.99999 12.75 7.6642 12.75 7.24999C12.75 6.83577 12.4142 6.49999 12 6.49999H9.26846Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
