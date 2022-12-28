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

export const MultiplemembersFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3 4C3 2.89543 3.89543 2 5 2C6.10457 2 7 2.89543 7 4C7 5.10457 6.10457 6 5 6C3.89543 6 3 5.10457 3 4ZM10 5.5C10 4.67157 10.6716 4 11.5 4C12.3284 4 13 4.67157 13 5.5C13 6.32843 12.3284 7 11.5 7C10.6716 7 10 6.32843 10 5.5ZM2 10C2 8.34315 3.34315 7 5 7C6.65685 7 8 8.34315 8 10V13.8C8 13.9105 7.91046 14 7.8 14H2.2C2.08954 14 2 13.9105 2 13.8V10ZM11.5 8C10.1193 8 9 9.11929 9 10.5V13.8C9 13.9105 9.08954 14 9.2 14H13.8C13.9105 14 14 13.9105 14 13.8V10.5C14 9.11929 12.8807 8 11.5 8Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'multiplemembers_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M3 4C3 2.89543 3.89543 2 5 2C6.10457 2 7 2.89543 7 4C7 5.10457 6.10457 6 5 6C3.89543 6 3 5.10457 3 4ZM10 5.5C10 4.67157 10.6716 4 11.5 4C12.3284 4 13 4.67157 13 5.5C13 6.32843 12.3284 7 11.5 7C10.6716 7 10 6.32843 10 5.5ZM2 10C2 8.34315 3.34315 7 5 7C6.65685 7 8 8.34315 8 10V13.8C8 13.9105 7.91046 14 7.8 14H2.2C2.08954 14 2 13.9105 2 13.8V10ZM11.5 8C10.1193 8 9 9.11929 9 10.5V13.8C9 13.9105 9.08954 14 9.2 14H13.8C13.9105 14 14 13.9105 14 13.8V10.5C14 9.11929 12.8807 8 11.5 8Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
