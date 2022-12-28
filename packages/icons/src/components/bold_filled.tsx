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

export const BoldFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M4.12 2.576V14H9.368C10.584 14 11.544 13.776 12.216 13.328C13 12.784 13.4 11.936 13.4 10.784C13.4 10.016 13.208 9.392 12.84 8.944C12.456 8.48 11.896 8.176 11.144 8.032C11.72 7.808 12.152 7.504 12.456 7.088C12.76 6.64 12.92 6.096 12.92 5.456C12.92 4.592 12.616 3.904 12.024 3.392C11.384 2.848 10.488 2.576 9.352 2.576H4.12ZM5.992 4.112H8.888C9.656 4.112 10.2 4.24 10.552 4.496C10.872 4.736 11.048 5.136 11.048 5.68C11.048 6.272 10.872 6.704 10.552 6.976C10.216 7.232 9.656 7.376 8.856 7.376H5.992V4.112ZM5.992 8.912H9.144C9.976 8.912 10.584 9.056 10.968 9.344C11.336 9.632 11.528 10.096 11.528 10.752C11.528 11.392 11.272 11.84 10.76 12.128C10.36 12.352 9.8 12.464 9.096 12.464H5.992V8.912Z" fill={ colors[0] }/>

  </>,
  name: 'bold_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M4.12 2.576V14H9.368C10.584 14 11.544 13.776 12.216 13.328C13 12.784 13.4 11.936 13.4 10.784C13.4 10.016 13.208 9.392 12.84 8.944C12.456 8.48 11.896 8.176 11.144 8.032C11.72 7.808 12.152 7.504 12.456 7.088C12.76 6.64 12.92 6.096 12.92 5.456C12.92 4.592 12.616 3.904 12.024 3.392C11.384 2.848 10.488 2.576 9.352 2.576H4.12ZM5.992 4.112H8.888C9.656 4.112 10.2 4.24 10.552 4.496C10.872 4.736 11.048 5.136 11.048 5.68C11.048 6.272 10.872 6.704 10.552 6.976C10.216 7.232 9.656 7.376 8.856 7.376H5.992V4.112ZM5.992 8.912H9.144C9.976 8.912 10.584 9.056 10.968 9.344C11.336 9.632 11.528 10.096 11.528 10.752C11.528 11.392 11.272 11.84 10.76 12.128C10.36 12.352 9.8 12.464 9.096 12.464H5.992V8.912Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
