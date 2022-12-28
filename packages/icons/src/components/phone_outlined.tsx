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

export const PhoneOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M27 2.5H9C8.72386 2.5 8.5 2.72386 8.5 3V22.9167H9.03261H27.0326H27.5V3C27.5 2.72386 27.2761 2.5 27 2.5ZM8.5 33V24.4167H9.03261H27.0326H27.5V33C27.5 33.2761 27.2761 33.5 27 33.5H9C8.72386 33.5 8.5 33.2761 8.5 33ZM9 1C7.89543 1 7 1.89543 7 3V33C7 34.1046 7.89543 35 9 35H27C28.1046 35 29 34.1046 29 33V3C29 1.89543 28.1046 1 27 1H9ZM20 28.5C20 29.3284 19.3284 30 18.5 30C17.6716 30 17 29.3284 17 28.5C17 27.6716 17.6716 27 18.5 27C19.3284 27 20 27.6716 20 28.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'phone_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M27 2.5H9C8.72386 2.5 8.5 2.72386 8.5 3V22.9167H9.03261H27.0326H27.5V3C27.5 2.72386 27.2761 2.5 27 2.5ZM8.5 33V24.4167H9.03261H27.0326H27.5V33C27.5 33.2761 27.2761 33.5 27 33.5H9C8.72386 33.5 8.5 33.2761 8.5 33ZM9 1C7.89543 1 7 1.89543 7 3V33C7 34.1046 7.89543 35 9 35H27C28.1046 35 29 34.1046 29 33V3C29 1.89543 28.1046 1 27 1H9ZM20 28.5C20 29.3284 19.3284 30 18.5 30C17.6716 30 17 29.3284 17 28.5C17 27.6716 17.6716 27 18.5 27C19.3284 27 20 27.6716 20 28.5Z'],
  width: '36',
  height: '36',
  viewBox: '0 0 36 36',
});
