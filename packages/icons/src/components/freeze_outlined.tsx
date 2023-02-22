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

export const FreezeOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M13.25 1.5H2.75C2.05964 1.5 1.5 2.05964 1.5 2.75V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5ZM5.57993 3L3.05287 5.75679C3.03593 5.77527 3.01828 5.7927 3 5.80909V6.87829L6.20474 3.48503C6.21934 3.46957 6.23444 3.45487 6.25 3.44093V3H5.57993ZM6.25 5.62171L3.04526 9.01497C3.03066 9.03043 3.01556 9.04513 3 9.05907V10.1317L6.25 6.70115V5.62171ZM3 3H3.54507L3 3.59463V3ZM3 13V12.3091C3.01527 12.2954 3.03011 12.281 3.04446 12.2658L6.25 8.88219V9.95257L3.39503 12.986L3.38215 13H3ZM5.4417 13H6.25V12.1412L5.4417 13ZM7.75 13H13V3H7.75V13Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'freeze_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M13.25 1.5H2.75C2.05964 1.5 1.5 2.05964 1.5 2.75V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5ZM5.57993 3L3.05287 5.75679C3.03593 5.77527 3.01828 5.7927 3 5.80909V6.87829L6.20474 3.48503C6.21934 3.46957 6.23444 3.45487 6.25 3.44093V3H5.57993ZM6.25 5.62171L3.04526 9.01497C3.03066 9.03043 3.01556 9.04513 3 9.05907V10.1317L6.25 6.70115V5.62171ZM3 3H3.54507L3 3.59463V3ZM3 13V12.3091C3.01527 12.2954 3.03011 12.281 3.04446 12.2658L6.25 8.88219V9.95257L3.39503 12.986L3.38215 13H3ZM5.4417 13H6.25V12.1412L5.4417 13ZM7.75 13H13V3H7.75V13Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
