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

export const WidgetNarrowOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M9.49995 7.49979C8.99995 7.49979 8.59995 7.09979 8.49995 6.59979V6.49979L8.49996 2.49979C8.49996 1.89979 8.89996 1.49979 9.49996 1.49979C9.99996 1.49979 10.4 1.89979 10.5 2.39979V2.49979V5.49979H13.5C14 5.49979 14.4 5.89979 14.5 6.39979V6.49979C14.5 6.99979 14.1 7.39979 13.6 7.49979H13.5L9.49995 7.49979ZM5.50055 10.4999H2.50055C2.00055 10.4999 1.60055 10.0999 1.50055 9.59994V9.49994C1.50055 8.99994 1.90055 8.59994 2.40055 8.49994H2.50055L6.50055 8.49994C7.00055 8.49994 7.40055 8.89994 7.50055 9.39994V9.49994L7.50055 13.4999C7.50055 14.0999 7.10055 14.4999 6.50055 14.4999C6.00055 14.4999 5.60055 14.0999 5.50055 13.5999V13.4999L5.50055 10.4999Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'widget_narrow_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M9.49995 7.49979C8.99995 7.49979 8.59995 7.09979 8.49995 6.59979V6.49979L8.49996 2.49979C8.49996 1.89979 8.89996 1.49979 9.49996 1.49979C9.99996 1.49979 10.4 1.89979 10.5 2.39979V2.49979V5.49979H13.5C14 5.49979 14.4 5.89979 14.5 6.39979V6.49979C14.5 6.99979 14.1 7.39979 13.6 7.49979H13.5L9.49995 7.49979ZM5.50055 10.4999H2.50055C2.00055 10.4999 1.60055 10.0999 1.50055 9.59994V9.49994C1.50055 8.99994 1.90055 8.59994 2.40055 8.49994H2.50055L6.50055 8.49994C7.00055 8.49994 7.40055 8.89994 7.50055 9.39994V9.49994L7.50055 13.4999C7.50055 14.0999 7.10055 14.4999 6.50055 14.4999C6.00055 14.4999 5.60055 14.0999 5.50055 13.5999V13.4999L5.50055 10.4999Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
