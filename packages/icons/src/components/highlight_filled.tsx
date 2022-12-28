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

export const HighlightFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M13.2071 2.79287C12.5969 2.18262 11.6273 2.12358 10.9475 2.65522L4.65543 7.57452C3.84798 8.2063 3.77527 9.40213 4.50022 10.1271L6.87293 12.4998C7.59286 13.2197 8.77719 13.153 9.41229 12.3612L14.5352 6.2682L14.5461 6.25434C15.078 5.57455 15.019 4.60475 14.4087 3.99441L13.2071 2.79287ZM6.14792 8.94636L11.9758 4.38997L12.8046 5.21877L8.06154 10.86L6.14792 8.94636ZM2.63845 10.213C2.63845 10.0263 2.89958 9.93069 3.05626 10.0582L6.94943 13.8519C7.07287 14.0249 6.95893 14.1661 6.73103 14.1616L3.54053 14.1661L3.30789 14.6625C3.30454 14.6692 3.30124 14.6759 3.29798 14.6824C3.19506 14.8888 3.13546 15.0084 2.93756 14.9995H1.22837C1.01472 14.9904 0.91976 14.7445 1.08118 14.6124L2.63845 13.2644V10.213Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'highlight_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M13.2071 2.79287C12.5969 2.18262 11.6273 2.12358 10.9475 2.65522L4.65543 7.57452C3.84798 8.2063 3.77527 9.40213 4.50022 10.1271L6.87293 12.4998C7.59286 13.2197 8.77719 13.153 9.41229 12.3612L14.5352 6.2682L14.5461 6.25434C15.078 5.57455 15.019 4.60475 14.4087 3.99441L13.2071 2.79287ZM6.14792 8.94636L11.9758 4.38997L12.8046 5.21877L8.06154 10.86L6.14792 8.94636ZM2.63845 10.213C2.63845 10.0263 2.89958 9.93069 3.05626 10.0582L6.94943 13.8519C7.07287 14.0249 6.95893 14.1661 6.73103 14.1616L3.54053 14.1661L3.30789 14.6625C3.30454 14.6692 3.30124 14.6759 3.29798 14.6824C3.19506 14.8888 3.13546 15.0084 2.93756 14.9995H1.22837C1.01472 14.9904 0.91976 14.7445 1.08118 14.6124L2.63845 13.2644V10.213Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
