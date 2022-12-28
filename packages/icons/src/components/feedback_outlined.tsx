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

export const FeedbackOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.06667 4.05C6.78205 4.05 5.71503 4.97497 5.49252 6.19505C5.41821 6.60255 5.68831 6.99313 6.0958 7.06744C6.50329 7.14175 6.89387 6.87166 6.96819 6.46416C7.06302 5.94416 7.5196 5.55 8.06667 5.55C8.68339 5.55 9.18334 6.04995 9.18334 6.66667C9.18334 7.22095 8.77876 7.68218 8.24883 7.76867C7.79446 7.84283 7.31667 8.2278 7.31667 8.83742V9.35154C7.31667 9.76576 7.65246 10.1015 8.06667 10.1015C8.48088 10.1015 8.81667 9.76576 8.81667 9.35154V9.17407C9.89642 8.85142 10.6833 7.85154 10.6833 6.66667C10.6833 5.22152 9.51182 4.05 8.06667 4.05ZM8.87518 11.3021C8.87518 11.7403 8.51999 12.0954 8.08185 12.0954C7.6437 12.0954 7.28851 11.7403 7.28851 11.3021C7.28851 10.864 7.6437 10.5088 8.08185 10.5088C8.51999 10.5088 8.87518 10.864 8.87518 11.3021Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'feedback_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M8.06667 4.05C6.78205 4.05 5.71503 4.97497 5.49252 6.19505C5.41821 6.60255 5.68831 6.99313 6.0958 7.06744C6.50329 7.14175 6.89387 6.87166 6.96819 6.46416C7.06302 5.94416 7.5196 5.55 8.06667 5.55C8.68339 5.55 9.18334 6.04995 9.18334 6.66667C9.18334 7.22095 8.77876 7.68218 8.24883 7.76867C7.79446 7.84283 7.31667 8.2278 7.31667 8.83742V9.35154C7.31667 9.76576 7.65246 10.1015 8.06667 10.1015C8.48088 10.1015 8.81667 9.76576 8.81667 9.35154V9.17407C9.89642 8.85142 10.6833 7.85154 10.6833 6.66667C10.6833 5.22152 9.51182 4.05 8.06667 4.05ZM8.87518 11.3021C8.87518 11.7403 8.51999 12.0954 8.08185 12.0954C7.6437 12.0954 7.28851 11.7403 7.28851 11.3021C7.28851 10.864 7.6437 10.5088 8.08185 10.5088C8.51999 10.5088 8.87518 10.864 8.87518 11.3021Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
