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

export const NetworkFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <circle cx="9" cy="12" r="7" fill={ colors[0] }/>
    <rect x="5" y="11" width="17" height="8" rx="4" fill={ colors[0] }/>
    <circle cx="15" cy="11" r="4" fill={ colors[0] }/>
    <path d="M15 11.4467L11.4316 14.9849L9 12.5532" stroke={ colors[1] } strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

  </>,
  name: 'network_filled',
  defaultColors: ['#7B67EE', 'white'],
  colorful: true,
  allPathData: ['M15 11.4467L11.4316 14.9849L9 12.5532'],
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
});
