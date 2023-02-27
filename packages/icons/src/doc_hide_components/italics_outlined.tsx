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

export const ItalicsOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M10.0172 1H12C12.4142 1 12.75 1.33579 12.75 1.75C12.75 2.16421 12.4142 2.5 12 2.5H10.5441L7.03387 13.25H8C8.41421 13.25 8.75 13.5858 8.75 14C8.75 14.4142 8.41421 14.75 8 14.75H6.01753C6.00597 14.7503 5.99438 14.7503 5.98276 14.75H4C3.58579 14.75 3.25 14.4142 3.25 14C3.25 13.5858 3.58579 13.25 4 13.25H5.45593L8.96613 2.5H8C7.58579 2.5 7.25 2.16421 7.25 1.75C7.25 1.33579 7.58579 1 8 1H9.98249C9.99404 0.99973 10.0056 0.999729 10.0172 1Z" fill={ colors[0] }/>

  </>,
  name: 'italics_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M10.0172 1H12C12.4142 1 12.75 1.33579 12.75 1.75C12.75 2.16421 12.4142 2.5 12 2.5H10.5441L7.03387 13.25H8C8.41421 13.25 8.75 13.5858 8.75 14C8.75 14.4142 8.41421 14.75 8 14.75H6.01753C6.00597 14.7503 5.99438 14.7503 5.98276 14.75H4C3.58579 14.75 3.25 14.4142 3.25 14C3.25 13.5858 3.58579 13.25 4 13.25H5.45593L8.96613 2.5H8C7.58579 2.5 7.25 2.16421 7.25 1.75C7.25 1.33579 7.58579 1 8 1H9.98249C9.99404 0.99973 10.0056 0.999729 10.0172 1Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
