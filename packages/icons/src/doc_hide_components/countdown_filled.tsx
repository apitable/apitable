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

export const CountdownFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1.90104 8.47909C1.85005 9.03046 2.08808 10.0266 2.48092 10.5937" stroke={ colors[0] } strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.79667 10.3446C3.06334 9.74491 2.86243 8.47761 3.22984 7.60735C3.34508 7.33439 3.63753 7.20811 3.93086 7.16627C5.23354 6.98045 6.41397 6.15528 7.44449 4.85715C7.71362 4.51814 8.16809 4.34232 8.5403 4.56327C10.4753 5.71193 10.722 8.89397 9.80507 10.4539C9.5563 10.8771 9.00226 10.8152 8.61084 10.519C7.26101 9.49723 6.19475 9.93884 4.46488 10.4408C4.23566 10.5073 3.98143 10.4957 3.79667 10.3446Z" fill={ colors[0] }/>
    <path d="M3.33203 11.889L4.39517 13.2812" stroke={ colors[0] } strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.1589 4.81056L12.513 3.62049" stroke={ colors[0] } strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.8831 6.73297L13.4991 5.93393" stroke={ colors[0] } strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.8834 9.24794L13.5911 9.82564" stroke={ colors[0] } strokeLinecap="round" strokeLinejoin="round"/>

  </>,
  name: 'countdown_filled',
  defaultColors: ['#FFEB3A'],
  colorful: false,
  allPathData: ['M1.90104 8.47909C1.85005 9.03046 2.08808 10.0266 2.48092 10.5937', 'M3.79667 10.3446C3.06334 9.74491 2.86243 8.47761 3.22984 7.60735C3.34508 7.33439 3.63753 7.20811 3.93086 7.16627C5.23354 6.98045 6.41397 6.15528 7.44449 4.85715C7.71362 4.51814 8.16809 4.34232 8.5403 4.56327C10.4753 5.71193 10.722 8.89397 9.80507 10.4539C9.5563 10.8771 9.00226 10.8152 8.61084 10.519C7.26101 9.49723 6.19475 9.93884 4.46488 10.4408C4.23566 10.5073 3.98143 10.4957 3.79667 10.3446Z', 'M3.33203 11.889L4.39517 13.2812', 'M11.1589 4.81056L12.513 3.62049', 'M11.8831 6.73297L13.4991 5.93393', 'M11.8834 9.24794L13.5911 9.82564'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
