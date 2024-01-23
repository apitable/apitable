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

export const FolderLeftOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5.21967 9.0481L6.98744 10.8159C7.28033 11.1088 7.7552 11.1088 8.0481 10.8159C8.34099 10.523 8.34099 10.0481 8.0481 9.7552L7.5963 9.30341H10.2773C10.6916 9.30341 11.0273 8.96763 11.0273 8.55341C11.0273 8.1392 10.6916 7.80341 10.2773 7.80341H7.52502L8.0481 7.28033C8.34099 6.98744 8.34099 6.51256 8.0481 6.21967C7.7552 5.92678 7.28033 5.92678 6.98744 6.21967L5.21967 7.98744C4.92678 8.28033 4.92678 8.7552 5.21967 9.0481Z" fill={ colors[0] }/>
    <path d="M2.25 2C1.55964 2 1 2.55964 1 3.25V12.75C1 13.4404 1.55964 14 2.25 14H13.75C14.4404 14 15 13.4404 15 12.75V4.75C15 4.05964 14.4404 3.5 13.75 3.5H10.2822L8.57718 2.24368C8.36236 2.08539 8.10252 2 7.83568 2H2.25ZM2.5 12.5V3.5H7.75353L9.45853 4.75632C9.67335 4.91461 9.93319 5 10.2 5H13.5V12.5H2.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'folder_left_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M5.21967 9.0481L6.98744 10.8159C7.28033 11.1088 7.7552 11.1088 8.0481 10.8159C8.34099 10.523 8.34099 10.0481 8.0481 9.7552L7.5963 9.30341H10.2773C10.6916 9.30341 11.0273 8.96763 11.0273 8.55341C11.0273 8.1392 10.6916 7.80341 10.2773 7.80341H7.52502L8.0481 7.28033C8.34099 6.98744 8.34099 6.51256 8.0481 6.21967C7.7552 5.92678 7.28033 5.92678 6.98744 6.21967L5.21967 7.98744C4.92678 8.28033 4.92678 8.7552 5.21967 9.0481Z', 'M2.25 2C1.55964 2 1 2.55964 1 3.25V12.75C1 13.4404 1.55964 14 2.25 14H13.75C14.4404 14 15 13.4404 15 12.75V4.75C15 4.05964 14.4404 3.5 13.75 3.5H10.2822L8.57718 2.24368C8.36236 2.08539 8.10252 2 7.83568 2H2.25ZM2.5 12.5V3.5H7.75353L9.45853 4.75632C9.67335 4.91461 9.93319 5 10.2 5H13.5V12.5H2.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
