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

export const EmailSigninFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M4 3H13C13.6 3 14 3.4 14 4V4.5C14 4.8 13.9 4.9 13.7 5L8.7 6.6C8.5 6.7 8.3 6.7 8.1 6.6L3.3 5C3.1 4.9 3 4.7 3 4.5V4C3 3.4 3.4 3 4 3ZM8.8 7.7L13.3 6.2C13.7 6.1 14 6.3 14 6.7V12C14 12.6 13.6 13 13 13H4C3.4 13 3 12.6 3 12V6.7C3 6.3 3.3 6.1 3.7 6.2L8.2 7.7C8.4 7.8 8.6 7.8 8.8 7.7Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'email_signin_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M4 3H13C13.6 3 14 3.4 14 4V4.5C14 4.8 13.9 4.9 13.7 5L8.7 6.6C8.5 6.7 8.3 6.7 8.1 6.6L3.3 5C3.1 4.9 3 4.7 3 4.5V4C3 3.4 3.4 3 4 3ZM8.8 7.7L13.3 6.2C13.7 6.1 14 6.3 14 6.7V12C14 12.6 13.6 13 13 13H4C3.4 13 3 12.6 3 12V6.7C3 6.3 3.3 6.1 3.7 6.2L8.2 7.7C8.4 7.8 8.6 7.8 8.8 7.7Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
