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

export const QuestionCircleFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8ZM5.63765 5.92957C5.84498 4.81453 6.84603 4 8.00001 4C9.31329 4 10.375 5.04945 10.375 6.35681C10.375 7.40374 9.68785 8.27783 8.75001 8.59036V9C8.75001 9.41421 8.41423 9.75 8.00001 9.75C7.5858 9.75 7.25001 9.41421 7.25001 9V8.21719C7.25001 7.63965 7.70095 7.27133 8.13405 7.202C8.56506 7.13301 8.87501 6.77056 8.87501 6.35681C8.87501 5.88934 8.49637 5.5 8.00001 5.5C7.54637 5.5 7.18355 5.82097 7.11237 6.20378C7.03665 6.61102 6.64514 6.87976 6.23791 6.80404C5.83067 6.72832 5.56193 6.3368 5.63765 5.92957ZM9.00001 11.25C9.00001 11.8023 8.5523 12.25 8.00001 12.25C7.44773 12.25 7.00001 11.8023 7.00001 11.25C7.00001 10.6977 7.44773 10.25 8.00001 10.25C8.5523 10.25 9.00001 10.6977 9.00001 11.25Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'question_circle_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8ZM5.63765 5.92957C5.84498 4.81453 6.84603 4 8.00001 4C9.31329 4 10.375 5.04945 10.375 6.35681C10.375 7.40374 9.68785 8.27783 8.75001 8.59036V9C8.75001 9.41421 8.41423 9.75 8.00001 9.75C7.5858 9.75 7.25001 9.41421 7.25001 9V8.21719C7.25001 7.63965 7.70095 7.27133 8.13405 7.202C8.56506 7.13301 8.87501 6.77056 8.87501 6.35681C8.87501 5.88934 8.49637 5.5 8.00001 5.5C7.54637 5.5 7.18355 5.82097 7.11237 6.20378C7.03665 6.61102 6.64514 6.87976 6.23791 6.80404C5.83067 6.72832 5.56193 6.3368 5.63765 5.92957ZM9.00001 11.25C9.00001 11.8023 8.5523 12.25 8.00001 12.25C7.44773 12.25 7.00001 11.8023 7.00001 11.25C7.00001 10.6977 7.44773 10.25 8.00001 10.25C8.5523 10.25 9.00001 10.6977 9.00001 11.25Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
