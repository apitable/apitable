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

export const ExportOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.5414 1.73097C8.40489 1.58862 8.2128 1.5 8 1.5C7.78746 1.5 7.59557 1.58841 7.4591 1.73045L4.99479 4.19477C4.70189 4.48766 4.70189 4.96253 4.99479 5.25543C5.28768 5.54832 5.76255 5.54832 6.05545 5.25543L7.25 4.06087V10.25C7.25 10.6642 7.58579 11 8 11C8.41421 11 8.75 10.6642 8.75 10.25V4.06089L9.94453 5.25543C10.2374 5.54832 10.7123 5.54832 11.0052 5.25543C11.2981 4.96253 11.2981 4.48766 11.0052 4.19477L8.5414 1.73097Z" fill={ colors[0] }/>
    <path d="M3 7.5H4.25C4.66421 7.5 5 7.16421 5 6.75C5 6.33579 4.66421 6 4.25 6H2.75C2.05964 6 1.5 6.55964 1.5 7.25V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V7.25C14.5 6.55964 13.9404 6 13.25 6H11.75C11.3358 6 11 6.33579 11 6.75C11 7.16421 11.3358 7.5 11.75 7.5H13V13H3V7.5Z" fill={ colors[0] }/>

  </>,
  name: 'export_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8.5414 1.73097C8.40489 1.58862 8.2128 1.5 8 1.5C7.78746 1.5 7.59557 1.58841 7.4591 1.73045L4.99479 4.19477C4.70189 4.48766 4.70189 4.96253 4.99479 5.25543C5.28768 5.54832 5.76255 5.54832 6.05545 5.25543L7.25 4.06087V10.25C7.25 10.6642 7.58579 11 8 11C8.41421 11 8.75 10.6642 8.75 10.25V4.06089L9.94453 5.25543C10.2374 5.54832 10.7123 5.54832 11.0052 5.25543C11.2981 4.96253 11.2981 4.48766 11.0052 4.19477L8.5414 1.73097Z', 'M3 7.5H4.25C4.66421 7.5 5 7.16421 5 6.75C5 6.33579 4.66421 6 4.25 6H2.75C2.05964 6 1.5 6.55964 1.5 7.25V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V7.25C14.5 6.55964 13.9404 6 13.25 6H11.75C11.3358 6 11 6.33579 11 6.75C11 7.16421 11.3358 7.5 11.75 7.5H13V13H3V7.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
