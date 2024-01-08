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

export const AutomationFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M9.63393 2.49017C9.63398 1.24516 8.01253 0.765406 7.33514 1.81002L4.08643 6.81989C3.54716 7.65152 4.14402 8.74996 5.13519 8.74999L6.63392 8.75003L6.63376 13.4957C6.63372 14.7917 8.36297 15.2314 8.98196 14.0928L12.4917 7.63694C12.9445 6.80401 12.3416 5.7899 11.3935 5.7899L9.63379 5.7899L9.63393 2.49017Z" fill={ colors[0] }/>

  </>,
  name: 'automation_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M9.63393 2.49017C9.63398 1.24516 8.01253 0.765406 7.33514 1.81002L4.08643 6.81989C3.54716 7.65152 4.14402 8.74996 5.13519 8.74999L6.63392 8.75003L6.63376 13.4957C6.63372 14.7917 8.36297 15.2314 8.98196 14.0928L12.4917 7.63694C12.9445 6.80401 12.3416 5.7899 11.3935 5.7899L9.63379 5.7899L9.63393 2.49017Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
