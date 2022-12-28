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

export const ViewGridFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5 13H2C1.44772 13 1 13.4477 1 14C1 14.5523 1.44772 15 2 15H5V13Z" fill={ colors[0] }/>
    <path d="M7 15H14C14.5523 15 15 14.5523 15 14C15 13.4477 14.5523 13 14 13H7V15Z" fill={ colors[0] }/>
    <path d="M5 9H2C1.44772 9 1 9.44772 1 10C1 10.5523 1.44772 11 2 11H5V9Z" fill={ colors[0] }/>
    <path d="M7 11H14C14.5523 11 15 10.5523 15 10C15 9.44772 14.5523 9 14 9H7V11Z" fill={ colors[0] }/>
    <path d="M5 5H2C1.44772 5 1 5.44772 1 6C1 6.55228 1.44772 7 2 7H5V5Z" fill={ colors[0] }/>
    <path d="M7 7H14C14.5523 7 15 6.55228 15 6C15 5.44772 14.5523 5 14 5H7V7Z" fill={ colors[0] }/>
    <path d="M2 1C1.44772 1 1 1.44772 1 2C1 2.55228 1.44772 3 2 3H5V1H2Z" fill={ colors[0] }/>
    <path d="M7 1V3H14C14.5523 3 15 2.55228 15 2C15 1.44772 14.5523 1 14 1H7Z" fill={ colors[0] }/>
    <path opacity="0.6" d="M7 1V15H5V1H7Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M2 1C2.55228 1 3 1.44772 3 2L3 14C3 14.5523 2.55228 15 2 15C1.44771 15 0.999999 14.5523 0.999999 14L1 2C1 1.44772 1.44772 1 2 1Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M14 1C14.5523 1 15 1.44772 15 2L15 14C15 14.5523 14.5523 15 14 15C13.4477 15 13 14.5523 13 14L13 2C13 1.44772 13.4477 1 14 1Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'view_grid_filled',
  defaultColors: ['#7B67EE'],
  colorful: false,
  allPathData: ['M5 13H2C1.44772 13 1 13.4477 1 14C1 14.5523 1.44772 15 2 15H5V13Z', 'M7 15H14C14.5523 15 15 14.5523 15 14C15 13.4477 14.5523 13 14 13H7V15Z', 'M5 9H2C1.44772 9 1 9.44772 1 10C1 10.5523 1.44772 11 2 11H5V9Z', 'M7 11H14C14.5523 11 15 10.5523 15 10C15 9.44772 14.5523 9 14 9H7V11Z', 'M5 5H2C1.44772 5 1 5.44772 1 6C1 6.55228 1.44772 7 2 7H5V5Z', 'M7 7H14C14.5523 7 15 6.55228 15 6C15 5.44772 14.5523 5 14 5H7V7Z', 'M2 1C1.44772 1 1 1.44772 1 2C1 2.55228 1.44772 3 2 3H5V1H2Z', 'M7 1V3H14C14.5523 3 15 2.55228 15 2C15 1.44772 14.5523 1 14 1H7Z', 'M7 1V15H5V1H7Z', 'M2 1C2.55228 1 3 1.44772 3 2L3 14C3 14.5523 2.55228 15 2 15C1.44771 15 0.999999 14.5523 0.999999 14L1 2C1 1.44772 1.44772 1 2 1Z', 'M14 1C14.5523 1 15 1.44772 15 2L15 14C15 14.5523 14.5523 15 14 15C13.4477 15 13 14.5523 13 14L13 2C13 1.44772 13.4477 1 14 1Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
