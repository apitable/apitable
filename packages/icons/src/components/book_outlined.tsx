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

export const BookOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3.9 1.3C2.79543 1.3 1.9 2.19543 1.9 3.3V11.8C1.9 13.4569 3.24315 14.8 4.9 14.8H12.9C13.4523 14.8 13.9 14.3523 13.9 13.8V2.3C13.9 1.74772 13.4523 1.3 12.9 1.3H3.9ZM3.9 3.3L11.9 3.3V9.3H3.9V3.3ZM3.9 11.3V11.8C3.9 12.3523 4.34772 12.8 4.9 12.8H11.9V11.3H3.9Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'book_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M3.9 1.3C2.79543 1.3 1.9 2.19543 1.9 3.3V11.8C1.9 13.4569 3.24315 14.8 4.9 14.8H12.9C13.4523 14.8 13.9 14.3523 13.9 13.8V2.3C13.9 1.74772 13.4523 1.3 12.9 1.3H3.9ZM3.9 3.3L11.9 3.3V9.3H3.9V3.3ZM3.9 11.3V11.8C3.9 12.3523 4.34772 12.8 4.9 12.8H11.9V11.3H3.9Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
