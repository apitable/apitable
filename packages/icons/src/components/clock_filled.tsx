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

export const ClockFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M0.530324 3.29828C0.23743 3.59118 0.23743 4.06605 0.530324 4.35894C0.823217 4.65184 1.29809 4.65184 1.59098 4.35894L3.35875 2.59118C3.65164 2.29828 3.65164 1.82341 3.35875 1.53052C3.06586 1.23762 2.59098 1.23762 2.29809 1.53052L0.530324 3.29828ZM15.4697 4.35894C15.7626 4.06605 15.7626 3.59118 15.4697 3.29828L13.7019 1.53052C13.409 1.23762 12.9341 1.23762 12.6412 1.53052C12.3483 1.82341 12.3483 2.29828 12.6412 2.59118L14.409 4.35894C14.7019 4.65184 15.1768 4.65184 15.4697 4.35894ZM14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8ZM7 5C7 4.44772 7.44772 4 8 4C8.55228 4 9 4.44772 9 5V7H11C11.5523 7 12 7.44772 12 8C12 8.55228 11.5523 9 11 9H8C7.93096 9 7.86356 8.993 7.79847 8.97968C7.34278 8.88644 7 8.48325 7 8V5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'clock_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M0.530324 3.29828C0.23743 3.59118 0.23743 4.06605 0.530324 4.35894C0.823217 4.65184 1.29809 4.65184 1.59098 4.35894L3.35875 2.59118C3.65164 2.29828 3.65164 1.82341 3.35875 1.53052C3.06586 1.23762 2.59098 1.23762 2.29809 1.53052L0.530324 3.29828ZM15.4697 4.35894C15.7626 4.06605 15.7626 3.59118 15.4697 3.29828L13.7019 1.53052C13.409 1.23762 12.9341 1.23762 12.6412 1.53052C12.3483 1.82341 12.3483 2.29828 12.6412 2.59118L14.409 4.35894C14.7019 4.65184 15.1768 4.65184 15.4697 4.35894ZM14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8ZM7 5C7 4.44772 7.44772 4 8 4C8.55228 4 9 4.44772 9 5V7H11C11.5523 7 12 7.44772 12 8C12 8.55228 11.5523 9 11 9H8C7.93096 9 7.86356 8.993 7.79847 8.97968C7.34278 8.88644 7 8.48325 7 8V5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
