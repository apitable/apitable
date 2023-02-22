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

export const AdviseOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M6.75 4.25C6.33579 4.25 6 4.58579 6 5C6 5.41421 6.33579 5.75 6.75 5.75H9.25C9.66421 5.75 10 5.41421 10 5C10 4.58579 9.66421 4.25 9.25 4.25H6.75Z" fill={ colors[0] }/>
    <path d="M3.25 2.75V6.56999L3.18331 6.54534C2.36705 6.24368 1.5 6.84761 1.5 7.71783V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V7.71783C14.5 6.84761 13.633 6.24368 12.8167 6.54534L12.75 6.56999V2.75C12.75 2.05964 12.1904 1.5 11.5 1.5H4.5C3.80965 1.5 3.25 2.05964 3.25 2.75ZM4.75 3V7.12433L8 8.32542L11.25 7.12433V3H4.75ZM3 8.07675L7.56669 9.76444C7.84632 9.86778 8.15368 9.86778 8.43331 9.76444L13 8.07675V13H3V8.07675Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'advise_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M6.75 4.25C6.33579 4.25 6 4.58579 6 5C6 5.41421 6.33579 5.75 6.75 5.75H9.25C9.66421 5.75 10 5.41421 10 5C10 4.58579 9.66421 4.25 9.25 4.25H6.75Z', 'M3.25 2.75V6.56999L3.18331 6.54534C2.36705 6.24368 1.5 6.84761 1.5 7.71783V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V7.71783C14.5 6.84761 13.633 6.24368 12.8167 6.54534L12.75 6.56999V2.75C12.75 2.05964 12.1904 1.5 11.5 1.5H4.5C3.80965 1.5 3.25 2.05964 3.25 2.75ZM4.75 3V7.12433L8 8.32542L11.25 7.12433V3H4.75ZM3 8.07675L7.56669 9.76444C7.84632 9.86778 8.15368 9.86778 8.43331 9.76444L13 8.07675V13H3V8.07675Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
