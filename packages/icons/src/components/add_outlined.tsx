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

export const AddOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7.25 13.75C7.25 14.1642 7.58579 14.5 8 14.5C8.41421 14.5 8.75 14.1642 8.75 13.75V8.75H13.75C14.1642 8.75 14.5 8.41421 14.5 8C14.5 7.58579 14.1642 7.25 13.75 7.25H8.75V2.25C8.75 1.83579 8.41421 1.5 8 1.5C7.58579 1.5 7.25 1.83579 7.25 2.25V7.25H2.25C1.83579 7.25 1.5 7.58579 1.5 8C1.5 8.41421 1.83579 8.75 2.25 8.75H7.25V13.75Z" fill={ colors[0] }/>

  </>,
  name: 'add_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M7.25 13.75C7.25 14.1642 7.58579 14.5 8 14.5C8.41421 14.5 8.75 14.1642 8.75 13.75V8.75H13.75C14.1642 8.75 14.5 8.41421 14.5 8C14.5 7.58579 14.1642 7.25 13.75 7.25H8.75V2.25C8.75 1.83579 8.41421 1.5 8 1.5C7.58579 1.5 7.25 1.83579 7.25 2.25V7.25H2.25C1.83579 7.25 1.5 7.58579 1.5 8C1.5 8.41421 1.83579 8.75 2.25 8.75H7.25V13.75Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
