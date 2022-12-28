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

export const ColumnCascadeOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1 2C1 1.44772 1.44772 1 2 1H6C6.55228 1 7 1.44772 7 2V4.53201C7.52009 4.0056 8.17142 3.54075 9 3.2422V2C9 1.44772 9.44772 1 10 1H14C14.5523 1 15 1.44772 15 2V6C15 6.55228 14.5523 7 14 7H10C9.44772 7 9 6.55228 9 6V5.45803C8.09249 6.04779 7.59586 7.02201 7.1151 8C7.59586 8.97799 8.09249 9.95221 9 10.542V10C9 9.44772 9.44772 9 10 9H14C14.5523 9 15 9.44772 15 10V14C15 14.5523 14.5523 15 14 15H10C9.44772 15 9 14.5523 9 14V12.7578C8.17142 12.4593 7.52009 11.9944 7 11.468V14C7 14.5523 6.55228 15 6 15H2C1.44772 15 1 14.5523 1 14V2ZM3 3V13H5V3H3ZM11 3V5H13V3H11ZM11 13V11H13V13H11Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'column_cascade_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M1 2C1 1.44772 1.44772 1 2 1H6C6.55228 1 7 1.44772 7 2V4.53201C7.52009 4.0056 8.17142 3.54075 9 3.2422V2C9 1.44772 9.44772 1 10 1H14C14.5523 1 15 1.44772 15 2V6C15 6.55228 14.5523 7 14 7H10C9.44772 7 9 6.55228 9 6V5.45803C8.09249 6.04779 7.59586 7.02201 7.1151 8C7.59586 8.97799 8.09249 9.95221 9 10.542V10C9 9.44772 9.44772 9 10 9H14C14.5523 9 15 9.44772 15 10V14C15 14.5523 14.5523 15 14 15H10C9.44772 15 9 14.5523 9 14V12.7578C8.17142 12.4593 7.52009 11.9944 7 11.468V14C7 14.5523 6.55228 15 6 15H2C1.44772 15 1 14.5523 1 14V2ZM3 3V13H5V3H3ZM11 3V5H13V3H11ZM11 13V11H13V13H11Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
