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

export const TextRightFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M13 1.25C13.4142 1.25 13.75 1.58579 13.75 2C13.75 2.41421 13.4142 2.75 13 2.75H8.5C8.08579 2.75 7.75 2.41421 7.75 2C7.75 1.58579 8.08579 1.25 8.5 1.25H13Z" fill={ colors[0] }/>
    <path d="M13 9.25C13.4142 9.25 13.75 9.58579 13.75 10C13.75 10.4142 13.4142 10.75 13 10.75H3C2.58579 10.75 2.25 10.4142 2.25 10C2.25 9.58579 2.58579 9.25 3 9.25H13Z" fill={ colors[0] }/>
    <path d="M13.75 6C13.75 5.58579 13.4142 5.25 13 5.25H3C2.58579 5.25 2.25 5.58579 2.25 6C2.25 6.41421 2.58579 6.75 3 6.75H13C13.4142 6.75 13.75 6.41421 13.75 6Z" fill={ colors[0] }/>
    <path d="M13 13.25C13.4142 13.25 13.75 13.5858 13.75 14C13.75 14.4142 13.4142 14.75 13 14.75H8.5C8.08579 14.75 7.75 14.4142 7.75 14C7.75 13.5858 8.08579 13.25 8.5 13.25H13Z" fill={ colors[0] }/>

  </>,
  name: 'text_right_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M13 1.25C13.4142 1.25 13.75 1.58579 13.75 2C13.75 2.41421 13.4142 2.75 13 2.75H8.5C8.08579 2.75 7.75 2.41421 7.75 2C7.75 1.58579 8.08579 1.25 8.5 1.25H13Z', 'M13 9.25C13.4142 9.25 13.75 9.58579 13.75 10C13.75 10.4142 13.4142 10.75 13 10.75H3C2.58579 10.75 2.25 10.4142 2.25 10C2.25 9.58579 2.58579 9.25 3 9.25H13Z', 'M13.75 6C13.75 5.58579 13.4142 5.25 13 5.25H3C2.58579 5.25 2.25 5.58579 2.25 6C2.25 6.41421 2.58579 6.75 3 6.75H13C13.4142 6.75 13.75 6.41421 13.75 6Z', 'M13 13.25C13.4142 13.25 13.75 13.5858 13.75 14C13.75 14.4142 13.4142 14.75 13 14.75H8.5C8.08579 14.75 7.75 14.4142 7.75 14C7.75 13.5858 8.08579 13.25 8.5 13.25H13Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
