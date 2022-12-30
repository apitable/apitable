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

export const ZoomInOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M0.25 8.00003C0.25 3.71982 3.71979 0.250031 8 0.250031C12.2802 0.250031 15.75 3.71982 15.75 8.00003C15.75 12.2802 12.2802 15.75 8 15.75C3.71979 15.75 0.25 12.2802 0.25 8.00003ZM8 1.75003C4.54822 1.75003 1.75 4.54825 1.75 8.00003C1.75 11.4518 4.54822 14.25 8 14.25C11.4518 14.25 14.25 11.4518 14.25 8.00003C14.25 4.54825 11.4518 1.75003 8 1.75003ZM4.04998 8.00001C4.04998 7.5858 4.38577 7.25001 4.79998 7.25001H7.24998V4.80001C7.24998 4.3858 7.58577 4.05001 7.99998 4.05001C8.4142 4.05001 8.74998 4.3858 8.74998 4.80001V7.25001H11.2C11.6142 7.25001 11.95 7.5858 11.95 8.00001C11.95 8.41423 11.6142 8.75001 11.2 8.75001H8.74998V11.2C8.74998 11.6142 8.4142 11.95 7.99998 11.95C7.58577 11.95 7.24998 11.6142 7.24998 11.2V8.75001H4.79998C4.38577 8.75001 4.04998 8.41423 4.04998 8.00001Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'zoom_in_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M0.25 8.00003C0.25 3.71982 3.71979 0.250031 8 0.250031C12.2802 0.250031 15.75 3.71982 15.75 8.00003C15.75 12.2802 12.2802 15.75 8 15.75C3.71979 15.75 0.25 12.2802 0.25 8.00003ZM8 1.75003C4.54822 1.75003 1.75 4.54825 1.75 8.00003C1.75 11.4518 4.54822 14.25 8 14.25C11.4518 14.25 14.25 11.4518 14.25 8.00003C14.25 4.54825 11.4518 1.75003 8 1.75003ZM4.04998 8.00001C4.04998 7.5858 4.38577 7.25001 4.79998 7.25001H7.24998V4.80001C7.24998 4.3858 7.58577 4.05001 7.99998 4.05001C8.4142 4.05001 8.74998 4.3858 8.74998 4.80001V7.25001H11.2C11.6142 7.25001 11.95 7.5858 11.95 8.00001C11.95 8.41423 11.6142 8.75001 11.2 8.75001H8.74998V11.2C8.74998 11.6142 8.4142 11.95 7.99998 11.95C7.58577 11.95 7.24998 11.6142 7.24998 11.2V8.75001H4.79998C4.38577 8.75001 4.04998 8.41423 4.04998 8.00001Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
