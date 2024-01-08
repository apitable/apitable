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

export const MortarboardOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7.92094 3.56692C7.97225 3.54982 8.02774 3.54982 8.07905 3.56692L13.8783 5.5L14.3526 6.92303L13.8783 5.5L8.07905 7.43308C8.02774 7.45018 7.97225 7.45018 7.92094 7.43308L2.1217 5.5L1.64736 4.07697L2.1217 5.5L7.92094 3.56692ZM2 7.04057L1.64736 6.92303C0.279814 6.46718 0.279822 4.53282 1.64736 4.07697L7.4466 2.1439C7.80581 2.02416 8.19418 2.02416 8.55339 2.1439L14.3526 4.07697C15.7202 4.53282 15.7202 6.46718 14.3526 6.92303L14 7.04057V12.25C14 12.4831 13.8916 12.703 13.7066 12.845C10.4881 15.315 5.51185 15.315 2.29338 12.845C2.10842 12.703 2 12.4831 2 12.25V7.04057ZM3.5 7.54057V11.8678C6.0872 13.6407 9.9128 13.6407 12.5 11.8678V7.54057L8.55339 8.8561C8.19418 8.97584 7.80581 8.97584 7.4466 8.8561L3.5 7.54057Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'mortarboard_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M7.92094 3.56692C7.97225 3.54982 8.02774 3.54982 8.07905 3.56692L13.8783 5.5L14.3526 6.92303L13.8783 5.5L8.07905 7.43308C8.02774 7.45018 7.97225 7.45018 7.92094 7.43308L2.1217 5.5L1.64736 4.07697L2.1217 5.5L7.92094 3.56692ZM2 7.04057L1.64736 6.92303C0.279814 6.46718 0.279822 4.53282 1.64736 4.07697L7.4466 2.1439C7.80581 2.02416 8.19418 2.02416 8.55339 2.1439L14.3526 4.07697C15.7202 4.53282 15.7202 6.46718 14.3526 6.92303L14 7.04057V12.25C14 12.4831 13.8916 12.703 13.7066 12.845C10.4881 15.315 5.51185 15.315 2.29338 12.845C2.10842 12.703 2 12.4831 2 12.25V7.04057ZM3.5 7.54057V11.8678C6.0872 13.6407 9.9128 13.6407 12.5 11.8678V7.54057L8.55339 8.8561C8.19418 8.97584 7.80581 8.97584 7.4466 8.8561L3.5 7.54057Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
