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

export const RestoreOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M4.23858 0.261649C3.8308 0.188942 3.44129 0.460575 3.36858 0.868357L2.84199 3.82178L2.71034 4.56013L3.44869 4.69178L6.40212 5.21837C6.8099 5.29108 7.19941 5.01945 7.27212 4.61167C7.34483 4.20388 7.07319 3.81437 6.66541 3.74166L5.40612 3.51713C6.17807 3.10173 7.06003 2.86677 8 2.86677C11.0376 2.86677 13.5 5.3292 13.5 8.36677C13.5 11.4043 11.0376 13.8668 8 13.8668C4.96243 13.8668 2.5 11.4043 2.5 8.36677C2.5 7.95255 2.16421 7.61677 1.75 7.61677C1.33579 7.61677 1 7.95255 1 8.36677C1 12.2328 4.13401 15.3668 8 15.3668C11.866 15.3668 15 12.2328 15 8.36677C15 4.50077 11.866 1.36677 8 1.36677C6.78499 1.36677 5.64483 1.6762 4.65119 2.22026L4.84529 1.13165C4.918 0.72387 4.64636 0.334357 4.23858 0.261649Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'restore_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M4.23858 0.261649C3.8308 0.188942 3.44129 0.460575 3.36858 0.868357L2.84199 3.82178L2.71034 4.56013L3.44869 4.69178L6.40212 5.21837C6.8099 5.29108 7.19941 5.01945 7.27212 4.61167C7.34483 4.20388 7.07319 3.81437 6.66541 3.74166L5.40612 3.51713C6.17807 3.10173 7.06003 2.86677 8 2.86677C11.0376 2.86677 13.5 5.3292 13.5 8.36677C13.5 11.4043 11.0376 13.8668 8 13.8668C4.96243 13.8668 2.5 11.4043 2.5 8.36677C2.5 7.95255 2.16421 7.61677 1.75 7.61677C1.33579 7.61677 1 7.95255 1 8.36677C1 12.2328 4.13401 15.3668 8 15.3668C11.866 15.3668 15 12.2328 15 8.36677C15 4.50077 11.866 1.36677 8 1.36677C6.78499 1.36677 5.64483 1.6762 4.65119 2.22026L4.84529 1.13165C4.918 0.72387 4.64636 0.334357 4.23858 0.261649Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
