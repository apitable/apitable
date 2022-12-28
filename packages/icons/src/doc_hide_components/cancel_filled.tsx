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

export const CancelFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8ZM5.73727 11.017C5.52899 11.2253 5.1913 11.2253 4.98302 11.017C4.79789 10.8318 4.77732 10.5444 4.92131 10.3366L4.98303 10.2627L7.24577 7.99998L4.98302 5.73724C4.77474 5.52896 4.77475 5.19127 4.98303 4.98299C5.16816 4.79786 5.45555 4.77728 5.66341 4.92128L5.73727 4.98299L8.00001 7.24574L10.2628 4.983C10.471 4.77472 10.8087 4.77472 11.017 4.983C11.2021 5.16813 11.2227 5.45552 11.0787 5.66338L11.017 5.73724L8.75426 7.99998L11.017 10.2627C11.2253 10.471 11.2253 10.8087 11.017 11.017C10.8319 11.2021 10.5445 11.2227 10.3366 11.0787L10.2628 11.017L8.00001 8.75423L5.73727 11.017Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'cancel_filled',
  defaultColors: ['#636363'],
  colorful: false,
  allPathData: ['M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8ZM5.73727 11.017C5.52899 11.2253 5.1913 11.2253 4.98302 11.017C4.79789 10.8318 4.77732 10.5444 4.92131 10.3366L4.98303 10.2627L7.24577 7.99998L4.98302 5.73724C4.77474 5.52896 4.77475 5.19127 4.98303 4.98299C5.16816 4.79786 5.45555 4.77728 5.66341 4.92128L5.73727 4.98299L8.00001 7.24574L10.2628 4.983C10.471 4.77472 10.8087 4.77472 11.017 4.983C11.2021 5.16813 11.2227 5.45552 11.0787 5.66338L11.017 5.73724L8.75426 7.99998L11.017 10.2627C11.2253 10.471 11.2253 10.8087 11.017 11.017C10.8319 11.2021 10.5445 11.2227 10.3366 11.0787L10.2628 11.017L8.00001 8.75423L5.73727 11.017Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
