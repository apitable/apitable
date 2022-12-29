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

export const MovefileOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3 12V4H7.67347L9.23235 5.13953C9.48928 5.32734 9.79929 5.42857 10.1175 5.42857H13V12H3ZM2.5 2C1.67157 2 1 2.67157 1 3.5V12.5C1 13.3284 1.67157 14 2.5 14H13.5C14.3284 14 15 13.3284 15 12.5V4.92857C15 4.10014 14.3284 3.42857 13.5 3.42857H10.2808L8.72194 2.28904C8.46501 2.10123 8.15499 2 7.83674 2H2.5ZM10.8077 9.0481L9.03991 10.8159C8.74701 11.1088 8.27214 11.1088 7.97925 10.8159C7.68635 10.523 7.68635 10.0481 7.97925 9.7552L8.43092 9.30353H5.75C5.33579 9.30353 5 8.96775 5 8.55353C5 8.13932 5.33579 7.80353 5.75 7.80353H8.50245L7.97925 7.28033C7.68635 6.98744 7.68635 6.51256 7.97925 6.21967C8.27214 5.92678 8.74701 5.92678 9.03991 6.21967L10.8077 7.98744C11.1006 8.28033 11.1006 8.7552 10.8077 9.0481Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'movefile_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M3 12V4H7.67347L9.23235 5.13953C9.48928 5.32734 9.79929 5.42857 10.1175 5.42857H13V12H3ZM2.5 2C1.67157 2 1 2.67157 1 3.5V12.5C1 13.3284 1.67157 14 2.5 14H13.5C14.3284 14 15 13.3284 15 12.5V4.92857C15 4.10014 14.3284 3.42857 13.5 3.42857H10.2808L8.72194 2.28904C8.46501 2.10123 8.15499 2 7.83674 2H2.5ZM10.8077 9.0481L9.03991 10.8159C8.74701 11.1088 8.27214 11.1088 7.97925 10.8159C7.68635 10.523 7.68635 10.0481 7.97925 9.7552L8.43092 9.30353H5.75C5.33579 9.30353 5 8.96775 5 8.55353C5 8.13932 5.33579 7.80353 5.75 7.80353H8.50245L7.97925 7.28033C7.68635 6.98744 7.68635 6.51256 7.97925 6.21967C8.27214 5.92678 8.74701 5.92678 9.03991 6.21967L10.8077 7.98744C11.1006 8.28033 11.1006 8.7552 10.8077 9.0481Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
