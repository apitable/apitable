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

export const Headline1Filled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1.00005 13V3H3V7H7V3H9.00005V13H7V9H3V13H1.00005ZM12.0176 6.35585C12.3776 6.13585 12.6776 5.90585 12.9176 5.65585H13.7976V12.7959H12.6276V7.06585C12.1976 7.45585 11.6576 7.74585 10.9976 7.93585V6.77585C11.3176 6.69585 11.6576 6.55585 12.0176 6.35585Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'headline_1_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M1.00005 13V3H3V7H7V3H9.00005V13H7V9H3V13H1.00005ZM12.0176 6.35585C12.3776 6.13585 12.6776 5.90585 12.9176 5.65585H13.7976V12.7959H12.6276V7.06585C12.1976 7.45585 11.6576 7.74585 10.9976 7.93585V6.77585C11.3176 6.69585 11.6576 6.55585 12.0176 6.35585Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
