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

export const FolderLeftFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2.25 2C1.55964 2 1 2.55964 1 3.25V12.75C1 13.4404 1.55964 14 2.25 14H13.75C14.4404 14 15 13.4404 15 12.75V4.75C15 4.05964 14.4404 3.5 13.75 3.5H10.6667C10.3962 3.5 10.133 3.41228 9.91667 3.25L8.58333 2.25C8.36696 2.08772 8.1038 2 7.83333 2H2.25ZM5.21967 9.0481L6.98744 10.8159C7.28033 11.1088 7.7552 11.1088 8.0481 10.8159C8.34099 10.523 8.34099 10.0481 8.0481 9.7552L7.59679 9.3039H10.2773C10.6916 9.3039 11.0273 8.96811 11.0273 8.5539C11.0273 8.13969 10.6916 7.8039 10.2773 7.8039H7.52453L8.0481 7.28033C8.34099 6.98744 8.34099 6.51256 8.0481 6.21967C7.7552 5.92678 7.28033 5.92678 6.98744 6.21967L5.21967 7.98744C4.92678 8.28033 4.92678 8.7552 5.21967 9.0481Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'folder_left_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M2.25 2C1.55964 2 1 2.55964 1 3.25V12.75C1 13.4404 1.55964 14 2.25 14H13.75C14.4404 14 15 13.4404 15 12.75V4.75C15 4.05964 14.4404 3.5 13.75 3.5H10.6667C10.3962 3.5 10.133 3.41228 9.91667 3.25L8.58333 2.25C8.36696 2.08772 8.1038 2 7.83333 2H2.25ZM5.21967 9.0481L6.98744 10.8159C7.28033 11.1088 7.7552 11.1088 8.0481 10.8159C8.34099 10.523 8.34099 10.0481 8.0481 9.7552L7.59679 9.3039H10.2773C10.6916 9.3039 11.0273 8.96811 11.0273 8.5539C11.0273 8.13969 10.6916 7.8039 10.2773 7.8039H7.52453L8.0481 7.28033C8.34099 6.98744 8.34099 6.51256 8.0481 6.21967C7.7552 5.92678 7.28033 5.92678 6.98744 6.21967L5.21967 7.98744C4.92678 8.28033 4.92678 8.7552 5.21967 9.0481Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
