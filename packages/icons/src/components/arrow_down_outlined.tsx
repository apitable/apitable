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

export const ArrowDownOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7.00019 3.20005C7.00019 2.64777 7.44791 2.20005 8.00019 2.20005C8.55248 2.20005 9.00019 2.64777 9.00019 3.20005V10.3858L11.0643 8.32171C11.4548 7.93118 12.088 7.93118 12.4785 8.32171C12.8691 8.71223 12.8691 9.3454 12.4785 9.73592L8.7073 13.5072C8.51976 13.6947 8.26541 13.8001 8.00019 13.8001C7.73498 13.8001 7.48062 13.6947 7.29309 13.5072L3.52185 9.73592C3.13133 9.3454 3.13133 8.71223 3.52185 8.32171C3.91238 7.93118 4.54554 7.93118 4.93606 8.32171L7.00019 10.3858V3.20005Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'arrow_down_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M7.00019 3.20005C7.00019 2.64777 7.44791 2.20005 8.00019 2.20005C8.55248 2.20005 9.00019 2.64777 9.00019 3.20005V10.3858L11.0643 8.32171C11.4548 7.93118 12.088 7.93118 12.4785 8.32171C12.8691 8.71223 12.8691 9.3454 12.4785 9.73592L8.7073 13.5072C8.51976 13.6947 8.26541 13.8001 8.00019 13.8001C7.73498 13.8001 7.48062 13.6947 7.29309 13.5072L3.52185 9.73592C3.13133 9.3454 3.13133 8.71223 3.52185 8.32171C3.91238 7.93118 4.54554 7.93118 4.93606 8.32171L7.00019 10.3858V3.20005Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
