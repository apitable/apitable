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

export const AccountFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M11.348 5.33333C11.348 7.17428 9.85558 8.66667 8.01463 8.66667C6.17368 8.66667 4.6813 7.17428 4.6813 5.33333C4.6813 3.49238 6.17368 2 8.01463 2C9.85558 2 11.348 3.49238 11.348 5.33333ZM13.8628 12.7512C13.5283 11.175 12.3177 8.66667 8 8.66667C3.6823 8.66667 2.47169 11.175 2.13719 12.7512C1.99058 13.4421 2.56628 14 3.27255 14H12.7274C13.4337 14 14.0094 13.4421 13.8628 12.7512Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'account_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M11.348 5.33333C11.348 7.17428 9.85558 8.66667 8.01463 8.66667C6.17368 8.66667 4.6813 7.17428 4.6813 5.33333C4.6813 3.49238 6.17368 2 8.01463 2C9.85558 2 11.348 3.49238 11.348 5.33333ZM13.8628 12.7512C13.5283 11.175 12.3177 8.66667 8 8.66667C3.6823 8.66667 2.47169 11.175 2.13719 12.7512C1.99058 13.4421 2.56628 14 3.27255 14H12.7274C13.4337 14 14.0094 13.4421 13.8628 12.7512Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
