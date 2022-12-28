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

export const ZoomOutOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8 0.250031C3.71979 0.250031 0.25 3.71982 0.25 8.00003C0.25 12.2802 3.71979 15.75 8 15.75C12.2802 15.75 15.75 12.2802 15.75 8.00003C15.75 3.71982 12.2802 0.250031 8 0.250031ZM1.75 8.00003C1.75 4.54825 4.54822 1.75003 8 1.75003C11.4518 1.75003 14.25 4.54825 14.25 8.00003C14.25 11.4518 11.4518 14.25 8 14.25C4.54822 14.25 1.75 11.4518 1.75 8.00003ZM4.79998 7.25001C4.38577 7.25001 4.04998 7.5858 4.04998 8.00001C4.04998 8.41423 4.38577 8.75001 4.79998 8.75001H11.2C11.6142 8.75001 11.95 8.41423 11.95 8.00001C11.95 7.5858 11.6142 7.25001 11.2 7.25001H4.79998Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'zoom_out_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M8 0.250031C3.71979 0.250031 0.25 3.71982 0.25 8.00003C0.25 12.2802 3.71979 15.75 8 15.75C12.2802 15.75 15.75 12.2802 15.75 8.00003C15.75 3.71982 12.2802 0.250031 8 0.250031ZM1.75 8.00003C1.75 4.54825 4.54822 1.75003 8 1.75003C11.4518 1.75003 14.25 4.54825 14.25 8.00003C14.25 11.4518 11.4518 14.25 8 14.25C4.54822 14.25 1.75 11.4518 1.75 8.00003ZM4.79998 7.25001C4.38577 7.25001 4.04998 7.5858 4.04998 8.00001C4.04998 8.41423 4.38577 8.75001 4.79998 8.75001H11.2C11.6142 8.75001 11.95 8.41423 11.95 8.00001C11.95 7.5858 11.6142 7.25001 11.2 7.25001H4.79998Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
