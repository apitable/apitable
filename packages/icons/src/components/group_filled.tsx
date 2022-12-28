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

export const GroupFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3 5C3 3.89543 3.89543 3 5 3H11C12.1046 3 13 3.89543 13 5V6H3V5ZM3 8.5C3 7.67157 3.67157 7 4.5 7H11.5C12.3284 7 13 7.67157 13 8.5C13 9.32843 12.3284 10 11.5 10H4.5C3.67157 10 3 9.32843 3 8.5ZM13 11H3V12C3 13.1046 3.89543 14 5 14H11C12.1046 14 13 13.1046 13 12V11Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'group_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M3 5C3 3.89543 3.89543 3 5 3H11C12.1046 3 13 3.89543 13 5V6H3V5ZM3 8.5C3 7.67157 3.67157 7 4.5 7H11.5C12.3284 7 13 7.67157 13 8.5C13 9.32843 12.3284 10 11.5 10H4.5C3.67157 10 3 9.32843 3 8.5ZM13 11H3V12C3 13.1046 3.89543 14 5 14H11C12.1046 14 13 13.1046 13 12V11Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
