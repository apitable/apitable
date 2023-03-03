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

export const ReloadOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M12.486 1.35566C12.4063 0.949194 12.0121 0.684306 11.6057 0.76402C11.1992 0.843734 10.9343 1.23787 11.014 1.64434L11.1374 2.27369C10.2011 1.77973 9.13437 1.5 8 1.5C4.27208 1.5 1.25 4.52208 1.25 8.25C1.25 11.9779 4.27208 15 8 15C11.7279 15 14.75 11.9779 14.75 8.25C14.75 7.83579 14.4142 7.5 14 7.5C13.5858 7.5 13.25 7.83579 13.25 8.25C13.25 11.1495 10.8995 13.5 8 13.5C5.10051 13.5 2.75 11.1495 2.75 8.25C2.75 5.35051 5.10051 3 8 3C8.90177 3 9.74759 3.22653 10.4871 3.62681L9.84092 3.76707C9.43613 3.85492 9.17921 4.25429 9.26707 4.65908C9.35492 5.06387 9.75429 5.32079 10.1591 5.23294L12.402 4.74613C12.801 4.65952 13.0574 4.26957 12.9789 3.86886L12.486 1.35566Z" fill={ colors[0] }/>

  </>,
  name: 'reload_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M12.486 1.35566C12.4063 0.949194 12.0121 0.684306 11.6057 0.76402C11.1992 0.843734 10.9343 1.23787 11.014 1.64434L11.1374 2.27369C10.2011 1.77973 9.13437 1.5 8 1.5C4.27208 1.5 1.25 4.52208 1.25 8.25C1.25 11.9779 4.27208 15 8 15C11.7279 15 14.75 11.9779 14.75 8.25C14.75 7.83579 14.4142 7.5 14 7.5C13.5858 7.5 13.25 7.83579 13.25 8.25C13.25 11.1495 10.8995 13.5 8 13.5C5.10051 13.5 2.75 11.1495 2.75 8.25C2.75 5.35051 5.10051 3 8 3C8.90177 3 9.74759 3.22653 10.4871 3.62681L9.84092 3.76707C9.43613 3.85492 9.17921 4.25429 9.26707 4.65908C9.35492 5.06387 9.75429 5.32079 10.1591 5.23294L12.402 4.74613C12.801 4.65952 13.0574 4.26957 12.9789 3.86886L12.486 1.35566Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
