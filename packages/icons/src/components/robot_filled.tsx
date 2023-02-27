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

export const RobotFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1.5 2.75C1.5 2.05964 2.05964 1.5 2.75 1.5H13.25C13.9404 1.5 14.5 2.05964 14.5 2.75V6C14.9142 6 15.25 6.33579 15.25 6.75V9.25C15.25 9.66421 14.9142 10 14.5 10V13.25C14.5 13.9404 13.9404 14.5 13.25 14.5H2.75C2.05964 14.5 1.5 13.9404 1.5 13.25V10C1.08579 10 0.75 9.66421 0.75 9.25V6.75C0.75 6.33579 1.08579 6 1.5 6V2.75ZM6.5 7C6.5 7.55228 6.05228 8 5.5 8C4.94772 8 4.5 7.55228 4.5 7C4.5 6.44772 4.94772 6 5.5 6C6.05228 6 6.5 6.44772 6.5 7ZM10.5 8C11.0523 8 11.5 7.55228 11.5 7C11.5 6.44772 11.0523 6 10.5 6C9.94771 6 9.5 6.44772 9.5 7C9.5 7.55228 9.94771 8 10.5 8ZM5.93885 9.50212C6.21382 9.19234 6.68786 9.16412 6.99764 9.43909C7.17596 9.59738 7.53109 9.75 7.99976 9.75C8.46842 9.75 8.82355 9.59738 9.00188 9.43909C9.31166 9.16412 9.78569 9.19234 10.0607 9.50212C10.3356 9.8119 10.3074 10.2859 9.99763 10.5609C9.49187 11.0098 8.75784 11.25 7.99976 11.25C7.24167 11.25 6.50764 11.0098 6.00188 10.5609C5.6921 10.2859 5.66388 9.8119 5.93885 9.50212Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'robot_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M1.5 2.75C1.5 2.05964 2.05964 1.5 2.75 1.5H13.25C13.9404 1.5 14.5 2.05964 14.5 2.75V6C14.9142 6 15.25 6.33579 15.25 6.75V9.25C15.25 9.66421 14.9142 10 14.5 10V13.25C14.5 13.9404 13.9404 14.5 13.25 14.5H2.75C2.05964 14.5 1.5 13.9404 1.5 13.25V10C1.08579 10 0.75 9.66421 0.75 9.25V6.75C0.75 6.33579 1.08579 6 1.5 6V2.75ZM6.5 7C6.5 7.55228 6.05228 8 5.5 8C4.94772 8 4.5 7.55228 4.5 7C4.5 6.44772 4.94772 6 5.5 6C6.05228 6 6.5 6.44772 6.5 7ZM10.5 8C11.0523 8 11.5 7.55228 11.5 7C11.5 6.44772 11.0523 6 10.5 6C9.94771 6 9.5 6.44772 9.5 7C9.5 7.55228 9.94771 8 10.5 8ZM5.93885 9.50212C6.21382 9.19234 6.68786 9.16412 6.99764 9.43909C7.17596 9.59738 7.53109 9.75 7.99976 9.75C8.46842 9.75 8.82355 9.59738 9.00188 9.43909C9.31166 9.16412 9.78569 9.19234 10.0607 9.50212C10.3356 9.8119 10.3074 10.2859 9.99763 10.5609C9.49187 11.0098 8.75784 11.25 7.99976 11.25C7.24167 11.25 6.50764 11.0098 6.00188 10.5609C5.6921 10.2859 5.66388 9.8119 5.93885 9.50212Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
