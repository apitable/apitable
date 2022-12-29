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

export const ReloadOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M12.2017 11.3495C12.4473 11.016 12.376 10.5465 12.0424 10.3009C11.7089 10.0553 11.2394 10.1267 10.9938 10.4602C10.0095 11.7971 8.2737 12.4635 6.57593 12.0086C4.36205 11.4154 3.04823 9.13979 3.64144 6.92591C4.23465 4.71202 6.51024 3.3982 8.72413 3.99141C9.7624 4.26962 10.6024 4.91704 11.1412 5.75625L9.77248 6.54651C9.57896 6.65824 9.61713 6.94816 9.83297 7.006L13.0941 7.87982C13.2279 7.91568 13.3655 7.83627 13.4013 7.70247L14.2752 4.4413C14.333 4.22546 14.101 4.04744 13.9075 4.15917L12.4413 5.00566C11.7105 3.8359 10.5508 2.92795 9.11236 2.54252C6.09827 1.7349 3.00017 3.52359 2.19255 6.53768C1.38493 9.55176 3.17362 12.6499 6.1877 13.4575C8.50181 14.0776 10.8637 13.167 12.2017 11.3495Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'reload_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M12.2017 11.3495C12.4473 11.016 12.376 10.5465 12.0424 10.3009C11.7089 10.0553 11.2394 10.1267 10.9938 10.4602C10.0095 11.7971 8.2737 12.4635 6.57593 12.0086C4.36205 11.4154 3.04823 9.13979 3.64144 6.92591C4.23465 4.71202 6.51024 3.3982 8.72413 3.99141C9.7624 4.26962 10.6024 4.91704 11.1412 5.75625L9.77248 6.54651C9.57896 6.65824 9.61713 6.94816 9.83297 7.006L13.0941 7.87982C13.2279 7.91568 13.3655 7.83627 13.4013 7.70247L14.2752 4.4413C14.333 4.22546 14.101 4.04744 13.9075 4.15917L12.4413 5.00566C11.7105 3.8359 10.5508 2.92795 9.11236 2.54252C6.09827 1.7349 3.00017 3.52359 2.19255 6.53768C1.38493 9.55176 3.17362 12.6499 6.1877 13.4575C8.50181 14.0776 10.8637 13.167 12.2017 11.3495Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
