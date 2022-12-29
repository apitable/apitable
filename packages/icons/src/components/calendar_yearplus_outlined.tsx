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

export const CalendarYearplusOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M6.75358 3.12096L11.2791 7.64645C11.4743 7.84171 11.4743 8.15829 11.2791 8.35355L6.75358 12.879C6.55832 13.0743 6.24173 13.0743 6.04647 12.879C5.85121 12.6838 5.85121 12.3672 6.04647 12.1719L10.2184 8L6.04647 3.82807C5.85121 3.63281 5.85121 3.31623 6.04647 3.12096C6.24173 2.9257 6.55832 2.9257 6.75358 3.12096ZM13.283 5.38371L15.5457 7.64645C15.741 7.84171 15.741 8.15829 15.5457 8.35355L11.0202 12.879C10.825 13.0743 10.5084 13.0743 10.3131 12.879C10.1179 12.6838 10.1179 12.3672 10.3131 12.1719L14.4851 8L12.5759 6.09081L10.3131 3.82807C10.1179 3.63281 10.1179 3.31623 10.3131 3.12096C10.5084 2.9257 10.825 2.9257 11.0202 3.12096L13.283 5.38371Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'calendar_yearplus_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M6.75358 3.12096L11.2791 7.64645C11.4743 7.84171 11.4743 8.15829 11.2791 8.35355L6.75358 12.879C6.55832 13.0743 6.24173 13.0743 6.04647 12.879C5.85121 12.6838 5.85121 12.3672 6.04647 12.1719L10.2184 8L6.04647 3.82807C5.85121 3.63281 5.85121 3.31623 6.04647 3.12096C6.24173 2.9257 6.55832 2.9257 6.75358 3.12096ZM13.283 5.38371L15.5457 7.64645C15.741 7.84171 15.741 8.15829 15.5457 8.35355L11.0202 12.879C10.825 13.0743 10.5084 13.0743 10.3131 12.879C10.1179 12.6838 10.1179 12.3672 10.3131 12.1719L14.4851 8L12.5759 6.09081L10.3131 3.82807C10.1179 3.63281 10.1179 3.31623 10.3131 3.12096C10.5084 2.9257 10.825 2.9257 11.0202 3.12096L13.283 5.38371Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
