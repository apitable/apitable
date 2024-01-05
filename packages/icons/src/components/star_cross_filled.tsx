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

export const StarCrossFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.88521 2.07168C8.5104 1.35892 7.48985 1.35892 7.11504 2.07168L6.53081 3.18269L12.6525 13.7858C12.6527 13.7357 12.6491 13.6846 12.6416 13.6326L12.1273 10.091L14.6251 7.52803C15.1871 6.95131 14.8718 5.98071 14.0781 5.8445L10.5509 5.23918L8.88521 2.07168Z" fill={ colors[0] }/>
    <path d="M9.90703 14.0304L10.44 14.9535C10.6471 15.3123 11.1058 15.4352 11.4645 15.2281C11.8232 15.0209 11.9461 14.5623 11.739 14.2035L5.2388 2.94481C5.03169 2.58609 4.573 2.46318 4.21428 2.67029C3.85556 2.87739 3.73265 3.33609 3.93976 3.69481L4.88711 5.33567L1.9222 5.8445C1.1285 5.98071 0.813133 6.95131 1.37519 7.52803L3.87294 10.091L3.35868 13.6326C3.24295 14.4295 4.06859 15.0294 4.79077 14.6731L8.00013 13.0895L9.90703 14.0304Z" fill={ colors[0] }/>

  </>,
  name: 'star_cross_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8.88521 2.07168C8.5104 1.35892 7.48985 1.35892 7.11504 2.07168L6.53081 3.18269L12.6525 13.7858C12.6527 13.7357 12.6491 13.6846 12.6416 13.6326L12.1273 10.091L14.6251 7.52803C15.1871 6.95131 14.8718 5.98071 14.0781 5.8445L10.5509 5.23918L8.88521 2.07168Z', 'M9.90703 14.0304L10.44 14.9535C10.6471 15.3123 11.1058 15.4352 11.4645 15.2281C11.8232 15.0209 11.9461 14.5623 11.739 14.2035L5.2388 2.94481C5.03169 2.58609 4.573 2.46318 4.21428 2.67029C3.85556 2.87739 3.73265 3.33609 3.93976 3.69481L4.88711 5.33567L1.9222 5.8445C1.1285 5.98071 0.813133 6.95131 1.37519 7.52803L3.87294 10.091L3.35868 13.6326C3.24295 14.4295 4.06859 15.0294 4.79077 14.6731L8.00013 13.0895L9.90703 14.0304Z'],
  width: '17',
  height: '17',
  viewBox: '0 0 17 17',
});
