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

export const EmojiOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3 8C3 5.23858 5.23858 3 8 3C10.7614 3 13 5.23858 13 8C13 10.7614 10.7614 13 8 13C5.23858 13 3 10.7614 3 8ZM8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1ZM7 6C7 5.44772 6.55228 5 6 5C5.44772 5 5 5.44772 5 6V6.5C5 7.05228 5.44772 7.5 6 7.5C6.55228 7.5 7 7.05228 7 6.5V6ZM10 5C10.5523 5 11 5.44772 11 6V6.5C11 7.05228 10.5523 7.5 10 7.5C9.44772 7.5 9 7.05228 9 6.5V6C9 5.44772 9.44772 5 10 5ZM6.32274 9.49981C6.04649 9.19117 5.57235 9.1649 5.2637 9.44115C4.95506 9.71739 4.92879 10.1915 5.20503 10.5002C5.89061 11.2662 6.8893 11.75 7.99999 11.75C9.11069 11.75 10.1094 11.2662 10.7949 10.5002C11.0712 10.1915 11.0449 9.71739 10.7363 9.44115C10.4276 9.1649 9.95349 9.19117 9.67725 9.49981C9.26418 9.96132 8.6663 10.25 7.99999 10.25C7.33369 10.25 6.7358 9.96132 6.32274 9.49981Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'emoji_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M3 8C3 5.23858 5.23858 3 8 3C10.7614 3 13 5.23858 13 8C13 10.7614 10.7614 13 8 13C5.23858 13 3 10.7614 3 8ZM8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1ZM7 6C7 5.44772 6.55228 5 6 5C5.44772 5 5 5.44772 5 6V6.5C5 7.05228 5.44772 7.5 6 7.5C6.55228 7.5 7 7.05228 7 6.5V6ZM10 5C10.5523 5 11 5.44772 11 6V6.5C11 7.05228 10.5523 7.5 10 7.5C9.44772 7.5 9 7.05228 9 6.5V6C9 5.44772 9.44772 5 10 5ZM6.32274 9.49981C6.04649 9.19117 5.57235 9.1649 5.2637 9.44115C4.95506 9.71739 4.92879 10.1915 5.20503 10.5002C5.89061 11.2662 6.8893 11.75 7.99999 11.75C9.11069 11.75 10.1094 11.2662 10.7949 10.5002C11.0712 10.1915 11.0449 9.71739 10.7363 9.44115C10.4276 9.1649 9.95349 9.19117 9.67725 9.49981C9.26418 9.96132 8.6663 10.25 7.99999 10.25C7.33369 10.25 6.7358 9.96132 6.32274 9.49981Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
