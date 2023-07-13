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

export const EmailfeedbackOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.125 10.6562C8.125 9.8796 8.7546 9.25 9.53125 9.25H22.4688C23.2454 9.25 23.875 9.8796 23.875 10.6562V21.3438C23.875 22.1204 23.2454 22.75 22.4688 22.75H9.53125C8.7546 22.75 8.125 22.1204 8.125 21.3438V10.6562ZM20.2249 13.1297C20.5252 13.486 20.4798 14.0183 20.1235 14.3186L16.9063 17.0303C16.3827 17.4716 15.6173 17.4716 15.0937 17.0303L11.8765 14.3186C11.5202 14.0183 11.4748 13.486 11.7751 13.1297C12.0754 12.7734 12.6077 12.728 12.9641 13.0283L16 15.5872L19.036 13.0283C19.3923 12.728 19.9246 12.7734 20.2249 13.1297Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'emailfeedback_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8.125 10.6562C8.125 9.8796 8.7546 9.25 9.53125 9.25H22.4688C23.2454 9.25 23.875 9.8796 23.875 10.6562V21.3438C23.875 22.1204 23.2454 22.75 22.4688 22.75H9.53125C8.7546 22.75 8.125 22.1204 8.125 21.3438V10.6562ZM20.2249 13.1297C20.5252 13.486 20.4798 14.0183 20.1235 14.3186L16.9063 17.0303C16.3827 17.4716 15.6173 17.4716 15.0937 17.0303L11.8765 14.3186C11.5202 14.0183 11.4748 13.486 11.7751 13.1297C12.0754 12.7734 12.6077 12.728 12.9641 13.0283L16 15.5872L19.036 13.0283C19.3923 12.728 19.9246 12.7734 20.2249 13.1297Z'],
  width: '32',
  height: '32',
  viewBox: '0 0 32 32',
});
