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

export const AccountOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.00001 1.13288C5.68041 1.13288 3.80001 3.01329 3.80001 5.33288C3.80001 6.4599 4.24391 7.48325 4.96642 8.2376C2.69553 9.35771 1.13334 11.6962 1.13334 14.3995C1.13334 14.9518 1.58105 15.3995 2.13334 15.3995C2.68562 15.3995 3.13334 14.9518 3.13334 14.3995C3.13334 11.7118 5.31222 9.53288 8.00001 9.53288C10.6878 9.53288 12.8667 11.7118 12.8667 14.3995C12.8667 14.9518 13.3144 15.3995 13.8667 15.3995C14.419 15.3995 14.8667 14.9518 14.8667 14.3995C14.8667 11.6962 13.3045 9.35771 11.0336 8.2376C11.7561 7.48325 12.2 6.4599 12.2 5.33288C12.2 3.01329 10.3196 1.13288 8.00001 1.13288ZM8.00001 7.53288C9.21503 7.53288 10.2 6.54791 10.2 5.33288C10.2 4.11785 9.21503 3.13288 8.00001 3.13288C6.78498 3.13288 5.80001 4.11785 5.80001 5.33288C5.80001 6.54791 6.78498 7.53288 8.00001 7.53288Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'account_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M8.00001 1.13288C5.68041 1.13288 3.80001 3.01329 3.80001 5.33288C3.80001 6.4599 4.24391 7.48325 4.96642 8.2376C2.69553 9.35771 1.13334 11.6962 1.13334 14.3995C1.13334 14.9518 1.58105 15.3995 2.13334 15.3995C2.68562 15.3995 3.13334 14.9518 3.13334 14.3995C3.13334 11.7118 5.31222 9.53288 8.00001 9.53288C10.6878 9.53288 12.8667 11.7118 12.8667 14.3995C12.8667 14.9518 13.3144 15.3995 13.8667 15.3995C14.419 15.3995 14.8667 14.9518 14.8667 14.3995C14.8667 11.6962 13.3045 9.35771 11.0336 8.2376C11.7561 7.48325 12.2 6.4599 12.2 5.33288C12.2 3.01329 10.3196 1.13288 8.00001 1.13288ZM8.00001 7.53288C9.21503 7.53288 10.2 6.54791 10.2 5.33288C10.2 4.11785 9.21503 3.13288 8.00001 3.13288C6.78498 3.13288 5.80001 4.11785 5.80001 5.33288C5.80001 6.54791 6.78498 7.53288 8.00001 7.53288Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
