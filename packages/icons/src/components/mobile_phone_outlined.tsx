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

export const MobilePhoneOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M15 5H17C18.1 5 19 5.9 19 7V17C19 18.1 18.1 19 17 19H11C9.9 19 9 18.1 9 17V7C9 5.9 9.9 5 11 5H13H14H15ZM17 18C17.6 18 18 17.6 18 17V7C18 6.4 17.6 6 17 6H16C16 6.6 15.6 7 15 7H13C12.4 7 12 6.6 12 6H11C10.4 6 10 6.4 10 7V17C10 17.6 10.4 18 11 18H17ZM12 16.5C12 16.2 12.2 16 12.5 16H15.5C15.8 16 16 16.2 16 16.5C16 16.8 15.8 17 15.5 17H12.5C12.2 17 12 16.8 12 16.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'mobile_phone_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M15 5H17C18.1 5 19 5.9 19 7V17C19 18.1 18.1 19 17 19H11C9.9 19 9 18.1 9 17V7C9 5.9 9.9 5 11 5H13H14H15ZM17 18C17.6 18 18 17.6 18 17V7C18 6.4 17.6 6 17 6H16C16 6.6 15.6 7 15 7H13C12.4 7 12 6.6 12 6H11C10.4 6 10 6.4 10 7V17C10 17.6 10.4 18 11 18H17ZM12 16.5C12 16.2 12.2 16 12.5 16H15.5C15.8 16 16 16.2 16 16.5C16 16.8 15.8 17 15.5 17H12.5C12.2 17 12 16.8 12 16.5Z'],
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
});
