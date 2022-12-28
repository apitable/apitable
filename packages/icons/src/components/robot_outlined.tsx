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

export const RobotOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3 1C1.89543 1 1 1.89543 1 3V6C0.447715 6 0 6.44772 0 7V9C0 9.55229 0.447715 10 1 10V13C1 14.1046 1.89543 15 3 15H13C14.1046 15 15 14.1046 15 13V10C15.5523 10 16 9.55229 16 9V7C16 6.44772 15.5523 6 15 6V3C15 1.89543 14.1046 1 13 1H3ZM3 3L13 3V13H3V3ZM5.5 8C6.05228 8 6.5 7.55228 6.5 7C6.5 6.44772 6.05228 6 5.5 6C4.94772 6 4.5 6.44772 4.5 7C4.5 7.55228 4.94772 8 5.5 8ZM11.5 7C11.5 7.55228 11.0523 8 10.5 8C9.94771 8 9.5 7.55228 9.5 7C9.5 6.44772 9.94771 6 10.5 6C11.0523 6 11.5 6.44772 11.5 7ZM6.99764 9.43909C6.68786 9.16412 6.21382 9.19234 5.93885 9.50212C5.66388 9.8119 5.6921 10.2859 6.00188 10.5609C6.50764 11.0098 7.24167 11.25 7.99976 11.25C8.75784 11.25 9.49187 11.0098 9.99763 10.5609C10.3074 10.2859 10.3356 9.8119 10.0607 9.50212C9.78569 9.19234 9.31166 9.16412 9.00188 9.43909C8.82355 9.59738 8.46842 9.75 7.99976 9.75C7.53109 9.75 7.17596 9.59738 6.99764 9.43909Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'robot_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M3 1C1.89543 1 1 1.89543 1 3V6C0.447715 6 0 6.44772 0 7V9C0 9.55229 0.447715 10 1 10V13C1 14.1046 1.89543 15 3 15H13C14.1046 15 15 14.1046 15 13V10C15.5523 10 16 9.55229 16 9V7C16 6.44772 15.5523 6 15 6V3C15 1.89543 14.1046 1 13 1H3ZM3 3L13 3V13H3V3ZM5.5 8C6.05228 8 6.5 7.55228 6.5 7C6.5 6.44772 6.05228 6 5.5 6C4.94772 6 4.5 6.44772 4.5 7C4.5 7.55228 4.94772 8 5.5 8ZM11.5 7C11.5 7.55228 11.0523 8 10.5 8C9.94771 8 9.5 7.55228 9.5 7C9.5 6.44772 9.94771 6 10.5 6C11.0523 6 11.5 6.44772 11.5 7ZM6.99764 9.43909C6.68786 9.16412 6.21382 9.19234 5.93885 9.50212C5.66388 9.8119 5.6921 10.2859 6.00188 10.5609C6.50764 11.0098 7.24167 11.25 7.99976 11.25C8.75784 11.25 9.49187 11.0098 9.99763 10.5609C10.3074 10.2859 10.3356 9.8119 10.0607 9.50212C9.78569 9.19234 9.31166 9.16412 9.00188 9.43909C8.82355 9.59738 8.46842 9.75 7.99976 9.75C7.53109 9.75 7.17596 9.59738 6.99764 9.43909Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
