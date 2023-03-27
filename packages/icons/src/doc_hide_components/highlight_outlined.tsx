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

export const HighlightOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M10.2656 1.82325C10.8593 1.29734 11.7599 1.32461 12.3208 1.88547L13.8223 3.387C14.3832 3.94786 14.4104 4.84844 13.8845 5.44221L8.07073 12.0062C7.68878 12.4374 7.02239 12.4576 6.61504 12.0502L3.65754 9.09273C3.25019 8.68538 3.27037 8.01899 3.70161 7.63703L10.2656 1.82325ZM12.7616 4.44766L11.2601 2.94613L5.09383 8.40769L7.30007 10.6139L12.7616 4.44766Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M3.60538 10L5.875 12.25L4.98765 13H2.09646C1.66776 13 1.43785 12.4958 1.71896 12.1721L3.60538 10Z" fill={ colors[0] }/>
    <path d="M10 11.75C9.58579 11.75 9.25 12.0858 9.25 12.5C9.25 12.9142 9.58579 13.25 10 13.25H13.75C14.1642 13.25 14.5 12.9142 14.5 12.5C14.5 12.0858 14.1642 11.75 13.75 11.75H10Z" fill={ colors[0] }/>

  </>,
  name: 'highlight_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M10.2656 1.82325C10.8593 1.29734 11.7599 1.32461 12.3208 1.88547L13.8223 3.387C14.3832 3.94786 14.4104 4.84844 13.8845 5.44221L8.07073 12.0062C7.68878 12.4374 7.02239 12.4576 6.61504 12.0502L3.65754 9.09273C3.25019 8.68538 3.27037 8.01899 3.70161 7.63703L10.2656 1.82325ZM12.7616 4.44766L11.2601 2.94613L5.09383 8.40769L7.30007 10.6139L12.7616 4.44766Z', 'M3.60538 10L5.875 12.25L4.98765 13H2.09646C1.66776 13 1.43785 12.4958 1.71896 12.1721L3.60538 10Z', 'M10 11.75C9.58579 11.75 9.25 12.0858 9.25 12.5C9.25 12.9142 9.58579 13.25 10 13.25H13.75C14.1642 13.25 14.5 12.9142 14.5 12.5C14.5 12.0858 14.1642 11.75 13.75 11.75H10Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
