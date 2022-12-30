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

export const CommentBjEntireFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2 0C0.9 0 0 0.9 0 2V12C0 13.1 0.9 14 2 14H4V15.5C4 16.2 4.7 16.7 5.4 16.4L11.8 13.9H16C17.1 13.9 18 13 18 11.9V2C18 0.9 17.1 0 16 0H2Z" fill={ colors[0] }/>

  </>,
  name: 'comment_bj_entire_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M2 0C0.9 0 0 0.9 0 2V12C0 13.1 0.9 14 2 14H4V15.5C4 16.2 4.7 16.7 5.4 16.4L11.8 13.9H16C17.1 13.9 18 13 18 11.9V2C18 0.9 17.1 0 16 0H2Z'],
  width: '17',
  height: '17',
  viewBox: '0 0 17 17',
});
