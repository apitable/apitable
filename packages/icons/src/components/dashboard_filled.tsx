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

export const DashboardFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.5 0.5C8.08579 0.5 7.75 0.835786 7.75 1.25L7.75 7.25C7.75 7.66421 8.08579 8 8.5 8H14.5C14.9142 8 15.25 7.66421 15.25 7.25C15.25 6.36358 15.0754 5.48583 14.7362 4.66689C14.397 3.84794 13.8998 3.10382 13.273 2.47703C12.6462 1.85023 11.9021 1.35303 11.0831 1.01381C10.2642 0.674594 9.38642 0.5 8.5 0.5Z" fill={ colors[0] }/>
    <path d="M6.45682 1.17066C6.60884 1.13646 6.75 1.25456 6.75 1.41038V7.75001C6.75 8.44036 7.30964 9.00001 8 9.00001H14.6408C14.793 9.00001 14.9101 9.13501 14.8824 9.28461C14.2791 12.5371 11.4272 15 8 15C4.13401 15 1 11.866 1 8C1 4.66424 3.33329 1.87344 6.45682 1.17066Z" fill={ colors[0] }/>

  </>,
  name: 'dashboard_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8.5 0.5C8.08579 0.5 7.75 0.835786 7.75 1.25L7.75 7.25C7.75 7.66421 8.08579 8 8.5 8H14.5C14.9142 8 15.25 7.66421 15.25 7.25C15.25 6.36358 15.0754 5.48583 14.7362 4.66689C14.397 3.84794 13.8998 3.10382 13.273 2.47703C12.6462 1.85023 11.9021 1.35303 11.0831 1.01381C10.2642 0.674594 9.38642 0.5 8.5 0.5Z', 'M6.45682 1.17066C6.60884 1.13646 6.75 1.25456 6.75 1.41038V7.75001C6.75 8.44036 7.30964 9.00001 8 9.00001H14.6408C14.793 9.00001 14.9101 9.13501 14.8824 9.28461C14.2791 12.5371 11.4272 15 8 15C4.13401 15 1 11.866 1 8C1 4.66424 3.33329 1.87344 6.45682 1.17066Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
