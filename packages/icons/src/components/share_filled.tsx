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

export const ShareFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M13.0009 1.58846C13.9264 1.20592 14.8529 2.13238 14.4703 3.05789L9.59074 14.8634C9.25517 15.6752 8.16013 15.8064 7.64229 15.0968L5.76388 12.5227C5.54934 12.2287 5.49029 11.849 5.60538 11.5038L6.13055 9.92825L4.55504 10.4534C4.20976 10.5685 3.83013 10.5095 3.53613 10.2949L0.962017 8.41651C0.252375 7.89867 0.38356 6.80364 1.19543 6.46806L13.0009 1.58846Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'share_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M13.0009 1.58846C13.9264 1.20592 14.8529 2.13238 14.4703 3.05789L9.59074 14.8634C9.25517 15.6752 8.16013 15.8064 7.64229 15.0968L5.76388 12.5227C5.54934 12.2287 5.49029 11.849 5.60538 11.5038L6.13055 9.92825L4.55504 10.4534C4.20976 10.5685 3.83013 10.5095 3.53613 10.2949L0.962017 8.41651C0.252375 7.89867 0.38356 6.80364 1.19543 6.46806L13.0009 1.58846Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
