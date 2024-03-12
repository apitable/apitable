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

export const BronzeLightFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M20 42H44V52.2166C44 52.9986 43.5442 53.7089 42.8333 54.0347L32.8333 58.6181C32.3042 58.8606 31.6958 58.8606 31.1667 58.6181L21.1667 54.0347C20.4558 53.7089 20 52.9986 20 52.2166V42Z" fill={ colors[2] }/>
    <path d="M35 57.625L32.8333 58.6181C32.3042 58.8606 31.6958 58.8606 31.1667 58.6181L29 57.625V43H35V57.625Z" fill={ colors[3] } fillRule="evenodd" clipRule="evenodd"/>
    <g filter="url(#filter0_d_4422_1319)">

      <circle cx="32" cy="25" r="22" fill={ colors[4] }/>

    </g>
    <circle cx="32" cy="25" r="18.75" stroke={ colors[0] } strokeWidth="1.5"/>
    <g filter="url(#filter1_i_4422_1319)">

      <path d="M31.4276 37.8551C31.6634 38.3268 32.3366 38.3268 32.5724 37.8551L43.5369 15.9262C43.7497 15.5007 43.4402 15 42.9645 15H36.2477C36.0079 15 35.7882 15.134 35.6785 15.3473L32.603 21.3275C32.3586 21.8026 31.674 21.7868 31.4518 21.3008L28.7424 15.3739C28.6382 15.1461 28.4108 15 28.1603 15H21.0355C20.5598 15 20.2503 15.5007 20.4631 15.9262L31.4276 37.8551Z" fill={ colors[1] }/>

    </g>
    <defs>

      <filter id="filter0_d_4422_1319" x="8.4" y="3" width="47.2" height="47.2" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">

        <feFlood result="BackgroundImageFix" floodOpacity="0"/>

        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>

        <feOffset dy="1.6"/>

        <feGaussianBlur stdDeviation="0.8"/>

        <feComposite in2="hardAlpha" operator="out"/>

        <feColorMatrix type="matrix" values="0 0 0 0 0.325 0 0 0 0 0.23919 0 0 0 0 0.136771 0 0 0 0.05 0"/>

        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4422_1319"/>

        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4422_1319" result="shape"/>

      </filter>

      <filter id="filter1_i_4422_1319" x="20.3945" y="15" width="23.2109" height="23.209" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">

        <feFlood result="BackgroundImageFix" floodOpacity="0"/>

        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>

        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>

        <feOffset/>

        <feGaussianBlur stdDeviation="0.470588"/>

        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>

        <feColorMatrix type="matrix" values="0 0 0 0 0.354167 0 0 0 0 0.24266 0 0 0 0 0.123958 0 0 0 0.1 0"/>

        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_4422_1319"/>

      </filter>

      <linearGradient id="paint0_linear_4422_1319" x1="32" y1="42" x2="32" y2="60" gradientUnits="userSpaceOnUse">

        <stop offset="0.136865" stopColor="#D59249"/>

        <stop offset="1" stopColor="#FFCB93"/>

      </linearGradient>

      <linearGradient id="paint1_linear_4422_1319" x1="32" y1="43" x2="32" y2="61" gradientUnits="userSpaceOnUse">

        <stop offset="0.130899" stopColor="#EEA659"/>

        <stop offset="1" stopColor="#FFD8AD"/>

      </linearGradient>

      <linearGradient id="paint2_linear_4422_1319" x1="23.0952" y1="8.7619" x2="38.8095" y2="42.2857" gradientUnits="userSpaceOnUse">

        <stop stopColor="#FBCE9D"/>

        <stop offset="1" stopColor="#F6C084"/>

      </linearGradient>

    </defs>

  </>,
  name: 'bronze_light_filled',
  defaultColors: ['#DF9B50', '#E09847', 'url(#paint0_linear_4422_1319)', 'url(#paint1_linear_4422_1319)', 'url(#paint2_linear_4422_1319)'],
  colorful: true,
  allPathData: ['M20 42H44V52.2166C44 52.9986 43.5442 53.7089 42.8333 54.0347L32.8333 58.6181C32.3042 58.8606 31.6958 58.8606 31.1667 58.6181L21.1667 54.0347C20.4558 53.7089 20 52.9986 20 52.2166V42Z', 'M35 57.625L32.8333 58.6181C32.3042 58.8606 31.6958 58.8606 31.1667 58.6181L29 57.625V43H35V57.625Z', 'M31.4276 37.8551C31.6634 38.3268 32.3366 38.3268 32.5724 37.8551L43.5369 15.9262C43.7497 15.5007 43.4402 15 42.9645 15H36.2477C36.0079 15 35.7882 15.134 35.6785 15.3473L32.603 21.3275C32.3586 21.8026 31.674 21.7868 31.4518 21.3008L28.7424 15.3739C28.6382 15.1461 28.4108 15 28.1603 15H21.0355C20.5598 15 20.2503 15.5007 20.4631 15.9262L31.4276 37.8551Z'],
  width: '64',
  height: '64',
  viewBox: '0 0 64 64',
});
