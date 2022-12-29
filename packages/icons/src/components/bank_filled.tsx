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

export const BankFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path opacity="0.6" d="M4.7002 3.57246C4.82685 3.05806 5.3327 2.7317 5.85357 2.82831L20.1572 5.48145C20.7003 5.58218 21.0588 6.10404 20.9581 6.64706L20.7755 7.63131C20.6876 8.10518 20.2742 8.44893 19.7923 8.44893L13.5 8.44893L4.77564 8.44855C4.12655 8.44852 3.6495 7.83973 3.80468 7.20947L4.7002 3.57246Z" fill={ colors[0] }/>
    <path d="M3 7C3 6.44772 3.44772 6 4 6H20C20.5523 6 21 6.44772 21 7V9.5H3V7ZM3 11V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V11H3ZM14 18C14 17.4477 14.4477 17 15 17H19C19.5523 17 20 17.4477 20 18C20 18.5523 19.5523 19 19 19H15C14.4477 19 14 18.5523 14 18Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'bank_filled',
  defaultColors: ['#30C28B'],
  colorful: false,
  allPathData: ['M4.7002 3.57246C4.82685 3.05806 5.3327 2.7317 5.85357 2.82831L20.1572 5.48145C20.7003 5.58218 21.0588 6.10404 20.9581 6.64706L20.7755 7.63131C20.6876 8.10518 20.2742 8.44893 19.7923 8.44893L13.5 8.44893L4.77564 8.44855C4.12655 8.44852 3.6495 7.83973 3.80468 7.20947L4.7002 3.57246Z', 'M3 7C3 6.44772 3.44772 6 4 6H20C20.5523 6 21 6.44772 21 7V9.5H3V7ZM3 11V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V11H3ZM14 18C14 17.4477 14.4477 17 15 17H19C19.5523 17 20 17.4477 20 18C20 18.5523 19.5523 19 19 19H15C14.4477 19 14 18.5523 14 18Z'],
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
});
