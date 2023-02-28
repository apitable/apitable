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

export const ShieldCheckFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2.77817 2.28271C2.30761 2.47451 2 2.93196 2 3.44011V8.81475C2 11.2096 5.90597 13.7659 7.4157 14.6646C7.77862 14.8806 8.22342 14.8786 8.58477 14.66C10.0921 13.748 14 11.1575 14 8.81475V3.43946C14 2.93139 13.6925 2.47449 13.222 2.28263L12.0401 1.80063C9.42317 0.733375 6.57976 0.733117 3.96265 1.79989L2.77817 2.28271ZM6.52608 6.49366C6.2308 6.20318 5.75594 6.20707 5.46546 6.50235C5.17497 6.79764 5.17886 7.27249 5.47415 7.56298L7.22415 9.28454C7.36922 9.42725 7.56605 9.50488 7.76948 9.49963C7.97291 9.49437 8.16547 9.40668 8.30298 9.25667L11.053 6.25667C11.3329 5.95133 11.3122 5.47691 11.0069 5.19701C10.7016 4.91712 10.2271 4.93775 9.94725 5.24308L7.72223 7.67037L6.52608 6.49366Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'shield_check_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M2.77817 2.28271C2.30761 2.47451 2 2.93196 2 3.44011V8.81475C2 11.2096 5.90597 13.7659 7.4157 14.6646C7.77862 14.8806 8.22342 14.8786 8.58477 14.66C10.0921 13.748 14 11.1575 14 8.81475V3.43946C14 2.93139 13.6925 2.47449 13.222 2.28263L12.0401 1.80063C9.42317 0.733375 6.57976 0.733117 3.96265 1.79989L2.77817 2.28271ZM6.52608 6.49366C6.2308 6.20318 5.75594 6.20707 5.46546 6.50235C5.17497 6.79764 5.17886 7.27249 5.47415 7.56298L7.22415 9.28454C7.36922 9.42725 7.56605 9.50488 7.76948 9.49963C7.97291 9.49437 8.16547 9.40668 8.30298 9.25667L11.053 6.25667C11.3329 5.95133 11.3122 5.47691 11.0069 5.19701C10.7016 4.91712 10.2271 4.93775 9.94725 5.24308L7.72223 7.67037L6.52608 6.49366Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
