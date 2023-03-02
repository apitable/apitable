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

export const FileFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2 2.25C2 1.55964 2.55964 1 3.25 1H10.0461C10.3821 1 10.7039 1.13526 10.939 1.37528L13.6429 4.13551C13.8718 4.36915 14 4.68318 14 5.01023V13.75C14 14.4404 13.4404 15 12.75 15H3.25C2.55964 15 2 14.4404 2 13.75V2.25ZM4.75 8C4.75 7.58579 5.08579 7.25 5.5 7.25H9C9.41421 7.25 9.75 7.58579 9.75 8C9.75 8.41421 9.41421 8.75 9 8.75H5.5C5.08579 8.75 4.75 8.41421 4.75 8ZM5.5 10.25C5.08579 10.25 4.75 10.5858 4.75 11C4.75 11.4142 5.08579 11.75 5.5 11.75H10.5C10.9142 11.75 11.25 11.4142 11.25 11C11.25 10.5858 10.9142 10.25 10.5 10.25H5.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'file_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M2 2.25C2 1.55964 2.55964 1 3.25 1H10.0461C10.3821 1 10.7039 1.13526 10.939 1.37528L13.6429 4.13551C13.8718 4.36915 14 4.68318 14 5.01023V13.75C14 14.4404 13.4404 15 12.75 15H3.25C2.55964 15 2 14.4404 2 13.75V2.25ZM4.75 8C4.75 7.58579 5.08579 7.25 5.5 7.25H9C9.41421 7.25 9.75 7.58579 9.75 8C9.75 8.41421 9.41421 8.75 9 8.75H5.5C5.08579 8.75 4.75 8.41421 4.75 8ZM5.5 10.25C5.08579 10.25 4.75 10.5858 4.75 11C4.75 11.4142 5.08579 11.75 5.5 11.75H10.5C10.9142 11.75 11.25 11.4142 11.25 11C11.25 10.5858 10.9142 10.25 10.5 10.25H5.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
