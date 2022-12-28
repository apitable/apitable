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

export const NarrowRecordOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M14.7071 1.29289C14.3166 0.902369 13.6834 0.902369 13.2929 1.29289L10 4.58579V3C10 2.44772 9.55228 2 9 2C8.44772 2 8 2.44772 8 3V7C8 7.55228 8.44772 8 9 8H13C13.5523 8 14 7.55228 14 7C14 6.44772 13.5523 6 13 6H11.4142L14.7071 2.70711C15.0976 2.31658 15.0976 1.68342 14.7071 1.29289ZM6 11.4142L2.70711 14.7071C2.31658 15.0976 1.68342 15.0976 1.29289 14.7071C0.902369 14.3166 0.902369 13.6834 1.29289 13.2929L4.58579 10L3 10C2.44772 10 2 9.55228 2 9C2 8.44771 2.44772 8 3 8L7 8C7.55229 8 8 8.44772 8 9L8 13C8 13.5523 7.55228 14 7 14C6.44772 14 6 13.5523 6 13L6 11.4142Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'narrow_record_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M14.7071 1.29289C14.3166 0.902369 13.6834 0.902369 13.2929 1.29289L10 4.58579V3C10 2.44772 9.55228 2 9 2C8.44772 2 8 2.44772 8 3V7C8 7.55228 8.44772 8 9 8H13C13.5523 8 14 7.55228 14 7C14 6.44772 13.5523 6 13 6H11.4142L14.7071 2.70711C15.0976 2.31658 15.0976 1.68342 14.7071 1.29289ZM6 11.4142L2.70711 14.7071C2.31658 15.0976 1.68342 15.0976 1.29289 14.7071C0.902369 14.3166 0.902369 13.6834 1.29289 13.2929L4.58579 10L3 10C2.44772 10 2 9.55228 2 9C2 8.44771 2.44772 8 3 8L7 8C7.55229 8 8 8.44772 8 9L8 13C8 13.5523 7.55228 14 7 14C6.44772 14 6 13.5523 6 13L6 11.4142Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
