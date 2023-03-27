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

export const CommentOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M4.5 6C3.94772 6 3.5 6.44772 3.5 7C3.5 7.55228 3.94772 8 4.5 8C5.05228 8 5.5 7.55228 5.5 7C5.5 6.44772 5.05228 6 4.5 6Z" fill={ colors[0] }/>
    <path d="M7 7C7 6.44772 7.44772 6 8 6C8.55228 6 9 6.44772 9 7C9 7.55228 8.55228 8 8 8C7.44772 8 7 7.55228 7 7Z" fill={ colors[0] }/>
    <path d="M11.5 6C10.9477 6 10.5 6.44772 10.5 7C10.5 7.55228 10.9477 8 11.5 8C12.0523 8 12.5 7.55228 12.5 7C12.5 6.44772 12.0523 6 11.5 6Z" fill={ colors[0] }/>
    <path d="M2.25 2C1.55964 2 1 2.55964 1 3.25V10.75C1 11.4404 1.55964 12 2.25 12H5.6632L7.06574 13.5779C7.56298 14.1372 8.43702 14.1372 8.93426 13.5779L10.3368 12H13.75C14.4404 12 15 11.4404 15 10.75V3.25C15 2.55964 14.4404 2 13.75 2H2.25ZM2.5 10.5V3.5H13.5V10.5H10.2245C9.86749 10.5 9.52748 10.6527 9.29027 10.9195L8 12.3711L6.70973 10.9195C6.47252 10.6527 6.13251 10.5 5.77547 10.5H2.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'comment_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M4.5 6C3.94772 6 3.5 6.44772 3.5 7C3.5 7.55228 3.94772 8 4.5 8C5.05228 8 5.5 7.55228 5.5 7C5.5 6.44772 5.05228 6 4.5 6Z', 'M7 7C7 6.44772 7.44772 6 8 6C8.55228 6 9 6.44772 9 7C9 7.55228 8.55228 8 8 8C7.44772 8 7 7.55228 7 7Z', 'M11.5 6C10.9477 6 10.5 6.44772 10.5 7C10.5 7.55228 10.9477 8 11.5 8C12.0523 8 12.5 7.55228 12.5 7C12.5 6.44772 12.0523 6 11.5 6Z', 'M2.25 2C1.55964 2 1 2.55964 1 3.25V10.75C1 11.4404 1.55964 12 2.25 12H5.6632L7.06574 13.5779C7.56298 14.1372 8.43702 14.1372 8.93426 13.5779L10.3368 12H13.75C14.4404 12 15 11.4404 15 10.75V3.25C15 2.55964 14.4404 2 13.75 2H2.25ZM2.5 10.5V3.5H13.5V10.5H10.2245C9.86749 10.5 9.52748 10.6527 9.29027 10.9195L8 12.3711L6.70973 10.9195C6.47252 10.6527 6.13251 10.5 5.77547 10.5H2.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
