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

export const ChevronUpOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M12 11C11.7 11 11.5 10.9 11.3 10.7L8 7.4L4.7 10.7C4.3 11.1 3.7 11.1 3.3 10.7C2.9 10.3 2.9 9.7 3.3 9.3L7.3 5.3C7.7 4.9 8.3 4.9 8.7 5.3L12.7 9.3C13.1 9.7 13.1 10.3 12.7 10.7C12.5 10.9 12.3 11 12 11Z" fill={ colors[0] }/>

  </>,
  name: 'chevron_up_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M12 11C11.7 11 11.5 10.9 11.3 10.7L8 7.4L4.7 10.7C4.3 11.1 3.7 11.1 3.3 10.7C2.9 10.3 2.9 9.7 3.3 9.3L7.3 5.3C7.7 4.9 8.3 4.9 8.7 5.3L12.7 9.3C13.1 9.7 13.1 10.3 12.7 10.7C12.5 10.9 12.3 11 12 11Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
