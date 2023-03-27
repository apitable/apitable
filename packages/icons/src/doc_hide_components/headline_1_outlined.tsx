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

export const Headline1Outlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3 2.25C3 1.83579 2.66421 1.5 2.25 1.5C1.83579 1.5 1.5 1.83579 1.5 2.25V13.75C1.5 14.1642 1.83579 14.5 2.25 14.5C2.66421 14.5 3 14.1642 3 13.75V9.05263H7.5V13.75C7.5 14.1642 7.83579 14.5 8.25 14.5C8.66421 14.5 9 14.1642 9 13.75V2.25C9 1.83579 8.66421 1.5 8.25 1.5C7.83579 1.5 7.5 1.83579 7.5 2.25V7.55263H3V2.25Z" fill={ colors[0] }/>
    <path d="M13.75 7.25C13.75 6.95068 13.5721 6.68002 13.2972 6.5614C13.0224 6.44279 12.7034 6.49893 12.4856 6.70424L10.8943 8.20424C10.5928 8.48836 10.5788 8.96302 10.8629 9.26444C11.147 9.56585 11.6217 9.57988 11.9231 9.29576L12.25 8.98763V13.75C12.25 14.1642 12.5858 14.5 13 14.5C13.4142 14.5 13.75 14.1642 13.75 13.75V7.25Z" fill={ colors[0] }/>

  </>,
  name: 'headline_1_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M3 2.25C3 1.83579 2.66421 1.5 2.25 1.5C1.83579 1.5 1.5 1.83579 1.5 2.25V13.75C1.5 14.1642 1.83579 14.5 2.25 14.5C2.66421 14.5 3 14.1642 3 13.75V9.05263H7.5V13.75C7.5 14.1642 7.83579 14.5 8.25 14.5C8.66421 14.5 9 14.1642 9 13.75V2.25C9 1.83579 8.66421 1.5 8.25 1.5C7.83579 1.5 7.5 1.83579 7.5 2.25V7.55263H3V2.25Z', 'M13.75 7.25C13.75 6.95068 13.5721 6.68002 13.2972 6.5614C13.0224 6.44279 12.7034 6.49893 12.4856 6.70424L10.8943 8.20424C10.5928 8.48836 10.5788 8.96302 10.8629 9.26444C11.147 9.56585 11.6217 9.57988 11.9231 9.29576L12.25 8.98763V13.75C12.25 14.1642 12.5858 14.5 13 14.5C13.4142 14.5 13.75 14.1642 13.75 13.75V7.25Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
