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

export const EditOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M11.3145 1.73627C11.1739 1.59562 10.9831 1.5166 10.7842 1.5166C10.5853 1.5166 10.3945 1.59562 10.2539 1.73627L2.21663 9.77352C2.10413 9.88602 2.03032 10.0314 2.00587 10.1886L1.5088 13.3848C1.47213 13.6205 1.54982 13.8597 1.71805 14.0288C1.88628 14.198 2.12496 14.2771 2.36092 14.2418L5.57329 13.7609C5.73208 13.7371 5.87905 13.663 5.99258 13.5495L14.0298 5.51222C14.3227 5.21933 14.3227 4.74445 14.0298 4.45156L11.3145 1.73627ZM3.45043 10.661L10.7842 3.32726L12.4388 4.98189L5.10673 12.314L3.14775 12.6073L3.45043 10.661Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M13.7501 14.2497C14.1644 14.2497 14.5001 13.914 14.5001 13.4997C14.5001 13.0855 14.1644 12.7497 13.7501 12.7497L9.74732 12.7497C9.33311 12.7497 8.99732 13.0855 8.99732 13.4997C8.99732 13.914 9.33311 14.2497 9.74732 14.2497L13.7501 14.2497Z" fill={ colors[0] }/>

  </>,
  name: 'edit_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M11.3145 1.73627C11.1739 1.59562 10.9831 1.5166 10.7842 1.5166C10.5853 1.5166 10.3945 1.59562 10.2539 1.73627L2.21663 9.77352C2.10413 9.88602 2.03032 10.0314 2.00587 10.1886L1.5088 13.3848C1.47213 13.6205 1.54982 13.8597 1.71805 14.0288C1.88628 14.198 2.12496 14.2771 2.36092 14.2418L5.57329 13.7609C5.73208 13.7371 5.87905 13.663 5.99258 13.5495L14.0298 5.51222C14.3227 5.21933 14.3227 4.74445 14.0298 4.45156L11.3145 1.73627ZM3.45043 10.661L10.7842 3.32726L12.4388 4.98189L5.10673 12.314L3.14775 12.6073L3.45043 10.661Z', 'M13.7501 14.2497C14.1644 14.2497 14.5001 13.914 14.5001 13.4997C14.5001 13.0855 14.1644 12.7497 13.7501 12.7497L9.74732 12.7497C9.33311 12.7497 8.99732 13.0855 8.99732 13.4997C8.99732 13.914 9.33311 14.2497 9.74732 14.2497L13.7501 14.2497Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
