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

export const ArrowUpOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7.29307 2.49285C7.48061 2.30532 7.73496 2.19996 8.00018 2.19996C8.2654 2.19996 8.51975 2.30532 8.70729 2.49285L12.4785 6.26409C12.869 6.65461 12.869 7.28778 12.4785 7.6783C12.088 8.06883 11.4548 8.06883 11.0643 7.6783L9.00018 5.61417V12.8C9.00018 13.3522 8.55246 13.8 8.00018 13.8C7.44789 13.8 7.00018 13.3522 7.00018 12.8V5.61417L4.93605 7.6783C4.54553 8.06883 3.91236 8.06883 3.52184 7.6783C3.13131 7.28778 3.13131 6.65461 3.52184 6.26409L7.29307 2.49285Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'arrow_up_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M7.29307 2.49285C7.48061 2.30532 7.73496 2.19996 8.00018 2.19996C8.2654 2.19996 8.51975 2.30532 8.70729 2.49285L12.4785 6.26409C12.869 6.65461 12.869 7.28778 12.4785 7.6783C12.088 8.06883 11.4548 8.06883 11.0643 7.6783L9.00018 5.61417V12.8C9.00018 13.3522 8.55246 13.8 8.00018 13.8C7.44789 13.8 7.00018 13.3522 7.00018 12.8V5.61417L4.93605 7.6783C4.54553 8.06883 3.91236 8.06883 3.52184 7.6783C3.13131 7.28778 3.13131 6.65461 3.52184 6.26409L7.29307 2.49285Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
