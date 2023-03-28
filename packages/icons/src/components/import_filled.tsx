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

export const ImportFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3.25 1C2.55964 1 2 1.55964 2 2.25V13.75C2 14.4404 2.55964 15 3.25 15H12.75C13.4404 15 14 14.4404 14 13.75V5.01023C14 4.68318 13.8718 4.36915 13.6429 4.13551L10.939 1.37528C10.7039 1.13526 10.3821 1 10.0461 1H3.25ZM6.7448 8.97925L7.26788 9.50233L7.26788 5.75C7.26788 5.33579 7.60366 5 8.01788 5C8.43209 5 8.76788 5.33579 8.76788 5.75L8.76788 9.43104L9.21967 8.97925C9.51256 8.68635 9.98744 8.68635 10.2803 8.97925C10.5732 9.27214 10.5732 9.74701 10.2803 10.0399L8.51256 11.8077C8.21967 12.1006 7.7448 12.1006 7.4519 11.8077L5.68414 10.0399C5.39124 9.74701 5.39124 9.27214 5.68414 8.97925C5.97703 8.68635 6.4519 8.68635 6.7448 8.97925Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'import_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M3.25 1C2.55964 1 2 1.55964 2 2.25V13.75C2 14.4404 2.55964 15 3.25 15H12.75C13.4404 15 14 14.4404 14 13.75V5.01023C14 4.68318 13.8718 4.36915 13.6429 4.13551L10.939 1.37528C10.7039 1.13526 10.3821 1 10.0461 1H3.25ZM6.7448 8.97925L7.26788 9.50233L7.26788 5.75C7.26788 5.33579 7.60366 5 8.01788 5C8.43209 5 8.76788 5.33579 8.76788 5.75L8.76788 9.43104L9.21967 8.97925C9.51256 8.68635 9.98744 8.68635 10.2803 8.97925C10.5732 9.27214 10.5732 9.74701 10.2803 10.0399L8.51256 11.8077C8.21967 12.1006 7.7448 12.1006 7.4519 11.8077L5.68414 10.0399C5.39124 9.74701 5.39124 9.27214 5.68414 8.97925C5.97703 8.68635 6.4519 8.68635 6.7448 8.97925Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
