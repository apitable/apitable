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

export const DescriptionFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2.75 1.5C2.05964 1.5 1.5 2.05964 1.5 2.75V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H2.75ZM4 6C4 5.58579 4.33579 5.25 4.75 5.25H9.375C9.78921 5.25 10.125 5.58579 10.125 6C10.125 6.41421 9.78921 6.75 9.375 6.75H4.75C4.33579 6.75 4 6.41421 4 6ZM4 10C4 9.58579 4.33579 9.25 4.75 9.25H11.25C11.6642 9.25 12 9.58579 12 10C12 10.4142 11.6642 10.75 11.25 10.75H4.75C4.33579 10.75 4 10.4142 4 10Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'description_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M2.75 1.5C2.05964 1.5 1.5 2.05964 1.5 2.75V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H2.75ZM4 6C4 5.58579 4.33579 5.25 4.75 5.25H9.375C9.78921 5.25 10.125 5.58579 10.125 6C10.125 6.41421 9.78921 6.75 9.375 6.75H4.75C4.33579 6.75 4 6.41421 4 6ZM4 10C4 9.58579 4.33579 9.25 4.75 9.25H11.25C11.6642 9.25 12 9.58579 12 10C12 10.4142 11.6642 10.75 11.25 10.75H4.75C4.33579 10.75 4 10.4142 4 10Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
