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

export const SilverFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M20 2H44.0001V16.5155L32.0001 26L20 16.5155V2Z" fill={ colors[2] }/>
    <path d="M19.999 14.5137V16.5137L31.999 25.9982L43.999 16.5137V14.5137L31.999 23.9982L19.999 14.5137Z" fill={ colors[1] }/>
    <path d="M38 4H34V22H38V4Z" fill={ colors[4] }/>
    <path d="M30 4H26V22H30V4Z" fill={ colors[4] }/>
    <path d="M18 3C18 2.44772 18.4477 2 19 2H45C45.5522 2 46 2.44772 46 3C46 3.55228 45.5522 4 45 4H32H19C18.4477 4 18 3.55228 18 3Z" fill={ colors[1] }/>
    <path d="M30.4356 15.7839L14.4357 25.5617C13.5439 26.1067 13 27.0765 13 28.1215V47.8783C13 48.9233 13.5439 49.8931 14.4356 50.4381L30.4356 60.2159C31.396 60.8027 32.604 60.8027 33.5644 60.2159L49.5644 50.4381C50.4562 49.8931 51 48.9233 51 47.8783V28.1215C51 27.0765 50.4562 26.1067 49.5644 25.5617L33.5644 15.7839C32.604 15.197 31.396 15.197 30.4356 15.7839Z" fill={ colors[3] } stroke={ colors[0] } strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M32 28L30 26V34H32V28Z" fill={ colors[0] }/>
    <path d="M30 26H22V34V42V50L30 42L38 34L46 26H38L30 34V26Z" fill={ colors[4] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M46 28V26L22 50V52L46 28Z" fill={ colors[0] }/>

  </>,
  name: 'silver_filled',
  defaultColors: ['#7997BA', '#7B67EE', '#A697FB', '#DBE7F5', 'white'],
  colorful: true,
  allPathData: ['M20 2H44.0001V16.5155L32.0001 26L20 16.5155V2Z', 'M19.999 14.5137V16.5137L31.999 25.9982L43.999 16.5137V14.5137L31.999 23.9982L19.999 14.5137Z', 'M38 4H34V22H38V4Z', 'M30 4H26V22H30V4Z', 'M18 3C18 2.44772 18.4477 2 19 2H45C45.5522 2 46 2.44772 46 3C46 3.55228 45.5522 4 45 4H32H19C18.4477 4 18 3.55228 18 3Z', 'M30.4356 15.7839L14.4357 25.5617C13.5439 26.1067 13 27.0765 13 28.1215V47.8783C13 48.9233 13.5439 49.8931 14.4356 50.4381L30.4356 60.2159C31.396 60.8027 32.604 60.8027 33.5644 60.2159L49.5644 50.4381C50.4562 49.8931 51 48.9233 51 47.8783V28.1215C51 27.0765 50.4562 26.1067 49.5644 25.5617L33.5644 15.7839C32.604 15.197 31.396 15.197 30.4356 15.7839Z', 'M32 28L30 26V34H32V28Z', 'M30 26H22V34V42V50L30 42L38 34L46 26H38L30 34V26Z', 'M46 28V26L22 50V52L46 28Z'],
  width: '64',
  height: '64',
  viewBox: '0 0 64 64',
});
