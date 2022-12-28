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

export const TitleFavoriteFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7.48232 0.338434C7.69289 -0.112811 8.30711 -0.112812 8.51768 0.338433L10.2221 3.99106C10.3061 4.17098 10.4698 4.29556 10.6592 4.32356L14.5038 4.89209C14.9787 4.96232 15.1685 5.57395 14.8237 5.92307L12.0326 8.74903C11.8951 8.88824 11.8325 9.08981 11.8656 9.28704L12.5372 13.291C12.6202 13.7857 12.1233 14.1637 11.6996 13.9282L8.27014 12.0221C8.10121 11.9282 7.89879 11.9282 7.72986 12.0221L4.30039 13.9282C3.87671 14.1637 3.3798 13.7857 3.46277 13.291L4.13439 9.28704C4.16747 9.08981 4.10492 8.88824 3.96743 8.74904L1.17628 5.92307C0.831466 5.57395 1.02127 4.96232 1.49622 4.89209L5.34078 4.32356C5.53015 4.29556 5.69392 4.17098 5.77788 3.99106L7.48232 0.338434Z" fill={ colors[0] }/>

  </>,
  name: 'title_favorite_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M7.48232 0.338434C7.69289 -0.112811 8.30711 -0.112812 8.51768 0.338433L10.2221 3.99106C10.3061 4.17098 10.4698 4.29556 10.6592 4.32356L14.5038 4.89209C14.9787 4.96232 15.1685 5.57395 14.8237 5.92307L12.0326 8.74903C11.8951 8.88824 11.8325 9.08981 11.8656 9.28704L12.5372 13.291C12.6202 13.7857 12.1233 14.1637 11.6996 13.9282L8.27014 12.0221C8.10121 11.9282 7.89879 11.9282 7.72986 12.0221L4.30039 13.9282C3.87671 14.1637 3.3798 13.7857 3.46277 13.291L4.13439 9.28704C4.16747 9.08981 4.10492 8.88824 3.96743 8.74904L1.17628 5.92307C0.831466 5.57395 1.02127 4.96232 1.49622 4.89209L5.34078 4.32356C5.53015 4.29556 5.69392 4.17098 5.77788 3.99106L7.48232 0.338434Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
