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

export const EmailBackgroundFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M30 60C46.5685 60 60 46.5685 60 30C60 13.4315 46.5685 0 30 0C13.4315 0 0 13.4315 0 30C0 46.5685 13.4315 60 30 60Z" fill={ colors[1] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M30 0C13.431 0 0 13.431 0 30C0 46.569 13.431 60 30 60C46.569 60 60 46.569 60 30C60 13.431 46.569 0 30 0Z" fill={ colors[0] }/>
    <rect x="14" y="18" width="32" height="24" rx="1" fill={ colors[1] }/>
    <path d="M48.5918 18L31.0064 32.5854C30.5649 33.0269 29.8492 33.0269 29.4077 32.5854L11.8223 18" stroke={ colors[0] } strokeWidth="2"/>

  </>,
  name: 'email_background_filled',
  defaultColors: ['#2B68FF', 'white'],
  colorful: true,
  allPathData: ['M30 60C46.5685 60 60 46.5685 60 30C60 13.4315 46.5685 0 30 0C13.4315 0 0 13.4315 0 30C0 46.5685 13.4315 60 30 60Z', 'M30 0C13.431 0 0 13.431 0 30C0 46.569 13.431 60 30 60C46.569 60 60 46.569 60 30C60 13.431 46.569 0 30 0Z', 'M48.5918 18L31.0064 32.5854C30.5649 33.0269 29.8492 33.0269 29.4077 32.5854L11.8223 18'],
  width: '60',
  height: '60',
  viewBox: '0 0 60 60',
});
