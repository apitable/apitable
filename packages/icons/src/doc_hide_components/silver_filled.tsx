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
    <path d="M9.99976 1H21.9998V8.25774L15.9998 13L9.99976 8.25774L9.99976 1Z" fill={ colors[2] }/>
    <path d="M9.99951 7.25703V8.25703L15.9995 12.9993L21.9995 8.25703V7.25703L15.9995 11.9993L9.99951 7.25703Z" fill={ colors[1] }/>
    <rect x="16.9998" y="2" width="2" height="9" fill={ colors[4] }/>
    <rect x="12.9998" y="2" width="2" height="9" fill={ colors[4] }/>
    <path d="M9 1.5C9 1.22386 9.22386 1 9.5 1H22.5C22.7761 1 23 1.22386 23 1.5V1.5C23 1.77614 22.7761 2 22.5 2H16H9.5C9.22386 2 9 1.77614 9 1.5V1.5Z" fill={ colors[1] }/>
    <path d="M15.2178 7.89202L7.21783 12.7809C6.77194 13.0534 6.5 13.5383 6.5 14.0608V23.9392C6.5 24.4617 6.77194 24.9466 7.21782 25.2191L15.2178 30.108C15.698 30.4014 16.302 30.4014 16.7822 30.108L24.7822 25.2191C25.2281 24.9466 25.5 24.4617 25.5 23.9392V14.0608C25.5 13.5383 25.2281 13.0534 24.7822 12.7809L16.7822 7.89202C16.302 7.59859 15.698 7.59859 15.2178 7.89202Z" fill={ colors[3] } stroke={ colors[0] } strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 14L15 13V17H16V14Z" fill={ colors[0] }/>
    <path d="M15 13H11V17V21V25L15 21L19 17L23 13H19L15 17V13Z" fill={ colors[4] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M23 14V13L11 25V26L23 14Z" fill={ colors[0] }/>

  </>,
  name: 'silver_filled',
  defaultColors: ['#7997BA', '#7B67EE', '#A697FB', '#DBE7F5', 'white'],
  colorful: true,
  allPathData: ['M9.99976 1H21.9998V8.25774L15.9998 13L9.99976 8.25774L9.99976 1Z', 'M9.99951 7.25703V8.25703L15.9995 12.9993L21.9995 8.25703V7.25703L15.9995 11.9993L9.99951 7.25703Z', 'M9 1.5C9 1.22386 9.22386 1 9.5 1H22.5C22.7761 1 23 1.22386 23 1.5V1.5C23 1.77614 22.7761 2 22.5 2H16H9.5C9.22386 2 9 1.77614 9 1.5V1.5Z', 'M15.2178 7.89202L7.21783 12.7809C6.77194 13.0534 6.5 13.5383 6.5 14.0608V23.9392C6.5 24.4617 6.77194 24.9466 7.21782 25.2191L15.2178 30.108C15.698 30.4014 16.302 30.4014 16.7822 30.108L24.7822 25.2191C25.2281 24.9466 25.5 24.4617 25.5 23.9392V14.0608C25.5 13.5383 25.2281 13.0534 24.7822 12.7809L16.7822 7.89202C16.302 7.59859 15.698 7.59859 15.2178 7.89202Z', 'M16 14L15 13V17H16V14Z', 'M15 13H11V17V21V25L15 21L19 17L23 13H19L15 17V13Z', 'M23 14V13L11 25V26L23 14Z'],
  width: '32',
  height: '32',
  viewBox: '0 0 32 32',
});
