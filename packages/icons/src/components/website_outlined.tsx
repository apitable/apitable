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

export const WebsiteOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1 4C1 2.34315 2.34315 1 4 1H12C13.6569 1 15 2.34315 15 4V12C15 13.6569 13.6569 15 12 15H4C2.34315 15 1 13.6569 1 12V4ZM4 3C3.44772 3 3 3.44772 3 4V12C3 12.5523 3.44772 13 4 13H12C12.5523 13 13 12.5523 13 12V4C13 3.44772 12.5523 3 12 3H4ZM11.187 4.39724C11.5799 4.78542 11.5837 5.41857 11.1955 5.81143L6.34347 10.722L4.63214 12.454V10.0192V5.10857C4.63214 4.55629 5.07986 4.10857 5.63214 4.10857C6.18443 4.10857 6.63214 4.55629 6.63214 5.10857V7.58432L9.77286 4.40572C10.161 4.01286 10.7942 4.00906 11.187 4.39724ZM10.0625 11.7186C10.6148 11.7186 11.0625 11.2709 11.0625 10.7186C11.0625 10.1663 10.6148 9.71857 10.0625 9.71857C9.51022 9.71857 9.0625 10.1663 9.0625 10.7186C9.0625 11.2709 9.51022 11.7186 10.0625 11.7186Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'website_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M1 4C1 2.34315 2.34315 1 4 1H12C13.6569 1 15 2.34315 15 4V12C15 13.6569 13.6569 15 12 15H4C2.34315 15 1 13.6569 1 12V4ZM4 3C3.44772 3 3 3.44772 3 4V12C3 12.5523 3.44772 13 4 13H12C12.5523 13 13 12.5523 13 12V4C13 3.44772 12.5523 3 12 3H4ZM11.187 4.39724C11.5799 4.78542 11.5837 5.41857 11.1955 5.81143L6.34347 10.722L4.63214 12.454V10.0192V5.10857C4.63214 4.55629 5.07986 4.10857 5.63214 4.10857C6.18443 4.10857 6.63214 4.55629 6.63214 5.10857V7.58432L9.77286 4.40572C10.161 4.01286 10.7942 4.00906 11.187 4.39724ZM10.0625 11.7186C10.6148 11.7186 11.0625 11.2709 11.0625 10.7186C11.0625 10.1663 10.6148 9.71857 10.0625 9.71857C9.51022 9.71857 9.0625 10.1663 9.0625 10.7186C9.0625 11.2709 9.51022 11.7186 10.0625 11.7186Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
