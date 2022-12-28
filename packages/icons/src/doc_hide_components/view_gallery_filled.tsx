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

export const ViewGalleryFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path opacity="0.6" d="M9.5 8.5C9 8.5 8.6 8.9 8.5 9.4V9.5V14C8.5 14.5 8.9 14.9 9.4 15H9.5H14C14.6 15 15 14.6 15 14V9.5C15 8.9 14.6 8.5 14 8.5H9.5ZM13 10.5H10.5V13H13V10.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M6.5 8.5H2C1.5 8.5 1.1 8.9 1 9.4V9.5V14C1 14.5 1.4 14.9 1.9 15H2H6.5C7.1 15 7.5 14.6 7.5 14V9.5C7.5 8.9 7.1 8.5 6.5 8.5ZM5.5 13H3V10.5H5.5V13Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M6.5 1H2C1.5 1 1.1 1.4 1 1.9V2V6.5C1 7 1.4 7.4 1.9 7.5H2H6.5C7.1 7.5 7.5 7.1 7.5 6.5V2C7.5 1.4 7.1 1 6.5 1ZM5.5 5.5H3V3H5.5V5.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M14 1H9.5C9 1 8.6 1.4 8.5 1.9V2V6.5C8.5 7 8.9 7.4 9.4 7.5H9.5H14C14.6 7.5 15 7.1 15 6.5V2C15 1.4 14.6 1 14 1ZM13 5.5H10.5V3H13V5.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'view_gallery_filled',
  defaultColors: ['#7B67EE'],
  colorful: false,
  allPathData: ['M9.5 8.5C9 8.5 8.6 8.9 8.5 9.4V9.5V14C8.5 14.5 8.9 14.9 9.4 15H9.5H14C14.6 15 15 14.6 15 14V9.5C15 8.9 14.6 8.5 14 8.5H9.5ZM13 10.5H10.5V13H13V10.5Z', 'M6.5 8.5H2C1.5 8.5 1.1 8.9 1 9.4V9.5V14C1 14.5 1.4 14.9 1.9 15H2H6.5C7.1 15 7.5 14.6 7.5 14V9.5C7.5 8.9 7.1 8.5 6.5 8.5ZM5.5 13H3V10.5H5.5V13Z', 'M6.5 1H2C1.5 1 1.1 1.4 1 1.9V2V6.5C1 7 1.4 7.4 1.9 7.5H2H6.5C7.1 7.5 7.5 7.1 7.5 6.5V2C7.5 1.4 7.1 1 6.5 1ZM5.5 5.5H3V3H5.5V5.5Z', 'M14 1H9.5C9 1 8.6 1.4 8.5 1.9V2V6.5C8.5 7 8.9 7.4 9.4 7.5H9.5H14C14.6 7.5 15 7.1 15 6.5V2C15 1.4 14.6 1 14 1ZM13 5.5H10.5V3H13V5.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
