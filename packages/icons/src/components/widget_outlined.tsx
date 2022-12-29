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

export const WidgetOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7.50371 1.38392C7.81325 1.20525 8.19462 1.20537 8.50405 1.38423L13.5004 4.27232C13.8096 4.45102 14 4.781 14 5.13809V10.9143C14 11.2713 13.8096 11.6013 13.5004 11.78L8.50405 14.6681C8.19462 14.847 7.81325 14.8471 7.50371 14.6684L2.5001 11.7803C2.19064 11.6017 2 11.2716 2 10.9143V5.13809C2 4.78078 2.19064 4.45062 2.5001 4.27201L7.50371 1.38392ZM4 10.3368V6.83546L7.0036 8.4998V12.0705L4 10.3368ZM9.0036 12.0693L12 10.3373V6.83665L9.0036 8.49939V12.0693ZM8.00325 3.40483L10.9711 5.12033L8.00326 6.7672L5.03116 5.12033L8.00325 3.40483Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'widget_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M7.50371 1.38392C7.81325 1.20525 8.19462 1.20537 8.50405 1.38423L13.5004 4.27232C13.8096 4.45102 14 4.781 14 5.13809V10.9143C14 11.2713 13.8096 11.6013 13.5004 11.78L8.50405 14.6681C8.19462 14.847 7.81325 14.8471 7.50371 14.6684L2.5001 11.7803C2.19064 11.6017 2 11.2716 2 10.9143V5.13809C2 4.78078 2.19064 4.45062 2.5001 4.27201L7.50371 1.38392ZM4 10.3368V6.83546L7.0036 8.4998V12.0705L4 10.3368ZM9.0036 12.0693L12 10.3373V6.83665L9.0036 8.49939V12.0693ZM8.00325 3.40483L10.9711 5.12033L8.00326 6.7672L5.03116 5.12033L8.00325 3.40483Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
