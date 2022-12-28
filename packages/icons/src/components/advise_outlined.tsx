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
    <path d="M13 4L3 4.00001V12V12.882L4.55279 12.1056C4.69164 12.0361 4.84475 12 5 12H13V4ZM3 2.00001L13 2C14.1046 2 15 2.89543 15 4V12C15 13.1046 14.1046 14 13 14H5.23607L2.44721 15.3944C2.13723 15.5494 1.76909 15.5329 1.47427 15.3506C1.17945 15.1684 1 14.8466 1 14.5V12V4.00001C1 2.89544 1.89543 2.00001 3 2.00001ZM5 7C5 6.44771 5.44772 6 6 6C6.55228 6 7 6.44771 7 7V9C7 9.55228 6.55228 10 6 10C5.44772 10 5 9.55228 5 9V7ZM10 6C9.44772 6 9 6.44771 9 7V9C9 9.55228 9.44772 10 10 10C10.5523 10 11 9.55228 11 9V7C11 6.44771 10.5523 6 10 6Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'advise_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M13 4L3 4.00001V12V12.882L4.55279 12.1056C4.69164 12.0361 4.84475 12 5 12H13V4ZM3 2.00001L13 2C14.1046 2 15 2.89543 15 4V12C15 13.1046 14.1046 14 13 14H5.23607L2.44721 15.3944C2.13723 15.5494 1.76909 15.5329 1.47427 15.3506C1.17945 15.1684 1 14.8466 1 14.5V12V4.00001C1 2.89544 1.89543 2.00001 3 2.00001ZM5 7C5 6.44771 5.44772 6 6 6C6.55228 6 7 6.44771 7 7V9C7 9.55228 6.55228 10 6 10C5.44772 10 5 9.55228 5 9V7ZM10 6C9.44772 6 9 6.44771 9 7V9C9 9.55228 9.44772 10 10 10C10.5523 10 11 9.55228 11 9V7C11 6.44771 10.5523 6 10 6Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
