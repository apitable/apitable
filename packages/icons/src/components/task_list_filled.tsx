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

export const TaskListFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1.9732 3.6634C1.68031 3.3705 1.20543 3.3705 0.912541 3.6634C0.619648 3.95629 0.619648 4.43116 0.912541 4.72406L1.96961 5.78113C2.26251 6.07402 2.73738 6.07402 3.03027 5.78113L4.63957 4.17183C4.93247 3.87894 4.93247 3.40407 4.63957 3.11117C4.34668 2.81828 3.87181 2.81828 3.57891 3.11117L2.49994 4.19014L1.9732 3.6634ZM7 4C6.44772 4 6 4.44771 6 5C6 5.55228 6.44772 6 7 6H14C14.5523 6 15 5.55228 15 5C15 4.44771 14.5523 4 14 4H7ZM7 10C6.44772 10 6 10.4477 6 11C6 11.5523 6.44772 12 7 12H14C14.5523 12 15 11.5523 15 11C15 10.4477 14.5523 10 14 10H7ZM4 10.5C4 11.3284 3.32843 12 2.5 12C1.67157 12 1 11.3284 1 10.5C1 9.67157 1.67157 9 2.5 9C3.32843 9 4 9.67157 4 10.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'task_list_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M1.9732 3.6634C1.68031 3.3705 1.20543 3.3705 0.912541 3.6634C0.619648 3.95629 0.619648 4.43116 0.912541 4.72406L1.96961 5.78113C2.26251 6.07402 2.73738 6.07402 3.03027 5.78113L4.63957 4.17183C4.93247 3.87894 4.93247 3.40407 4.63957 3.11117C4.34668 2.81828 3.87181 2.81828 3.57891 3.11117L2.49994 4.19014L1.9732 3.6634ZM7 4C6.44772 4 6 4.44771 6 5C6 5.55228 6.44772 6 7 6H14C14.5523 6 15 5.55228 15 5C15 4.44771 14.5523 4 14 4H7ZM7 10C6.44772 10 6 10.4477 6 11C6 11.5523 6.44772 12 7 12H14C14.5523 12 15 11.5523 15 11C15 10.4477 14.5523 10 14 10H7ZM4 10.5C4 11.3284 3.32843 12 2.5 12C1.67157 12 1 11.3284 1 10.5C1 9.67157 1.67157 9 2.5 9C3.32843 9 4 9.67157 4 10.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
