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

export const DisabledOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1ZM2.5 8C2.5 4.96243 4.96243 2.5 8 2.5C9.24835 2.5 10.3996 2.9159 11.3226 3.6167L3.6167 11.3226C2.9159 10.3996 2.5 9.24835 2.5 8ZM4.67736 12.3833C5.60043 13.0841 6.75165 13.5 8 13.5C11.0376 13.5 13.5 11.0376 13.5 8C13.5 6.75165 13.0841 5.60043 12.3833 4.67736L4.67736 12.3833Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'disabled_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1ZM2.5 8C2.5 4.96243 4.96243 2.5 8 2.5C9.24835 2.5 10.3996 2.9159 11.3226 3.6167L3.6167 11.3226C2.9159 10.3996 2.5 9.24835 2.5 8ZM4.67736 12.3833C5.60043 13.0841 6.75165 13.5 8 13.5C11.0376 13.5 13.5 11.0376 13.5 8C13.5 6.75165 13.0841 5.60043 12.3833 4.67736L4.67736 12.3833Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
