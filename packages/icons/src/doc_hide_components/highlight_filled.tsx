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

export const HighlightFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.79352 2.92238C9.15865 2.43554 9.87031 2.38496 10.3006 2.81527L15.034 7.54863C15.4643 7.97894 15.4137 8.69061 14.9269 9.05574L10.8863 12.0862C10.4881 12.3848 9.93105 12.3452 9.57916 11.9933L9.48519 11.8993L8.5709 12.8136C8.48347 12.9011 8.367 12.9528 8.24416 12.9594C8.16762 12.9857 8.08548 13 8 13H1.75C1.33579 13 1 12.6642 1 12.25C1 11.8358 1.33579 11.5 1.75 11.5H2.81346L5.94966 8.36381L5.85595 8.2701C5.50406 7.9182 5.46447 7.36111 5.76306 6.96299L8.79352 2.92238ZM7.01024 9.42455L4.9747 11.4601L7.80313 11.4601L8.42445 10.8388L7.01024 9.42455Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'highlight_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8.79352 2.92238C9.15865 2.43554 9.87031 2.38496 10.3006 2.81527L15.034 7.54863C15.4643 7.97894 15.4137 8.69061 14.9269 9.05574L10.8863 12.0862C10.4881 12.3848 9.93105 12.3452 9.57916 11.9933L9.48519 11.8993L8.5709 12.8136C8.48347 12.9011 8.367 12.9528 8.24416 12.9594C8.16762 12.9857 8.08548 13 8 13H1.75C1.33579 13 1 12.6642 1 12.25C1 11.8358 1.33579 11.5 1.75 11.5H2.81346L5.94966 8.36381L5.85595 8.2701C5.50406 7.9182 5.46447 7.36111 5.76306 6.96299L8.79352 2.92238ZM7.01024 9.42455L4.9747 11.4601L7.80313 11.4601L8.42445 10.8388L7.01024 9.42455Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
