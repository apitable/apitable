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

export const CoverOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3 2.5H13C13.2761 2.5 13.5 2.72386 13.5 3V5.76107C10.9543 5.8963 8.73447 7.26007 7.4227 9.27032C5.95551 8.2612 4.04741 8.16941 2.5 8.99494V3C2.5 2.72386 2.72386 2.5 3 2.5ZM2.5 10.8281V13C2.5 13.2761 2.72386 13.5 3 13.5H6.16779C6.16779 12.4806 6.36459 11.5073 6.72227 10.6157C5.47021 9.64577 3.6724 9.71656 2.5 10.8281ZM7.66779 13.5C7.66779 10.1886 10.243 7.4787 13.5 7.26374V13C13.5 13.2761 13.2761 13.5 13 13.5H7.66779ZM1 3C1 1.89543 1.89543 1 3 1H13C14.1046 1 15 1.89543 15 3V13C15 14.1046 14.1046 15 13 15H3C1.89543 15 1 14.1046 1 13V3ZM6.5 5.25C6.5 5.94036 5.94036 6.5 5.25 6.5C4.55964 6.5 4 5.94036 4 5.25C4 4.55964 4.55964 4 5.25 4C5.94036 4 6.5 4.55964 6.5 5.25Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'cover_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M3 2.5H13C13.2761 2.5 13.5 2.72386 13.5 3V5.76107C10.9543 5.8963 8.73447 7.26007 7.4227 9.27032C5.95551 8.2612 4.04741 8.16941 2.5 8.99494V3C2.5 2.72386 2.72386 2.5 3 2.5ZM2.5 10.8281V13C2.5 13.2761 2.72386 13.5 3 13.5H6.16779C6.16779 12.4806 6.36459 11.5073 6.72227 10.6157C5.47021 9.64577 3.6724 9.71656 2.5 10.8281ZM7.66779 13.5C7.66779 10.1886 10.243 7.4787 13.5 7.26374V13C13.5 13.2761 13.2761 13.5 13 13.5H7.66779ZM1 3C1 1.89543 1.89543 1 3 1H13C14.1046 1 15 1.89543 15 3V13C15 14.1046 14.1046 15 13 15H3C1.89543 15 1 14.1046 1 13V3ZM6.5 5.25C6.5 5.94036 5.94036 6.5 5.25 6.5C4.55964 6.5 4 5.94036 4 5.25C4 4.55964 4.55964 4 5.25 4C5.94036 4 6.5 4.55964 6.5 5.25Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
