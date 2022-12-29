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

export const AdviseSmallOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M13 3.75L3 3.75001C2.86193 3.75001 2.75 3.86194 2.75 4.00001V12V13.2865L4.66459 12.3292C4.76873 12.2771 4.88357 12.25 5 12.25H13C13.1381 12.25 13.25 12.1381 13.25 12V4C13.25 3.86193 13.1381 3.75 13 3.75ZM3 2.25001L13 2.25C13.9665 2.25 14.75 3.0335 14.75 4V12C14.75 12.9665 13.9665 13.75 13 13.75H5.17705L2.33541 15.1708C2.10292 15.2871 1.82681 15.2746 1.6057 15.138C1.38459 15.0013 1.25 14.7599 1.25 14.5V12V4.00001C1.25 3.03351 2.0335 2.25001 3 2.25001ZM5 7C5 6.44771 5.44772 6 6 6C6.55228 6 7 6.44771 7 7V9C7 9.55228 6.55228 10 6 10C5.44772 10 5 9.55228 5 9V7ZM10 6C9.44772 6 9 6.44771 9 7V9C9 9.55228 9.44772 10 10 10C10.5523 10 11 9.55228 11 9V7C11 6.44771 10.5523 6 10 6Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'advise_small_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M13 3.75L3 3.75001C2.86193 3.75001 2.75 3.86194 2.75 4.00001V12V13.2865L4.66459 12.3292C4.76873 12.2771 4.88357 12.25 5 12.25H13C13.1381 12.25 13.25 12.1381 13.25 12V4C13.25 3.86193 13.1381 3.75 13 3.75ZM3 2.25001L13 2.25C13.9665 2.25 14.75 3.0335 14.75 4V12C14.75 12.9665 13.9665 13.75 13 13.75H5.17705L2.33541 15.1708C2.10292 15.2871 1.82681 15.2746 1.6057 15.138C1.38459 15.0013 1.25 14.7599 1.25 14.5V12V4.00001C1.25 3.03351 2.0335 2.25001 3 2.25001ZM5 7C5 6.44771 5.44772 6 6 6C6.55228 6 7 6.44771 7 7V9C7 9.55228 6.55228 10 6 10C5.44772 10 5 9.55228 5 9V7ZM10 6C9.44772 6 9 6.44771 9 7V9C9 9.55228 9.44772 10 10 10C10.5523 10 11 9.55228 11 9V7C11 6.44771 10.5523 6 10 6Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
