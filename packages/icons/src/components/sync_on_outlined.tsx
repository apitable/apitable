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

export const SyncOnOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2.25002 7C1.83581 7 1.50002 6.66421 1.50002 6.25C1.50002 5.83579 1.83581 5.5 2.25002 5.5L11.9394 5.5L9.21969 2.78033C8.9268 2.48744 8.9268 2.01256 9.21969 1.71967C9.51258 1.42678 9.98746 1.42678 10.2804 1.71967L14.2804 5.71967C14.4949 5.93417 14.559 6.25676 14.4429 6.53701C14.3268 6.81727 14.0534 7 13.75 7L2.25002 7Z" fill={ colors[0] }/>
    <path d="M2.25002 9L13.75 9C14.1642 9 14.5 9.33579 14.5 9.75C14.5 10.1642 14.1642 10.5 13.75 10.5H4.06068L6.78035 13.2197C7.07325 13.5126 7.07325 13.9874 6.78035 14.2803C6.48746 14.5732 6.01259 14.5732 5.71969 14.2803L1.71969 10.2803C1.50519 10.0658 1.44103 9.74324 1.55711 9.46299C1.6732 9.18273 1.94667 9 2.25002 9Z" fill={ colors[0] }/>

  </>,
  name: 'sync_on_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M2.25002 7C1.83581 7 1.50002 6.66421 1.50002 6.25C1.50002 5.83579 1.83581 5.5 2.25002 5.5L11.9394 5.5L9.21969 2.78033C8.9268 2.48744 8.9268 2.01256 9.21969 1.71967C9.51258 1.42678 9.98746 1.42678 10.2804 1.71967L14.2804 5.71967C14.4949 5.93417 14.559 6.25676 14.4429 6.53701C14.3268 6.81727 14.0534 7 13.75 7L2.25002 7Z', 'M2.25002 9L13.75 9C14.1642 9 14.5 9.33579 14.5 9.75C14.5 10.1642 14.1642 10.5 13.75 10.5H4.06068L6.78035 13.2197C7.07325 13.5126 7.07325 13.9874 6.78035 14.2803C6.48746 14.5732 6.01259 14.5732 5.71969 14.2803L1.71969 10.2803C1.50519 10.0658 1.44103 9.74324 1.55711 9.46299C1.6732 9.18273 1.94667 9 2.25002 9Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
