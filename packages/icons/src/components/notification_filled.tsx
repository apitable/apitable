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

export const NotificationFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7.25018 2.31V1.75C7.25018 1.33579 7.58597 1 8.00018 1C8.4144 1 8.75018 1.33579 8.75018 1.75V2.31006C10.903 2.6583 12.5719 4.48095 12.663 6.72771L12.7121 7.93912C12.7491 8.8528 13.0799 9.73017 13.6552 10.4409L13.6735 10.4635C14.3351 11.2808 13.7534 12.5 12.702 12.5H10.9586C10.7206 13.9189 9.48659 15 8.00009 15C6.51359 15 5.27961 13.9189 5.04157 12.5H3.29801C2.24653 12.5 1.66487 11.2808 2.32644 10.4635L2.34474 10.4409C2.92008 9.73017 3.25084 8.8528 3.28789 7.93912L3.33701 6.72771C3.42813 4.48081 5.09716 2.65808 7.25018 2.31ZM8.00009 13.5C8.6532 13.5 9.20882 13.0826 9.41474 12.5H6.58544C6.79136 13.0826 7.34698 13.5 8.00009 13.5Z" fill={ colors[0] }/>

  </>,
  name: 'notification_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M7.25018 2.31V1.75C7.25018 1.33579 7.58597 1 8.00018 1C8.4144 1 8.75018 1.33579 8.75018 1.75V2.31006C10.903 2.6583 12.5719 4.48095 12.663 6.72771L12.7121 7.93912C12.7491 8.8528 13.0799 9.73017 13.6552 10.4409L13.6735 10.4635C14.3351 11.2808 13.7534 12.5 12.702 12.5H10.9586C10.7206 13.9189 9.48659 15 8.00009 15C6.51359 15 5.27961 13.9189 5.04157 12.5H3.29801C2.24653 12.5 1.66487 11.2808 2.32644 10.4635L2.34474 10.4409C2.92008 9.73017 3.25084 8.8528 3.28789 7.93912L3.33701 6.72771C3.42813 4.48081 5.09716 2.65808 7.25018 2.31ZM8.00009 13.5C8.6532 13.5 9.20882 13.0826 9.41474 12.5H6.58544C6.79136 13.0826 7.34698 13.5 8.00009 13.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
