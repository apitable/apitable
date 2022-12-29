
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const HidefieldOnLargeFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <rect width="54" height="28" rx="14" fill={ colors[0] }/>
    <path d="M40 26C46.6274 26 52 20.6274 52 14C52 7.37258 46.6274 2 40 2C33.3726 2 28 7.37258 28 14C28 20.6274 33.3726 26 40 26Z" fill={ colors[1] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'hidefield_on_large_filled',
  defaultColors: ['#7B67EE', 'white'],
  colorful: true,
  allPathData: ['M40 26C46.6274 26 52 20.6274 52 14C52 7.37258 46.6274 2 40 2C33.3726 2 28 7.37258 28 14C28 20.6274 33.3726 26 40 26Z'],
  width: '28',
  height: '28',
  viewBox: '0 0 28 28',
});
