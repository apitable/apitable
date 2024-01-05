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

export const PercentFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M12.4283 1.63433C12.7683 1.87087 12.8522 2.33827 12.6157 2.6783L4.61568 14.1783C4.37914 14.5183 3.91173 14.6022 3.5717 14.3657C3.23167 14.1291 3.14778 13.6617 3.38432 13.3217L11.3843 1.82171C11.6209 1.48168 12.0883 1.39778 12.4283 1.63433Z" fill={ colors[0] }/>
    <path d="M1.5 4.75001C1.5 3.1199 2.58369 1.50001 4.25 1.50001C5.91631 1.50001 7 3.1199 7 4.75001C7 6.38011 5.91631 8.00001 4.25 8.00001C2.58369 8.00001 1.5 6.38011 1.5 4.75001ZM4.25 3.00001C3.70717 3.00001 3 3.61868 3 4.75001C3 5.88133 3.70717 6.50001 4.25 6.50001C4.79283 6.50001 5.5 5.88133 5.5 4.75001C5.5 3.61868 4.79283 3.00001 4.25 3.00001Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M11.75 8.00001C10.0837 8.00001 9 9.6199 9 11.25C9 12.8801 10.0837 14.5 11.75 14.5C13.4163 14.5 14.5 12.8801 14.5 11.25C14.5 9.6199 13.4163 8.00001 11.75 8.00001ZM10.5 11.25C10.5 10.1187 11.2072 9.50001 11.75 9.50001C12.2928 9.50001 13 10.1187 13 11.25C13 12.3813 12.2928 13 11.75 13C11.2072 13 10.5 12.3813 10.5 11.25Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'percent_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M12.4283 1.63433C12.7683 1.87087 12.8522 2.33827 12.6157 2.6783L4.61568 14.1783C4.37914 14.5183 3.91173 14.6022 3.5717 14.3657C3.23167 14.1291 3.14778 13.6617 3.38432 13.3217L11.3843 1.82171C11.6209 1.48168 12.0883 1.39778 12.4283 1.63433Z', 'M1.5 4.75001C1.5 3.1199 2.58369 1.50001 4.25 1.50001C5.91631 1.50001 7 3.1199 7 4.75001C7 6.38011 5.91631 8.00001 4.25 8.00001C2.58369 8.00001 1.5 6.38011 1.5 4.75001ZM4.25 3.00001C3.70717 3.00001 3 3.61868 3 4.75001C3 5.88133 3.70717 6.50001 4.25 6.50001C4.79283 6.50001 5.5 5.88133 5.5 4.75001C5.5 3.61868 4.79283 3.00001 4.25 3.00001Z', 'M11.75 8.00001C10.0837 8.00001 9 9.6199 9 11.25C9 12.8801 10.0837 14.5 11.75 14.5C13.4163 14.5 14.5 12.8801 14.5 11.25C14.5 9.6199 13.4163 8.00001 11.75 8.00001ZM10.5 11.25C10.5 10.1187 11.2072 9.50001 11.75 9.50001C12.2928 9.50001 13 10.1187 13 11.25C13 12.3813 12.2928 13 11.75 13C11.2072 13 10.5 12.3813 10.5 11.25Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
