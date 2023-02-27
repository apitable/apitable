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

export const DashboardOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.5 0.5C8.08579 0.5 7.75 0.835786 7.75 1.25L7.75 7.25C7.75 7.66421 8.08579 8 8.5 8H14.5C14.9142 8 15.25 7.66421 15.25 7.25C15.25 6.36358 15.0754 5.48583 14.7362 4.66689C14.397 3.84794 13.8998 3.10382 13.273 2.47703C12.6462 1.85023 11.9021 1.35303 11.0831 1.01381C10.2642 0.674594 9.38642 0.5 8.5 0.5ZM9.25 6.5V2.05385C9.68149 2.11613 10.1045 2.23205 10.5091 2.39963C11.146 2.66347 11.7248 3.05018 12.2123 3.53769C12.6998 4.0252 13.0865 4.60395 13.3504 5.24091C13.5179 5.64549 13.6339 6.06851 13.6962 6.5H9.25Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M6.23986 2.78745C6.63232 2.65499 6.84308 2.22945 6.71061 1.83699C6.57814 1.44453 6.1526 1.23376 5.76014 1.36623C2.9936 2.30004 1 4.91623 1 8C1 11.866 4.13401 15 8 15C10.9788 15 13.5213 13.1397 14.5324 10.5201C14.6816 10.1337 14.4893 9.69948 14.1028 9.55032C13.7164 9.40115 13.2822 9.59349 13.1331 9.97991C12.3377 12.0404 10.3384 13.5 8 13.5C4.96243 13.5 2.5 11.0376 2.5 8C2.5 5.57911 4.06457 3.52169 6.23986 2.78745Z" fill={ colors[0] }/>

  </>,
  name: 'dashboard_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8.5 0.5C8.08579 0.5 7.75 0.835786 7.75 1.25L7.75 7.25C7.75 7.66421 8.08579 8 8.5 8H14.5C14.9142 8 15.25 7.66421 15.25 7.25C15.25 6.36358 15.0754 5.48583 14.7362 4.66689C14.397 3.84794 13.8998 3.10382 13.273 2.47703C12.6462 1.85023 11.9021 1.35303 11.0831 1.01381C10.2642 0.674594 9.38642 0.5 8.5 0.5ZM9.25 6.5V2.05385C9.68149 2.11613 10.1045 2.23205 10.5091 2.39963C11.146 2.66347 11.7248 3.05018 12.2123 3.53769C12.6998 4.0252 13.0865 4.60395 13.3504 5.24091C13.5179 5.64549 13.6339 6.06851 13.6962 6.5H9.25Z', 'M6.23986 2.78745C6.63232 2.65499 6.84308 2.22945 6.71061 1.83699C6.57814 1.44453 6.1526 1.23376 5.76014 1.36623C2.9936 2.30004 1 4.91623 1 8C1 11.866 4.13401 15 8 15C10.9788 15 13.5213 13.1397 14.5324 10.5201C14.6816 10.1337 14.4893 9.69948 14.1028 9.55032C13.7164 9.40115 13.2822 9.59349 13.1331 9.97991C12.3377 12.0404 10.3384 13.5 8 13.5C4.96243 13.5 2.5 11.0376 2.5 8C2.5 5.57911 4.06457 3.52169 6.23986 2.78745Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
