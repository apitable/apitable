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
    <path d="M3.17082 1.46715C2.17347 0.968473 1 1.69372 1 2.80879V13.1908C1 14.3058 2.17347 15.0311 3.17082 14.5324L5.89443 13.1706C6.572 12.8318 7 12.1393 7 11.3817V4.61781C7 3.86026 6.572 3.16774 5.89443 2.82895L3.17082 1.46715ZM3 12.3817V3.61781L5 4.61781V11.3817L3 12.3817ZM12.8292 1.46715C13.8265 0.968473 15 1.69372 15 2.80879V13.1908C15 14.3058 13.8265 15.0311 12.8292 14.5324L10.1056 13.1706C9.42801 12.8318 9 12.1393 9 11.3817V4.61781C9 3.86026 9.428 3.16774 10.1056 2.82895L12.8292 1.46715ZM13 12.3817V3.61781L11 4.61781V11.3817L13 12.3817Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'mirror_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M3.17082 1.46715C2.17347 0.968473 1 1.69372 1 2.80879V13.1908C1 14.3058 2.17347 15.0311 3.17082 14.5324L5.89443 13.1706C6.572 12.8318 7 12.1393 7 11.3817V4.61781C7 3.86026 6.572 3.16774 5.89443 2.82895L3.17082 1.46715ZM3 12.3817V3.61781L5 4.61781V11.3817L3 12.3817ZM12.8292 1.46715C13.8265 0.968473 15 1.69372 15 2.80879V13.1908C15 14.3058 13.8265 15.0311 12.8292 14.5324L10.1056 13.1706C9.42801 12.8318 9 12.1393 9 11.3817V4.61781C9 3.86026 9.428 3.16774 10.1056 2.82895L12.8292 1.46715ZM13 12.3817V3.61781L11 4.61781V11.3817L13 12.3817Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
