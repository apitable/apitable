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

export const LabelSmallOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M6.85232 1.14768C6.65541 0.950772 6.33615 0.950772 6.13924 1.14768L4 3.28692L1.86076 1.14768C1.66385 0.950772 1.34459 0.950772 1.14768 1.14768C0.950772 1.34459 0.950772 1.66385 1.14768 1.86076L3.28692 4L1.14768 6.13924C0.950772 6.33615 0.950772 6.65541 1.14768 6.85232C1.34459 7.04923 1.66385 7.04923 1.86076 6.85232L4 4.71308L6.13924 6.85232C6.33615 7.04923 6.65541 7.04923 6.85232 6.85232C7.04923 6.6554 7.04923 6.33615 6.85232 6.13924L4.71308 4L6.85232 1.86076C7.04923 1.66385 7.04923 1.34459 6.85232 1.14768Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'label_small_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M6.85232 1.14768C6.65541 0.950772 6.33615 0.950772 6.13924 1.14768L4 3.28692L1.86076 1.14768C1.66385 0.950772 1.34459 0.950772 1.14768 1.14768C0.950772 1.34459 0.950772 1.66385 1.14768 1.86076L3.28692 4L1.14768 6.13924C0.950772 6.33615 0.950772 6.65541 1.14768 6.85232C1.34459 7.04923 1.66385 7.04923 1.86076 6.85232L4 4.71308L6.13924 6.85232C6.33615 7.04923 6.65541 7.04923 6.85232 6.85232C7.04923 6.6554 7.04923 6.33615 6.85232 6.13924L4.71308 4L6.85232 1.86076C7.04923 1.66385 7.04923 1.34459 6.85232 1.14768Z'],
  width: '8',
  height: '8',
  viewBox: '0 0 8 8',
});
