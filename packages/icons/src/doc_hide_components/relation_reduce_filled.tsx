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

export const RelationReduceFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M10.6666 8.00001H5.33325" stroke={ colors[1] } strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

  </>,
  name: 'relation_reduce_filled',
  defaultColors: ['#636363', 'white'],
  colorful: true,
  allPathData: ['M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z', 'M10.6666 8.00001H5.33325'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
