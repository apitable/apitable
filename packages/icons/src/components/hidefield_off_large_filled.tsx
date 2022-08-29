
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const HidefieldOffLargeFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <rect width="54" height="28" rx="14" fill={ colors[0] }/>
    <path d="M14 26C20.6274 26 26 20.6274 26 14C26 7.37258 20.6274 2 14 2C7.37258 2 2 7.37258 2 14C2 20.6274 7.37258 26 14 26Z" fill={ colors[1] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'hidefield_off_large_filled',
  defaultColors: ['#C9C9C9', 'white'],
  colorful: true,
  allPathData: ['M14 26C20.6274 26 26 20.6274 26 14C26 7.37258 20.6274 2 14 2C7.37258 2 2 7.37258 2 14C2 20.6274 7.37258 26 14 26Z'],
  width: '28',
  height: '28',
  viewBox: '0 0 28 28',
});
