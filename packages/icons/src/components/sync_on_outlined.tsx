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

export const SyncOnOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M14 7.00001C14.4167 7.00001 14.7896 6.74173 14.9361 6.35174C15.0827 5.96175 14.9721 5.52178 14.6585 5.24744L11.23 2.24744C10.8143 1.88375 10.1826 1.92587 9.8189 2.34151C9.45521 2.75715 9.49733 3.38891 9.91297 3.75259L11.3386 5.00001L2.00004 5.00001C1.44776 5.00001 1.00005 5.44773 1.00005 6.00001C1.00005 6.5523 1.44776 7.00001 2.00004 7.00001L14 7.00001ZM2.00005 9.00001C1.58344 9.00001 1.21047 9.2583 1.06394 9.64829C0.91741 10.0383 1.02801 10.4783 1.34154 10.7526L4.77011 13.7526C5.18575 14.1163 5.81751 14.0742 6.18119 13.6585C6.54488 13.2429 6.50276 12.6111 6.08712 12.2474L4.66149 11H14C14.5523 11 15 10.5523 15 10C15 9.44773 14.5523 9.00001 14 9.00001L2.00005 9.00001Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'sync_on_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M14 7.00001C14.4167 7.00001 14.7896 6.74173 14.9361 6.35174C15.0827 5.96175 14.9721 5.52178 14.6585 5.24744L11.23 2.24744C10.8143 1.88375 10.1826 1.92587 9.8189 2.34151C9.45521 2.75715 9.49733 3.38891 9.91297 3.75259L11.3386 5.00001L2.00004 5.00001C1.44776 5.00001 1.00005 5.44773 1.00005 6.00001C1.00005 6.5523 1.44776 7.00001 2.00004 7.00001L14 7.00001ZM2.00005 9.00001C1.58344 9.00001 1.21047 9.2583 1.06394 9.64829C0.91741 10.0383 1.02801 10.4783 1.34154 10.7526L4.77011 13.7526C5.18575 14.1163 5.81751 14.0742 6.18119 13.6585C6.54488 13.2429 6.50276 12.6111 6.08712 12.2474L4.66149 11H14C14.5523 11 15 10.5523 15 10C15 9.44773 14.5523 9.00001 14 9.00001L2.00005 9.00001Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
