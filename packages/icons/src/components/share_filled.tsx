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
    <path d="M9 4.25C9 2.73122 10.2312 1.5 11.75 1.5C13.2688 1.5 14.5 2.73122 14.5 4.25C14.5 5.76878 13.2688 7 11.75 7C10.9734 7 10.2721 6.67812 9.77199 6.16049L7.89238 7.16743C7.96259 7.43315 8 7.71221 8 8C8 8.30182 7.95886 8.59404 7.88187 8.87134L10.2742 10.1912C10.7229 9.76298 11.3307 9.5 12 9.5C13.3807 9.5 14.5 10.6193 14.5 12C14.5 13.3807 13.3807 14.5 12 14.5C10.6193 14.5 9.5 13.3807 9.5 12C9.5 11.8303 9.51691 11.6646 9.54913 11.5044L7.15654 10.1843C6.56199 10.839 5.704 11.25 4.75 11.25C2.95507 11.25 1.5 9.79493 1.5 8C1.5 6.20507 2.95507 4.75 4.75 4.75C5.71844 4.75 6.58794 5.17358 7.18335 5.84558L9.06313 4.83856C9.02178 4.64894 9 4.45201 9 4.25Z" fill={ colors[0] }/>

  </>,
  name: 'share_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M9 4.25C9 2.73122 10.2312 1.5 11.75 1.5C13.2688 1.5 14.5 2.73122 14.5 4.25C14.5 5.76878 13.2688 7 11.75 7C10.9734 7 10.2721 6.67812 9.77199 6.16049L7.89238 7.16743C7.96259 7.43315 8 7.71221 8 8C8 8.30182 7.95886 8.59404 7.88187 8.87134L10.2742 10.1912C10.7229 9.76298 11.3307 9.5 12 9.5C13.3807 9.5 14.5 10.6193 14.5 12C14.5 13.3807 13.3807 14.5 12 14.5C10.6193 14.5 9.5 13.3807 9.5 12C9.5 11.8303 9.51691 11.6646 9.54913 11.5044L7.15654 10.1843C6.56199 10.839 5.704 11.25 4.75 11.25C2.95507 11.25 1.5 9.79493 1.5 8C1.5 6.20507 2.95507 4.75 4.75 4.75C5.71844 4.75 6.58794 5.17358 7.18335 5.84558L9.06313 4.83856C9.02178 4.64894 9 4.45201 9 4.25Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
