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

export const RankDownFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5 1.75003C5 1.33582 4.66421 1.00003 4.25 1.00003C3.83579 1.00003 3.5 1.33582 3.5 1.75003V14.25C3.5 14.6642 3.83579 15 4.25 15C4.66421 15 5 14.6642 5 14.25V1.75003Z" fill={ colors[0] }/>
    <path d="M9.75 1.75C9.75 1.33579 9.41421 1 9 1C8.58579 1 8.25 1.33579 8.25 1.75V14.25C8.25 14.5533 8.43273 14.8268 8.71299 14.9429C8.99324 15.059 9.31583 14.9948 9.53033 14.7803L13.1553 11.1553C13.4482 10.8624 13.4482 10.3876 13.1553 10.0947C12.8624 9.80178 12.3876 9.80178 12.0947 10.0947L9.75 12.4393V1.75Z" fill={ colors[0] }/>

  </>,
  name: 'rank_down_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M5 1.75003C5 1.33582 4.66421 1.00003 4.25 1.00003C3.83579 1.00003 3.5 1.33582 3.5 1.75003V14.25C3.5 14.6642 3.83579 15 4.25 15C4.66421 15 5 14.6642 5 14.25V1.75003Z', 'M9.75 1.75C9.75 1.33579 9.41421 1 9 1C8.58579 1 8.25 1.33579 8.25 1.75V14.25C8.25 14.5533 8.43273 14.8268 8.71299 14.9429C8.99324 15.059 9.31583 14.9948 9.53033 14.7803L13.1553 11.1553C13.4482 10.8624 13.4482 10.3876 13.1553 10.0947C12.8624 9.80178 12.3876 9.80178 12.0947 10.0947L9.75 12.4393V1.75Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
