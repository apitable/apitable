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

export const ActivityRecordOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M4 5H11C11.6 5 12 4.6 12 4C12 3.4 11.6 3 11 3H4C3.4 3 3 3.4 3 4C3 4.6 3.4 5 4 5ZM13 7H4C3.4 7 3 7.4 3 8C3 8.6 3.4 9 4 9H13C13.6 9 14 8.6 14 8C14 7.4 13.6 7 13 7ZM4 11H9C9.6 11 10 11.4 10 12C10 12.6 9.6 13 9 13H4C3.4 13 3 12.6 3 12C3 11.4 3.4 11 4 11Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'activity_record_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M4 5H11C11.6 5 12 4.6 12 4C12 3.4 11.6 3 11 3H4C3.4 3 3 3.4 3 4C3 4.6 3.4 5 4 5ZM13 7H4C3.4 7 3 7.4 3 8C3 8.6 3.4 9 4 9H13C13.6 9 14 8.6 14 8C14 7.4 13.6 7 13 7ZM4 11H9C9.6 11 10 11.4 10 12C10 12.6 9.6 13 9 13H4C3.4 13 3 12.6 3 12C3 11.4 3.4 11 4 11Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
