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

export const FolderNormalOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5.39064 1.99988C5.67642 1.99988 5.95358 2.0978 6.17592 2.27734L7.38038 3.24988H14.25C14.9404 3.24988 15.5 3.80952 15.5 4.49988L15.5 12.7499C15.5 13.4402 14.9404 13.9999 14.25 13.9999H2.75C2.05964 13.9999 1.5 13.4402 1.5 12.7499V3.24988C1.5 2.55952 2.05964 1.99988 2.75 1.99988H5.39064ZM6.50677 4.47242L5.30231 3.49988H3V6H14V4.74988H7.29205C7.00627 4.74988 6.72912 4.65195 6.50677 4.47242ZM14 7.5H3V12.4999H14L14 7.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'folder_normal_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M5.39064 1.99988C5.67642 1.99988 5.95358 2.0978 6.17592 2.27734L7.38038 3.24988H14.25C14.9404 3.24988 15.5 3.80952 15.5 4.49988L15.5 12.7499C15.5 13.4402 14.9404 13.9999 14.25 13.9999H2.75C2.05964 13.9999 1.5 13.4402 1.5 12.7499V3.24988C1.5 2.55952 2.05964 1.99988 2.75 1.99988H5.39064ZM6.50677 4.47242L5.30231 3.49988H3V6H14V4.74988H7.29205C7.00627 4.74988 6.72912 4.65195 6.50677 4.47242ZM14 7.5H3V12.4999H14L14 7.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
