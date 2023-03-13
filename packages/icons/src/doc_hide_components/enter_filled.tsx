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

export const EnterFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M10.9393 3.75C10.5251 3.75 10.1893 4.08579 10.1893 4.5C10.1893 4.91421 10.5251 5.25 10.9393 5.25H13.5001V8.5H3.36034L5.79254 6.06781C6.08543 5.77491 6.08543 5.30004 5.79254 5.00715C5.49964 4.71425 5.02477 4.71425 4.73188 5.00715L1.37312 8.3659C0.884964 8.85406 0.884964 9.64551 1.37312 10.1337L4.73188 13.4924C5.02477 13.7853 5.49964 13.7853 5.79254 13.4924C6.08543 13.1995 6.08543 12.7247 5.79254 12.4318L3.36077 10H13.7501C14.4405 10 15.0001 9.44036 15.0001 8.75V5C15.0001 4.30964 14.4405 3.75 13.7501 3.75H10.9393Z" fill={ colors[0] }/>

  </>,
  name: 'enter_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M10.9393 3.75C10.5251 3.75 10.1893 4.08579 10.1893 4.5C10.1893 4.91421 10.5251 5.25 10.9393 5.25H13.5001V8.5H3.36034L5.79254 6.06781C6.08543 5.77491 6.08543 5.30004 5.79254 5.00715C5.49964 4.71425 5.02477 4.71425 4.73188 5.00715L1.37312 8.3659C0.884964 8.85406 0.884964 9.64551 1.37312 10.1337L4.73188 13.4924C5.02477 13.7853 5.49964 13.7853 5.79254 13.4924C6.08543 13.1995 6.08543 12.7247 5.79254 12.4318L3.36077 10H13.7501C14.4405 10 15.0001 9.44036 15.0001 8.75V5C15.0001 4.30964 14.4405 3.75 13.7501 3.75H10.9393Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
