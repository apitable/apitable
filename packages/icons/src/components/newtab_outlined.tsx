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

export const NewtabOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5 2C5 1.44772 5.44772 1 6 1H13C14.1046 1 15 1.89543 15 3V10C15 10.5523 14.5523 11 14 11C13.4477 11 13 10.5523 13 10V4C13 3.44772 12.5523 3 12 3H6C5.44772 3 5 2.55228 5 2ZM10 7C10 6.44772 9.55229 6 9 6H3C2.44772 6 2 6.44772 2 7L2 13C2 13.5523 2.44772 14 3 14H9C9.55229 14 10 13.5523 10 13V7ZM2 4C0.895431 4 0 4.89543 0 6V14C0 15.1046 0.895431 16 2 16H10C11.1046 16 12 15.1046 12 14V6C12 4.89543 11.1046 4 10 4H2ZM8 6.99994C8.55228 6.99994 9 7.44765 9 7.99994V10.9999C9 11.5522 8.55228 11.9999 8 11.9999C7.44772 11.9999 7 11.5522 7 10.9999V10.4142L4.70711 12.7071C4.31658 13.0976 3.68342 13.0976 3.29289 12.7071C2.90237 12.3166 2.90237 11.6834 3.29289 11.2929L5.58582 8.99994H5C4.44772 8.99994 4 8.55222 4 7.99994C4 7.44765 4.44772 6.99994 5 6.99994H8Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'newtab_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M5 2C5 1.44772 5.44772 1 6 1H13C14.1046 1 15 1.89543 15 3V10C15 10.5523 14.5523 11 14 11C13.4477 11 13 10.5523 13 10V4C13 3.44772 12.5523 3 12 3H6C5.44772 3 5 2.55228 5 2ZM10 7C10 6.44772 9.55229 6 9 6H3C2.44772 6 2 6.44772 2 7L2 13C2 13.5523 2.44772 14 3 14H9C9.55229 14 10 13.5523 10 13V7ZM2 4C0.895431 4 0 4.89543 0 6V14C0 15.1046 0.895431 16 2 16H10C11.1046 16 12 15.1046 12 14V6C12 4.89543 11.1046 4 10 4H2ZM8 6.99994C8.55228 6.99994 9 7.44765 9 7.99994V10.9999C9 11.5522 8.55228 11.9999 8 11.9999C7.44772 11.9999 7 11.5522 7 10.9999V10.4142L4.70711 12.7071C4.31658 13.0976 3.68342 13.0976 3.29289 12.7071C2.90237 12.3166 2.90237 11.6834 3.29289 11.2929L5.58582 8.99994H5C4.44772 8.99994 4 8.55222 4 7.99994C4 7.44765 4.44772 6.99994 5 6.99994H8Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
