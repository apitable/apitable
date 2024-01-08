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

export const CommunityFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2.25 2.5C1.55964 2.5 1 3.05964 1 3.75V11.25C1 11.9404 1.55964 12.5 2.25 12.5H5.25V13.1451C5.25 14.1011 6.27957 14.7033 7.11283 14.2345L10.1965 12.5H13.75C14.4404 12.5 15 11.9404 15 11.25V3.75C15 3.05964 14.4404 2.5 13.75 2.5H2.25ZM6.5 7C6.5 6.58579 6.16421 6.25 5.75 6.25C5.33579 6.25 5 6.58579 5 7C5 8.65685 6.34315 10 8 10C9.65685 10 11 8.65685 11 7C11 6.58579 10.6642 6.25 10.25 6.25C9.83579 6.25 9.5 6.58579 9.5 7C9.5 7.82843 8.82843 8.5 8 8.5C7.17157 8.5 6.5 7.82843 6.5 7Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'community_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M2.25 2.5C1.55964 2.5 1 3.05964 1 3.75V11.25C1 11.9404 1.55964 12.5 2.25 12.5H5.25V13.1451C5.25 14.1011 6.27957 14.7033 7.11283 14.2345L10.1965 12.5H13.75C14.4404 12.5 15 11.9404 15 11.25V3.75C15 3.05964 14.4404 2.5 13.75 2.5H2.25ZM6.5 7C6.5 6.58579 6.16421 6.25 5.75 6.25C5.33579 6.25 5 6.58579 5 7C5 8.65685 6.34315 10 8 10C9.65685 10 11 8.65685 11 7C11 6.58579 10.6642 6.25 10.25 6.25C9.83579 6.25 9.5 6.58579 9.5 7C9.5 7.82843 8.82843 8.5 8 8.5C7.17157 8.5 6.5 7.82843 6.5 7Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
