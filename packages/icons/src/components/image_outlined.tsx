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

export const ImageOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M6 5C6 5.55228 5.55228 6 5 6C4.44772 6 4 5.55228 4 5C4 4.44772 4.44772 4 5 4C5.55228 4 6 4.44772 6 5Z" fill={ colors[0] }/>
    <path d="M2.75 1.5C2.05964 1.5 1.5 2.05964 1.5 2.75V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H2.75ZM3 13V10.075C4.46935 10.3733 5.62672 11.5307 5.92499 13H3ZM6.58582 10.7888C5.77387 9.60225 4.48751 8.76594 3 8.55317V3H13V6.03582C10.0947 6.31481 7.65793 8.19785 6.58582 10.7888ZM7.54454 13H13V7.54454C10.1477 7.88565 7.88565 10.1477 7.54454 13Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'image_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M6 5C6 5.55228 5.55228 6 5 6C4.44772 6 4 5.55228 4 5C4 4.44772 4.44772 4 5 4C5.55228 4 6 4.44772 6 5Z', 'M2.75 1.5C2.05964 1.5 1.5 2.05964 1.5 2.75V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H2.75ZM3 13V10.075C4.46935 10.3733 5.62672 11.5307 5.92499 13H3ZM6.58582 10.7888C5.77387 9.60225 4.48751 8.76594 3 8.55317V3H13V6.03582C10.0947 6.31481 7.65793 8.19785 6.58582 10.7888ZM7.54454 13H13V7.54454C10.1477 7.88565 7.88565 10.1477 7.54454 13Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
