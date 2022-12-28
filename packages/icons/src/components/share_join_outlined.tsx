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

export const ShareJoinOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M16 8C16 10.2 14.2 12 12 12C9.8 12 8 13.8 8 16H11C11.6 16 12 16.4 12 17C12 17.6 11.6 18 11 18H7C6.5 18 6 17.6 6 17V16C6 13.8 7.3 11.8 9.1 10.8C8.4 10 8 9.1 8 8C8 5.8 9.8 4 12 4C14.2 4 16 5.8 16 8ZM14 8C14 6.9 13.1 6 12 6C10.9 6 10 6.9 10 8C10 9.1 10.9 10 12 10C13.1 10 14 9.1 14 8ZM17 14H18C18.6 14 19 14.4 19 15C19 15.6 18.6 16 18 16H17V17C17 17.6 16.6 18 16 18C15.4 18 15 17.6 15 17V16H14C13.4 16 13 15.6 13 15C13 14.4 13.4 14 14 14H15V13C15 12.4 15.4 12 16 12C16.6 12 17 12.4 17 13V14Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'share_join_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M16 8C16 10.2 14.2 12 12 12C9.8 12 8 13.8 8 16H11C11.6 16 12 16.4 12 17C12 17.6 11.6 18 11 18H7C6.5 18 6 17.6 6 17V16C6 13.8 7.3 11.8 9.1 10.8C8.4 10 8 9.1 8 8C8 5.8 9.8 4 12 4C14.2 4 16 5.8 16 8ZM14 8C14 6.9 13.1 6 12 6C10.9 6 10 6.9 10 8C10 9.1 10.9 10 12 10C13.1 10 14 9.1 14 8ZM17 14H18C18.6 14 19 14.4 19 15C19 15.6 18.6 16 18 16H17V17C17 17.6 16.6 18 16 18C15.4 18 15 17.6 15 17V16H14C13.4 16 13 15.6 13 15C13 14.4 13.4 14 14 14H15V13C15 12.4 15.4 12 16 12C16.6 12 17 12.4 17 13V14Z'],
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
});
