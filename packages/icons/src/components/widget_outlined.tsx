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

export const WidgetOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.625 1.24486C8.23825 1.02157 7.76175 1.02157 7.375 1.24486L2.46234 4.08119C2.07559 4.30448 1.83734 4.71714 1.83734 5.16372V10.8364C1.83734 11.283 2.07559 11.6956 2.46234 11.9189L7.375 14.7552C7.76175 14.9785 8.23825 14.9785 8.625 14.7552L13.5377 11.9189C13.9244 11.6956 14.1627 11.2829 14.1627 10.8364L14.1627 5.16372C14.1627 4.71713 13.9244 4.30448 13.5377 4.08119L8.625 1.24486ZM8 7.13402L4.08731 4.87506L8 2.61607L11.9127 4.87506L8 7.13402ZM8.75 8.43306L8.75 12.951L12.6627 10.692V6.17411L8.75 8.43306ZM3.33734 6.17411L7.25 8.43306L7.25 12.951L3.33734 10.692L3.33734 6.17411Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'widget_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8.625 1.24486C8.23825 1.02157 7.76175 1.02157 7.375 1.24486L2.46234 4.08119C2.07559 4.30448 1.83734 4.71714 1.83734 5.16372V10.8364C1.83734 11.283 2.07559 11.6956 2.46234 11.9189L7.375 14.7552C7.76175 14.9785 8.23825 14.9785 8.625 14.7552L13.5377 11.9189C13.9244 11.6956 14.1627 11.2829 14.1627 10.8364L14.1627 5.16372C14.1627 4.71713 13.9244 4.30448 13.5377 4.08119L8.625 1.24486ZM8 7.13402L4.08731 4.87506L8 2.61607L11.9127 4.87506L8 7.13402ZM8.75 8.43306L8.75 12.951L12.6627 10.692V6.17411L8.75 8.43306ZM3.33734 6.17411L7.25 8.43306L7.25 12.951L3.33734 10.692L3.33734 6.17411Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
