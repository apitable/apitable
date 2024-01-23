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

export const AddCircleOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8 4.25C8.41421 4.25 8.75 4.58579 8.75 5V7.25H11C11.4142 7.25 11.75 7.58579 11.75 8C11.75 8.41421 11.4142 8.75 11 8.75H8.75V11C8.75 11.4142 8.41421 11.75 8 11.75C7.58579 11.75 7.25 11.4142 7.25 11V8.75H5C4.58579 8.75 4.25 8.41421 4.25 8C4.25 7.58579 4.58579 7.25 5 7.25H7.25V5C7.25 4.58579 7.58579 4.25 8 4.25Z" fill={ colors[0] }/>
    <path d="M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1ZM2.5 8C2.5 4.96243 4.96243 2.5 8 2.5C11.0376 2.5 13.5 4.96243 13.5 8C13.5 11.0376 11.0376 13.5 8 13.5C4.96243 13.5 2.5 11.0376 2.5 8Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'add_circle_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8 4.25C8.41421 4.25 8.75 4.58579 8.75 5V7.25H11C11.4142 7.25 11.75 7.58579 11.75 8C11.75 8.41421 11.4142 8.75 11 8.75H8.75V11C8.75 11.4142 8.41421 11.75 8 11.75C7.58579 11.75 7.25 11.4142 7.25 11V8.75H5C4.58579 8.75 4.25 8.41421 4.25 8C4.25 7.58579 4.58579 7.25 5 7.25H7.25V5C7.25 4.58579 7.58579 4.25 8 4.25Z', 'M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1ZM2.5 8C2.5 4.96243 4.96243 2.5 8 2.5C11.0376 2.5 13.5 4.96243 13.5 8C13.5 11.0376 11.0376 13.5 8 13.5C4.96243 13.5 2.5 11.0376 2.5 8Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
