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

export const QuestionCircleOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5.63759 5.92957C5.84493 4.81453 6.84597 4 7.99995 4C9.31323 4 10.375 5.04945 10.375 6.35681C10.375 7.40374 9.68779 8.27783 8.74995 8.59036V9C8.74995 9.41421 8.41417 9.75 7.99995 9.75C7.58574 9.75 7.24995 9.41421 7.24995 9V8.21719C7.24995 7.63965 7.70089 7.27133 8.13399 7.202C8.565 7.13301 8.87495 6.77056 8.87495 6.35681C8.87495 5.88934 8.49631 5.5 7.99995 5.5C7.54631 5.5 7.1835 5.82097 7.11232 6.20378C7.03659 6.61102 6.64508 6.87976 6.23785 6.80404C5.83061 6.72832 5.56187 6.3368 5.63759 5.92957Z" fill={ colors[0] }/>
    <path d="M8.99995 11.25C8.99995 11.8023 8.55224 12.25 7.99995 12.25C7.44767 12.25 6.99995 11.8023 6.99995 11.25C6.99995 10.6977 7.44767 10.25 7.99995 10.25C8.55224 10.25 8.99995 10.6977 8.99995 11.25Z" fill={ colors[0] }/>
    <path d="M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1ZM2.5 8C2.5 4.96243 4.96243 2.5 8 2.5C11.0376 2.5 13.5 4.96243 13.5 8C13.5 11.0376 11.0376 13.5 8 13.5C4.96243 13.5 2.5 11.0376 2.5 8Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'question_circle_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M5.63759 5.92957C5.84493 4.81453 6.84597 4 7.99995 4C9.31323 4 10.375 5.04945 10.375 6.35681C10.375 7.40374 9.68779 8.27783 8.74995 8.59036V9C8.74995 9.41421 8.41417 9.75 7.99995 9.75C7.58574 9.75 7.24995 9.41421 7.24995 9V8.21719C7.24995 7.63965 7.70089 7.27133 8.13399 7.202C8.565 7.13301 8.87495 6.77056 8.87495 6.35681C8.87495 5.88934 8.49631 5.5 7.99995 5.5C7.54631 5.5 7.1835 5.82097 7.11232 6.20378C7.03659 6.61102 6.64508 6.87976 6.23785 6.80404C5.83061 6.72832 5.56187 6.3368 5.63759 5.92957Z', 'M8.99995 11.25C8.99995 11.8023 8.55224 12.25 7.99995 12.25C7.44767 12.25 6.99995 11.8023 6.99995 11.25C6.99995 10.6977 7.44767 10.25 7.99995 10.25C8.55224 10.25 8.99995 10.6977 8.99995 11.25Z', 'M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1ZM2.5 8C2.5 4.96243 4.96243 2.5 8 2.5C11.0376 2.5 13.5 4.96243 13.5 8C13.5 11.0376 11.0376 13.5 8 13.5C4.96243 13.5 2.5 11.0376 2.5 8Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
