
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const LogoFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <rect x="3" y="3" width="4" height="4" fill={ colors[0] }/>
    <rect x="3" y="7" width="4" height="4" fill={ colors[1] }/>
    <path d="M3 11H7L3 15V11Z" fill={ colors[2] }/>
    <path d="M7 7H11L7 11V7Z" fill={ colors[2] }/>
    <path d="M11 3H15L11 7V3Z" fill={ colors[0] }/>
    <path d="M11 7L7 7L11 3L11 7Z" fill={ colors[1] }/>

  </>,
  name: 'logo_filled',
  defaultColors: ['#1274FE', '#539AFF', '#7EB3FF'],
  colorful: true,
  allPathData: ['M3 11H7L3 15V11Z', 'M7 7H11L7 11V7Z', 'M11 3H15L11 7V3Z', 'M11 7L7 7L11 3L11 7Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
