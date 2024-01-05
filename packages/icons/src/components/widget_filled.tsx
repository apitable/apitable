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

export const WidgetFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7.375 1.24482C7.76175 1.02153 8.23825 1.02153 8.625 1.24482L13.5377 4.08114C13.9244 4.30443 14.1627 4.71709 14.1627 5.16367L14.1627 10.8363C14.1627 11.2829 13.9244 11.6956 13.5377 11.9189L8.625 14.7552C8.23825 14.9785 7.76175 14.9785 7.375 14.7552L2.46234 11.9189C2.07559 11.6956 1.83734 11.2829 1.83734 10.8363V5.16368C1.83734 4.7171 2.07559 4.30444 2.46234 4.08115L7.375 1.24482ZM8 2.61603L4.08731 4.87502L8 7.13398L11.9127 4.87502L8 2.61603ZM3.33734 10.692L3.33734 6.17407L7.25 8.43302L7.25 12.951L3.33734 10.692Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'widget_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M7.375 1.24482C7.76175 1.02153 8.23825 1.02153 8.625 1.24482L13.5377 4.08114C13.9244 4.30443 14.1627 4.71709 14.1627 5.16367L14.1627 10.8363C14.1627 11.2829 13.9244 11.6956 13.5377 11.9189L8.625 14.7552C8.23825 14.9785 7.76175 14.9785 7.375 14.7552L2.46234 11.9189C2.07559 11.6956 1.83734 11.2829 1.83734 10.8363V5.16368C1.83734 4.7171 2.07559 4.30444 2.46234 4.08115L7.375 1.24482ZM8 2.61603L4.08731 4.87502L8 7.13398L11.9127 4.87502L8 2.61603ZM3.33734 10.692L3.33734 6.17407L7.25 8.43302L7.25 12.951L3.33734 10.692Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
