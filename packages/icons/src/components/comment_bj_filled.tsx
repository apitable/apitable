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

export const CommentBjFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5 5C3.9 5 3 5.9 3 7V17C3 18.1 3.9 19 5 19H7V20.5C7 21.2 7.7 21.7 8.4 21.4L14.8 18.9H19C20.1 18.9 21 18 21 16.9V7C21 5.9 20.1 5 19 5H5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'comment_bj_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M5 5C3.9 5 3 5.9 3 7V17C3 18.1 3.9 19 5 19H7V20.5C7 21.2 7.7 21.7 8.4 21.4L14.8 18.9H19C20.1 18.9 21 18 21 16.9V7C21 5.9 20.1 5 19 5H5Z'],
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
});
