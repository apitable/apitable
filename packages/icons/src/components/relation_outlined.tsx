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

export const RelationOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M28.9136 7.70499C28.1611 6.95233 26.874 7.47901 26.865 8.54324L26.8281 12.9091H7C5.89543 12.9091 5 13.8045 5 14.9091C5 16.0136 5.89543 16.9091 7 16.9091H31.4V16.8988H35.2085C36.2775 16.8988 36.813 15.6064 36.0572 14.8504L28.9136 7.70499ZM13.135 31.0568C13.126 32.121 11.8389 32.6477 11.0864 31.895L3.94285 24.7496C3.18704 23.9936 3.72248 22.7011 4.79149 22.7011H8.6V22.6909H33C34.1046 22.6909 35 23.5864 35 24.6909C35 25.7955 34.1046 26.6909 33 26.6909H13.172L13.135 31.0568Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'relation_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M28.9136 7.70499C28.1611 6.95233 26.874 7.47901 26.865 8.54324L26.8281 12.9091H7C5.89543 12.9091 5 13.8045 5 14.9091C5 16.0136 5.89543 16.9091 7 16.9091H31.4V16.8988H35.2085C36.2775 16.8988 36.813 15.6064 36.0572 14.8504L28.9136 7.70499ZM13.135 31.0568C13.126 32.121 11.8389 32.6477 11.0864 31.895L3.94285 24.7496C3.18704 23.9936 3.72248 22.7011 4.79149 22.7011H8.6V22.6909H33C34.1046 22.6909 35 23.5864 35 24.6909C35 25.7955 34.1046 26.6909 33 26.6909H13.172L13.135 31.0568Z'],
  width: '40',
  height: '40',
  viewBox: '0 0 40 40',
});
