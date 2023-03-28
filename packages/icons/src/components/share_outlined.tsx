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

export const ShareOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M14.4703 3.05789C14.8529 2.13238 13.9264 1.20592 13.0009 1.58846L1.19543 6.46806C0.383559 6.80364 0.252375 7.89867 0.962017 8.41651L3.53613 10.2949C3.83013 10.5095 4.20976 10.5685 4.55504 10.4534L6.13055 9.92825L5.60538 11.5038C5.49029 11.849 5.54934 12.2287 5.76388 12.5227L7.64229 15.0968C8.16013 15.8064 9.25517 15.6752 9.59074 14.8634L14.4703 3.05789ZM2.38628 7.59893L12.739 3.3198L8.45988 13.6725L7.08955 11.7947L7.79075 9.69108C8.08391 8.8116 7.2472 7.97489 6.36772 8.26805L4.26413 8.96925L2.38628 7.59893Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'share_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M14.4703 3.05789C14.8529 2.13238 13.9264 1.20592 13.0009 1.58846L1.19543 6.46806C0.383559 6.80364 0.252375 7.89867 0.962017 8.41651L3.53613 10.2949C3.83013 10.5095 4.20976 10.5685 4.55504 10.4534L6.13055 9.92825L5.60538 11.5038C5.49029 11.849 5.54934 12.2287 5.76388 12.5227L7.64229 15.0968C8.16013 15.8064 9.25517 15.6752 9.59074 14.8634L14.4703 3.05789ZM2.38628 7.59893L12.739 3.3198L8.45988 13.6725L7.08955 11.7947L7.79075 9.69108C8.08391 8.8116 7.2472 7.97489 6.36772 8.26805L4.26413 8.96925L2.38628 7.59893Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
