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

export const DemoOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.5 2.5C5.46243 2.5 3 4.96243 3 8C3 11.0376 5.46243 13.5 8.5 13.5C11.5376 13.5 14 11.0376 14 8C14 4.96243 11.5376 2.5 8.5 2.5ZM1 8C1 3.85786 4.35786 0.5 8.5 0.5C12.6421 0.5 16 3.85786 16 8C16 12.1421 12.6421 15.5 8.5 15.5C4.35786 15.5 1 12.1421 1 8ZM7.5 5C7.5 4.44772 7.94772 4 8.5 4C9.05228 4 9.5 4.44772 9.5 5V7H11.5C12.0523 7 12.5 7.44772 12.5 8C12.5 8.55228 12.0523 9 11.5 9H8.5C7.94772 9 7.5 8.55228 7.5 8V5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'demo_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M8.5 2.5C5.46243 2.5 3 4.96243 3 8C3 11.0376 5.46243 13.5 8.5 13.5C11.5376 13.5 14 11.0376 14 8C14 4.96243 11.5376 2.5 8.5 2.5ZM1 8C1 3.85786 4.35786 0.5 8.5 0.5C12.6421 0.5 16 3.85786 16 8C16 12.1421 12.6421 15.5 8.5 15.5C4.35786 15.5 1 12.1421 1 8ZM7.5 5C7.5 4.44772 7.94772 4 8.5 4C9.05228 4 9.5 4.44772 9.5 5V7H11.5C12.0523 7 12.5 7.44772 12.5 8C12.5 8.55228 12.0523 9 11.5 9H8.5C7.94772 9 7.5 8.55228 7.5 8V5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
