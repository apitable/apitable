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

export const RankDownOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M9 13C9 13.4045 9.24364 13.7691 9.61732 13.9239C9.99099 14.0787 10.4211 13.9931 10.7071 13.7071L14.2071 10.2071C14.5976 9.81658 14.5976 9.18342 14.2071 8.79289C13.8166 8.40237 13.1834 8.40237 12.7929 8.79289L11 10.5858L11 3C11 2.44772 10.5523 2 10 2C9.44772 2 9 2.44772 9 3L9 13ZM7 3C7 2.44772 6.55228 2 6 2C5.44771 2 5 2.44772 5 3L5 13C5 13.5523 5.44771 14 6 14C6.55228 14 7 13.5523 7 13L7 3Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'rank_down_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M9 13C9 13.4045 9.24364 13.7691 9.61732 13.9239C9.99099 14.0787 10.4211 13.9931 10.7071 13.7071L14.2071 10.2071C14.5976 9.81658 14.5976 9.18342 14.2071 8.79289C13.8166 8.40237 13.1834 8.40237 12.7929 8.79289L11 10.5858L11 3C11 2.44772 10.5523 2 10 2C9.44772 2 9 2.44772 9 3L9 13ZM7 3C7 2.44772 6.55228 2 6 2C5.44771 2 5 2.44772 5 3L5 13C5 13.5523 5.44771 14 6 14C6.55228 14 7 13.5523 7 13L7 3Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
