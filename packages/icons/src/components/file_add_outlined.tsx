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

export const FileAddOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.75 7C8.75 6.58579 8.41421 6.25 8 6.25C7.58579 6.25 7.25 6.58579 7.25 7V8.5H5.75C5.33579 8.5 5 8.83579 5 9.25C5 9.66421 5.33579 10 5.75 10H7.25V11.5C7.25 11.9142 7.58579 12.25 8 12.25C8.41421 12.25 8.75 11.9142 8.75 11.5V10H10.25C10.6642 10 11 9.66421 11 9.25C11 8.83579 10.6642 8.5 10.25 8.5H8.75V7Z" fill={ colors[0] }/>
    <path d="M3.25 1C2.55964 1 2 1.55964 2 2.25V13.75C2 14.4404 2.55964 15 3.25 15H12.75C13.4404 15 14 14.4404 14 13.75V5.07616C14 4.75346 13.8752 4.44327 13.6517 4.21049L10.9386 1.38434C10.7029 1.1388 10.3773 1 10.0369 1H3.25ZM3.5 13.5V2.5H9V5C9 5.55229 9.44772 6 10 6H12.5V13.5H3.5ZM11.8503 4.5L10.5 3.0934V4.5H11.8503Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'file_add_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8.75 7C8.75 6.58579 8.41421 6.25 8 6.25C7.58579 6.25 7.25 6.58579 7.25 7V8.5H5.75C5.33579 8.5 5 8.83579 5 9.25C5 9.66421 5.33579 10 5.75 10H7.25V11.5C7.25 11.9142 7.58579 12.25 8 12.25C8.41421 12.25 8.75 11.9142 8.75 11.5V10H10.25C10.6642 10 11 9.66421 11 9.25C11 8.83579 10.6642 8.5 10.25 8.5H8.75V7Z', 'M3.25 1C2.55964 1 2 1.55964 2 2.25V13.75C2 14.4404 2.55964 15 3.25 15H12.75C13.4404 15 14 14.4404 14 13.75V5.07616C14 4.75346 13.8752 4.44327 13.6517 4.21049L10.9386 1.38434C10.7029 1.1388 10.3773 1 10.0369 1H3.25ZM3.5 13.5V2.5H9V5C9 5.55229 9.44772 6 10 6H12.5V13.5H3.5ZM11.8503 4.5L10.5 3.0934V4.5H11.8503Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
