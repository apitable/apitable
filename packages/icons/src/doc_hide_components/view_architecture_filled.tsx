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

export const ViewArchitectureFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path opacity="0.6" d="M9 10.25C9 9.55964 9.55964 9 10.25 9H13.75C14.4404 9 15 9.55964 15 10.25V13.75C15 14.4404 14.4404 15 13.75 15H10.25C9.55964 15 9 14.4404 9 13.75V10.25ZM11 11V13H13V11H11Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M3 2.25C3 1.55964 3.55964 1 4.25 1H11.75C12.4404 1 13 1.55964 13 2.25V5.75C13 6.36043 12.5624 6.86866 11.9839 6.97816C12.4292 7.56436 12.7481 8.25185 12.9 9H10.8293C10.4175 7.83481 9.30622 7 8 7C6.69378 7 5.58254 7.83481 5.17071 9H5.75C6.44036 9 7 9.55964 7 10.25V13.75C7 14.4404 6.44036 15 5.75 15H2.25C1.55964 15 1 14.4404 1 13.75V10.25C1 9.55964 1.55964 9 2.25 9H3.10002C3.25188 8.25185 3.5708 7.56436 4.01613 6.97816C3.43755 6.86866 3 6.36043 3 5.75V2.25ZM8 5H11V3H5V5H8ZM3 13V11H5V13H3Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'view_architecture_filled',
  defaultColors: ['#7B67EE'],
  colorful: false,
  allPathData: ['M9 10.25C9 9.55964 9.55964 9 10.25 9H13.75C14.4404 9 15 9.55964 15 10.25V13.75C15 14.4404 14.4404 15 13.75 15H10.25C9.55964 15 9 14.4404 9 13.75V10.25ZM11 11V13H13V11H11Z', 'M3 2.25C3 1.55964 3.55964 1 4.25 1H11.75C12.4404 1 13 1.55964 13 2.25V5.75C13 6.36043 12.5624 6.86866 11.9839 6.97816C12.4292 7.56436 12.7481 8.25185 12.9 9H10.8293C10.4175 7.83481 9.30622 7 8 7C6.69378 7 5.58254 7.83481 5.17071 9H5.75C6.44036 9 7 9.55964 7 10.25V13.75C7 14.4404 6.44036 15 5.75 15H2.25C1.55964 15 1 14.4404 1 13.75V10.25C1 9.55964 1.55964 9 2.25 9H3.10002C3.25188 8.25185 3.5708 7.56436 4.01613 6.97816C3.43755 6.86866 3 6.36043 3 5.75V2.25ZM8 5H11V3H5V5H8ZM3 13V11H5V13H3Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
