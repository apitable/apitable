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

export const WorkbenchLargeOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M21 4.10001C21 2.94021 20.0598 2.00001 18.9 2.00001L5.1 2C3.9402 2 3 2.9402 3 4.1V14.9C3 16.0598 3.9402 17 5.1 17L11 16.9991V19.9994L6.99994 19.9999C6.44767 19.9999 6 20.4477 6 20.9999C6 21.5523 6.44774 22 7.00006 22H16.9999C17.5523 22 18 21.5523 18 20.9999C18 20.4477 17.5523 19.9999 17.0001 19.9999L13 19.9994V16.9991L18.9 17C20.0598 17 21 16.0598 21 14.9V4.10001ZM5.28005 3.99999H18.72C18.8747 3.99999 19 4.14013 19 4.313V14.687C19 14.8599 18.8747 15 18.72 15H5.28005C5.12541 15 5.00005 14.8599 5.00005 14.687V4.313C5.00005 4.14013 5.12541 3.99999 5.28005 3.99999Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'workbench_large_outlined',
  defaultColors: ['#666666'],
  colorful: false,
  allPathData: ['M21 4.10001C21 2.94021 20.0598 2.00001 18.9 2.00001L5.1 2C3.9402 2 3 2.9402 3 4.1V14.9C3 16.0598 3.9402 17 5.1 17L11 16.9991V19.9994L6.99994 19.9999C6.44767 19.9999 6 20.4477 6 20.9999C6 21.5523 6.44774 22 7.00006 22H16.9999C17.5523 22 18 21.5523 18 20.9999C18 20.4477 17.5523 19.9999 17.0001 19.9999L13 19.9994V16.9991L18.9 17C20.0598 17 21 16.0598 21 14.9V4.10001ZM5.28005 3.99999H18.72C18.8747 3.99999 19 4.14013 19 4.313V14.687C19 14.8599 18.8747 15 18.72 15H5.28005C5.12541 15 5.00005 14.8599 5.00005 14.687V4.313C5.00005 4.14013 5.12541 3.99999 5.28005 3.99999Z'],
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
});
