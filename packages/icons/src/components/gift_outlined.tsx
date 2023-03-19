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

export const GiftOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M4.93151 1.85942C5.2017 1.54546 5.67524 1.50996 5.98921 1.78015L7.99531 3.50649L10.0121 1.77902C10.3267 1.50956 10.8002 1.54615 11.0696 1.86073C11.3391 2.17532 11.3025 2.64878 10.9879 2.91824L10.0168 3.75H13.25C13.9404 3.75 14.5 4.30964 14.5 5V6.5C14.5 7.19035 13.9404 7.75 13.25 7.75V13.25C13.25 13.9404 12.6904 14.5 12 14.5H4C3.30964 14.5 2.75 13.9404 2.75 13.25L2.75 7.75C2.05964 7.75 1.5 7.19035 1.5 6.5V5C1.5 4.30964 2.05964 3.75 2.75 3.75H5.97864L5.01079 2.91712C4.69683 2.64693 4.66133 2.17339 4.93151 1.85942ZM3 5.25V6.25H13V5.25H3ZM7.25 7.75H4.25V13H7.25L7.25 7.75ZM8.75 7.75L8.75 13H11.75V7.75H8.75Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'gift_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M4.93151 1.85942C5.2017 1.54546 5.67524 1.50996 5.98921 1.78015L7.99531 3.50649L10.0121 1.77902C10.3267 1.50956 10.8002 1.54615 11.0696 1.86073C11.3391 2.17532 11.3025 2.64878 10.9879 2.91824L10.0168 3.75H13.25C13.9404 3.75 14.5 4.30964 14.5 5V6.5C14.5 7.19035 13.9404 7.75 13.25 7.75V13.25C13.25 13.9404 12.6904 14.5 12 14.5H4C3.30964 14.5 2.75 13.9404 2.75 13.25L2.75 7.75C2.05964 7.75 1.5 7.19035 1.5 6.5V5C1.5 4.30964 2.05964 3.75 2.75 3.75H5.97864L5.01079 2.91712C4.69683 2.64693 4.66133 2.17339 4.93151 1.85942ZM3 5.25V6.25H13V5.25H3ZM7.25 7.75H4.25V13H7.25L7.25 7.75ZM8.75 7.75L8.75 13H11.75V7.75H8.75Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
