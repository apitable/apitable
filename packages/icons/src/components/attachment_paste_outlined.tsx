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

export const AttachmentPasteOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M13.5 0.6L15.6 3C15.9 3.3 16 3.7 16 4.1V11.8C16 12.4 15.6 12.8 15 12.8C14.4 12.8 14 12.4 14 11.8V4.2L12 2H6C5.4 2 5 1.6 5 1C5 0.4 5.4 0 6 0H12.2C12.7 0 13.1 0.2 13.5 0.6ZM9.2 3C9.7 3 10.1 3.2 10.4 3.5L12.7 5.9C12.9 6.2 13.1 6.6 13.1 7V14.3C13.1 15.3 12.3 16 11.4 16H2.7C1.7 16 1 15.3 1 14.4V4.7C1 3.7 1.7 3 2.7 3H9.2ZM10.9 7L9.5 5.5V7H10.9ZM3 5V14H11V9H9.2C8.2 9 7.5 8.3 7.5 7.3V5H3ZM5 10H6C6.6 10 7 9.6 7 9C7 8.4 6.6 8 6 8H5C4.4 8 4 8.4 4 9C4 9.6 4.4 10 5 10ZM5 11H8C8.6 11 9 11.4 9 12C9 12.6 8.6 13 8 13H5C4.4 13 4 12.6 4 12C4 11.4 4.4 11 5 11Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'attachment_paste_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M13.5 0.6L15.6 3C15.9 3.3 16 3.7 16 4.1V11.8C16 12.4 15.6 12.8 15 12.8C14.4 12.8 14 12.4 14 11.8V4.2L12 2H6C5.4 2 5 1.6 5 1C5 0.4 5.4 0 6 0H12.2C12.7 0 13.1 0.2 13.5 0.6ZM9.2 3C9.7 3 10.1 3.2 10.4 3.5L12.7 5.9C12.9 6.2 13.1 6.6 13.1 7V14.3C13.1 15.3 12.3 16 11.4 16H2.7C1.7 16 1 15.3 1 14.4V4.7C1 3.7 1.7 3 2.7 3H9.2ZM10.9 7L9.5 5.5V7H10.9ZM3 5V14H11V9H9.2C8.2 9 7.5 8.3 7.5 7.3V5H3ZM5 10H6C6.6 10 7 9.6 7 9C7 8.4 6.6 8 6 8H5C4.4 8 4 8.4 4 9C4 9.6 4.4 10 5 10ZM5 11H8C8.6 11 9 11.4 9 12C9 12.6 8.6 13 8 13H5C4.4 13 4 12.6 4 12C4 11.4 4.4 11 5 11Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
