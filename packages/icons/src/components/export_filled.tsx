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

export const ExportFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1.5 2.75C1.5 2.05964 2.05964 1.5 2.75 1.5H13.25C13.9404 1.5 14.5 2.05964 14.5 2.75V13.25C14.5 13.9404 13.9404 14.5 13.25 14.5H2.75C2.05964 14.5 1.5 13.9404 1.5 13.25V2.75ZM4.99482 7.50494C4.70192 7.21205 4.70192 6.73717 4.99482 6.44428L7.46969 3.96941C7.76258 3.67651 8.23746 3.67651 8.53035 3.96941L11.0052 6.44428C11.2981 6.73717 11.2981 7.21205 11.0052 7.50494C10.7123 7.79783 10.2375 7.79783 9.94456 7.50494L8.75 6.31038V11.5C8.75 11.9142 8.41421 12.25 8 12.25C7.58579 12.25 7.25 11.9142 7.25 11.5V6.31042L6.05548 7.50494C5.76258 7.79783 5.28771 7.79783 4.99482 7.50494Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'export_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M1.5 2.75C1.5 2.05964 2.05964 1.5 2.75 1.5H13.25C13.9404 1.5 14.5 2.05964 14.5 2.75V13.25C14.5 13.9404 13.9404 14.5 13.25 14.5H2.75C2.05964 14.5 1.5 13.9404 1.5 13.25V2.75ZM4.99482 7.50494C4.70192 7.21205 4.70192 6.73717 4.99482 6.44428L7.46969 3.96941C7.76258 3.67651 8.23746 3.67651 8.53035 3.96941L11.0052 6.44428C11.2981 6.73717 11.2981 7.21205 11.0052 7.50494C10.7123 7.79783 10.2375 7.79783 9.94456 7.50494L8.75 6.31038V11.5C8.75 11.9142 8.41421 12.25 8 12.25C7.58579 12.25 7.25 11.9142 7.25 11.5V6.31042L6.05548 7.50494C5.76258 7.79783 5.28771 7.79783 4.99482 7.50494Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
