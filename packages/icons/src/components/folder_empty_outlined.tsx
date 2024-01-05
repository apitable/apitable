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

export const FolderEmptyOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M4.89064 1.99988C5.17642 1.99988 5.45358 2.0978 5.67592 2.27734L6.88038 3.24988H13.75C14.4404 3.24988 15 3.80952 15 4.49988L15 12.7499C15 13.4402 14.4404 13.9999 13.75 13.9999H2.25C1.55964 13.9999 1 13.4402 1 12.7499V3.24988C1 2.55952 1.55964 1.99988 2.25 1.99988H4.89064ZM6.00677 4.47242L4.80231 3.49988H2.5V12.4999H13.5L13.5 4.74988H6.79205C6.50627 4.74988 6.22912 4.65195 6.00677 4.47242Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'folder_empty_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M4.89064 1.99988C5.17642 1.99988 5.45358 2.0978 5.67592 2.27734L6.88038 3.24988H13.75C14.4404 3.24988 15 3.80952 15 4.49988L15 12.7499C15 13.4402 14.4404 13.9999 13.75 13.9999H2.25C1.55964 13.9999 1 13.4402 1 12.7499V3.24988C1 2.55952 1.55964 1.99988 2.25 1.99988H4.89064ZM6.00677 4.47242L4.80231 3.49988H2.5V12.4999H13.5L13.5 4.74988H6.79205C6.50627 4.74988 6.22912 4.65195 6.00677 4.47242Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
