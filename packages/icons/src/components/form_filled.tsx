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

export const FormFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M9.75 1.75C9.75 1.33579 10.0858 1 10.5 1C10.9142 1 11.25 1.33579 11.25 1.75V3.75C11.25 4.16421 10.9142 4.5 10.5 4.5C10.0858 4.5 9.75 4.16421 9.75 3.75V1.75Z" fill={ colors[0] }/>
    <path d="M7 2.25H9V3.75C9 4.57843 9.67157 5.25 10.5 5.25C11.3284 5.25 12 4.57843 12 3.75V2.25H12.75C13.4404 2.25 14 2.80964 14 3.5V13.75C14 14.4404 13.4404 15 12.75 15H3.25C2.55964 15 2 14.4404 2 13.75V3.5C2 2.80964 2.55964 2.25 3.25 2.25H4V3.75C4 4.57843 4.67157 5.25 5.5 5.25C6.32843 5.25 7 4.57843 7 3.75V2.25ZM4.75 7.75C4.75 7.33579 5.08579 7 5.5 7H10.5C10.9142 7 11.25 7.33579 11.25 7.75C11.25 8.16421 10.9142 8.5 10.5 8.5H5.5C5.08579 8.5 4.75 8.16421 4.75 7.75ZM4.75 10.75C4.75 10.3358 5.08579 10 5.5 10H10.5C10.9142 10 11.25 10.3358 11.25 10.75C11.25 11.1642 10.9142 11.5 10.5 11.5H5.5C5.08579 11.5 4.75 11.1642 4.75 10.75Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M5.5 1C5.08579 1 4.75 1.33579 4.75 1.75V3.75C4.75 4.16421 5.08579 4.5 5.5 4.5C5.91421 4.5 6.25 4.16421 6.25 3.75V1.75C6.25 1.33579 5.91421 1 5.5 1Z" fill={ colors[0] }/>

  </>,
  name: 'form_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M9.75 1.75C9.75 1.33579 10.0858 1 10.5 1C10.9142 1 11.25 1.33579 11.25 1.75V3.75C11.25 4.16421 10.9142 4.5 10.5 4.5C10.0858 4.5 9.75 4.16421 9.75 3.75V1.75Z', 'M7 2.25H9V3.75C9 4.57843 9.67157 5.25 10.5 5.25C11.3284 5.25 12 4.57843 12 3.75V2.25H12.75C13.4404 2.25 14 2.80964 14 3.5V13.75C14 14.4404 13.4404 15 12.75 15H3.25C2.55964 15 2 14.4404 2 13.75V3.5C2 2.80964 2.55964 2.25 3.25 2.25H4V3.75C4 4.57843 4.67157 5.25 5.5 5.25C6.32843 5.25 7 4.57843 7 3.75V2.25ZM4.75 7.75C4.75 7.33579 5.08579 7 5.5 7H10.5C10.9142 7 11.25 7.33579 11.25 7.75C11.25 8.16421 10.9142 8.5 10.5 8.5H5.5C5.08579 8.5 4.75 8.16421 4.75 7.75ZM4.75 10.75C4.75 10.3358 5.08579 10 5.5 10H10.5C10.9142 10 11.25 10.3358 11.25 10.75C11.25 11.1642 10.9142 11.5 10.5 11.5H5.5C5.08579 11.5 4.75 11.1642 4.75 10.75Z', 'M5.5 1C5.08579 1 4.75 1.33579 4.75 1.75V3.75C4.75 4.16421 5.08579 4.5 5.5 4.5C5.91421 4.5 6.25 4.16421 6.25 3.75V1.75C6.25 1.33579 5.91421 1 5.5 1Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
