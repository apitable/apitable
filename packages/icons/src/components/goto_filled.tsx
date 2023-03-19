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

export const GotoFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2.75 1.5C2.05964 1.5 1.5 2.05964 1.5 2.75V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H2.75ZM12.75 7.5V4.0007L12.75 3.99308C12.7491 3.89391 12.7289 3.79933 12.6931 3.71291C12.6565 3.62445 12.6022 3.54158 12.5303 3.46967C12.4584 3.39776 12.3755 3.34351 12.2871 3.30691C12.1987 3.27024 12.1017 3.25 12 3.25H8.49999C8.08578 3.25 7.74999 3.58579 7.74999 4C7.74999 4.41421 8.08578 4.75 8.49999 4.75L10.1893 4.75L6.51992 8.41942C6.22702 8.71231 6.22702 9.18718 6.51992 9.48008C6.81281 9.77297 7.28768 9.77297 7.58058 9.48008L11.25 5.81066V7.5C11.25 7.91421 11.5858 8.25 12 8.25C12.4142 8.25 12.75 7.91421 12.75 7.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'goto_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M2.75 1.5C2.05964 1.5 1.5 2.05964 1.5 2.75V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H2.75ZM12.75 7.5V4.0007L12.75 3.99308C12.7491 3.89391 12.7289 3.79933 12.6931 3.71291C12.6565 3.62445 12.6022 3.54158 12.5303 3.46967C12.4584 3.39776 12.3755 3.34351 12.2871 3.30691C12.1987 3.27024 12.1017 3.25 12 3.25H8.49999C8.08578 3.25 7.74999 3.58579 7.74999 4C7.74999 4.41421 8.08578 4.75 8.49999 4.75L10.1893 4.75L6.51992 8.41942C6.22702 8.71231 6.22702 9.18718 6.51992 9.48008C6.81281 9.77297 7.28768 9.77297 7.58058 9.48008L11.25 5.81066V7.5C11.25 7.91421 11.5858 8.25 12 8.25C12.4142 8.25 12.75 7.91421 12.75 7.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
