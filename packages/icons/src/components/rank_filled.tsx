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

export const RankFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M6.65245 2.38509C6.64065 2.37228 6.62854 2.35965 6.61611 2.34723C6.12795 1.85907 5.3365 1.85907 4.84834 2.34723L1.66971 5.52586C1.18155 6.01402 1.18155 6.80548 1.66971 7.29363C2.15786 7.78179 2.94932 7.78179 3.43747 7.29363L4.49996 6.23114V12.75C4.49996 13.4403 5.05961 14 5.74996 14C6.44032 14 6.99996 13.4403 6.99996 12.75V3.24998C6.99996 2.91436 6.8677 2.60964 6.65245 2.38509ZM10.25 1.99999C9.55964 1.99999 8.99999 2.55964 8.99999 3.24999V12.75C8.99999 13.4403 9.55964 14 10.25 14C10.5976 14 10.912 13.8581 11.1386 13.6292L14.3139 10.4538C14.802 9.96568 14.802 9.17422 14.3139 8.68607C13.8257 8.19791 13.0343 8.19791 12.5461 8.68607L11.5 9.7322V3.24999C11.5 2.55964 10.9404 1.99999 10.25 1.99999Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'rank_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M6.65245 2.38509C6.64065 2.37228 6.62854 2.35965 6.61611 2.34723C6.12795 1.85907 5.3365 1.85907 4.84834 2.34723L1.66971 5.52586C1.18155 6.01402 1.18155 6.80548 1.66971 7.29363C2.15786 7.78179 2.94932 7.78179 3.43747 7.29363L4.49996 6.23114V12.75C4.49996 13.4403 5.05961 14 5.74996 14C6.44032 14 6.99996 13.4403 6.99996 12.75V3.24998C6.99996 2.91436 6.8677 2.60964 6.65245 2.38509ZM10.25 1.99999C9.55964 1.99999 8.99999 2.55964 8.99999 3.24999V12.75C8.99999 13.4403 9.55964 14 10.25 14C10.5976 14 10.912 13.8581 11.1386 13.6292L14.3139 10.4538C14.802 9.96568 14.802 9.17422 14.3139 8.68607C13.8257 8.19791 13.0343 8.19791 12.5461 8.68607L11.5 9.7322V3.24999C11.5 2.55964 10.9404 1.99999 10.25 1.99999Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
