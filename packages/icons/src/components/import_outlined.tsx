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

export const ImportOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.01788 6.25415C7.60366 6.25415 7.26788 6.58994 7.26788 7.00415L7.26788 9.75648L6.7448 9.2334C6.4519 8.9405 5.97703 8.9405 5.68414 9.2334C5.39124 9.52629 5.39124 10.0012 5.68414 10.2941L7.4519 12.0618C7.7448 12.3547 8.21967 12.3547 8.51256 12.0618L10.2803 10.2941C10.5732 10.0012 10.5732 9.52629 10.2803 9.2334C9.98744 8.9405 9.51256 8.9405 9.21967 9.2334L8.76788 9.68519L8.76788 7.00415C8.76788 6.58994 8.43209 6.25415 8.01788 6.25415Z" fill={ colors[0] }/>
    <path d="M2 2.25C2 1.55964 2.55964 1 3.25 1H10.0369C10.3773 1 10.7029 1.1388 10.9386 1.38434L13.6517 4.21049C13.8752 4.44327 14 4.75346 14 5.07616V13.75C14 14.4404 13.4404 15 12.75 15H3.25C2.55964 15 2 14.4404 2 13.75V2.25ZM3.5 2.5V13.5H12.5V6H10C9.44772 6 9 5.55229 9 5V2.5H3.5ZM10.5 3.0934L11.8503 4.5H10.5V3.0934Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'import_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8.01788 6.25415C7.60366 6.25415 7.26788 6.58994 7.26788 7.00415L7.26788 9.75648L6.7448 9.2334C6.4519 8.9405 5.97703 8.9405 5.68414 9.2334C5.39124 9.52629 5.39124 10.0012 5.68414 10.2941L7.4519 12.0618C7.7448 12.3547 8.21967 12.3547 8.51256 12.0618L10.2803 10.2941C10.5732 10.0012 10.5732 9.52629 10.2803 9.2334C9.98744 8.9405 9.51256 8.9405 9.21967 9.2334L8.76788 9.68519L8.76788 7.00415C8.76788 6.58994 8.43209 6.25415 8.01788 6.25415Z', 'M2 2.25C2 1.55964 2.55964 1 3.25 1H10.0369C10.3773 1 10.7029 1.1388 10.9386 1.38434L13.6517 4.21049C13.8752 4.44327 14 4.75346 14 5.07616V13.75C14 14.4404 13.4404 15 12.75 15H3.25C2.55964 15 2 14.4404 2 13.75V2.25ZM3.5 2.5V13.5H12.5V6H10C9.44772 6 9 5.55229 9 5V2.5H3.5ZM10.5 3.0934L11.8503 4.5H10.5V3.0934Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
