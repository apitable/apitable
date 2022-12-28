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

export const AddressOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M9 14C11.8 14 14 11.8 14 9C14 6.2 11.8 4 9 4C6.2 4 4 6.2 4 9C4 11.8 6.2 14 9 14ZM9 6C10.7 6 12 7.3 12 9C12 10.7 10.7 12 9 12C7.3 12 6 10.7 6 9C6 7.3 7.3 6 9 6ZM6 15C3.8 15 2 16.9 2 19.3V21C2 21.6 2.4 22 3 22C3.6 22 4 21.6 4 21V19.3C4 18 4.9 17 6 17H12C13.1 17 14 18 14 19.3V21C14 21.6 14.4 22 15 22C15.6 22 16 21.6 16 21V19.3C16 16.9 14.2 15 12 15H6ZM20 10C20 11.2 19.5 12.3 18.8 13.2C20.6 13.7 22 15.4 22 17.3V19C22 19.6 21.6 20 21 20C20.4 20 20 19.6 20 19V17.3C20 16 18.9 15 17.5 15H15C14.4 15 14 14.6 14 14C14 13.4 14.4 13 15 13C16.7 13 18 11.7 18 10C18 8.3 16.7 7 15 7C14.4 7 14 6.6 14 6C14 5.4 14.4 5 15 5C17.8 5 20 7.2 20 10Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'address_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M9 14C11.8 14 14 11.8 14 9C14 6.2 11.8 4 9 4C6.2 4 4 6.2 4 9C4 11.8 6.2 14 9 14ZM9 6C10.7 6 12 7.3 12 9C12 10.7 10.7 12 9 12C7.3 12 6 10.7 6 9C6 7.3 7.3 6 9 6ZM6 15C3.8 15 2 16.9 2 19.3V21C2 21.6 2.4 22 3 22C3.6 22 4 21.6 4 21V19.3C4 18 4.9 17 6 17H12C13.1 17 14 18 14 19.3V21C14 21.6 14.4 22 15 22C15.6 22 16 21.6 16 21V19.3C16 16.9 14.2 15 12 15H6ZM20 10C20 11.2 19.5 12.3 18.8 13.2C20.6 13.7 22 15.4 22 17.3V19C22 19.6 21.6 20 21 20C20.4 20 20 19.6 20 19V17.3C20 16 18.9 15 17.5 15H15C14.4 15 14 14.6 14 14C14 13.4 14.4 13 15 13C16.7 13 18 11.7 18 10C18 8.3 16.7 7 15 7C14.4 7 14 6.6 14 6C14 5.4 14.4 5 15 5C17.8 5 20 7.2 20 10Z'],
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
});
