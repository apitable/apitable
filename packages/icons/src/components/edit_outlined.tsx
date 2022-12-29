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

export const EditOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M10.3472 1.6843C10.1597 1.49676 9.90535 1.3914 9.64013 1.3914C9.37492 1.3914 9.12056 1.49676 8.93303 1.6843L1.49217 9.12515C1.32535 9.29197 1.22288 9.51241 1.20288 9.74749L0.950411 12.7152C0.925426 13.0089 1.03128 13.2987 1.23971 13.5071C1.44813 13.7155 1.73788 13.8214 2.03158 13.7964L4.99933 13.5439C5.23441 13.5239 5.45485 13.4215 5.62168 13.2547L13.0625 5.8138C13.4531 5.42328 13.4531 4.79011 13.0625 4.39959L10.3472 1.6843ZM3.16472 10.281L9.64013 3.80562L10.9412 5.10669L4.46579 11.5821L3.04374 11.7031L3.16472 10.281ZM14.0001 14.0001C14.5524 14.0001 15.0001 13.5524 15.0001 13.0001C15.0001 12.4478 14.5524 12.0001 14.0001 12.0001L9.50008 12C8.94779 12 8.50007 12.4477 8.50006 13C8.50005 13.5523 8.94776 14 9.50005 14L14.0001 14.0001Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'edit_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M10.3472 1.6843C10.1597 1.49676 9.90535 1.3914 9.64013 1.3914C9.37492 1.3914 9.12056 1.49676 8.93303 1.6843L1.49217 9.12515C1.32535 9.29197 1.22288 9.51241 1.20288 9.74749L0.950411 12.7152C0.925426 13.0089 1.03128 13.2987 1.23971 13.5071C1.44813 13.7155 1.73788 13.8214 2.03158 13.7964L4.99933 13.5439C5.23441 13.5239 5.45485 13.4215 5.62168 13.2547L13.0625 5.8138C13.4531 5.42328 13.4531 4.79011 13.0625 4.39959L10.3472 1.6843ZM3.16472 10.281L9.64013 3.80562L10.9412 5.10669L4.46579 11.5821L3.04374 11.7031L3.16472 10.281ZM14.0001 14.0001C14.5524 14.0001 15.0001 13.5524 15.0001 13.0001C15.0001 12.4478 14.5524 12.0001 14.0001 12.0001L9.50008 12C8.94779 12 8.50007 12.4477 8.50006 13C8.50005 13.5523 8.94776 14 9.50005 14L14.0001 14.0001Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
