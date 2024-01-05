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

export const AutomationOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M9.634 2.49021C9.63405 1.24519 8.0126 0.765442 7.33521 1.81006L4.08651 6.81993C3.54723 7.65155 4.14409 8.75 5.13526 8.75003L6.63399 8.75007L6.63384 13.4958C6.63379 14.7917 8.36304 15.2314 8.98204 14.0928L12.4918 7.63697C12.9446 6.80405 12.3416 5.78993 11.3936 5.78993L9.63386 5.78993L9.634 2.49021ZM5.59537 7.25004L8.13397 3.33523L8.13385 6.03988C8.13382 6.73026 8.69348 7.28993 9.38385 7.28993H10.9731L8.13387 12.5125L8.134 8.50011C8.13402 7.80975 7.57439 7.25009 6.88403 7.25007L5.59537 7.25004Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'automation_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M9.634 2.49021C9.63405 1.24519 8.0126 0.765442 7.33521 1.81006L4.08651 6.81993C3.54723 7.65155 4.14409 8.75 5.13526 8.75003L6.63399 8.75007L6.63384 13.4958C6.63379 14.7917 8.36304 15.2314 8.98204 14.0928L12.4918 7.63697C12.9446 6.80405 12.3416 5.78993 11.3936 5.78993L9.63386 5.78993L9.634 2.49021ZM5.59537 7.25004L8.13397 3.33523L8.13385 6.03988C8.13382 6.73026 8.69348 7.28993 9.38385 7.28993H10.9731L8.13387 12.5125L8.134 8.50011C8.13402 7.80975 7.57439 7.25009 6.88403 7.25007L5.59537 7.25004Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
