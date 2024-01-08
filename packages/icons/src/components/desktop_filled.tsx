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

export const DesktopFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1.5 2.25C1.5 1.83579 1.83579 1.5 2.25 1.5H13.75C14.1642 1.5 14.5 1.83579 14.5 2.25V10.75C14.5 11.1642 14.1642 11.5 13.75 11.5H8.75V13H11.25C11.6642 13 12 13.3358 12 13.75C12 14.1642 11.6642 14.5 11.25 14.5H4.75C4.33579 14.5 4 14.1642 4 13.75C4 13.3358 4.33579 13 4.75 13H7.25V11.5H2.25C1.83579 11.5 1.5 11.1642 1.5 10.75V2.25ZM7.14312 5.63587C7.35623 5.28069 7.24106 4.81999 6.88587 4.60688C6.53069 4.39377 6.06999 4.50894 5.85688 4.86413L4.35688 7.36413C4.14377 7.71931 4.25894 8.18001 4.61413 8.39312C4.96931 8.60623 5.43001 8.49106 5.64312 8.13587L7.14312 5.63587ZM11.3859 4.60688C11.7411 4.81999 11.8562 5.28069 11.6431 5.63587L10.1431 8.13587C9.93001 8.49106 9.46931 8.60623 9.11413 8.39312C8.75894 8.18001 8.64377 7.71931 8.85688 7.36413L10.3569 4.86413C10.57 4.50894 11.0307 4.39377 11.3859 4.60688Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'desktop_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M1.5 2.25C1.5 1.83579 1.83579 1.5 2.25 1.5H13.75C14.1642 1.5 14.5 1.83579 14.5 2.25V10.75C14.5 11.1642 14.1642 11.5 13.75 11.5H8.75V13H11.25C11.6642 13 12 13.3358 12 13.75C12 14.1642 11.6642 14.5 11.25 14.5H4.75C4.33579 14.5 4 14.1642 4 13.75C4 13.3358 4.33579 13 4.75 13H7.25V11.5H2.25C1.83579 11.5 1.5 11.1642 1.5 10.75V2.25ZM7.14312 5.63587C7.35623 5.28069 7.24106 4.81999 6.88587 4.60688C6.53069 4.39377 6.06999 4.50894 5.85688 4.86413L4.35688 7.36413C4.14377 7.71931 4.25894 8.18001 4.61413 8.39312C4.96931 8.60623 5.43001 8.49106 5.64312 8.13587L7.14312 5.63587ZM11.3859 4.60688C11.7411 4.81999 11.8562 5.28069 11.6431 5.63587L10.1431 8.13587C9.93001 8.49106 9.46931 8.60623 9.11413 8.39312C8.75894 8.18001 8.64377 7.71931 8.85688 7.36413L10.3569 4.86413C10.57 4.50894 11.0307 4.39377 11.3859 4.60688Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
