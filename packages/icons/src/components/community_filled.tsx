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
    <path d="M1 3.75C1 3.05964 1.55964 2.5 2.25 2.5H13.75C14.4404 2.5 15 3.05964 15 3.75V11.25C15 11.9404 14.4404 12.5 13.75 12.5H10.5239C10.3092 12.5 10.0982 12.5553 9.91108 12.6605L6.78015 14.4217C6.09571 14.8067 5.25 14.3121 5.25 13.5268C5.25 12.9597 4.7903 12.5 4.22323 12.5H2.25C1.55964 12.5 1 11.9404 1 11.25V3.75ZM6.5 7C6.5 6.58579 6.16421 6.25 5.75 6.25C5.33579 6.25 5 6.58579 5 7C5 8.65685 6.34315 10 8 10C9.65685 10 11 8.65685 11 7C11 6.58579 10.6642 6.25 10.25 6.25C9.83579 6.25 9.5 6.58579 9.5 7C9.5 7.82843 8.82843 8.5 8 8.5C7.17157 8.5 6.5 7.82843 6.5 7Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'community_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M1 3.75C1 3.05964 1.55964 2.5 2.25 2.5H13.75C14.4404 2.5 15 3.05964 15 3.75V11.25C15 11.9404 14.4404 12.5 13.75 12.5H10.5239C10.3092 12.5 10.0982 12.5553 9.91108 12.6605L6.78015 14.4217C6.09571 14.8067 5.25 14.3121 5.25 13.5268C5.25 12.9597 4.7903 12.5 4.22323 12.5H2.25C1.55964 12.5 1 11.9404 1 11.25V3.75ZM6.5 7C6.5 6.58579 6.16421 6.25 5.75 6.25C5.33579 6.25 5 6.58579 5 7C5 8.65685 6.34315 10 8 10C9.65685 10 11 8.65685 11 7C11 6.58579 10.6642 6.25 10.25 6.25C9.83579 6.25 9.5 6.58579 9.5 7C9.5 7.82843 8.82843 8.5 8 8.5C7.17157 8.5 6.5 7.82843 6.5 7Z'],
  width: '17',
  height: '17',
  viewBox: '0 0 17 17',
});
