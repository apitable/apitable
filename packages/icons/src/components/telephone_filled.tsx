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

export const TelephoneFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M10.3602 14.4537C10.3167 14.456 10.2737 14.4499 10.2317 14.4381C7.95656 13.8006 5.93147 11.731 4.81952 9.87641C3.69728 8.00469 2.9659 5.18037 3.58529 2.86878C3.73595 2.30651 5.56191 1.14687 6.68399 1.07366C6.75715 1.06889 6.8298 1.08457 6.89188 1.12356C7.49371 1.5015 8.50181 2.89655 8.68862 3.95247C8.70001 4.01686 8.69666 4.08323 8.67183 4.14373C8.45505 4.67198 7.62976 5.21056 7.31874 5.45983C7.25476 5.51112 7.21181 5.58329 7.21323 5.66528C7.22342 6.25136 7.97166 7.7264 8.34536 8.33162C8.7067 8.91684 9.25891 9.67606 9.647 9.90302C9.72707 9.94985 9.82332 9.94634 9.90953 9.91212C10.2432 9.77966 10.818 9.48331 11.1889 9.36417C11.2844 9.33352 11.3871 9.34372 11.4762 9.38964C12.5445 9.94007 13.43 11.5197 13.4433 12.4339C13.4444 12.507 13.4227 12.5779 13.384 12.6399C12.7447 13.6636 11.144 14.4134 10.3602 14.4537Z" fill={ colors[0] }/>

  </>,
  name: 'telephone_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M10.3602 14.4537C10.3167 14.456 10.2737 14.4499 10.2317 14.4381C7.95656 13.8006 5.93147 11.731 4.81952 9.87641C3.69728 8.00469 2.9659 5.18037 3.58529 2.86878C3.73595 2.30651 5.56191 1.14687 6.68399 1.07366C6.75715 1.06889 6.8298 1.08457 6.89188 1.12356C7.49371 1.5015 8.50181 2.89655 8.68862 3.95247C8.70001 4.01686 8.69666 4.08323 8.67183 4.14373C8.45505 4.67198 7.62976 5.21056 7.31874 5.45983C7.25476 5.51112 7.21181 5.58329 7.21323 5.66528C7.22342 6.25136 7.97166 7.7264 8.34536 8.33162C8.7067 8.91684 9.25891 9.67606 9.647 9.90302C9.72707 9.94985 9.82332 9.94634 9.90953 9.91212C10.2432 9.77966 10.818 9.48331 11.1889 9.36417C11.2844 9.33352 11.3871 9.34372 11.4762 9.38964C12.5445 9.94007 13.43 11.5197 13.4433 12.4339C13.4444 12.507 13.4227 12.5779 13.384 12.6399C12.7447 13.6636 11.144 14.4134 10.3602 14.4537Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
