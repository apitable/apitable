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

export const ExpandOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M14 2.75C14 2.33579 13.6642 2 13.25 2H9.25C8.83579 2 8.5 2.33579 8.5 2.75C8.5 3.16421 8.83579 3.5 9.25 3.5H11.4393L8.59467 6.34467C8.30178 6.63756 8.30178 7.11244 8.59467 7.40533C8.88756 7.69822 9.36244 7.69822 9.65533 7.40533L12.5 4.56066V6.75C12.5 7.16421 12.8358 7.5 13.25 7.5C13.6642 7.5 14 7.16421 14 6.75V2.75Z" fill={ colors[0] }/>
    <path d="M2 13.25C2 13.6642 2.33579 14 2.75 14H6.75C7.16421 14 7.5 13.6642 7.5 13.25C7.5 12.8358 7.16421 12.5 6.75 12.5H4.56066L7.40533 9.65533C7.69822 9.36244 7.69822 8.88756 7.40533 8.59467C7.11244 8.30178 6.63756 8.30178 6.34467 8.59467L3.5 11.4393V9.25C3.5 8.83579 3.16421 8.5 2.75 8.5C2.33579 8.5 2 8.83579 2 9.25V13.25Z" fill={ colors[0] }/>

  </>,
  name: 'expand_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M14 2.75C14 2.33579 13.6642 2 13.25 2H9.25C8.83579 2 8.5 2.33579 8.5 2.75C8.5 3.16421 8.83579 3.5 9.25 3.5H11.4393L8.59467 6.34467C8.30178 6.63756 8.30178 7.11244 8.59467 7.40533C8.88756 7.69822 9.36244 7.69822 9.65533 7.40533L12.5 4.56066V6.75C12.5 7.16421 12.8358 7.5 13.25 7.5C13.6642 7.5 14 7.16421 14 6.75V2.75Z', 'M2 13.25C2 13.6642 2.33579 14 2.75 14H6.75C7.16421 14 7.5 13.6642 7.5 13.25C7.5 12.8358 7.16421 12.5 6.75 12.5H4.56066L7.40533 9.65533C7.69822 9.36244 7.69822 8.88756 7.40533 8.59467C7.11244 8.30178 6.63756 8.30178 6.34467 8.59467L3.5 11.4393V9.25C3.5 8.83579 3.16421 8.5 2.75 8.5C2.33579 8.5 2 8.83579 2 9.25V13.25Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
