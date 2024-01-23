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

export const CommentFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1.875 2.5C1.18464 2.5 0.625 3.05964 0.625 3.75V11.25C0.625 11.9404 1.18464 12.5 1.875 12.5H5.2882L6.69074 14.0779C7.18798 14.6372 8.06202 14.6372 8.55926 14.0779L9.9618 12.5H13.375C14.0654 12.5 14.625 11.9404 14.625 11.25V3.75C14.625 3.05964 14.0654 2.5 13.375 2.5H1.875ZM4.125 6.5C3.57272 6.5 3.125 6.94772 3.125 7.5C3.125 8.05228 3.57272 8.5 4.125 8.5C4.67728 8.5 5.125 8.05228 5.125 7.5C5.125 6.94772 4.67728 6.5 4.125 6.5ZM6.625 7.5C6.625 6.94772 7.07272 6.5 7.625 6.5C8.17728 6.5 8.625 6.94772 8.625 7.5C8.625 8.05228 8.17728 8.5 7.625 8.5C7.07272 8.5 6.625 8.05228 6.625 7.5ZM11.125 6.5C10.5727 6.5 10.125 6.94772 10.125 7.5C10.125 8.05228 10.5727 8.5 11.125 8.5C11.6773 8.5 12.125 8.05228 12.125 7.5C12.125 6.94772 11.6773 6.5 11.125 6.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'comment_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M1.875 2.5C1.18464 2.5 0.625 3.05964 0.625 3.75V11.25C0.625 11.9404 1.18464 12.5 1.875 12.5H5.2882L6.69074 14.0779C7.18798 14.6372 8.06202 14.6372 8.55926 14.0779L9.9618 12.5H13.375C14.0654 12.5 14.625 11.9404 14.625 11.25V3.75C14.625 3.05964 14.0654 2.5 13.375 2.5H1.875ZM4.125 6.5C3.57272 6.5 3.125 6.94772 3.125 7.5C3.125 8.05228 3.57272 8.5 4.125 8.5C4.67728 8.5 5.125 8.05228 5.125 7.5C5.125 6.94772 4.67728 6.5 4.125 6.5ZM6.625 7.5C6.625 6.94772 7.07272 6.5 7.625 6.5C8.17728 6.5 8.625 6.94772 8.625 7.5C8.625 8.05228 8.17728 8.5 7.625 8.5C7.07272 8.5 6.625 8.05228 6.625 7.5ZM11.125 6.5C10.5727 6.5 10.125 6.94772 10.125 7.5C10.125 8.05228 10.5727 8.5 11.125 8.5C11.6773 8.5 12.125 8.05228 12.125 7.5C12.125 6.94772 11.6773 6.5 11.125 6.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
