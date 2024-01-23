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

export const UserGroupFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M10 5.5C10 6.49549 9.5844 7.3939 8.91724 8.03121C10.7204 8.86779 12.017 10.6115 12.2217 12.6767C12.2976 13.4424 11.6681 14 11 14H1.99999C1.33184 14 0.702351 13.4424 0.77827 12.6767C0.983026 10.6115 2.2796 8.86778 4.08276 8.0312C3.4156 7.3939 3 6.49548 3 5.5C3 3.567 4.567 2 6.5 2C8.433 2 10 3.567 10 5.5Z" fill={ colors[0] }/>
    <path d="M10.979 7.72472C11.3125 7.05468 11.5 6.29924 11.5 5.5C11.5 4.59132 11.2576 3.73925 10.8339 3.00493C10.8889 3.00166 10.9442 3 11 3C12.5188 3 13.75 4.23122 13.75 5.75C13.75 6.45156 13.4873 7.09177 13.0549 7.5776C14.3925 8.29834 15.3366 9.62704 15.4948 11.1812C15.5578 11.7997 15.0358 12.25 14.4817 12.25H13.8749C13.4958 10.4051 12.4405 8.80679 10.979 7.72472Z" fill={ colors[0] }/>

  </>,
  name: 'user_group_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M10 5.5C10 6.49549 9.5844 7.3939 8.91724 8.03121C10.7204 8.86779 12.017 10.6115 12.2217 12.6767C12.2976 13.4424 11.6681 14 11 14H1.99999C1.33184 14 0.702351 13.4424 0.77827 12.6767C0.983026 10.6115 2.2796 8.86778 4.08276 8.0312C3.4156 7.3939 3 6.49548 3 5.5C3 3.567 4.567 2 6.5 2C8.433 2 10 3.567 10 5.5Z', 'M10.979 7.72472C11.3125 7.05468 11.5 6.29924 11.5 5.5C11.5 4.59132 11.2576 3.73925 10.8339 3.00493C10.8889 3.00166 10.9442 3 11 3C12.5188 3 13.75 4.23122 13.75 5.75C13.75 6.45156 13.4873 7.09177 13.0549 7.5776C14.3925 8.29834 15.3366 9.62704 15.4948 11.1812C15.5578 11.7997 15.0358 12.25 14.4817 12.25H13.8749C13.4958 10.4051 12.4405 8.80679 10.979 7.72472Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
