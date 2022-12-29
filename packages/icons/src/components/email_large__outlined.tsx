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

export const EmailLargeOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M29.4099 7.5H6.59009L17.8232 18.7331C17.9208 18.8308 18.0791 18.8308 18.1768 18.7331L29.4099 7.5ZM4.63118 7.6624C4.54971 7.75136 4.5 7.86987 4.5 8V28C4.5 28.2761 4.72386 28.5 5 28.5H31C31.2761 28.5 31.5 28.2761 31.5 28V8C31.5 7.86987 31.4503 7.75135 31.3688 7.6624L19.2374 19.7938C18.554 20.4772 17.446 20.4772 16.7626 19.7938L4.63118 7.6624ZM3 8C3 6.89543 3.89543 6 5 6H31C32.1046 6 33 6.89543 33 8V28C33 29.1046 32.1046 30 31 30H5C3.89543 30 3 29.1046 3 28V8Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'email_large__outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M29.4099 7.5H6.59009L17.8232 18.7331C17.9208 18.8308 18.0791 18.8308 18.1768 18.7331L29.4099 7.5ZM4.63118 7.6624C4.54971 7.75136 4.5 7.86987 4.5 8V28C4.5 28.2761 4.72386 28.5 5 28.5H31C31.2761 28.5 31.5 28.2761 31.5 28V8C31.5 7.86987 31.4503 7.75135 31.3688 7.6624L19.2374 19.7938C18.554 20.4772 17.446 20.4772 16.7626 19.7938L4.63118 7.6624ZM3 8C3 6.89543 3.89543 6 5 6H31C32.1046 6 33 6.89543 33 8V28C33 29.1046 32.1046 30 31 30H5C3.89543 30 3 29.1046 3 28V8Z'],
  width: '36',
  height: '36',
  viewBox: '0 0 36 36',
});
