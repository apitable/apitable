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

export const AdviseOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7 4.25C6.58579 4.25 6.25 4.58579 6.25 5C6.25 5.41421 6.58579 5.75 7 5.75H9C9.41421 5.75 9.75 5.41421 9.75 5C9.75 4.58579 9.41421 4.25 9 4.25H7Z" fill={ colors[0] }/>
    <path d="M3.25 2.75C3.25 2.05964 3.80964 1.5 4.5 1.5H11.5C12.1904 1.5 12.75 2.05964 12.75 2.75V6.81999L12.8167 6.79534C13.633 6.49368 14.5 7.09761 14.5 7.96783V13.25C14.5 13.9404 13.9404 14.5 13.25 14.5H2.75C2.05964 14.5 1.5 13.9404 1.5 13.25V7.96783C1.5 7.09761 2.36705 6.49368 3.18331 6.79534L3.25 6.81999V2.75ZM11.25 3V7.37433L8 8.57542L4.75 7.37433V3H11.25ZM3 8.32675V13H13V8.32675L8.43331 10.0144C8.15368 10.1178 7.84632 10.1178 7.56669 10.0144L3 8.32675Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'advise_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M7 4.25C6.58579 4.25 6.25 4.58579 6.25 5C6.25 5.41421 6.58579 5.75 7 5.75H9C9.41421 5.75 9.75 5.41421 9.75 5C9.75 4.58579 9.41421 4.25 9 4.25H7Z', 'M3.25 2.75C3.25 2.05964 3.80964 1.5 4.5 1.5H11.5C12.1904 1.5 12.75 2.05964 12.75 2.75V6.81999L12.8167 6.79534C13.633 6.49368 14.5 7.09761 14.5 7.96783V13.25C14.5 13.9404 13.9404 14.5 13.25 14.5H2.75C2.05964 14.5 1.5 13.9404 1.5 13.25V7.96783C1.5 7.09761 2.36705 6.49368 3.18331 6.79534L3.25 6.81999V2.75ZM11.25 3V7.37433L8 8.57542L4.75 7.37433V3H11.25ZM3 8.32675V13H13V8.32675L8.43331 10.0144C8.15368 10.1178 7.84632 10.1178 7.56669 10.0144L3 8.32675Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
