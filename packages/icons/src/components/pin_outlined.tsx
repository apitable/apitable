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

export const PinOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.89564 14.2159C9.60446 14.9247 10.8174 14.5527 11.007 13.5684L11.8257 9.31667L14.797 7.41467C15.4693 6.98427 15.5715 6.0425 15.007 5.47801L10.8345 1.30556C10.27 0.741063 9.32825 0.843171 8.89785 1.51553L6.99585 4.48681L2.74411 5.30555C1.75977 5.4951 1.38777 6.70806 2.09659 7.41688L4.96579 10.2861L2.57931 12.6726C2.28642 12.9655 2.28642 13.4403 2.57931 13.7332C2.87221 14.0261 3.34708 14.0261 3.63997 13.7332L6.02645 11.3467L8.89564 14.2159ZM10.3731 8.92762L9.62313 12.8221L6.55968 9.75865L6.55679 9.75574L6.55388 9.75285L3.49043 6.68939L7.38489 5.93945C7.7214 5.87465 8.01655 5.67454 8.20131 5.38591L9.99362 2.58599L13.7265 6.3189L10.9266 8.11121C10.638 8.29597 10.4379 8.59112 10.3731 8.92762Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'pin_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8.89564 14.2159C9.60446 14.9247 10.8174 14.5527 11.007 13.5684L11.8257 9.31667L14.797 7.41467C15.4693 6.98427 15.5715 6.0425 15.007 5.47801L10.8345 1.30556C10.27 0.741063 9.32825 0.843171 8.89785 1.51553L6.99585 4.48681L2.74411 5.30555C1.75977 5.4951 1.38777 6.70806 2.09659 7.41688L4.96579 10.2861L2.57931 12.6726C2.28642 12.9655 2.28642 13.4403 2.57931 13.7332C2.87221 14.0261 3.34708 14.0261 3.63997 13.7332L6.02645 11.3467L8.89564 14.2159ZM10.3731 8.92762L9.62313 12.8221L6.55968 9.75865L6.55679 9.75574L6.55388 9.75285L3.49043 6.68939L7.38489 5.93945C7.7214 5.87465 8.01655 5.67454 8.20131 5.38591L9.99362 2.58599L13.7265 6.3189L10.9266 8.11121C10.638 8.29597 10.4379 8.59112 10.3731 8.92762Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
