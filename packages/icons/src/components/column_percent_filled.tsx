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

export const ColumnPercentFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M4.5 7C5.88071 7 7 5.88071 7 4.5C7 3.11929 5.88071 2 4.5 2C3.11929 2 2 3.11929 2 4.5C2 5.88071 3.11929 7 4.5 7ZM11.5356 3.05037C11.9261 2.65984 12.5593 2.65984 12.9498 3.05037C13.3403 3.44089 13.3403 4.07406 12.9498 4.46458L4.4645 12.9499C4.07398 13.3404 3.44081 13.3404 3.05029 12.9499C2.65976 12.5593 2.65976 11.9262 3.05029 11.5356L11.5356 3.05037ZM14 11.5C14 12.8807 12.8807 14 11.5 14C10.1193 14 9 12.8807 9 11.5C9 10.1193 10.1193 9 11.5 9C12.8807 9 14 10.1193 14 11.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'column_percent_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M4.5 7C5.88071 7 7 5.88071 7 4.5C7 3.11929 5.88071 2 4.5 2C3.11929 2 2 3.11929 2 4.5C2 5.88071 3.11929 7 4.5 7ZM11.5356 3.05037C11.9261 2.65984 12.5593 2.65984 12.9498 3.05037C13.3403 3.44089 13.3403 4.07406 12.9498 4.46458L4.4645 12.9499C4.07398 13.3404 3.44081 13.3404 3.05029 12.9499C2.65976 12.5593 2.65976 11.9262 3.05029 11.5356L11.5356 3.05037ZM14 11.5C14 12.8807 12.8807 14 11.5 14C10.1193 14 9 12.8807 9 11.5C9 10.1193 10.1193 9 11.5 9C12.8807 9 14 10.1193 14 11.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
