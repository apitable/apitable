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
    <path d="M6 6.5C5.58579 6.5 5.25 6.83579 5.25 7.25C5.25 7.66421 5.58579 8 6 8H10C10.4142 8 10.75 7.66421 10.75 7.25C10.75 6.83579 10.4142 6.5 10 6.5H6Z" fill={ colors[0] }/>
    <path d="M6 9.5C5.58579 9.5 5.25 9.83579 5.25 10.25C5.25 10.6642 5.58579 11 6 11H10C10.4142 11 10.75 10.6642 10.75 10.25C10.75 9.83579 10.4142 9.5 10 9.5H6Z" fill={ colors[0] }/>
    <path d="M6.25 1C5.55964 1 5 1.55964 5 2.25H3.75C3.05964 2.25 2.5 2.80964 2.5 3.5V13.75C2.5 14.4404 3.05964 15 3.75 15H12.25C12.9404 15 13.5 14.4404 13.5 13.75V3.5C13.5 2.80964 12.9404 2.25 12.25 2.25H11C11 1.55964 10.4404 1 9.75 1H6.25ZM11 3.75C11 4.44036 10.4404 5 9.75 5H6.25C5.55964 5 5 4.44036 5 3.75H4V13.5H12V3.75H11ZM9.5 3.5H6.5V2.5H9.5V3.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'form_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M6 6.5C5.58579 6.5 5.25 6.83579 5.25 7.25C5.25 7.66421 5.58579 8 6 8H10C10.4142 8 10.75 7.66421 10.75 7.25C10.75 6.83579 10.4142 6.5 10 6.5H6Z', 'M6 9.5C5.58579 9.5 5.25 9.83579 5.25 10.25C5.25 10.6642 5.58579 11 6 11H10C10.4142 11 10.75 10.6642 10.75 10.25C10.75 9.83579 10.4142 9.5 10 9.5H6Z', 'M6.25 1C5.55964 1 5 1.55964 5 2.25H3.75C3.05964 2.25 2.5 2.80964 2.5 3.5V13.75C2.5 14.4404 3.05964 15 3.75 15H12.25C12.9404 15 13.5 14.4404 13.5 13.75V3.5C13.5 2.80964 12.9404 2.25 12.25 2.25H11C11 1.55964 10.4404 1 9.75 1H6.25ZM11 3.75C11 4.44036 10.4404 5 9.75 5H6.25C5.55964 5 5 4.44036 5 3.75H4V13.5H12V3.75H11ZM9.5 3.5H6.5V2.5H9.5V3.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
