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

export const UnpublishOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1 2C1 1.44772 1.44772 1 2 1H14C14.5523 1 15 1.44772 15 2V14C15 14.5523 14.5523 15 14 15H2C1.44772 15 1 14.5523 1 14V2ZM3 3V13H13V3H3ZM5 5C5 4.44772 5.44772 4 6 4H8C8.55228 4 9 4.44772 9 5V8.58502L9.29249 8.29252C9.68302 7.902 10.3162 7.902 10.7067 8.29252C11.0972 8.68305 11.0972 9.31621 10.7067 9.70674L8.73014 11.6833C8.55629 11.869 8.31241 11.9883 8.04062 11.9992C8.02684 11.9998 8.01303 12 7.99918 12C7.73396 12 7.47961 11.8947 7.29207 11.7072L5.29305 9.70814C4.90253 9.31761 4.90253 8.68445 5.29305 8.29392C5.68358 7.9034 6.31674 7.9034 6.70727 8.29392L7 8.58665V6H6C5.44772 6 5 5.55228 5 5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'unpublish_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M1 2C1 1.44772 1.44772 1 2 1H14C14.5523 1 15 1.44772 15 2V14C15 14.5523 14.5523 15 14 15H2C1.44772 15 1 14.5523 1 14V2ZM3 3V13H13V3H3ZM5 5C5 4.44772 5.44772 4 6 4H8C8.55228 4 9 4.44772 9 5V8.58502L9.29249 8.29252C9.68302 7.902 10.3162 7.902 10.7067 8.29252C11.0972 8.68305 11.0972 9.31621 10.7067 9.70674L8.73014 11.6833C8.55629 11.869 8.31241 11.9883 8.04062 11.9992C8.02684 11.9998 8.01303 12 7.99918 12C7.73396 12 7.47961 11.8947 7.29207 11.7072L5.29305 9.70814C4.90253 9.31761 4.90253 8.68445 5.29305 8.29392C5.68358 7.9034 6.31674 7.9034 6.70727 8.29392L7 8.58665V6H6C5.44772 6 5 5.55228 5 5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
