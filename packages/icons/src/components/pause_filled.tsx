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

export const PauseFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8 1.625C4.13401 1.625 1 4.75901 1 8.625C1 12.491 4.13401 15.625 8 15.625C11.866 15.625 15 12.491 15 8.625C15 4.75901 11.866 1.625 8 1.625ZM5.5 6.375C5.5 5.96079 5.83579 5.625 6.25 5.625C6.66421 5.625 7 5.96079 7 6.375V10.875C7 11.2892 6.66421 11.625 6.25 11.625C5.83579 11.625 5.5 11.2892 5.5 10.875V6.375ZM9.75 5.625C9.33579 5.625 9 5.96079 9 6.375V10.875C9 11.2892 9.33579 11.625 9.75 11.625C10.1642 11.625 10.5 11.2892 10.5 10.875V6.375C10.5 5.96079 10.1642 5.625 9.75 5.625Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'pause_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8 1.625C4.13401 1.625 1 4.75901 1 8.625C1 12.491 4.13401 15.625 8 15.625C11.866 15.625 15 12.491 15 8.625C15 4.75901 11.866 1.625 8 1.625ZM5.5 6.375C5.5 5.96079 5.83579 5.625 6.25 5.625C6.66421 5.625 7 5.96079 7 6.375V10.875C7 11.2892 6.66421 11.625 6.25 11.625C5.83579 11.625 5.5 11.2892 5.5 10.875V6.375ZM9.75 5.625C9.33579 5.625 9 5.96079 9 6.375V10.875C9 11.2892 9.33579 11.625 9.75 11.625C10.1642 11.625 10.5 11.2892 10.5 10.875V6.375C10.5 5.96079 10.1642 5.625 9.75 5.625Z'],
  width: '17',
  height: '17',
  viewBox: '0 0 17 17',
});
