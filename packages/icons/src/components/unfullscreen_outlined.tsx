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

export const UnfullscreenOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M9 8C8.5 8 8.1 7.6 8 7.1V7L8 3C8 2.4 8.4 2 9 2C9.5 2 9.9 2.4 10 2.9V3V6H13C13.5 6 13.9 6.4 14 6.9V7C14 7.5 13.6 7.9 13.1 8H13L9 8ZM6 10H3C2.5 10 2.1 9.6 2 9.1V9C2 8.5 2.4 8.1 2.9 8H3L7 8C7.5 8 7.9 8.4 8 8.9V9L8 13C8 13.6 7.6 14 7 14C6.5 14 6.1 13.6 6 13.1V13L6 10Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'unfullscreen_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M9 8C8.5 8 8.1 7.6 8 7.1V7L8 3C8 2.4 8.4 2 9 2C9.5 2 9.9 2.4 10 2.9V3V6H13C13.5 6 13.9 6.4 14 6.9V7C14 7.5 13.6 7.9 13.1 8H13L9 8ZM6 10H3C2.5 10 2.1 9.6 2 9.1V9C2 8.5 2.4 8.1 2.9 8H3L7 8C7.5 8 7.9 8.4 8 8.9V9L8 13C8 13.6 7.6 14 7 14C6.5 14 6.1 13.6 6 13.1V13L6 10Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
