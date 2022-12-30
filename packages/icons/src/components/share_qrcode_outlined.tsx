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

export const ShareQrcodeOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M6.5 1H2C1.4 1 1 1.4 1 2V6.5C1 7.1 1.4 7.5 2 7.5H6.5C7.1 7.5 7.5 7.1 7.5 6.5V2C7.5 1.4 7.1 1 6.5 1ZM5.5 5.5H3V3H5.5V5.5ZM6.5 8.5H2C1.4 8.5 1 8.9 1 9.5V14C1 14.6 1.4 15 2 15H6.5C7.1 15 7.5 14.6 7.5 14V9.5C7.5 8.9 7.1 8.5 6.5 8.5ZM5.5 13H3V10.5H5.5V13ZM9.5 1H14C14.6 1 15 1.4 15 2V6.5C15 7.1 14.6 7.5 14 7.5H9.5C8.9 7.5 8.5 7.1 8.5 6.5V2C8.5 1.4 8.9 1 9.5 1ZM10.5 5.5H13V3H10.5V5.5ZM10 11C9.4 11 9 11.4 9 12V14C9 14.6 9.4 15 10 15C10.6 15 11 14.6 11 14V12C11 11.4 10.6 11 10 11ZM12.5 10C12.5 9.4 12.9 9 13.5 9C14.1 9 14.5 9.4 14.5 10V14C14.5 14.6 14.1 15 13.5 15C12.9 15 12.5 14.6 12.5 14V10Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'share_qrcode_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M6.5 1H2C1.4 1 1 1.4 1 2V6.5C1 7.1 1.4 7.5 2 7.5H6.5C7.1 7.5 7.5 7.1 7.5 6.5V2C7.5 1.4 7.1 1 6.5 1ZM5.5 5.5H3V3H5.5V5.5ZM6.5 8.5H2C1.4 8.5 1 8.9 1 9.5V14C1 14.6 1.4 15 2 15H6.5C7.1 15 7.5 14.6 7.5 14V9.5C7.5 8.9 7.1 8.5 6.5 8.5ZM5.5 13H3V10.5H5.5V13ZM9.5 1H14C14.6 1 15 1.4 15 2V6.5C15 7.1 14.6 7.5 14 7.5H9.5C8.9 7.5 8.5 7.1 8.5 6.5V2C8.5 1.4 8.9 1 9.5 1ZM10.5 5.5H13V3H10.5V5.5ZM10 11C9.4 11 9 11.4 9 12V14C9 14.6 9.4 15 10 15C10.6 15 11 14.6 11 14V12C11 11.4 10.6 11 10 11ZM12.5 10C12.5 9.4 12.9 9 13.5 9C14.1 9 14.5 9.4 14.5 10V14C14.5 14.6 14.1 15 13.5 15C12.9 15 12.5 14.6 12.5 14V10Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
