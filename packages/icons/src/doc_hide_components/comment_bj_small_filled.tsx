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

export const CommentBjSmallFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3.33333 3.33333C2.6 3.33333 2 3.93333 2 4.66666V11.3333C2 12.0667 2.6 12.6667 3.33333 12.6667H4.66667V13.6667C4.66667 14.1333 5.13333 14.4667 5.6 14.2667L9.86667 12.6H12.6667C13.4 12.6 14 12 14 11.2667V4.66666C14 3.93333 13.4 3.33333 12.6667 3.33333H3.33333Z" fill={ colors[0] }/>

  </>,
  name: 'comment_bj_small_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M3.33333 3.33333C2.6 3.33333 2 3.93333 2 4.66666V11.3333C2 12.0667 2.6 12.6667 3.33333 12.6667H4.66667V13.6667C4.66667 14.1333 5.13333 14.4667 5.6 14.2667L9.86667 12.6H12.6667C13.4 12.6 14 12 14 11.2667V4.66666C14 3.93333 13.4 3.33333 12.6667 3.33333H3.33333Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
