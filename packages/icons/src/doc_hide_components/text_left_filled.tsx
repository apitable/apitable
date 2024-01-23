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

export const TextLeftFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3 1.25C2.58579 1.25 2.25 1.58579 2.25 2C2.25 2.41421 2.58579 2.75 3 2.75H7.5C7.91421 2.75 8.25 2.41421 8.25 2C8.25 1.58579 7.91421 1.25 7.5 1.25H3Z" fill={ colors[0] }/>
    <path d="M3 9.25C2.58579 9.25 2.25 9.58579 2.25 10C2.25 10.4142 2.58579 10.75 3 10.75H13C13.4142 10.75 13.75 10.4142 13.75 10C13.75 9.58579 13.4142 9.25 13 9.25H3Z" fill={ colors[0] }/>
    <path d="M2.25 6C2.25 5.58579 2.58579 5.25 3 5.25H13C13.4142 5.25 13.75 5.58579 13.75 6C13.75 6.41421 13.4142 6.75 13 6.75H3C2.58579 6.75 2.25 6.41421 2.25 6Z" fill={ colors[0] }/>
    <path d="M3 13.25C2.58579 13.25 2.25 13.5858 2.25 14C2.25 14.4142 2.58579 14.75 3 14.75H7.5C7.91421 14.75 8.25 14.4142 8.25 14C8.25 13.5858 7.91421 13.25 7.5 13.25H3Z" fill={ colors[0] }/>

  </>,
  name: 'text_left_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M3 1.25C2.58579 1.25 2.25 1.58579 2.25 2C2.25 2.41421 2.58579 2.75 3 2.75H7.5C7.91421 2.75 8.25 2.41421 8.25 2C8.25 1.58579 7.91421 1.25 7.5 1.25H3Z', 'M3 9.25C2.58579 9.25 2.25 9.58579 2.25 10C2.25 10.4142 2.58579 10.75 3 10.75H13C13.4142 10.75 13.75 10.4142 13.75 10C13.75 9.58579 13.4142 9.25 13 9.25H3Z', 'M2.25 6C2.25 5.58579 2.58579 5.25 3 5.25H13C13.4142 5.25 13.75 5.58579 13.75 6C13.75 6.41421 13.4142 6.75 13 6.75H3C2.58579 6.75 2.25 6.41421 2.25 6Z', 'M3 13.25C2.58579 13.25 2.25 13.5858 2.25 14C2.25 14.4142 2.58579 14.75 3 14.75H7.5C7.91421 14.75 8.25 14.4142 8.25 14C8.25 13.5858 7.91421 13.25 7.5 13.25H3Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
