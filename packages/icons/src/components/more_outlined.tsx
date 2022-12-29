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

export const MoreOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2.4 9.40001C3.1732 9.40001 3.8 8.77321 3.8 8.00001C3.8 7.22681 3.1732 6.60001 2.4 6.60001C1.6268 6.60001 1 7.22681 1 8.00001C1 8.77321 1.6268 9.40001 2.4 9.40001ZM8 9.40001C8.7732 9.40001 9.4 8.77321 9.4 8.00001C9.4 7.22681 8.7732 6.60001 8 6.60001C7.2268 6.60001 6.6 7.22681 6.6 8.00001C6.6 8.77321 7.2268 9.40001 8 9.40001ZM15 8.00001C15 8.77321 14.3732 9.40001 13.6 9.40001C12.8268 9.40001 12.2 8.77321 12.2 8.00001C12.2 7.22681 12.8268 6.60001 13.6 6.60001C14.3732 6.60001 15 7.22681 15 8.00001Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'more_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M2.4 9.40001C3.1732 9.40001 3.8 8.77321 3.8 8.00001C3.8 7.22681 3.1732 6.60001 2.4 6.60001C1.6268 6.60001 1 7.22681 1 8.00001C1 8.77321 1.6268 9.40001 2.4 9.40001ZM8 9.40001C8.7732 9.40001 9.4 8.77321 9.4 8.00001C9.4 7.22681 8.7732 6.60001 8 6.60001C7.2268 6.60001 6.6 7.22681 6.6 8.00001C6.6 8.77321 7.2268 9.40001 8 9.40001ZM15 8.00001C15 8.77321 14.3732 9.40001 13.6 9.40001C12.8268 9.40001 12.2 8.77321 12.2 8.00001C12.2 7.22681 12.8268 6.60001 13.6 6.60001C14.3732 6.60001 15 7.22681 15 8.00001Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
