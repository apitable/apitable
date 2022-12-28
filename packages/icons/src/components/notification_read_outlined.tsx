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

export const NotificationReadOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3.4 5.7C3.8 5.7 4.1 5.5 4.1 5.1C4.4 3.3 5.8 2 7.6 2H7.8C8.3 2 8.9 2.1 9.4 2.4L10 2.7C10.3 2.9 10.7 2.9 10.9 2.6C11.1 2.3 11.1 1.9 10.8 1.7C10.6789 1.57889 10.5211 1.49445 10.3489 1.40226C10.2367 1.34222 10.1183 1.27889 10 1.2C9.3 0.799997 8.6 0.699997 7.8 0.699997H7.6C5.2 0.699997 3.1 2.5 2.8 5C2.8 5.3 3.1 5.6 3.4 5.7ZM14 11.4L13.4 10.2C13.2 9.8 13.1 9.4 13.1 9L12.8 6C12.8 5.6 12.4 5.4 12.1 5.4C11.7 5.4 11.5 5.8 11.5 6.1L11.8 9.1C11.9 9.7 12 10.2 12.3 10.7L12.4 11H3.1L3.2 10.7C3.4 10.4 3.2 10 2.9 9.8C2.6 9.6 2.2 9.8 2 10.1L1.4 11.3C1.3 11.5 1.3 11.8 1.4 11.9C1.5 12.1 1.7 12.2 2 12.2H5.2V12.3C5.2 13.7 6.3 14.8 7.7 14.8C9.1 14.8 10.2 13.7 10.2 12.3V12.2H13.4C13.6 12.2 13.8 12.1 14 11.9C14.1 11.9 14.1 11.6 14 11.4ZM9 12.5C9 13.2 8.4 13.8 7.7 13.8C7 13.8 6.4 13.2 6.4 12.5V12.4L9 12.5ZM5.3 10.4C5.2 10.4 5 10.3 4.9 10.2L2.2 7.8C1.9 7.5 1.9 7.1 2.2 6.8C2.4 6.6 2.8 6.5 3.2 6.8L5.4 8.8L11.9 2.6C12.1 2.3 12.5 2.3 12.8 2.6C13.1 2.8 13.1 3.2 12.8 3.5L5.8 10.2C5.74641 10.2268 5.7 10.2536 5.65692 10.2785C5.53923 10.3464 5.44641 10.4 5.3 10.4Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'notification_read_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M3.4 5.7C3.8 5.7 4.1 5.5 4.1 5.1C4.4 3.3 5.8 2 7.6 2H7.8C8.3 2 8.9 2.1 9.4 2.4L10 2.7C10.3 2.9 10.7 2.9 10.9 2.6C11.1 2.3 11.1 1.9 10.8 1.7C10.6789 1.57889 10.5211 1.49445 10.3489 1.40226C10.2367 1.34222 10.1183 1.27889 10 1.2C9.3 0.799997 8.6 0.699997 7.8 0.699997H7.6C5.2 0.699997 3.1 2.5 2.8 5C2.8 5.3 3.1 5.6 3.4 5.7ZM14 11.4L13.4 10.2C13.2 9.8 13.1 9.4 13.1 9L12.8 6C12.8 5.6 12.4 5.4 12.1 5.4C11.7 5.4 11.5 5.8 11.5 6.1L11.8 9.1C11.9 9.7 12 10.2 12.3 10.7L12.4 11H3.1L3.2 10.7C3.4 10.4 3.2 10 2.9 9.8C2.6 9.6 2.2 9.8 2 10.1L1.4 11.3C1.3 11.5 1.3 11.8 1.4 11.9C1.5 12.1 1.7 12.2 2 12.2H5.2V12.3C5.2 13.7 6.3 14.8 7.7 14.8C9.1 14.8 10.2 13.7 10.2 12.3V12.2H13.4C13.6 12.2 13.8 12.1 14 11.9C14.1 11.9 14.1 11.6 14 11.4ZM9 12.5C9 13.2 8.4 13.8 7.7 13.8C7 13.8 6.4 13.2 6.4 12.5V12.4L9 12.5ZM5.3 10.4C5.2 10.4 5 10.3 4.9 10.2L2.2 7.8C1.9 7.5 1.9 7.1 2.2 6.8C2.4 6.6 2.8 6.5 3.2 6.8L5.4 8.8L11.9 2.6C12.1 2.3 12.5 2.3 12.8 2.6C13.1 2.8 13.1 3.2 12.8 3.5L5.8 10.2C5.74641 10.2268 5.7 10.2536 5.65692 10.2785C5.53923 10.3464 5.44641 10.4 5.3 10.4Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
