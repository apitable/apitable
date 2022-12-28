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

export const ColumnEmailFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2 5C2 3.89543 2.89543 3 4 3H12C13.1046 3 14 3.89543 14 5V11C14 12.1046 13.1046 13 12 13H4C2.89543 13 2 12.1046 2 11V5Z" fill={ colors[0] }/>
    <path d="M10.9142 6.84703L8 9.00006L5.08576 6.84703" stroke={ colors[1] } strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>

  </>,
  name: 'column_email_filled',
  defaultColors: ['#636363', 'white'],
  colorful: true,
  allPathData: ['M2 5C2 3.89543 2.89543 3 4 3H12C13.1046 3 14 3.89543 14 5V11C14 12.1046 13.1046 13 12 13H4C2.89543 13 2 12.1046 2 11V5Z', 'M10.9142 6.84703L8 9.00006L5.08576 6.84703'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
