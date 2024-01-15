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

export const PlayOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.39 10.0219L10.9466 8.424C11.2599 8.22817 11.2599 7.77183 10.9466 7.576L8.39 5.97812C8.05698 5.76998 7.625 6.00941 7.625 6.40212V9.59788C7.625 9.99059 8.05697 10.23 8.39 10.0219Z" fill={ colors[0] }/>
    <path d="M8.875 1C5.00901 1 1.875 4.13401 1.875 8C1.875 11.866 5.00901 15 8.875 15C12.741 15 15.875 11.866 15.875 8C15.875 4.13401 12.741 1 8.875 1ZM3.375 8C3.375 4.96243 5.83743 2.5 8.875 2.5C11.9126 2.5 14.375 4.96243 14.375 8C14.375 11.0376 11.9126 13.5 8.875 13.5C5.83743 13.5 3.375 11.0376 3.375 8Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'play_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8.39 10.0219L10.9466 8.424C11.2599 8.22817 11.2599 7.77183 10.9466 7.576L8.39 5.97812C8.05698 5.76998 7.625 6.00941 7.625 6.40212V9.59788C7.625 9.99059 8.05697 10.23 8.39 10.0219Z', 'M8.875 1C5.00901 1 1.875 4.13401 1.875 8C1.875 11.866 5.00901 15 8.875 15C12.741 15 15.875 11.866 15.875 8C15.875 4.13401 12.741 1 8.875 1ZM3.375 8C3.375 4.96243 5.83743 2.5 8.875 2.5C11.9126 2.5 14.375 4.96243 14.375 8C14.375 11.0376 11.9126 13.5 8.875 13.5C5.83743 13.5 3.375 11.0376 3.375 8Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
