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

export const UnderlineFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3.84204 6.80777V2.19922H5.48004V6.83577C5.48004 7.70377 5.67604 8.33377 6.08204 8.75377C6.47404 9.15977 7.11804 9.36977 8.00004 9.36977C8.86804 9.36977 9.51204 9.15977 9.91804 8.75377C10.31 8.33377 10.52 7.70377 10.52 6.83577L10.52 2.19922H12.158V6.80777C12.158 8.10977 11.794 9.10377 11.066 9.78977C10.338 10.4618 9.31604 10.7978 8.00004 10.7978C6.67004 10.7978 5.64804 10.4618 4.94804 9.80377C4.20604 9.10377 3.84204 8.10977 3.84204 6.80777ZM12.9998 12H3L3.00023 13.996H13L12.9998 12Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'underline_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M3.84204 6.80777V2.19922H5.48004V6.83577C5.48004 7.70377 5.67604 8.33377 6.08204 8.75377C6.47404 9.15977 7.11804 9.36977 8.00004 9.36977C8.86804 9.36977 9.51204 9.15977 9.91804 8.75377C10.31 8.33377 10.52 7.70377 10.52 6.83577L10.52 2.19922H12.158V6.80777C12.158 8.10977 11.794 9.10377 11.066 9.78977C10.338 10.4618 9.31604 10.7978 8.00004 10.7978C6.67004 10.7978 5.64804 10.4618 4.94804 9.80377C4.20604 9.10377 3.84204 8.10977 3.84204 6.80777ZM12.9998 12H3L3.00023 13.996H13L12.9998 12Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
