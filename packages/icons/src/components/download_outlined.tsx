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

export const DownloadOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7.99994 1C8.55222 1 8.99994 1.44772 8.99994 2V6H10.3354C11.0062 6 11.3792 6.77595 10.9601 7.29976L8.62463 10.2191C8.30437 10.6195 7.6955 10.6195 7.37524 10.2191L5.03974 7.29976C4.6207 6.77595 4.99363 6 5.66444 6H6.99994V2C6.99994 1.44772 7.44765 1 7.99994 1ZM3 12C2.44772 12 2 12.4477 2 13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13C14 12.4477 13.5523 12 13 12H3Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'download_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M7.99994 1C8.55222 1 8.99994 1.44772 8.99994 2V6H10.3354C11.0062 6 11.3792 6.77595 10.9601 7.29976L8.62463 10.2191C8.30437 10.6195 7.6955 10.6195 7.37524 10.2191L5.03974 7.29976C4.6207 6.77595 4.99363 6 5.66444 6H6.99994V2C6.99994 1.44772 7.44765 1 7.99994 1ZM3 12C2.44772 12 2 12.4477 2 13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13C14 12.4477 13.5523 12 13 12H3Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
