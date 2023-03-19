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

export const MirrorOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3.25767 1.627C2.43106 1.25961 1.5 1.86469 1.5 2.76926V13.2305C1.5 14.1351 2.43107 14.7401 3.25767 14.3728L6.75767 12.8172C7.20908 12.6166 7.5 12.1689 7.5 11.6749V4.32482C7.5 3.83083 7.20908 3.38318 6.75767 3.18255L3.25767 1.627ZM3 12.8458V3.15395L6 4.48728V11.5125L3 12.8458Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M12.7423 1.627C13.5689 1.25961 14.5 1.86469 14.5 2.76926V13.2305C14.5 14.1351 13.5689 14.7401 12.7423 14.3728L9.24233 12.8172C8.79092 12.6166 8.5 12.1689 8.5 11.6749V4.32482C8.5 3.83083 8.79092 3.38318 9.24233 3.18255L12.7423 1.627ZM13 12.8458V3.15395L10 4.48728V11.5125L13 12.8458Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'mirror_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M3.25767 1.627C2.43106 1.25961 1.5 1.86469 1.5 2.76926V13.2305C1.5 14.1351 2.43107 14.7401 3.25767 14.3728L6.75767 12.8172C7.20908 12.6166 7.5 12.1689 7.5 11.6749V4.32482C7.5 3.83083 7.20908 3.38318 6.75767 3.18255L3.25767 1.627ZM3 12.8458V3.15395L6 4.48728V11.5125L3 12.8458Z', 'M12.7423 1.627C13.5689 1.25961 14.5 1.86469 14.5 2.76926V13.2305C14.5 14.1351 13.5689 14.7401 12.7423 14.3728L9.24233 12.8172C8.79092 12.6166 8.5 12.1689 8.5 11.6749V4.32482C8.5 3.83083 8.79092 3.38318 9.24233 3.18255L12.7423 1.627ZM13 12.8458V3.15395L10 4.48728V11.5125L13 12.8458Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
