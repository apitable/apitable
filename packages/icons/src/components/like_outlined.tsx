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

export const LikeOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7.59277 1.03843C6.99847 0.934168 6.53113 1.30613 6.33771 1.70909L4.27807 6H2.75C2.05964 6 1.5 6.55964 1.5 7.25V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5L11.7182 14.5C12.6884 14.5087 13.5177 13.8025 13.6635 12.8429L14.4913 7.44367L14.4915 7.44254C14.5774 6.87687 14.4105 6.3021 14.0351 5.87038C13.6607 5.43986 13.1166 5.19491 12.5463 5.2H9.7V3.55C9.7 2.29222 8.79011 1.24849 7.59277 1.03843ZM5.5 13H11.7305C11.9548 13.0025 12.1468 12.8394 12.1805 12.6175L13.0085 7.21746C13.0281 7.08712 12.9897 6.95415 12.9031 6.85462C12.8165 6.75502 12.6905 6.69845 12.5585 6.69995L12.55 6.70005L9.45 6.7C8.75964 6.7 8.2 6.14036 8.2 5.45V3.55C8.2 3.12306 7.94467 2.75471 7.57833 2.59082L5.5 6.92068V13ZM4 13V7.5H3V13H4Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'like_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M7.59277 1.03843C6.99847 0.934168 6.53113 1.30613 6.33771 1.70909L4.27807 6H2.75C2.05964 6 1.5 6.55964 1.5 7.25V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5L11.7182 14.5C12.6884 14.5087 13.5177 13.8025 13.6635 12.8429L14.4913 7.44367L14.4915 7.44254C14.5774 6.87687 14.4105 6.3021 14.0351 5.87038C13.6607 5.43986 13.1166 5.19491 12.5463 5.2H9.7V3.55C9.7 2.29222 8.79011 1.24849 7.59277 1.03843ZM5.5 13H11.7305C11.9548 13.0025 12.1468 12.8394 12.1805 12.6175L13.0085 7.21746C13.0281 7.08712 12.9897 6.95415 12.9031 6.85462C12.8165 6.75502 12.6905 6.69845 12.5585 6.69995L12.55 6.70005L9.45 6.7C8.75964 6.7 8.2 6.14036 8.2 5.45V3.55C8.2 3.12306 7.94467 2.75471 7.57833 2.59082L5.5 6.92068V13ZM4 13V7.5H3V13H4Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
