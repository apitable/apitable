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

export const SearchOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M12.5 11.7L11.3 10.5C11.9 9.7 12.3 8.7 12.3 7.7C12.3 5.1 10.2 3 7.6 3C5.1 3 3 5.1 3 7.7C3 10.3 5.1 12.4 7.7 12.4C8.5 12.4 9.2 12.2 9.8 11.9L11.1 13.2C11.5 13.6 12.1 13.6 12.5 13.2C12.9 12.7 12.9 12.1 12.5 11.7ZM5 7.7C5 6.2 6.2 5 7.7 5C9.2 5 10.4 6.2 10.4 7.7C10.4 9.2 9.2 10.4 7.7 10.4C6.2 10.4 5 9.1 5 7.7Z" fill={ colors[0] }/>

  </>,
  name: 'search_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M12.5 11.7L11.3 10.5C11.9 9.7 12.3 8.7 12.3 7.7C12.3 5.1 10.2 3 7.6 3C5.1 3 3 5.1 3 7.7C3 10.3 5.1 12.4 7.7 12.4C8.5 12.4 9.2 12.2 9.8 11.9L11.1 13.2C11.5 13.6 12.1 13.6 12.5 13.2C12.9 12.7 12.9 12.1 12.5 11.7ZM5 7.7C5 6.2 6.2 5 7.7 5C9.2 5 10.4 6.2 10.4 7.7C10.4 9.2 9.2 10.4 7.7 10.4C6.2 10.4 5 9.1 5 7.7Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
