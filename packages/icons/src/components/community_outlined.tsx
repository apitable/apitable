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

export const CommunityOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M6.5 6.5C6.5 6.08579 6.16421 5.75 5.75 5.75C5.33579 5.75 5 6.08579 5 6.5C5 8.15685 6.34315 9.5 8 9.5C9.65685 9.5 11 8.15685 11 6.5C11 6.08579 10.6642 5.75 10.25 5.75C9.83579 5.75 9.5 6.08579 9.5 6.5C9.5 7.32843 8.82843 8 8 8C7.17157 8 6.5 7.32843 6.5 6.5Z" fill={ colors[0] }/>
    <path d="M2.25 2C1.55964 2 1 2.55964 1 3.25V10.75C1 11.4404 1.55964 12 2.25 12H5.25V12.6451C5.25 13.6011 6.27957 14.2033 7.11283 13.7345L10.1965 12H13.75C14.4404 12 15 11.4404 15 10.75V3.25C15 2.55964 14.4404 2 13.75 2H2.25ZM2.5 10.5V3.5H13.5V10.5H10.131C9.9163 10.5 9.70525 10.5553 9.51815 10.6605L6.75 12.2176V11.75C6.75 11.0596 6.19036 10.5 5.5 10.5H2.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'community_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M6.5 6.5C6.5 6.08579 6.16421 5.75 5.75 5.75C5.33579 5.75 5 6.08579 5 6.5C5 8.15685 6.34315 9.5 8 9.5C9.65685 9.5 11 8.15685 11 6.5C11 6.08579 10.6642 5.75 10.25 5.75C9.83579 5.75 9.5 6.08579 9.5 6.5C9.5 7.32843 8.82843 8 8 8C7.17157 8 6.5 7.32843 6.5 6.5Z', 'M2.25 2C1.55964 2 1 2.55964 1 3.25V10.75C1 11.4404 1.55964 12 2.25 12H5.25V12.6451C5.25 13.6011 6.27957 14.2033 7.11283 13.7345L10.1965 12H13.75C14.4404 12 15 11.4404 15 10.75V3.25C15 2.55964 14.4404 2 13.75 2H2.25ZM2.5 10.5V3.5H13.5V10.5H10.131C9.9163 10.5 9.70525 10.5553 9.51815 10.6605L6.75 12.2176V11.75C6.75 11.0596 6.19036 10.5 5.5 10.5H2.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
