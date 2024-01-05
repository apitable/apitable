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

export const RedoFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.25012 3.79335C8.25012 2.65081 9.65648 2.1071 10.425 2.9525L14.2493 7.15915C14.6828 7.63593 14.6828 8.36407 14.2493 8.84085L10.425 13.0476C9.65638 13.893 8.24999 13.3492 8.25005 12.2067L8.25013 10.4156C8.12647 10.3713 7.95516 10.3296 7.73156 10.3046C7.3768 10.2648 6.9398 10.2728 6.45617 10.3468C5.48667 10.4953 4.38958 10.9 3.45239 11.6324C3.03699 11.957 2.49942 11.9913 2.08008 11.7931C1.86574 11.6918 1.6606 11.5188 1.5334 11.2679C1.4019 11.0085 1.37966 10.7159 1.45612 10.4364C1.91156 8.77209 3.05624 7.53151 4.35517 6.69291C5.58854 5.89663 7.00841 5.42988 8.25012 5.29284L8.25012 3.79335Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'redo_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8.25012 3.79335C8.25012 2.65081 9.65648 2.1071 10.425 2.9525L14.2493 7.15915C14.6828 7.63593 14.6828 8.36407 14.2493 8.84085L10.425 13.0476C9.65638 13.893 8.24999 13.3492 8.25005 12.2067L8.25013 10.4156C8.12647 10.3713 7.95516 10.3296 7.73156 10.3046C7.3768 10.2648 6.9398 10.2728 6.45617 10.3468C5.48667 10.4953 4.38958 10.9 3.45239 11.6324C3.03699 11.957 2.49942 11.9913 2.08008 11.7931C1.86574 11.6918 1.6606 11.5188 1.5334 11.2679C1.4019 11.0085 1.37966 10.7159 1.45612 10.4364C1.91156 8.77209 3.05624 7.53151 4.35517 6.69291C5.58854 5.89663 7.00841 5.42988 8.25012 5.29284L8.25012 3.79335Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
