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

export const NetworkNormalOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3 2.75C1.89543 2.75 1 3.64543 1 4.75C1 5.85457 1.89543 6.75 3 6.75C4.10457 6.75 5 5.85457 5 4.75C5 3.64543 4.10457 2.75 3 2.75ZM2 4.75C2 4.19772 2.44772 3.75 3 3.75C3.55228 3.75 4 4.19772 4 4.75C4 5.30228 3.55228 5.75 3 5.75C2.44772 5.75 2 5.30228 2 4.75Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M6.25 2.75C5.83579 2.75 5.5 3.08579 5.5 3.5C5.5 3.91421 5.83579 4.25 6.25 4.25C8.32107 4.25 10 5.92893 10 8C10 8.41421 10.3358 8.75 10.75 8.75C10.762 8.75 10.7739 8.74972 10.7857 8.74916C10.7975 8.74972 10.8095 8.75 10.8214 8.75H12C12.8284 8.75 13.5 9.42157 13.5 10.25C13.5 11.0784 12.8284 11.75 12 11.75H6.25C4.17893 11.75 2.5 10.0711 2.5 8C2.5 7.58579 2.16421 7.25 1.75 7.25C1.33579 7.25 1 7.58579 1 8C1 10.8995 3.3505 13.25 6.25 13.25H12C13.6569 13.25 15 11.9069 15 10.25C15 8.6967 13.8195 7.41912 12.3067 7.26549C12.2059 7.25525 12.1036 7.25 12 7.25H11.4468C11.0829 4.70578 8.89485 2.75 6.25 2.75Z" fill={ colors[0] }/>

  </>,
  name: 'network_normal_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M3 2.75C1.89543 2.75 1 3.64543 1 4.75C1 5.85457 1.89543 6.75 3 6.75C4.10457 6.75 5 5.85457 5 4.75C5 3.64543 4.10457 2.75 3 2.75ZM2 4.75C2 4.19772 2.44772 3.75 3 3.75C3.55228 3.75 4 4.19772 4 4.75C4 5.30228 3.55228 5.75 3 5.75C2.44772 5.75 2 5.30228 2 4.75Z', 'M6.25 2.75C5.83579 2.75 5.5 3.08579 5.5 3.5C5.5 3.91421 5.83579 4.25 6.25 4.25C8.32107 4.25 10 5.92893 10 8C10 8.41421 10.3358 8.75 10.75 8.75C10.762 8.75 10.7739 8.74972 10.7857 8.74916C10.7975 8.74972 10.8095 8.75 10.8214 8.75H12C12.8284 8.75 13.5 9.42157 13.5 10.25C13.5 11.0784 12.8284 11.75 12 11.75H6.25C4.17893 11.75 2.5 10.0711 2.5 8C2.5 7.58579 2.16421 7.25 1.75 7.25C1.33579 7.25 1 7.58579 1 8C1 10.8995 3.3505 13.25 6.25 13.25H12C13.6569 13.25 15 11.9069 15 10.25C15 8.6967 13.8195 7.41912 12.3067 7.26549C12.2059 7.25525 12.1036 7.25 12 7.25H11.4468C11.0829 4.70578 8.89485 2.75 6.25 2.75Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
