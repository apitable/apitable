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

export const AttachmentLocalOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M12.5 0.8L14.7 4.3C14.9 4.6 15 4.9 15.1 5.2V14.3C15.1 15.3 14.3 16 13.4 16H2.7C1.7 16 1 15.3 1 14.4V1.7C1 0.7 1.7 0 2.7 0H11.1C11.7 0 12.2 0.3 12.5 0.8ZM11 4H12.2L11 2.1V4ZM3 14H13V6H10.7C9.7 6 9 5.3 9 4.3V2H3V14ZM9 7V8H10C10.6 8 11 8.4 11 9C11 9.6 10.6 10 10 10H9V11C9 11.6 8.6 12 8 12C7.4 12 7 11.6 7 11V10H6C5.4 10 5 9.6 5 9C5 8.4 5.4 8 6 8H7V7C7 6.4 7.4 6 8 6C8.6 6 9 6.4 9 7Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'attachment_local_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M12.5 0.8L14.7 4.3C14.9 4.6 15 4.9 15.1 5.2V14.3C15.1 15.3 14.3 16 13.4 16H2.7C1.7 16 1 15.3 1 14.4V1.7C1 0.7 1.7 0 2.7 0H11.1C11.7 0 12.2 0.3 12.5 0.8ZM11 4H12.2L11 2.1V4ZM3 14H13V6H10.7C9.7 6 9 5.3 9 4.3V2H3V14ZM9 7V8H10C10.6 8 11 8.4 11 9C11 9.6 10.6 10 10 10H9V11C9 11.6 8.6 12 8 12C7.4 12 7 11.6 7 11V10H6C5.4 10 5 9.6 5 9C5 8.4 5.4 8 6 8H7V7C7 6.4 7.4 6 8 6C8.6 6 9 6.4 9 7Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
