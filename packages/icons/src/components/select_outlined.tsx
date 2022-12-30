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

export const SelectOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1.49751 6.76449C1.88804 6.37396 2.5212 6.37396 2.91173 6.76449L6.69609 10.5488L13.0914 4.20996C13.4836 3.82117 14.1168 3.82398 14.5056 4.21623C14.8944 4.60848 14.8916 5.24164 14.4993 5.63043L7.39693 12.6702C7.0059 13.0577 6.37515 13.0563 5.98585 12.667L1.49751 8.1787C1.10699 7.78817 1.10699 7.15501 1.49751 6.76449Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'select_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M1.49751 6.76449C1.88804 6.37396 2.5212 6.37396 2.91173 6.76449L6.69609 10.5488L13.0914 4.20996C13.4836 3.82117 14.1168 3.82398 14.5056 4.21623C14.8944 4.60848 14.8916 5.24164 14.4993 5.63043L7.39693 12.6702C7.0059 13.0577 6.37515 13.0563 5.98585 12.667L1.49751 8.1787C1.10699 7.78817 1.10699 7.15501 1.49751 6.76449Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
