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

export const CheckedFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <rect x="1" y="1" width="14" height="14" rx="1" fill={ colors[0] }/>
    <path d="M11.8091 5.80053L7.26268 10.3051L4.2666 7.30902" stroke={ colors[1] } strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

  </>,
  name: 'checked_filled',
  defaultColors: ['#7B67EE', 'white'],
  colorful: true,
  allPathData: ['M11.8091 5.80053L7.26268 10.3051L4.2666 7.30902'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
