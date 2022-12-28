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

export const GotoSmallOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M9 7C9 6.7 9.2 6.5 9.5 6.5C9.8 6.5 10 6.7 10 7V8.5C10 9.3 9.3 10 8.5 10H1.5C0.7 10 0 9.3 0 8.5V1.5C0 0.7 0.7 0 1.5 0H3C3.3 0 3.5 0.2 3.5 0.5C3.5 0.8 3.3 1 3 1H1.5C1.2 1 1 1.2 1 1.5V8.5C1 8.8 1.2 9 1.5 9H8.5C8.8 9 9 8.8 9 8.5V7ZM9.7 0.05C9.775 0.075 9.85 0.1 9.9 0.1C9.9 0.15 9.925 0.225 9.95 0.3C9.975 0.375 10 0.45 10 0.5V4C10 4.3 9.8 4.5 9.5 4.5C9.2 4.5 9 4.3 9 4V1.7L4.9 5.9C4.8 6 4.6 6 4.5 6C4.4 6 4.2 6 4.1 5.9C4 5.7 4 5.3 4.1 5.1L8.3 1H6C5.7 1 5.5 0.8 5.5 0.5C5.5 0.2 5.7 0 6 0H9.5C9.55 0 9.625 0.025 9.7 0.05Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'goto_small_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M9 7C9 6.7 9.2 6.5 9.5 6.5C9.8 6.5 10 6.7 10 7V8.5C10 9.3 9.3 10 8.5 10H1.5C0.7 10 0 9.3 0 8.5V1.5C0 0.7 0.7 0 1.5 0H3C3.3 0 3.5 0.2 3.5 0.5C3.5 0.8 3.3 1 3 1H1.5C1.2 1 1 1.2 1 1.5V8.5C1 8.8 1.2 9 1.5 9H8.5C8.8 9 9 8.8 9 8.5V7ZM9.7 0.05C9.775 0.075 9.85 0.1 9.9 0.1C9.9 0.15 9.925 0.225 9.95 0.3C9.975 0.375 10 0.45 10 0.5V4C10 4.3 9.8 4.5 9.5 4.5C9.2 4.5 9 4.3 9 4V1.7L4.9 5.9C4.8 6 4.6 6 4.5 6C4.4 6 4.2 6 4.1 5.9C4 5.7 4 5.3 4.1 5.1L8.3 1H6C5.7 1 5.5 0.8 5.5 0.5C5.5 0.2 5.7 0 6 0H9.5C9.55 0 9.625 0.025 9.7 0.05Z'],
  width: '10',
  height: '10',
  viewBox: '0 0 10 10',
});
