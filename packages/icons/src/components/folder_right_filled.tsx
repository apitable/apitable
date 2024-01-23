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

export const FolderRightFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2.25 2C1.55964 2 1 2.55964 1 3.25V12.75C1 13.4404 1.55964 14 2.25 14H13.75C14.4404 14 15 13.4404 15 12.75V4.75C15 4.05964 14.4404 3.5 13.75 3.5H10.6667C10.3962 3.5 10.133 3.41228 9.91667 3.25L8.58333 2.25C8.36696 2.08772 8.1038 2 7.83333 2H2.25ZM10.8077 9.0481L9.03991 10.8159C8.74701 11.1088 8.27214 11.1088 7.97925 10.8159C7.68635 10.523 7.68635 10.0481 7.97925 9.7552L8.43055 9.3039H5.75C5.33579 9.3039 5 8.96811 5 8.5539C5 8.13969 5.33579 7.8039 5.75 7.8039H8.50282L7.97925 7.28033C7.68635 6.98744 7.68635 6.51256 7.97925 6.21967C8.27214 5.92678 8.74701 5.92678 9.03991 6.21967L10.8077 7.98744C11.1006 8.28033 11.1006 8.7552 10.8077 9.0481Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'folder_right_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M2.25 2C1.55964 2 1 2.55964 1 3.25V12.75C1 13.4404 1.55964 14 2.25 14H13.75C14.4404 14 15 13.4404 15 12.75V4.75C15 4.05964 14.4404 3.5 13.75 3.5H10.6667C10.3962 3.5 10.133 3.41228 9.91667 3.25L8.58333 2.25C8.36696 2.08772 8.1038 2 7.83333 2H2.25ZM10.8077 9.0481L9.03991 10.8159C8.74701 11.1088 8.27214 11.1088 7.97925 10.8159C7.68635 10.523 7.68635 10.0481 7.97925 9.7552L8.43055 9.3039H5.75C5.33579 9.3039 5 8.96811 5 8.5539C5 8.13969 5.33579 7.8039 5.75 7.8039H8.50282L7.97925 7.28033C7.68635 6.98744 7.68635 6.51256 7.97925 6.21967C8.27214 5.92678 8.74701 5.92678 9.03991 6.21967L10.8077 7.98744C11.1006 8.28033 11.1006 8.7552 10.8077 9.0481Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
