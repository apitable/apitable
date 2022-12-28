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

export const WidgetExportOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M12 10C12 9.4 12.4 9 13 9C13.6 9 14 9.4 14 10V14C14 14.6 13.6 15 13 15H3C2.4 15 2 14.6 2 14V2C2 1.4 2.4 1 3 1H7C7.6 1 8 1.4 8 2C8 2.6 7.6 3 7 3H4V13H12V10ZM12.1 2.2L14.2 4.3C14.6 4.7 14.6 5.3 14.2 5.7L12.1 7.8C11.9 8 11.6 8.1 11.4 8.1C11.2 8.1 10.9 8 10.7 7.8C10.3 7.4 10.3 6.8 10.7 6.4L11.1 6H7C6.4 6 6 5.6 6 5C6 4.4 6.4 4 7 4H11.1L10.7 3.6C10.3 3.2 10.3 2.6 10.7 2.2C11.1 1.8 11.7 1.8 12.1 2.2Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'widget_export_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M12 10C12 9.4 12.4 9 13 9C13.6 9 14 9.4 14 10V14C14 14.6 13.6 15 13 15H3C2.4 15 2 14.6 2 14V2C2 1.4 2.4 1 3 1H7C7.6 1 8 1.4 8 2C8 2.6 7.6 3 7 3H4V13H12V10ZM12.1 2.2L14.2 4.3C14.6 4.7 14.6 5.3 14.2 5.7L12.1 7.8C11.9 8 11.6 8.1 11.4 8.1C11.2 8.1 10.9 8 10.7 7.8C10.3 7.4 10.3 6.8 10.7 6.4L11.1 6H7C6.4 6 6 5.6 6 5C6 4.4 6.4 4 7 4H11.1L10.7 3.6C10.3 3.2 10.3 2.6 10.7 2.2C11.1 1.8 11.7 1.8 12.1 2.2Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
