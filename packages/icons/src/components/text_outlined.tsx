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

export const TextOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M4.63003 11.8531C4.72394 11.951 4.84314 12 4.98762 12C5.08875 12 5.17905 11.9736 5.25851 11.9209C5.3452 11.8606 5.41022 11.7815 5.45356 11.6836L6.15789 9.9209H9.8421L10.5464 11.6836C10.5898 11.7815 10.6512 11.8606 10.7306 11.9209C10.8173 11.9736 10.9112 12 11.0124 12C11.1569 12 11.2724 11.951 11.3591 11.8531C11.453 11.7552 11.5 11.6347 11.5 11.4915C11.5 11.4313 11.4819 11.3559 11.4458 11.2655L8.68266 4.46328C8.62487 4.32768 8.5418 4.21846 8.43344 4.13559C8.3323 4.0452 8.20588 4 8.05418 4H7.94582C7.79412 4 7.66409 4.0452 7.55573 4.13559C7.45459 4.21846 7.37513 4.32768 7.31734 4.46328L4.55418 11.2655C4.51806 11.3559 4.5 11.4313 4.5 11.4915C4.5 11.6347 4.54334 11.7552 4.63003 11.8531ZM9.46285 8.98305H6.53715L8 5.31073L9.46285 8.98305Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M2.75 1.5C2.05964 1.5 1.5 2.05964 1.5 2.75V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H2.75ZM3 13V3H13V13H3Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'text_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M4.63003 11.8531C4.72394 11.951 4.84314 12 4.98762 12C5.08875 12 5.17905 11.9736 5.25851 11.9209C5.3452 11.8606 5.41022 11.7815 5.45356 11.6836L6.15789 9.9209H9.8421L10.5464 11.6836C10.5898 11.7815 10.6512 11.8606 10.7306 11.9209C10.8173 11.9736 10.9112 12 11.0124 12C11.1569 12 11.2724 11.951 11.3591 11.8531C11.453 11.7552 11.5 11.6347 11.5 11.4915C11.5 11.4313 11.4819 11.3559 11.4458 11.2655L8.68266 4.46328C8.62487 4.32768 8.5418 4.21846 8.43344 4.13559C8.3323 4.0452 8.20588 4 8.05418 4H7.94582C7.79412 4 7.66409 4.0452 7.55573 4.13559C7.45459 4.21846 7.37513 4.32768 7.31734 4.46328L4.55418 11.2655C4.51806 11.3559 4.5 11.4313 4.5 11.4915C4.5 11.6347 4.54334 11.7552 4.63003 11.8531ZM9.46285 8.98305H6.53715L8 5.31073L9.46285 8.98305Z', 'M2.75 1.5C2.05964 1.5 1.5 2.05964 1.5 2.75V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H2.75ZM3 13V3H13V13H3Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
