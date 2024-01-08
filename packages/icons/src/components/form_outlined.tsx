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

export const FormOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5.25 7.5C5.25 7.08579 5.58579 6.75 6 6.75H10C10.4142 6.75 10.75 7.08579 10.75 7.5C10.75 7.91421 10.4142 8.25 10 8.25H6C5.58579 8.25 5.25 7.91421 5.25 7.5Z" fill={ colors[0] }/>
    <path d="M5.25 10.5C5.25 10.0858 5.58579 9.75 6 9.75H10C10.4142 9.75 10.75 10.0858 10.75 10.5C10.75 10.9142 10.4142 11.25 10 11.25H6C5.58579 11.25 5.25 10.9142 5.25 10.5Z" fill={ colors[0] }/>
    <path d="M6 1C6.41421 1 6.75 1.33579 6.75 1.75V2.25H9.25V1.75C9.25 1.33579 9.58579 1 10 1C10.4142 1 10.75 1.33579 10.75 1.75V2.25H12.75C13.4404 2.25 14 2.80964 14 3.5V13.75C14 14.4404 13.4404 15 12.75 15H3.25C2.55964 15 2 14.4404 2 13.75V3.5C2 2.80964 2.55964 2.25 3.25 2.25H5.25V1.75C5.25 1.33579 5.58579 1 6 1ZM9.25 3.75V4.25C9.25 4.66421 9.58579 5 10 5C10.4142 5 10.75 4.66421 10.75 4.25V3.75H12.5V13.5H3.5V3.75H5.25V4.25C5.25 4.66421 5.58579 5 6 5C6.41421 5 6.75 4.66421 6.75 4.25V3.75H9.25Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'form_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M5.25 7.5C5.25 7.08579 5.58579 6.75 6 6.75H10C10.4142 6.75 10.75 7.08579 10.75 7.5C10.75 7.91421 10.4142 8.25 10 8.25H6C5.58579 8.25 5.25 7.91421 5.25 7.5Z', 'M5.25 10.5C5.25 10.0858 5.58579 9.75 6 9.75H10C10.4142 9.75 10.75 10.0858 10.75 10.5C10.75 10.9142 10.4142 11.25 10 11.25H6C5.58579 11.25 5.25 10.9142 5.25 10.5Z', 'M6 1C6.41421 1 6.75 1.33579 6.75 1.75V2.25H9.25V1.75C9.25 1.33579 9.58579 1 10 1C10.4142 1 10.75 1.33579 10.75 1.75V2.25H12.75C13.4404 2.25 14 2.80964 14 3.5V13.75C14 14.4404 13.4404 15 12.75 15H3.25C2.55964 15 2 14.4404 2 13.75V3.5C2 2.80964 2.55964 2.25 3.25 2.25H5.25V1.75C5.25 1.33579 5.58579 1 6 1ZM9.25 3.75V4.25C9.25 4.66421 9.58579 5 10 5C10.4142 5 10.75 4.66421 10.75 4.25V3.75H12.5V13.5H3.5V3.75H5.25V4.25C5.25 4.66421 5.58579 5 6 5C6.41421 5 6.75 4.66421 6.75 4.25V3.75H9.25Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
