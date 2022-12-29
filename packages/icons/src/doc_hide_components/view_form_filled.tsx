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

export const ViewFormFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M14 15C14.5523 15 15 14.5523 15 14V3H13V14C13 14.5523 13.4477 15 14 15V15Z" fill={ colors[0] }/>
    <path d="M15 6C15 5.44771 14.5523 5 14 5L2 5C1.44772 5 1 5.44771 1 6V6C1 6.55228 1.44772 7 2 7L14 7C14.5523 7 15 6.55228 15 6V6Z" fill={ colors[0] }/>
    <path d="M6 15C6.55228 15 7 14.5523 7 14L7 3L5 3L5 14C5 14.5523 5.44772 15 6 15V15Z" fill={ colors[0] }/>
    <path d="M10 15C10.5523 15 11 14.5523 11 14L11 3L9 3L9 14C9 14.5523 9.44772 15 10 15V15Z" fill={ colors[0] }/>
    <path d="M15 10C15 9.44772 14.5523 9 14 9L2 9C1.44772 9 1 9.44772 1 10V10C1 10.5523 1.44772 11 2 11L14 11C14.5523 11 15 10.5523 15 10V10Z" fill={ colors[0] }/>
    <path d="M2 15C2.55228 15 3 14.5523 3 14L3 3H1L1 14C1 14.5523 1.44772 15 2 15V15Z" fill={ colors[0] }/>
    <rect width="2" height="14" rx="1" transform="matrix(0 -1 -1 0 15 15)" fill={ colors[0] }/>
    <path opacity="0.6" d="M15 2C15 1.44772 14.5523 1 14 1L2 0.999999C1.44772 0.999999 1 1.44771 1 2L1 3L15 3L15 2Z" fill={ colors[0] }/>

  </>,
  name: 'view_form_filled',
  defaultColors: ['#7B67EE'],
  colorful: false,
  allPathData: ['M14 15C14.5523 15 15 14.5523 15 14V3H13V14C13 14.5523 13.4477 15 14 15V15Z', 'M15 6C15 5.44771 14.5523 5 14 5L2 5C1.44772 5 1 5.44771 1 6V6C1 6.55228 1.44772 7 2 7L14 7C14.5523 7 15 6.55228 15 6V6Z', 'M6 15C6.55228 15 7 14.5523 7 14L7 3L5 3L5 14C5 14.5523 5.44772 15 6 15V15Z', 'M10 15C10.5523 15 11 14.5523 11 14L11 3L9 3L9 14C9 14.5523 9.44772 15 10 15V15Z', 'M15 10C15 9.44772 14.5523 9 14 9L2 9C1.44772 9 1 9.44772 1 10V10C1 10.5523 1.44772 11 2 11L14 11C14.5523 11 15 10.5523 15 10V10Z', 'M2 15C2.55228 15 3 14.5523 3 14L3 3H1L1 14C1 14.5523 1.44772 15 2 15V15Z', 'M15 2C15 1.44772 14.5523 1 14 1L2 0.999999C1.44772 0.999999 1 1.44771 1 2L1 3L15 3L15 2Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
