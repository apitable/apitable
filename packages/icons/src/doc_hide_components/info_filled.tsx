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

export const InfoFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <circle opacity="0.2" cx="12" cy="12" r="12" fill={ colors[0] }/>
    <path d="M12.1888 19C15.9507 19 19 15.9503 19 12.1888C19 10.6091 18.4625 9.15571 17.5599 8L16.7518 9.07921C14.5721 11.9893 11.9889 14.5726 9.07921 16.7518L8 17.5599C9.15529 18.4621 10.6095 19 12.1888 19Z" fill={ colors[1] }/>
    <path d="M15.6032 6.13977C14.5214 5.41966 13.2225 5 11.8259 5C8.0559 5 5 8.05644 5 11.8261C5 13.2232 5.41968 14.5223 6.13952 15.6035L5.85094 15.8174C5.44915 16.1151 5.40586 16.7004 5.75948 17.054C6.0463 17.3408 6.4999 17.3744 6.82579 17.1329L8.55091 15.8545C11.3319 13.7936 13.7928 11.3327 15.8537 8.55167L17.1321 6.82656C17.3736 6.50066 17.3401 6.04706 17.0533 5.76025C16.6996 5.40663 16.1144 5.44991 15.8166 5.8517L15.6032 6.13977ZM13.5 7.75C13.5 8.16421 13.1642 8.5 12.75 8.5C12.3358 8.5 12 8.16421 12 7.75C12 7.33579 12.3358 7 12.75 7C13.1642 7 13.5 7.33579 13.5 7.75Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'info_filled',
  defaultColors: ['#7B67EE', '#CEC5FF'],
  colorful: true,
  allPathData: ['M12.1888 19C15.9507 19 19 15.9503 19 12.1888C19 10.6091 18.4625 9.15571 17.5599 8L16.7518 9.07921C14.5721 11.9893 11.9889 14.5726 9.07921 16.7518L8 17.5599C9.15529 18.4621 10.6095 19 12.1888 19Z', 'M15.6032 6.13977C14.5214 5.41966 13.2225 5 11.8259 5C8.0559 5 5 8.05644 5 11.8261C5 13.2232 5.41968 14.5223 6.13952 15.6035L5.85094 15.8174C5.44915 16.1151 5.40586 16.7004 5.75948 17.054C6.0463 17.3408 6.4999 17.3744 6.82579 17.1329L8.55091 15.8545C11.3319 13.7936 13.7928 11.3327 15.8537 8.55167L17.1321 6.82656C17.3736 6.50066 17.3401 6.04706 17.0533 5.76025C16.6996 5.40663 16.1144 5.44991 15.8166 5.8517L15.6032 6.13977ZM13.5 7.75C13.5 8.16421 13.1642 8.5 12.75 8.5C12.3358 8.5 12 8.16421 12 7.75C12 7.33579 12.3358 7 12.75 7C13.1642 7 13.5 7.33579 13.5 7.75Z'],
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
});
