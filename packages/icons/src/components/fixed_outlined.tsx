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

export const FixedOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M15.3 6.39999L10.6 1.69999C10.4 1.49999 10.1 1.39999 9.80002 1.39999C9.50002 1.39999 9.20002 1.59999 9.00002 1.89999L7.00002 4.89999L2.80002 5.89999C2.50002 5.99999 2.20002 6.29999 2.10002 6.59999C2.00002 6.99999 2.10002 7.29999 2.30002 7.59999L5.10002 10.4L3.70002 11.8C3.30002 12.2 3.30002 12.8 3.70002 13.2C4.10002 13.6 4.70002 13.6 5.10002 13.2L6.50002 11.8L9.30002 14.6C9.50002 14.8 9.70002 14.9 10 14.9C10.1 14.9 10.2 14.9 10.3 14.9C10.6 14.8 10.9 14.5 11 14.2L12 9.99999L15.1 7.99999C15.4 7.79999 15.5 7.59999 15.5 7.29999C15.6 6.89999 15.5 6.59999 15.3 6.39999ZM10.6 8.49999C10.4 8.59999 10.2 8.89999 10.2 9.09999L9.60002 12L5.00002 7.39999L7.80002 6.69999C8.10002 6.59999 8.30002 6.49999 8.40002 6.29999L10 3.99999L13 6.99999L10.6 8.49999Z" fill={ colors[0] }/>

  </>,
  name: 'fixed_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M15.3 6.39999L10.6 1.69999C10.4 1.49999 10.1 1.39999 9.80002 1.39999C9.50002 1.39999 9.20002 1.59999 9.00002 1.89999L7.00002 4.89999L2.80002 5.89999C2.50002 5.99999 2.20002 6.29999 2.10002 6.59999C2.00002 6.99999 2.10002 7.29999 2.30002 7.59999L5.10002 10.4L3.70002 11.8C3.30002 12.2 3.30002 12.8 3.70002 13.2C4.10002 13.6 4.70002 13.6 5.10002 13.2L6.50002 11.8L9.30002 14.6C9.50002 14.8 9.70002 14.9 10 14.9C10.1 14.9 10.2 14.9 10.3 14.9C10.6 14.8 10.9 14.5 11 14.2L12 9.99999L15.1 7.99999C15.4 7.79999 15.5 7.59999 15.5 7.29999C15.6 6.89999 15.5 6.59999 15.3 6.39999ZM10.6 8.49999C10.4 8.59999 10.2 8.89999 10.2 9.09999L9.60002 12L5.00002 7.39999L7.80002 6.69999C8.10002 6.59999 8.30002 6.49999 8.40002 6.29999L10 3.99999L13 6.99999L10.6 8.49999Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
