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

export const MobilephoneFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M4.25 1C3.55964 1 3 1.55964 3 2.25V13.75C3 14.4404 3.55964 15 4.25 15H11.75C12.4404 15 13 14.4404 13 13.75V2.25C13 1.55964 12.4404 1 11.75 1H4.25ZM6.5 11.25C6.08579 11.25 5.75 11.5858 5.75 12C5.75 12.4142 6.08579 12.75 6.5 12.75H9.5C9.91421 12.75 10.25 12.4142 10.25 12C10.25 11.5858 9.91421 11.25 9.5 11.25H6.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'mobilephone_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M4.25 1C3.55964 1 3 1.55964 3 2.25V13.75C3 14.4404 3.55964 15 4.25 15H11.75C12.4404 15 13 14.4404 13 13.75V2.25C13 1.55964 12.4404 1 11.75 1H4.25ZM6.5 11.25C6.08579 11.25 5.75 11.5858 5.75 12C5.75 12.4142 6.08579 12.75 6.5 12.75H9.5C9.91421 12.75 10.25 12.4142 10.25 12C10.25 11.5858 9.91421 11.25 9.5 11.25H6.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
