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

export const Collapse3OpenFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M4.23966 10.7004C3.93613 10.9823 3.91855 11.4568 4.2004 11.7603C4.48226 12.0639 4.9568 12.0814 5.26034 11.7996L8.76034 8.5496C8.91316 8.40769 9 8.20855 9 8C9 7.79145 8.91316 7.59231 8.76034 7.45041L5.26034 4.20041C4.9568 3.91855 4.48226 3.93613 4.2004 4.23966C3.91855 4.5432 3.93613 5.01774 4.23966 5.2996L7.14779 8L4.23966 10.7004Z" fill={ colors[0] }/>
    <path d="M10.5 11.25C10.5 11.6642 10.8358 12 11.25 12C11.6642 12 12 11.6642 12 11.25V4.75C12 4.33579 11.6642 4 11.25 4C10.8358 4 10.5 4.33579 10.5 4.75V11.25Z" fill={ colors[0] }/>

  </>,
  name: 'collapse_3_open_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M4.23966 10.7004C3.93613 10.9823 3.91855 11.4568 4.2004 11.7603C4.48226 12.0639 4.9568 12.0814 5.26034 11.7996L8.76034 8.5496C8.91316 8.40769 9 8.20855 9 8C9 7.79145 8.91316 7.59231 8.76034 7.45041L5.26034 4.20041C4.9568 3.91855 4.48226 3.93613 4.2004 4.23966C3.91855 4.5432 3.93613 5.01774 4.23966 5.2996L7.14779 8L4.23966 10.7004Z', 'M10.5 11.25C10.5 11.6642 10.8358 12 11.25 12C11.6642 12 12 11.6642 12 11.25V4.75C12 4.33579 11.6642 4 11.25 4C10.8358 4 10.5 4.33579 10.5 4.75V11.25Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
